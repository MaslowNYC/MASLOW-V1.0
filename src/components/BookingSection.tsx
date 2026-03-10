import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { SessionType } from './SessionsSection';
import SamplePicker from './SamplePicker';

interface BookingSectionProps {
  selectedSession: SessionType | null;
}

const BookingSection = ({ selectedSession }: BookingSectionProps) => {
  const { user, signIn, signUp } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp({ email, password, options: { data: { first_name: firstName, last_name: lastName, full_name: `${firstName} ${lastName}`.trim() } } });
        if (error) throw error;
      } else {
        const { error } = await signIn({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
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
        const { error: bookingError } = await (supabase.from('bookings') as any).insert({
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
          <form onSubmit={handleAuth} className="space-y-6">
            <h3 className="text-xl text-center" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>
              {isSignUp ? 'Create your account' : 'Sign in to continue'}
            </h3>
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full px-4 py-3 border rounded-sm focus:outline-none" style={{ borderColor: 'var(--charcoal)', fontFamily: 'var(--sans)', background: 'white' }} />
                <input type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full px-4 py-3 border rounded-sm focus:outline-none" style={{ borderColor: 'var(--charcoal)', fontFamily: 'var(--sans)', background: 'white' }} />
              </div>
            )}
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border rounded-sm focus:outline-none" style={{ borderColor: 'var(--charcoal)', fontFamily: 'var(--sans)', background: 'white' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 border rounded-sm focus:outline-none" style={{ borderColor: 'var(--charcoal)', fontFamily: 'var(--sans)', background: 'white' }} />
            {authError && <p className="text-red-600 text-sm text-center">{authError}</p>}
            <button type="submit" disabled={authLoading} className="w-full py-4 tracking-wider uppercase transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: 'var(--gold)', color: 'var(--charcoal)', fontFamily: 'var(--sans)', borderRadius: '2px' }}>
              {authLoading ? 'Please wait...' : 'Continue'}
            </button>
            <p className="text-center text-sm" style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)' }}>
              {isSignUp
                ? (<>Already have an account? <button type="button" onClick={() => setIsSignUp(false)} className="underline" style={{ color: 'var(--blue)' }}>Sign in</button></>)
                : (<>New here? <button type="button" onClick={() => setIsSignUp(true)} className="underline" style={{ color: 'var(--blue)' }}>Create account</button></>)
              }
            </p>
          </form>
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
