/**
 * Vercel Serverless Function: Stripe Webhook Handler
 *
 * Handles Stripe webhook events, specifically payment_intent.succeeded.
 * When a payment succeeds:
 * 1. Verifies the webhook signature for security
 * 2. Extracts booking metadata (user_id, session_type, location_id)
 * 3. Finds an available suite at the location
 * 4. Creates a session record with payment info
 * 5. Marks the suite as unavailable
 *
 * POST /api/stripe/webhook
 * Headers: stripe-signature (required)
 * Body: Raw Stripe event payload
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Service key bypasses RLS
);

function generateQRCode(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `MASLOW-${timestamp}-${random}`.toUpperCase();
}

export const config = {
  api: {
    bodyParser: false, // Required for Stripe signature verification
  },
};

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Only handle payment_intent.succeeded
  if (event.type !== 'payment_intent.succeeded') {
    return res.status(200).json({ received: true, ignored: event.type });
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const { user_id, session_type, location_id } = paymentIntent.metadata;

  if (!user_id || !location_id) {
    console.error('Missing required metadata:', paymentIntent.metadata);
    return res.status(400).json({ error: 'Missing required metadata' });
  }

  const locationIdNum = parseInt(location_id, 10);

  try {
    // Find an available suite at this location
    const { data: suite, error: suiteError } = await supabase
      .from('suites')
      .select('id')
      .eq('location_id', locationIdNum)
      .eq('is_available', true)
      .eq('is_operational', true)
      .limit(1)
      .single();

    if (suiteError || !suite) {
      console.error('No available suite found:', suiteError);
      // Still return 200 to Stripe - we'll handle this manually
      // Returning non-200 would cause Stripe to retry
      return res.status(200).json({
        received: true,
        error: 'No available suite',
        payment_intent_id: paymentIntent.id
      });
    }

    // Create the session record
    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id,
        location_id: locationIdNum,
        suite_id: suite.id,
        qr_code: generateQRCode(),
        status: 'active',
        payment_status: 'paid',
        amount_paid: paymentIntent.amount / 100, // Convert cents to dollars
        start_time: new Date().toISOString(),
      });

    if (sessionError) {
      console.error('Failed to create session:', sessionError);
      return res.status(200).json({
        received: true,
        error: 'Failed to create session',
        payment_intent_id: paymentIntent.id
      });
    }

    // Mark the suite as unavailable
    const { error: updateError } = await supabase
      .from('suites')
      .update({ is_available: false, updated_at: new Date().toISOString() })
      .eq('id', suite.id);

    if (updateError) {
      console.error('Failed to update suite availability:', updateError);
      // Session was created, so still return success
    }

    console.log(`Session created for user ${user_id} at location ${location_id}, suite ${suite.id}`);
    return res.status(200).json({ received: true, success: true });

  } catch (err) {
    console.error('Webhook processing error:', err);
    // Return 200 to prevent Stripe retries - log for manual investigation
    return res.status(200).json({
      received: true,
      error: 'Processing error',
      payment_intent_id: paymentIntent.id
    });
  }
}
