/**
 * Local dev API server — replaces `vercel dev` for local testing.
 * Runs the Stripe create-payment-intent endpoint on port 3001.
 * Usage: node dev-api-server.cjs
 */

require('dotenv').config({ path: '.env' });

const http = require('http');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/stripe/create-payment-intent' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { amount, session_type, user_id, location_id } = JSON.parse(body);

        if (!amount || typeof amount !== 'number' || amount <= 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid amount' }));
          return;
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'usd',
          metadata: { user_id, session_type, location_id: String(location_id) },
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ clientSecret: paymentIntent.client_secret }));
      } catch (err) {
        console.error('Error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3001, () => {
  console.log('✅ Dev API server running on http://localhost:3001');
  console.log('   STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ loaded' : '❌ MISSING');
});
