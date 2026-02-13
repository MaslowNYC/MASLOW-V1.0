import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

interface BuyCreditsButtonProps {
  credits: number;
  amount: number;
  packageName: string;
  className?: string;
  children?: React.ReactNode;
}

export function BuyCreditsButton({ 
  credits, 
  amount, 
  packageName,
  className = '',
  children
}: BuyCreditsButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);

      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in to purchase credits');
        window.location.href = '/login';
        return;
      }

      // Create payment intent
      const response = await fetch(
        'https://hrfmphkjeqcwhsfvzfvw.supabase.co/functions/v1/create-payment-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            credits,
            userId: user.id,
            packageName,
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Show success message with instructions
      alert(
        `Payment Intent Created!\n\n` +
        `Package: ${packageName}\n` +
        `Amount: $${amount}\n` +
        `Credits: ${credits}\n\n` +
        `To complete payment:\n` +
        `1. Open Maslow app on your phone\n` +
        `2. Go to Buy Credits\n` +
        `3. Select this same package\n` +
        `4. Complete payment with Stripe\n\n` +
        `Or we can implement web checkout later!`
      );

    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} transition-opacity`}
    >
      {loading ? 'Processing...' : children || `Buy ${packageName} - $${amount}`}
    </button>
  );
}
