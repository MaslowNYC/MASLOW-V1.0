import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import PresalePurchaseModal from '@/components/PresalePurchaseModal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ── Tier data ──────────────────────────────────────────────

interface Tier {
  id: string;
  name: string;
  price: number;
  sessions: number;
  savings?: string;
  tagline: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    id: 'single',
    name: 'Single Pass',
    price: 5,
    sessions: 1,
    tagline: 'This is for everyone.',
    features: [
      'One 10-minute session',
      'Redeemable at SoHo location when we open',
    ],
    cta: 'Buy Now',
  },
  {
    id: 'five_pack',
    name: '5-Pack',
    price: 20,
    sessions: 5,
    savings: 'save $5',
    tagline: 'For the regulars.',
    features: [
      'Five 10-minute sessions',
      'Redeemable at SoHo location when we open',
    ],
    cta: 'Buy Now',
  },
  {
    id: 'twelve_pack',
    name: '12-Pack',
    price: 45,
    sessions: 12,
    savings: 'save $15',
    tagline: 'For the believers.',
    features: [
      'Twelve 10-minute sessions',
      'Redeemable at SoHo location when we open',
    ],
    cta: 'Buy Now',
    featured: true,
  },
  {
    id: 'founding',
    name: 'Founding Member',
    price: 500,
    sessions: -1,
    tagline: 'For the ones who showed up first.',
    features: [
      'Unlimited access for one year from opening',
      '24/7 access including after-hours',
      'Guest privileges',
      'Your name in the founding story',
    ],
    cta: 'Join',
  },
];

// ── FAQ data ───────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'When does Maslow open?',
    a: "We're targeting 2027. You'll be the first to know.",
  },
  {
    q: "What if it doesn't open?",
    a: 'Full refund within 24 months. Guaranteed.',
  },
  {
    q: 'Can I gift a pass?',
    a: 'Not yet, but soon.',
  },
  {
    q: 'Where is the SoHo location?',
    a: "We're finalizing the space. You'll get updates.",
  },
  {
    q: 'Is this an investment?',
    a: "No. You're buying a service pass, like a gift card. No equity, no returns — just a really nice bathroom when you need one.",
  },
];

// ── Inline auth form ───────────────────────────────────────

function InlineAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = mode === 'signup'
      ? await signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
      : await signIn({ email, password });

    if (result.error) {
      setError(result.error.message);
    } else {
      onAuthenticated();
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E0D8] shadow-sm max-w-md mx-auto">
      <h3 className="font-serif text-xl text-[#1C2B3A] text-center mb-1">
        {mode === 'signup' ? 'Create an account to continue' : 'Sign in to continue'}
      </h3>
      <p className="text-sm text-[#6B7280] text-center mb-4">
        We need an account to hold your pass.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#1C2B3A] focus:outline-none focus:border-[#C49F58] focus:ring-1 focus:ring-[#C49F58]"
        />
        <input
          type="password"
          placeholder="Password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#1C2B3A] focus:outline-none focus:border-[#C49F58] focus:ring-1 focus:ring-[#C49F58]"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1C2B3A] text-white py-3 rounded-lg font-semibold hover:bg-[#243347] transition-colors disabled:opacity-50"
        >
          {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <p className="text-xs text-center text-[#6B7280] mt-3">
        {mode === 'signup' ? (
          <>Already have an account? <button onClick={() => setMode('login')} className="text-[#C49F58] underline">Sign in</button></>
        ) : (
          <>Need an account? <button onClick={() => setMode('signup')} className="text-[#C49F58] underline">Sign up</button></>
        )}
      </p>
    </div>
  );
}

// ── FAQ Accordion Item ─────────────────────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#E5E0D8] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-serif text-lg text-[#1C2B3A] pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#C49F58] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[#6B7280] leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────

export default function FoundingPage() {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingTier, setPendingTier] = useState<Tier | null>(null);
  const [passCount, setPassCount] = useState<number | null>(null);

  // Confirmation state
  const [confirmation, setConfirmation] = useState<{
    passNumber: number;
    tier: Tier;
  } | null>(null);

  // Fetch total passes sold
  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await (supabase
        .from('presale_purchases') as any)
        .select('*', { count: 'exact', head: true });
      setPassCount(count || 0);
    };
    fetchCount();
  }, [confirmation]);

  const handleBuy = (tier: Tier) => {
    if (!user) {
      setPendingTier(tier);
      setShowAuth(true);
      return;
    }
    setSelectedTier(tier);
  };

  const handleAuthenticated = () => {
    setShowAuth(false);
    if (pendingTier) {
      setSelectedTier(pendingTier);
      setPendingTier(null);
    }
  };

  const handlePurchaseSuccess = (passNumber: number) => {
    if (selectedTier) {
      setConfirmation({ passNumber, tier: selectedTier });
    }
    setSelectedTier(null);
  };

  return (
    <>
      <Helmet>
        <title>Be Part of the Foundation — Maslow</title>
        <meta name="description" content="Pre-purchase your Maslow pass. Every pass you buy today is a pass you'll use on opening day." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#F8F7F4]">

        {/* ── Hero ─────────────────────────────────────── */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#C49F58] tracking-[0.3em] uppercase text-sm mb-6" style={{ fontFamily: 'var(--sans)' }}>
              Maslow
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-[#1C2B3A] mb-6 leading-tight">
              Be Part of the Foundation
            </h1>
            <p className="text-lg md:text-xl text-[#4A5568] leading-relaxed max-w-2xl mx-auto mb-4" style={{ fontFamily: 'var(--sans)' }}>
              We're building New York's first premium private restroom —
              and we need your help to make it real.
            </p>
            <p className="text-[#1C2B3A] font-medium text-lg" style={{ fontFamily: 'var(--sans)' }}>
              Every pass you buy today is a pass you'll use on opening day.
            </p>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────── */}
        <section className="pb-16 md:pb-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              {[
                { step: '1', text: 'Choose your pass' },
                { step: '2', text: 'We build it' },
                { step: '3', text: 'You walk in on day one' },
              ].map((item, i) => (
                <div key={item.step} className="flex items-center gap-3 md:gap-4">
                  {i > 0 && (
                    <span className="hidden md:block text-[#C49F58] text-2xl font-light">
                      &rarr;
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1C2B3A] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <span className="text-[#1C2B3A] font-medium" style={{ fontFamily: 'var(--sans)' }}>
                      {item.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Confirmation Banner ──────────────────────── */}
        <AnimatePresence>
          {confirmation && (
            <motion.section
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-4 pb-12"
            >
              <div className="max-w-lg mx-auto bg-[#1C2B3A] text-white rounded-xl p-8 text-center shadow-lg">
                <div className="w-12 h-12 bg-[#C49F58] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-serif text-2xl mb-2">You're in. Pass #{confirmation.passNumber}</h2>
                <p className="text-white/70 mb-1" style={{ fontFamily: 'var(--sans)' }}>
                  {confirmation.tier.sessions === -1
                    ? 'Unlimited sessions — Founding Member'
                    : `${confirmation.tier.sessions} session${confirmation.tier.sessions > 1 ? 's' : ''} purchased`
                  }
                </p>
                <p className="text-[#C49F58] text-sm mt-3" style={{ fontFamily: 'var(--sans)' }}>
                  We'll email you when we're ready.
                </p>
                <button
                  onClick={() => setConfirmation(null)}
                  className="mt-4 text-white/50 text-xs underline hover:text-white/70 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Inline Auth (if needed) ──────────────────── */}
        <AnimatePresence>
          {showAuth && !user && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-4 pb-12"
            >
              <InlineAuth onAuthenticated={handleAuthenticated} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Pass Cards ───────────────────────────────── */}
        <section className="pb-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all hover:shadow-md flex flex-col ${
                  tier.featured
                    ? 'border-[#C49F58] ring-1 ring-[#C49F58]/20'
                    : 'border-[#E5E0D8] hover:border-[#C49F58]'
                }`}
              >
                {/* Price + Name */}
                <div className="mb-4">
                  <h3 className="font-serif text-xl text-[#1C2B3A] mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#1C2B3A]">${tier.price}</span>
                    {tier.id === 'founding' && (
                      <span className="text-sm text-[#6B7280]">/year</span>
                    )}
                  </div>
                  {tier.savings && (
                    <span className="inline-block mt-1 text-xs text-[#C49F58] font-semibold uppercase tracking-wide">
                      {tier.savings}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-grow">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#4A5568]" style={{ fontFamily: 'var(--sans)' }}>
                      <Check className="w-4 h-4 text-[#C49F58] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Tagline */}
                <p className="text-sm italic text-[#6B7280] mb-4" style={{ fontFamily: 'var(--sans)' }}>
                  "{tier.tagline}"
                </p>

                {/* CTA */}
                <button
                  onClick={() => handleBuy(tier)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all text-center ${
                    tier.id === 'founding'
                      ? 'bg-[#1C2B3A] text-white hover:bg-[#243347]'
                      : 'bg-[#C49F58] text-white hover:bg-[#b08d4b]'
                  }`}
                  style={{ fontFamily: 'var(--sans)' }}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── The Promise ──────────────────────────────── */}
        <section className="pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl p-8 md:p-12 border border-[#E5E0D8] shadow-sm">
              <h2 className="font-serif text-2xl md:text-3xl text-[#1C2B3A] mb-4">
                Your money builds the space.<br />Your pass works on day one.
              </h2>
              <p className="text-[#6B7280] leading-relaxed" style={{ fontFamily: 'var(--sans)' }}>
                If we don't open within 24 months of your purchase,
                you get a full refund. No questions asked.
              </p>
            </div>
          </div>
        </section>

        {/* ── Social Proof Counter ─────────────────────── */}
        {passCount !== null && passCount > 0 && (
          <section className="pb-20 px-4">
            <div className="max-w-lg mx-auto text-center">
              <p className="text-[#1C2B3A] text-lg" style={{ fontFamily: 'var(--sans)' }}>
                <span className="text-3xl font-bold text-[#C49F58]">{passCount}</span>{' '}
                {passCount === 1 ? 'person is' : 'people are'} already in.
              </p>
            </div>
          </section>
        )}

        {/* ── FAQ ──────────────────────────────────────── */}
        <section className="pb-24 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-[#1C2B3A] text-center mb-8">
              Questions
            </h2>
            <div className="bg-white rounded-xl border border-[#E5E0D8] shadow-sm px-6">
              {FAQ_ITEMS.map((item) => (
                <FAQItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* ── Payment Modal ──────────────────────────────── */}
      {selectedTier && (
        <Elements stripe={stripePromise}>
          <PresalePurchaseModal
            isOpen={!!selectedTier}
            onClose={() => setSelectedTier(null)}
            tier={selectedTier}
            onSuccess={handlePurchaseSuccess}
          />
        </Elements>
      )}
    </>
  );
}
