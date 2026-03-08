/**
 * Vercel Serverless Function: Create Stripe PaymentIntent
 *
 * Creates a PaymentIntent for session bookings. The metadata (user_id, session_type,
 * location_id) is attached to the PaymentIntent so the webhook can process the booking
 * after successful payment.
 *
 * POST /api/stripe/create-payment-intent
 * Body: { amount: number, session_type: string, user_id: string, location_id: number }
 * Returns: { clientSecret: string }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  // Set CORS headers for all responses
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, session_type, user_id, location_id } = req.body || {};

  // Validate required fields
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount: must be a positive number' });
  }
  if (!session_type || typeof session_type !== 'string') {
    return res.status(400).json({ error: 'Invalid session_type: must be a string' });
  }
  if (!user_id || typeof user_id !== 'string') {
    return res.status(400).json({ error: 'Invalid user_id: must be a string' });
  }
  if (!location_id || typeof location_id !== 'number') {
    return res.status(400).json({ error: 'Invalid location_id: must be a number' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'usd',
      metadata: {
        user_id,
        session_type,
        location_id: String(location_id),
      },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe PaymentIntent error:', err);

    if (err instanceof Stripe.errors.StripeError) {
      return res.status(err.statusCode || 500).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Failed to create payment intent' });
  }
}
