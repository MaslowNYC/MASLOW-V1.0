import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { toE164 } from '@/utils/phoneFormat';
import PhoneInput from '@/components/auth/PhoneInput';
import OtpInput from '@/components/auth/OtpInput';
import type { SessionType } from './SessionsSection';
import SamplePicker from './SamplePicker';

interface BookingSectionProps {
  selectedSession: SessionType | null;
}

const BookingSection = ({ selectedSession }: BookingSectionProps) => {
  const { user, sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // Auth form state
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [authStep, setAuthStep] = useState<'enter' | 'verify'>('enter');
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Sample selection state
  const [selectedSamples, setSelectedSamples] = useState<number[]>([]);
  const [samplesConfirmed, setSamplesConfirmed] = useState(false);

  // Payment state
  const [paymentError, setPaymentError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Price calculations
  const sampleTotal = selectedSamples.length * 200; // 200 cents per sample
  const totalCents = selectedSession ? selectedSession.price_cents + sampleTotal : 0;

  const formatPrice = (cents: number) => `$${Math.round(cents / 100)}`;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const e164 = toE164(phone);
      if (!e164) throw new Error('Please enter a valid phone number');

      if (isSignUp) {
        if (!firstName.trim() || !lastName.trim()) throw new Error('Please enter your first and last name');
        if (!email.trim()) throw new Error('Please enter your email');
        const { error } = await sendPhoneOtp({
          phone: e164,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
        });
        if (error) throw error;
      } else {
        const { error } = await sendPhoneOtp({ phone: e164, shouldCreateUser: false });
        if (error) {
          const msg = error.message?.toLowerCase() ?? '';
          if (msg.includes('not found') || msg.includes('signups not allowed') || msg.includes('user not')) {
            throw new Error('No account found for this number. Tap Create account.');
          }
          throw error;
        }
      }

      setPendingPhone(e164);
      setAuthStep('verify');
    } catch (err: any) {
      setAuthError(err.message || 'Unable to send code');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPhone) return;
    setAuthError('');
    setAuthLoading(true);
    try {
      const { error } = await verifyPhoneOtp({ phone: pendingPhone, token: codeDigits.join('') });
      if (error) throw error;
      // Auth state listener will update `user`; component naturally advances to next state.
    } catch (err: any) {
      setAuthError(err.message || 'Invalid verification code');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!pendingPhone) return;
    setAuthError('');
    setAuthLoading(true);
    try {
      const { error } = await sendPhoneOtp({
        phone: pendingPhone,
        ...(isSignUp
          ? {
              firstName: firstName.trim() || undefined,
              lastName: lastName.trim() || undefined,
              email: email.trim() || undefined,
            }
          : { shouldCreateUser: false }),
      });
      if (error) throw error;
      setCodeDigits(['', '', '', '', '', '']);
    } catch (err: any) {
      setAuthError(err.message || 'Unable to resend code');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleBackToEnter = () => {
    setAuthStep('enter');
    setCodeDigits(['', '', '', '', '', '']);
    setPendingPhone(null);
    setAuthError('');
  };

  const handleSamplesConfirm = (ids: number[]) => {
    setSelectedSamples(ids);
    setSamplesConfirmed(true);
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !selectedSession || !user) return;
    setPaymentError('');
    setPaymentLoading(true);
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalCents,
          session_type: selectedSession.name,
          user_id: user.id,
          location_id: 1,
        }),
      });
      const { clientSecret, error: intentError } = await response.json();
      if (intentError) throw new Error(intentError);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement, billing_details: { email: user.email } },
      });
      if (stripeError) throw stripeError;

      if (paymentIntent?.status === 'succeeded') {
        const { error: bookingError } = await (supabase.schema('public').from('bookings') as any).insert({
          user_id: user.id,
          location_id: 1,
          session_type_id: selectedSession.id,
          status: 'confirmed',
          payment_status: 'paid',
          amount_paid: totalCents,
          notes: selectedSamples.length > 0 ? `Samples: ${selectedSamples.join(',')}` : null,
        });
        if (bookingError) console.error('Booking insert error:', bookingError);
        navigate('/checkout-success');
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  // State A: nothing selected
  if (!selectedSession) {
    return (
      <section id="booking" className="py-24" style={{ background: 'var(--cream-2)' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xl" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)', opacity: 0.6 }}>
            Select a visit length above to continue
          </p>
        </div>
      </section>
    );
  }

  // State B: session selected, not logged in
  if (!user) {
    return (
      <section id="booking" className="py-24" style={{ background: 'var(--cream-2)' }}>
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}>Your Selection</p>
            <h2 className="text-3xl font-light" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>{selectedSession.name}</h2>
            <p className="mt-2 text-lg" style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)', opacity: 0.7 }}>
              {selectedSession.duration_minutes} min — {formatPrice(selectedSession.price_cents)}
            </p>
          </div>
          {authStep === 'enter' ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <h3 className="text-xl text-center" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>
                {isSignUp ? 'Create your account' : 'Sign in to continue'}
              </h3>
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full px-4 py-3 border rounded-sm focus:outline-none" style={{ borderColor: 'var(--charcoal)', fontFamily: 'var(--sans)', background: 'white' }} />
                    <input type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full px-4 py-3 border rounded-sm focus:outline-none" style={{ borderColor: 'var(--charcoal)', fontFamily: 'var(--sans)', background: 'white' }} />
                  </div>
                  <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border rounded-sm focus:outline-none" style={{ borderColor: 'var(--charcoal)', fontFamily: 'var(--sans)', background: 'white' }} />
                </>
              )}
              <PhoneInput
                value={phone}
                onChange={setPhone}
                required
                containerClassName="flex gap-3"
                prefixClassName="px-3 flex items-center justify-center border rounded-sm text-sm"
                prefixStyle={{ borderColor: 'var(--charcoal)', fontFamily: 'var(--sans)', background: 'white', color: 'var(--charcoal)' }}
                inputClassName="flex-1 w-full px-4 py-3 border rounded-sm focus:outline-none"
                inputStyle={{ borderColor: 'var(--charcoal)', fontFamily: 'var(--sans)', background: 'white' }}
              />
              {authError && <p className="text-red-600 text-sm text-center">{authError}</p>}
              <button type="submit" disabled={authLoading} className="w-full py-4 tracking-wider uppercase transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: 'var(--gold)', color: 'var(--charcoal)', fontFamily: 'var(--sans)', borderRadius: '2px' }}>
                {authLoading ? 'Please wait...' : 'Send Code'}
              </button>
              <p className="text-center text-sm" style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)' }}>
                {isSignUp
                  ? (<>Already have an account? <button type="button" onClick={() => setIsSignUp(false)} className="underline" style={{ color: 'var(--blue)' }}>Sign in</button></>)
                  : (<>New here? <button type="button" onClick={() => setIsSignUp(true)} className="underline" style={{ color: 'var(--blue)' }}>Create account</button></>)
                }
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <h3 className="text-xl text-center" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>
                Enter verification code
              </h3>
              <p className="text-sm text-center" style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)', opacity: 0.7 }}>
                We sent a 6-digit code to your phone.
              </p>
              <OtpInput
                value={codeDigits}
                onChange={setCodeDigits}
                containerClassName="flex gap-2 justify-center"
                boxClassName="w-12 h-14 text-center text-xl border rounded-sm focus:outline-none"
                boxStyle={{ borderColor: 'var(--charcoal)', fontFamily: 'var(--sans)', background: 'white', color: 'var(--charcoal)' }}
              />
              {authError && <p className="text-red-600 text-sm text-center">{authError}</p>}
              <button type="submit" disabled={authLoading || codeDigits.some(d => !d)} className="w-full py-4 tracking-wider uppercase transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: 'var(--gold)', color: 'var(--charcoal)', fontFamily: 'var(--sans)', borderRadius: '2px' }}>
                {authLoading ? 'Verifying...' : 'Verify & Continue'}
              </button>
              <p className="text-center text-sm" style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)' }}>
                Didn't get it?{' '}
                <button type="button" onClick={handleResendCode} disabled={authLoading} className="underline" style={{ color: 'var(--blue)' }}>Resend</button>
                {' · '}
                <button type="button" onClick={handleBackToEnter} className="underline" style={{ color: 'var(--blue)' }}>Edit number</button>
              </p>
            </form>
          )}
        </div>
      </section>
    );
  }

  // State C: logged in, samples not yet chosen (only if session allows samples)
  if (!samplesConfirmed && selectedSession.sample_limit > 0) {
    return (
      <section id="booking" className="py-24" style={{ background: 'var(--cream-2)' }}>
        <SamplePicker
          sessionType={selectedSession}
          onConfirm={handleSamplesConfirm}
        />
      </section>
    );
  }

  // State D: samples chosen (or skipped, or no samples allowed), ready to pay
  return (
    <section id="booking" className="py-24" style={{ background: 'var(--cream-2)' }}>
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}>Complete Your Booking</p>
          <h2 className="text-3xl font-light mb-2" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>{selectedSession.name}</h2>
          <p className="text-sm" style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)', opacity: 0.6 }}>
            {selectedSession.duration_minutes} min
            {selectedSamples.length > 0 && ` · ${selectedSamples.length} sample${selectedSamples.length > 1 ? 's' : ''}`}
          </p>
          <div className="w-12 h-px mx-auto my-4" style={{ background: 'var(--charcoal)', opacity: 0.2 }} />
          <p className="text-2xl font-light" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>
            Total: {formatPrice(totalCents)}
          </p>
          <p className="mt-3 text-sm" style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)', opacity: 0.5 }}>Booking as {user.email}</p>
        </div>
        <div className="space-y-6">
          <div className="p-4 border rounded-sm" style={{ borderColor: 'var(--charcoal)', background: 'white' }}>
            <CardElement options={{ style: { base: { fontSize: '16px', fontFamily: 'Jost, sans-serif', color: '#2A2724', '::placeholder': { color: 'rgba(42,39,36,0.5)' } } } }} />
          </div>
          {paymentError && <p className="text-red-600 text-sm text-center">{paymentError}</p>}
          <button onClick={handlePayment} disabled={paymentLoading || !stripe} className="w-full py-4 tracking-wider uppercase transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: 'var(--gold)', color: 'var(--charcoal)', fontFamily: 'var(--sans)', borderRadius: '2px' }}>
            {paymentLoading ? 'Processing...' : `Pay ${formatPrice(totalCents)}`}
          </button>
          <p className="text-center text-xs" style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)', opacity: 0.5 }}>Secure payment powered by Stripe</p>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
