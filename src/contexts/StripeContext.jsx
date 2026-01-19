
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Initialize Stripe with publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SooXZJLId5Pxdd43YNywQIyrZc2Dr4hD7MSLUfR75554zf3zgGc6Az1Lq7YUvJXrZChA9rtxTnEberbnceKOJcL00uGqU3ENl');

export const StripeProvider = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};
