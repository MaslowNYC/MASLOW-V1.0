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
    const { amount, userId } = await req.json()

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

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret, debug: paymentIntent }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  }
})