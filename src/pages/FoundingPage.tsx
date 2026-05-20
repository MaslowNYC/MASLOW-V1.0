import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toE164 } from '@/utils/phoneFormat';
import PhoneInput from '@/components/auth/PhoneInput';
import OtpInput from '@/components/auth/OtpInput';
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
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [step, setStep] = useState<'enter' | 'verify'>('enter');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputClassName =
    'w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#1C2B3A] focus:outline-none focus:border-[#D4AF6A] focus:ring-1 focus:ring-[#D4AF6A]';

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const e164 = toE164(phone);
      if (!e164) throw new Error('Please enter a valid phone number');

      if (mode === 'signup') {
        if (!firstName.trim() || !lastName.trim()) throw new Error('Please enter your first and last name');
        if (!email.trim()) throw new Error('Please enter your email');
        const { error: sendError } = await sendPhoneOtp({
          phone: e164,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
        });
        if (sendError) throw sendError;
      } else {
        const { error: sendError } = await sendPhoneOtp({ phone: e164, shouldCreateUser: false });
        if (sendError) {
          const msg = sendError.message?.toLowerCase() ?? '';
          if (msg.includes('not found') || msg.includes('signups not allowed') || msg.includes('user not')) {
            setError('No account found for this number.');
            setMode('signup');
            setLoading(false);
            return;
          }
          throw sendError;
        }
      }

      setPendingPhone(e164);
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Unable to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPhone) return;
    setLoading(true);
    setError(null);
    try {
      const { error: verifyError } = await verifyPhoneOtp({ phone: pendingPhone, token: codeDigits.join('') });
      if (verifyError) throw verifyError;
      onAuthenticated();
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!pendingPhone) return;
    setLoading(true);
    setError(null);
    try {
      const { error: sendError } = await sendPhoneOtp({
        phone: pendingPhone,
        ...(mode === 'signup'
          ? {
              firstName: firstName.trim() || undefined,
              lastName: lastName.trim() || undefined,
              email: email.trim() || undefined,
            }
          : { shouldCreateUser: false }),
      });
      if (sendError) throw sendError;
      setCodeDigits(['', '', '', '', '', '']);
    } catch (err: any) {
      setError(err.message || 'Unable to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E0D8] shadow-sm max-w-md mx-auto">
      <h3 className="font-serif text-xl text-[#1C2B3A] text-center mb-1">
        {step === 'verify'
          ? 'Enter verification code'
          : mode === 'signup'
            ? 'Create an account to continue'
            : 'Sign in to continue'}
      </h3>
      <p className="text-sm text-[#6B7280] text-center mb-4">
        {step === 'verify'
          ? 'We sent a 6-digit code to your phone.'
          : 'We need an account to hold your pass.'}
      </p>

      {step === 'enter' ? (
        <form onSubmit={handleSendCode} className="space-y-3">
          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="First name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClassName} />
                <input type="text" placeholder="Last name" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClassName} />
              </div>
              <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClassName} />
            </>
          )}
          <PhoneInput
            value={phone}
            onChange={setPhone}
            required
            containerClassName="flex gap-2"
            prefixClassName="px-3 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50 text-sm text-[#1C2B3A]"
            inputClassName={inputClassName + ' flex-1'}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C2B3A] text-white py-3 rounded-lg font-semibold hover:bg-[#243347] transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait...' : 'Send Code'}
          </button>
          <p className="text-xs text-center text-[#6B7280] mt-3">
            {mode === 'signup' ? (
              <>Already have an account? <button type="button" onClick={() => setMode('login')} className="text-[#D4AF6A] underline">Sign in</button></>
            ) : (
              <>Need an account? <button type="button" onClick={() => setMode('signup')} className="text-[#D4AF6A] underline">Sign up</button></>
            )}
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-3">
          <OtpInput
            value={codeDigits}
            onChange={setCodeDigits}
            containerClassName="flex gap-2 justify-center"
            boxClassName="w-11 h-12 text-center text-lg border border-gray-200 rounded-lg bg-gray-50 text-[#1C2B3A] focus:outline-none focus:border-[#D4AF6A] focus:ring-1 focus:ring-[#D4AF6A]"
          />
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || codeDigits.some((d) => !d)}
            className="w-full bg-[#1C2B3A] text-white py-3 rounded-lg font-semibold hover:bg-[#243347] transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
          <p className="text-xs text-center text-[#6B7280]">
            Didn't get it?{' '}
            <button type="button" onClick={handleResendCode} disabled={loading} className="text-[#D4AF6A] underline">Resend</button>
            {' · '}
            <button type="button" onClick={() => { setStep('enter'); setCodeDigits(['', '', '', '', '', '']); setPendingPhone(null); setError(null); }} className="text-[#D4AF6A] underline">Edit number</button>
          </p>
        </form>
      )}
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
          className={`w-5 h-5 text-[#D4AF6A] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
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

export default function FoundationPage() {
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
        .schema('public')
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
        <section className="pt-16 pb-8 md:pt-20 md:pb-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#D4AF6A] tracking-[0.3em] uppercase text-sm mb-6" style={{ fontFamily: 'var(--sans)' }}>
              Maslow
            </p>
            <h1 className="text-3xl md:text-6xl font-serif text-[#1C2B3A] mb-6 leading-tight">
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
                <div className="w-12 h-12 bg-[#D4AF6A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-serif text-2xl mb-2 text-white">You're in. Pass #{confirmation.passNumber}</h2>
                <p className="text-white/70 mb-1" style={{ fontFamily: 'var(--sans)' }}>
                  {confirmation.tier.sessions === -1
                    ? 'Unlimited sessions — Founding Member'
                    : `${confirmation.tier.sessions} session${confirmation.tier.sessions > 1 ? 's' : ''} purchased`
                  }
                </p>
                <p className="text-[#D4AF6A] text-sm mt-3" style={{ fontFamily: 'var(--sans)' }}>
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
        <section className="pb-12 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`bg-white rounded-xl p-5 shadow-sm border-2 transition-all hover:shadow-md flex flex-col ${
                  tier.featured
                    ? 'border-[#D4AF6A] ring-1 ring-[#D4AF6A]/20'
                    : 'border-[#E5E0D8] hover:border-[#D4AF6A]'
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
                    <span className="inline-block mt-1 text-xs text-[#D4AF6A] font-semibold uppercase tracking-wide">
                      {tier.savings}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-1.5 mb-4 flex-grow">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#4A5568]" style={{ fontFamily: 'var(--sans)' }}>
                      <Check className="w-4 h-4 text-[#D4AF6A] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleBuy(tier)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all text-center ${
                    tier.id === 'founding'
                      ? 'bg-[#1C2B3A] text-white hover:bg-[#243347]'
                      : 'bg-[#D4AF6A] text-white hover:bg-[#bc9a58]'
                  }`}
                  style={{ fontFamily: 'var(--sans)' }}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>

          {/* ── Promise + Counter (inline under cards) ──── */}
          <div className="max-w-5xl mx-auto text-center mt-6">
            <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'var(--sans)' }}>
              If we don't open within 24 months, you get a full refund. No questions asked.
            </p>
            {passCount !== null && passCount > 0 && (
              <p className="text-sm text-[#6B7280] mt-2" style={{ fontFamily: 'var(--sans)' }}>
                <span className="font-bold text-[#D4AF6A]">{passCount}</span>{' '}
                {passCount === 1 ? 'person is' : 'people are'} already in.
              </p>
            )}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────── */}
        <section className="pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-[#1C2B3A] text-center mb-4">
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
