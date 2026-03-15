import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const action = url.searchParams.get("action")

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    // STATUS - public, no auth required
    if (action === "status") {
      return await handleStatus(supabase)
    }

    // All other actions require auth
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return jsonResponse({ error: "Unauthorized" }, 401)
    }

    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return jsonResponse({ error: "Invalid token" }, 401)
    }

    const body = req.method === "POST" ? await req.json() : {}
    const locationId = body.location_id || 1 // Default to SoHo

    switch (action) {
      case "join":
        return await handleJoin(supabase, user.id, locationId, body)
      case "checkin":
        return await handleCheckin(supabase, user.id, locationId)
      case "checkout":
        return await handleCheckout(supabase, user.id, locationId)
      case "cancel":
        return await handleCancel(supabase, user.id, locationId)
      default:
        return jsonResponse({ error: "Invalid action" }, 400)
    }
  } catch (error) {
    console.error("hull-queue error:", error)
    return jsonResponse({ error: error.message }, 500)
  }
})

// GET status - current occupancy + queue length
async function handleStatus(supabase: ReturnType<typeof createClient>) {
  // Get capacity config
  const { data: config } = await supabase
    .from("hull_capacity")
    .select("*")
    .limit(1)
    .single()

  const maxCapacity = config?.max_capacity || 20
  const locationId = config?.location_id || 1

  // Count currently checked-in guests
  const { count: occupancy } = await supabase
    .from("queue")
    .select("*", { count: "exact", head: true })
    .eq("location_id", locationId)
    .not("checked_in_at", "is", null)
    .is("checked_out_at", null)

  // Count people waiting in walk-up queue
  const { count: queueLength } = await supabase
    .from("queue")
    .select("*", { count: "exact", head: true })
    .eq("location_id", locationId)
    .eq("queue_type", "walk_up")
    .eq("status", "waiting")
    .is("checked_in_at", null)

  // Count upcoming reservations (next 2 hours)
  const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  const { count: upcomingReservations } = await supabase
    .from("queue")
    .select("*", { count: "exact", head: true })
    .eq("location_id", locationId)
    .eq("queue_type", "reservation")
    .eq("status", "waiting")
    .is("checked_in_at", null)
    .lte("reserved_for", twoHoursFromNow)

  return jsonResponse({
    occupancy: occupancy || 0,
    max_capacity: maxCapacity,
    available: Math.max(0, maxCapacity - (occupancy || 0)),
    queue_length: queueLength || 0,
    upcoming_reservations: upcomingReservations || 0,
  })
}

// POST join - join walk-up queue or make reservation
async function handleJoin(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  locationId: number,
  body: { queue_type?: string; reserved_for?: string }
) {
  const queueType = body.queue_type || "walk_up"
  const reservedFor = body.reserved_for ? new Date(body.reserved_for) : null

  // Check for existing active entry
  const { data: existing } = await supabase
    .from("queue")
    .select("*")
    .eq("user_id", userId)
    .eq("location_id", locationId)
    .is("checked_out_at", null)
    .in("status", ["waiting", "called"])
    .limit(1)
    .single()

  if (existing) {
    return jsonResponse({ error: "You already have an active queue entry or reservation" }, 400)
  }

  // Get capacity config
  const { data: config } = await supabase
    .from("hull_capacity")
    .select("*")
    .eq("location_id", locationId)
    .single()

  const holdMinutes = config?.reservation_hold_minutes || 10

  // Calculate position for walk-ups
  let position = null
  if (queueType === "walk_up") {
    const { count } = await supabase
      .from("queue")
      .select("*", { count: "exact", head: true })
      .eq("location_id", locationId)
      .eq("queue_type", "walk_up")
      .eq("status", "waiting")
      .is("checked_in_at", null)

    position = (count || 0) + 1
  }

  // Calculate expiration for reservations
  let expiresAt = null
  if (queueType === "reservation" && reservedFor) {
    expiresAt = new Date(reservedFor.getTime() + holdMinutes * 60 * 1000).toISOString()
  }

  const { data: entry, error } = await supabase
    .from("queue")
    .insert({
      user_id: userId,
      location_id: locationId,
      queue_type: queueType,
      reserved_for: reservedFor?.toISOString() || null,
      expires_at: expiresAt,
      position,
      status: "waiting",
    })
    .select()
    .single()

  if (error) {
    return jsonResponse({ error: error.message }, 500)
  }

  return jsonResponse({
    success: true,
    entry,
    message: queueType === "reservation"
      ? `Reservation confirmed for ${reservedFor?.toLocaleTimeString()}`
      : `You're #${position} in the walk-up queue`,
  })
}

// POST checkin - arrive and check in
async function handleCheckin(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  locationId: number
) {
  // Find user's active entry
  const { data: entry } = await supabase
    .from("queue")
    .select("*")
    .eq("user_id", userId)
    .eq("location_id", locationId)
    .is("checked_in_at", null)
    .is("checked_out_at", null)
    .in("status", ["waiting", "called"])
    .limit(1)
    .single()

  if (!entry) {
    return jsonResponse({ error: "No active reservation or queue entry found" }, 404)
  }

  // Get capacity config
  const { data: config } = await supabase
    .from("hull_capacity")
    .select("*")
    .eq("location_id", locationId)
    .single()

  const maxCapacity = config?.max_capacity || 20

  // Check current occupancy
  const { count: occupancy } = await supabase
    .from("queue")
    .select("*", { count: "exact", head: true })
    .eq("location_id", locationId)
    .not("checked_in_at", "is", null)
    .is("checked_out_at", null)

  const currentOccupancy = occupancy || 0

  // Reservation holders can check in if within 15 min window
  if (entry.queue_type === "reservation") {
    const reservedFor = new Date(entry.reserved_for)
    const now = new Date()
    const fifteenMinBefore = new Date(reservedFor.getTime() - 15 * 60 * 1000)
    const fifteenMinAfter = new Date(reservedFor.getTime() + 15 * 60 * 1000)

    if (now < fifteenMinBefore) {
      return jsonResponse({ error: "Too early to check in. Come back closer to your reservation time." }, 400)
    }
    if (now > fifteenMinAfter) {
      // Reservation expired - cancel it
      await supabase
        .from("queue")
        .update({ status: "expired" })
        .eq("id", entry.id)
      return jsonResponse({ error: "Reservation has expired" }, 400)
    }

    // Reservations always get in (they reserved capacity)
  } else {
    // Walk-ups can only check in when called AND capacity available
    if (entry.status !== "called") {
      return jsonResponse({ error: "Please wait until you're called" }, 400)
    }
    if (currentOccupancy >= maxCapacity) {
      return jsonResponse({ error: "Hull is at capacity. You'll be notified when a spot opens." }, 400)
    }
  }

  // Check in
  const { data: updated, error } = await supabase
    .from("queue")
    .update({
      checked_in_at: new Date().toISOString(),
      status: "checked_in",
    })
    .eq("id", entry.id)
    .select()
    .single()

  if (error) {
    return jsonResponse({ error: error.message }, 500)
  }

  return jsonResponse({
    success: true,
    entry: updated,
    message: "Welcome to the Hull!",
  })
}

// POST checkout - leave the Hull
async function handleCheckout(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  locationId: number
) {
  const { data: entry, error } = await supabase
    .from("queue")
    .update({
      checked_out_at: new Date().toISOString(),
      status: "completed",
    })
    .eq("user_id", userId)
    .eq("location_id", locationId)
    .not("checked_in_at", "is", null)
    .is("checked_out_at", null)
    .select()
    .single()

  if (error || !entry) {
    return jsonResponse({ error: "No active check-in found" }, 404)
  }

  // Call next person in walk-up queue
  await callNextInQueue(supabase, locationId)

  return jsonResponse({
    success: true,
    message: "Thanks for visiting the Hull!",
  })
}

// POST cancel - cancel reservation or leave queue
async function handleCancel(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  locationId: number
) {
  const { data: entry, error } = await supabase
    .from("queue")
    .update({ status: "cancelled" })
    .eq("user_id", userId)
    .eq("location_id", locationId)
    .is("checked_in_at", null)
    .in("status", ["waiting", "called"])
    .select()
    .single()

  if (error || !entry) {
    return jsonResponse({ error: "No active queue entry found to cancel" }, 404)
  }

  // Recalculate positions for walk-ups behind this one
  if (entry.queue_type === "walk_up" && entry.position) {
    await supabase.rpc("decrement_queue_positions", {
      p_location_id: locationId,
      p_after_position: entry.position,
    })
  }

  return jsonResponse({
    success: true,
    message: entry.queue_type === "reservation"
      ? "Reservation cancelled"
      : "You've left the queue",
  })
}

// Helper: call next person in walk-up queue when spot opens
async function callNextInQueue(
  supabase: ReturnType<typeof createClient>,
  locationId: number
) {
  const { data: next } = await supabase
    .from("queue")
    .select("*")
    .eq("location_id", locationId)
    .eq("queue_type", "walk_up")
    .eq("status", "waiting")
    .is("checked_in_at", null)
    .order("position", { ascending: true })
    .limit(1)
    .single()

  if (next) {
    await supabase
      .from("queue")
      .update({
        status: "called",
        called_at: new Date().toISOString(),
        notified_at: new Date().toISOString(),
      })
      .eq("id", next.id)
  }
}

function jsonResponse(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}
