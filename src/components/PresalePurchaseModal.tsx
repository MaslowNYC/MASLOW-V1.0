import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { CardElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import type { Stripe, StripeElements, PaymentRequest, PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Lock, CreditCard, Check } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const cardStyle = {
  style: {
    base: {
      color: '#1C2B3A',
      fontFamily: "'Jost', sans-serif",
      fontSmoothing: 'antialiased' as const,
      fontSize: '16px',
      '::placeholder': { color: '#9CA3AF' },
    },
    invalid: { color: '#DC2626', iconColor: '#DC2626' },
  },
};

interface PresaleTier {
  id: string;
  name: string;
  price: number;
  sessions: number;
  tagline: string;
}

interface PresalePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: PresaleTier;
  onSuccess?: (passNumber: number) => void;
}

const PresalePurchaseModal: React.FC<PresalePurchaseModalProps> = ({
  isOpen,
  onClose,
  tier,
  onSuccess,
}) => {
  const stripe = useStripe() as Stripe | null;
  const elements = useElements() as StripeElements | null;
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [canMakePayment, setCanMakePayment] = useState<boolean | null>(null);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const createPresaleIntent = async (): Promise<string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    // Attach auth token if logged in
    const { data: { session } } = await supabase.auth.refreshSession();
    if (session) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-presale-intent`,
      {
        method: 'POST',
        headers,
        // Only send tier ID — price is looked up server-side
        body: JSON.stringify({ tier: tier.id, email }),
      }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!data.clientSecret) throw new Error('No client secret returned');
    return data.clientSecret;
  };

  const recordPurchase = async (paymentIntentId: string): Promise<number> => {
    // Insert presale purchase record
    const { data, error: insertError } = await (supabase
      .from('presale_purchases') as any)
      .insert({
        user_id: user?.id || null,
        email,
        tier: tier.id,
        sessions_purchased: tier.sessions,
        amount_paid: tier.price,
        stripe_payment_intent_id: paymentIntentId,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error recording presale purchase:', insertError);
    }

    // Get total pass count for the "Pass #X" display
    const { count } = await (supabase
      .from('presale_purchases') as any)
      .select('*', { count: 'exact', head: true });

    return count || 1;
  };

  const notifyFounder = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-founder`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'presale_purchase',
            table: 'presale_purchases',
            record: {
              email,
              tier: tier.id,
              tier_name: tier.name,
              sessions_purchased: tier.sessions,
              amount_paid: tier.price,
            },
            old_record: null,
          }),
        }
      );
    } catch (e) {
      console.error('Failed to notify founder:', e);
    }
  };

  // Express checkout (Apple Pay / Google Pay)
  useEffect(() => {
    if (stripe && isOpen) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: `Maslow ${tier.name}`,
          amount: tier.price * 100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
          setCanMakePayment(true);
        } else {
          setCanMakePayment(false);
        }
      });

      pr.on('paymentmethod', async (ev: PaymentRequestPaymentMethodEvent) => {
        try {
          const clientSecret = await createPresaleIntent();
          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

          if (confirmError) {
            ev.complete('fail');
            toast({ title: 'Payment Failed', description: confirmError.message, variant: 'destructive' });
            return;
          }

          ev.complete('success');

          if (paymentIntent?.status === 'succeeded') {
            const passNumber = await recordPurchase(paymentIntent.id);
            await notifyFounder();
            onSuccess?.(passNumber);
          }
        } catch {
          ev.complete('fail');
        }
      });
    }
  }, [stripe, tier, isOpen, email]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLoading(false);
      return;
    }

    try {
      const clientSecret = await createPresaleIntent();

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name, email },
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        const passNumber = await recordPurchase(paymentIntent.id);
        await notifyFounder();
        onSuccess?.(passNumber);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      toast({
        title: 'Payment Failed',
        description: "We couldn't process your payment. Please check your details.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white text-[#1C2B3A] border-none shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-[#1C2B3A] p-6 text-white text-center rounded-t-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-white">{tier.name}</DialogTitle>
            <DialogDescription className="text-white/70 text-sm mt-1">
              {tier.tagline}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="text-3xl font-bold text-[#C49F58]">
              ${tier.price.toLocaleString()}
            </div>
            <div className="text-sm text-white/60 mt-1">
              {tier.sessions === -1 ? 'Unlimited access for one year' : `${tier.sessions} session${tier.sessions > 1 ? 's' : ''}`}
            </div>
          </div>
        </div>

        {/* Express checkout */}
        <div className="p-6 pb-0">
          {paymentRequest && canMakePayment ? (
            <div className="mb-6">
              <Label className="text-sm font-medium text-[#6B7280] mb-2 block">Express Checkout</Label>
              <PaymentRequestButtonElement
                options={{ paymentRequest, style: { paymentRequestButton: { theme: 'dark', height: '48px' } } }}
              />
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or pay with card</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Card form */}
        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          <div className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="presale-name" className="text-sm font-medium text-[#6B7280]">Name on Card</Label>
              <Input
                id="presale-name"
                placeholder="Jane Doe"
                required
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-[#C49F58] focus:ring-[#C49F58]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="presale-email" className="text-sm font-medium text-[#6B7280]">Email Address</Label>
              <Input
                id="presale-email"
                type="email"
                placeholder="jane@example.com"
                required
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-[#C49F58] focus:ring-[#C49F58]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="presale-card" className="text-sm font-medium text-[#6B7280]">Card Details</Label>
              <div className="p-4 border rounded-md bg-gray-50 border-gray-200 focus-within:border-[#C49F58] focus-within:ring-1 focus-within:ring-[#C49F58]">
                <CardElement id="presale-card" options={cardStyle} />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              className="w-full bg-[#C49F58] hover:bg-[#b08d4b] text-white py-6 text-lg font-bold shadow-lg transition-all"
              disabled={!stripe || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {tier.id === 'founding' ? 'Join' : 'Buy Now'} — ${tier.price.toLocaleString()}
                  <Lock className="ml-2 h-4 w-4 opacity-70" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Payments secured by Stripe
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PresalePurchaseModal;
