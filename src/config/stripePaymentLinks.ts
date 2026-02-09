
// TODO: Replace these placeholder URLs with your actual Stripe Payment Links
// 1. Go to Stripe Dashboard -> Payments -> Payment Links
// 2. Create a link for each product tier
// 3. Paste the 'buy.stripe.com' URLs here

export type PaymentTier = 'THE BELIEVER' | 'THE FOUNDER' | 'THE PATRON' | 'THE ARCHITECT';

export const STRIPE_PAYMENT_LINKS: Record<PaymentTier, string> = {
  'THE BELIEVER': "https://buy.stripe.com/test_believer_placeholder",
  'THE FOUNDER': "https://buy.stripe.com/test_founder_placeholder",
  'THE PATRON': "https://buy.stripe.com/test_patron_placeholder",
  'THE ARCHITECT': "https://buy.stripe.com/test_architect_placeholder"
};
