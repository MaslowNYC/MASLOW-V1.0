import "@supabase/functions-js/edge-runtime.d.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const FOUNDER_EMAIL = "patrick@maslow.nyc"

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE"
  table: string
  record: Record<string, unknown>
  old_record: Record<string, unknown> | null
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

  try {
    const payload: WebhookPayload = await req.json()
    const { type, table, record, old_record } = payload

    // Build notification content based on event
    let subject = ""
    let body = ""
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" })

    // Format member number helper
    const formatMemberNumber = (num: unknown): string => {
      if (num === null || num === undefined) return "Pending"
      return `#${String(num).padStart(5, "0")}`
    }

    // Route to correct message based on table + type
    if (table === "profiles" && type === "INSERT") {
      subject = `🎉 New Maslow Signup — Member ${formatMemberNumber(record.member_number)}`
      body = `
New member just signed up!

Name: ${record.first_name || "Unknown"}
Email: ${record.email || "Unknown"}
Member: ${formatMemberNumber(record.member_number)}
Time: ${timestamp}
      `.trim()
    }

    else if (table === "profiles" && type === "UPDATE" && old_record &&
             !old_record.phone_verified && record.phone_verified) {
      subject = `📱 Phone Verified — Member ${formatMemberNumber(record.member_number)}`
      body = `
A member just verified their phone number.

Name: ${record.first_name || "Unknown"}
Phone: ${record.phone || "Unknown"}
Member: ${formatMemberNumber(record.member_number)}
Time: ${timestamp}
      `.trim()
    }

    else if (table === "profiles" && type === "UPDATE" && old_record &&
             record.membership_tier !== old_record.membership_tier &&
             record.membership_tier) {
      subject = `💳 Membership Purchase — ${record.membership_tier}`
      body = `
A member just purchased or upgraded their membership!

Name: ${record.first_name || "Unknown"}
Email: ${record.email || "Unknown"}
New Tier: ${record.membership_tier}
Previous Tier: ${old_record.membership_tier || "None"}
Member: ${formatMemberNumber(record.member_number)}
Time: ${timestamp}
      `.trim()
    }

    else if (table === "memberships" && type === "INSERT") {
      subject = `💳 New Membership Created`
      body = `
A new membership record was created.

User ID: ${record.user_id || "Unknown"}
Tier: ${record.tier || record.type || "Unknown"}
Status: ${record.status || "Unknown"}
Time: ${timestamp}

Record ID: ${record.id}
      `.trim()
    }

    else if (table === "event_attendees" && type === "INSERT") {
      subject = `🎫 Event Registration`
      body = `
Someone just registered for an event.

User ID: ${record.user_id || "Unknown"}
Event ID: ${record.event_id || "Unknown"}
Status: ${record.status || "registered"}
Time: ${timestamp}

Record ID: ${record.id}
      `.trim()
    }

    else {
      // Unknown event — log it but don't send noise
      console.log("notify-founder: unhandled event", { type, table })
      return new Response(JSON.stringify({ status: "skipped", reason: "unhandled event type" }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

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
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Maslow Notifications <notifications@maslow.nyc>",
        to: FOUNDER_EMAIL,
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

    console.log(`Notification sent: ${subject}`)
    return new Response(JSON.stringify({ status: "sent", subject }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })

  } catch (error) {
    console.error("notify-founder error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  }
})
