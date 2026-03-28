import { createClient } from "@supabase/supabase-js"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
const SURVEY_NOTIFICATIONS_ENABLED = Deno.env.get("SURVEY_NOTIFICATIONS_ENABLED") !== "false"

const RECIPIENT_EMAIL = "patrick@maslow.nyc"
const SENDER_EMAIL = "Maslow Notifications <notifications@maslow.nyc>"

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE"
  table: string
  schema: string
  record: Record<string, unknown>
  old_record: Record<string, unknown> | null
}

// Human-readable labels for survey fields
const FIELD_LABELS: Record<string, string> = {
  public_restroom_feeling: "Public Restroom Feeling",
  uses_water_for_cleaning: "Uses Water for Cleaning",
  would_try_sprayer: "Would Try Sprayer",
  carries_own_vessel: "Carries Own Vessel",
  has_faith_based_washing: "Has Faith-Based Washing",
  needs_running_water_for_prayer: "Needs Running Water for Prayer",
  daily_washing_frequency: "Daily Washing Frequency",
  faith_background_broad: "Faith Background",
  sound_privacy_importance: "Sound Privacy Importance",
  visual_privacy_importance: "Visual Privacy Importance",
  brings_child_or_family: "Brings Child or Family",
  needs_gender_neutral: "Needs Gender-Neutral",
  typical_duration: "Typical Duration",
  has_practice_needing_more_time: "Has Practice Needing More Time",
  more_time_reason: "More Time Reason",
  avoids_alcohol: "Avoids Alcohol",
  avoids_pork_derivatives: "Avoids Pork Derivatives",
  avoids_fragrance: "Avoids Fragrance",
  avoids_none: "Avoids None",
  other_product_avoidance: "Other Product Avoidance",
  preferred_language: "Preferred Language",
  prefers_icons_over_text: "Prefers Icons Over Text",
  has_struggled_with_signage: "Has Struggled with Signage",
  signage_notes: "Signage Notes",
  region_broad: "Region",
  years_in_nyc: "Years in NYC",
  neighborhood_zip: "Neighborhood ZIP",
  one_thing_wrong: "One Thing Wrong",
  input_method: "Input Method",
  promo_code_issued: "Promo Code Issued",
}

// Fields to exclude from the email
const EXCLUDED_FIELDS = new Set([
  "id",
  "response_id",
  "session_token",
  "submitted_at",
  "created_at",
])

function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined) return "—"
  if (typeof value === "boolean") return value ? "Yes" : "No"
  return String(value)
}

function formatAnswers(data: Record<string, unknown>): string {
  const lines: string[] = []
  for (const [key, value] of Object.entries(data)) {
    if (EXCLUDED_FIELDS.has(key)) continue
    if (value === null || value === undefined) continue
    const label = FIELD_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    lines.push(`${label}: ${formatFieldValue(value)}`)
  }
  return lines.join("\n")
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    })
  }

  // Check if notifications are enabled
  if (!SURVEY_NOTIFICATIONS_ENABLED) {
    console.log("Survey notifications disabled via SURVEY_NOTIFICATIONS_ENABLED=false")
    return new Response(JSON.stringify({ status: "skipped", reason: "notifications disabled" }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  }

  try {
    const payload: WebhookPayload = await req.json()
    const { type, schema, table, record } = payload

    // Only process INSERTs to research.survey_responses
    if (type !== "INSERT" || schema !== "research" || table !== "survey_responses") {
      console.log(`Skipping: ${type} on ${schema}.${table}`)
      return new Response(JSON.stringify({ status: "skipped", reason: "not a survey_responses INSERT" }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    const responseId = record.id as string
    const submittedAt = record.submitted_at as string

    // Create Supabase client to fetch related data
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
      return new Response(JSON.stringify({ error: "Database client not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      db: { schema: "research" },
    })

    // Small delay to allow related tables to be populated
    await new Promise(resolve => setTimeout(resolve, 500))

    // Fetch all related data
    const [
      { data: waterHygiene },
      { data: ritualPractice },
      { data: privacyNeeds },
      { data: timeDuration },
      { data: productPrefs },
      { data: signageLanguage },
      { data: culturalBg },
    ] = await Promise.all([
      supabase.from("water_hygiene").select("*").eq("response_id", responseId).single(),
      supabase.from("ritual_practice").select("*").eq("response_id", responseId).single(),
      supabase.from("privacy_needs").select("*").eq("response_id", responseId).single(),
      supabase.from("time_duration").select("*").eq("response_id", responseId).single(),
      supabase.from("product_preferences").select("*").eq("response_id", responseId).single(),
      supabase.from("signage_language").select("*").eq("response_id", responseId).single(),
      supabase.from("cultural_background").select("*").eq("response_id", responseId).single(),
    ])

    // Combine all data
    const allData: Record<string, unknown> = {
      ...record,
      ...(waterHygiene || {}),
      ...(ritualPractice || {}),
      ...(privacyNeeds || {}),
      ...(timeDuration || {}),
      ...(productPrefs || {}),
      ...(signageLanguage || {}),
      ...(culturalBg || {}),
    }

    // Format timestamp
    const timestamp = new Date(submittedAt).toLocaleString("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })

    // Build email
    const subject = "New Unseen Standards Response"
    const body = `Someone just completed the Unseen Standards survey.

Time: ${timestamp}
Response ID: ${responseId}

--- Their Answers ---
${formatAnswers(allData)}
`

    // Send email via Resend
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured")
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: RECIPIENT_EMAIL,
        subject,
        text: body,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error("Failed to send notification email:", error)
      return new Response(JSON.stringify({ error: "email failed", details: error }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    console.log(`Survey notification sent for response ${responseId}`)
    return new Response(JSON.stringify({ status: "sent", responseId }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  } catch (error) {
    console.error("notify-survey-submission error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  }
})
