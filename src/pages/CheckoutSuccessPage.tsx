import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const CheckoutSuccessPage: React.FC = () => {
  const { clearCart } = useCart();

  // Clear the cart and scroll to top when landing on success page
  useEffect(() => {
    clearCart();
    window.scrollTo(0, 0);
  }, [clearCart]);

  const bookingRef = Math.random().toString(36).substring(7).toUpperCase();

  const nextSteps = [
    "Check your email — a confirmation is on its way to you.",
    "Head to any Maslow location and scan your pass to enter.",
    "Your selected samples will be waiting in your suite."
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Hero Section */}
      <section
        className="relative pt-32 pb-24 px-6"
        style={{ background: 'linear-gradient(160deg, #1a2318 0%, #2d3b28 60%, #1e2d1a 100%)' }}
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,10 C60,10 70,20 70,30 C70,40 60,50 50,50 C40,50 30,40 30,30 C30,20 40,10 50,10' fill='%23ffffff' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle
              className="w-16 h-16 mx-auto mb-8"
              style={{ color: 'var(--gold)' }}
            />
            <h1
              className="text-4xl md:text-5xl font-light mb-4"
              style={{ color: 'var(--cream)', fontFamily: 'var(--serif)' }}
            >
              Your Suite is Confirmed.
            </h1>
            <p
              className="text-xl font-light"
              style={{ color: 'rgba(250,244,237,0.75)', fontFamily: 'var(--sans)' }}
            >
              You're all set. We'll see you soon.
            </p>
          </motion.div>
        </div>
        {/* Bottom wave transition */}
        <svg
          className="absolute bottom-0 left-0 w-full h-16"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          style={{ fill: 'var(--cream)' }}
        >
          <path d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,40 1440,32 L1440,64 L0,64 Z" />
        </svg>
      </section>

      {/* Body Section */}
      <section className="py-16 px-6" style={{ background: 'var(--cream)' }}>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
            >
              What Happens Next
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <ul className="space-y-4 mb-12">
              {nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                    style={{ background: 'var(--moss)' }}
                  ></div>
                  <span style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
                    {step}
                  </span>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <Link to="/">
                <button
                  className="py-4 px-10 uppercase tracking-wider transition-opacity hover:opacity-90"
                  style={{
                    background: 'var(--charcoal)',
                    color: 'var(--cream)',
                    fontFamily: 'var(--sans)',
                    borderRadius: '2px',
                  }}
                >
                  Return Home
                </button>
              </Link>

              <p
                className="mt-8 text-sm"
                style={{ color: 'rgba(42,39,36,0.4)', fontFamily: 'var(--sans)' }}
              >
                Booking reference: {bookingRef}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutSuccessPage;
