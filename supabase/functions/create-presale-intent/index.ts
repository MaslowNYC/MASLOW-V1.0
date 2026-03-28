import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

// Server-side pricing — NEVER trust the frontend
const PRESALE_TIERS: Record<string, { price: number; sessions: number; label: string }> = {
  single:      { price: 500,   sessions: 1,  label: "Single Pass" },
  five_pack:   { price: 2000,  sessions: 5,  label: "5-Pack" },
  twelve_pack: { price: 4500,  sessions: 12, label: "12-Pack" },
  founding:    { price: 50000, sessions: -1, label: "Founding Member" }, // -1 = unlimited
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Content-Type": "application/json",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { tier, email } = await req.json()

    // Validate tier
    const tierData = PRESALE_TIERS[tier]
    if (!tierData) {
      return new Response(
        JSON.stringify({ error: `Invalid tier: ${tier}` }),
        { status: 400, headers: corsHeaders }
      )
    }

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: corsHeaders }
      )
    }

    if (!STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: "Payment service not configured" }),
        { status: 500, headers: corsHeaders }
      )
    }

    // Extract user ID from auth token if present
    let userId: string | null = null
    const authHeader = req.headers.get("Authorization")
    if (authHeader && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      const token = authHeader.replace("Bearer ", "")
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user) userId = user.id
    }

    // Create Stripe PaymentIntent with server-side price
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: String(tierData.price),
        currency: "usd",
        "automatic_payment_methods[enabled]": "true",
        "metadata[tier]": tier,
        "metadata[sessions]": String(tierData.sessions),
        "metadata[email]": email,
        "metadata[userId]": userId || "guest",
        "metadata[type]": "presale",
      }),
    })

    const paymentIntent = await response.json()

    if (paymentIntent.error) {
      return new Response(
        JSON.stringify({ error: paymentIntent.error.message }),
        { status: 400, headers: corsHeaders }
      )
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        amount: tierData.price,
        sessions: tierData.sessions,
      }),
      { headers: corsHeaders }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: corsHeaders }
    )
  }
})
