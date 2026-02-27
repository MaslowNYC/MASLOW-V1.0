import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CreditsPurchaseModal from './CreditsPurchaseModal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface BuyCreditsButtonProps {
  credits: number;
  amount: number;
  packageName: string;
  className?: string;
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function BuyCreditsButton({
  credits,
  amount,
  packageName,
  className = '',
  children,
  onSuccess
}: BuyCreditsButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${className} hover:opacity-90 transition-opacity`}
      >
        {children || `Buy ${packageName} - $${amount}`}
      </button>

      <Elements stripe={stripePromise}>
        <CreditsPurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          packageName={packageName}
          credits={credits}
          price={amount}
          onSuccess={onSuccess}
        />
      </Elements>
    </>
  );
}
