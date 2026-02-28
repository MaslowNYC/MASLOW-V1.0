import "@supabase/functions-js/edge-runtime.d.ts"

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    })
  }

  try {
    const body = await req.json()
    console.log("Received body:", JSON.stringify(body))

    const amount = parseInt(String(body.amount), 10)
    const userId = body.userId || "guest"

    if (!amount || isNaN(amount) || amount <= 0) {
      return new Response(
        JSON.stringify({ error: `Invalid amount: ${body.amount}` }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      )
    }

    if (!STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: "Payment service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      )
    }

    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: String(amount),
        currency: "usd",
        "automatic_payment_methods[enabled]": "true",
        "metadata[userId]": userId,
      }),
    })

    const paymentIntent = await response.json()
    console.log("Stripe response:", JSON.stringify(paymentIntent))

    if (paymentIntent.error) {
      return new Response(
        JSON.stringify({ error: paymentIntent.error.message }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      )
    }

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    )
  }
})