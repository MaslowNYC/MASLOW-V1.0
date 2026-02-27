import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { CardElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import type { Stripe, StripeElements, PaymentRequest, PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Lock, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { featureFlags } from '@/config/featureFlags';

const cardStyle = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased" as const,
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierName: string;
  price: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, tierName, price }) => {
  const stripe = useStripe() as Stripe | null;
  const elements = useElements() as StripeElements | null;
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [canMakePayment, setCanMakePayment] = useState<boolean | null>(null);

  // Force close if payments are disabled
  useEffect(() => {
    if (!featureFlags.enablePayments && isOpen) {
      onClose();
      toast({
        title: "Payments Unavailable",
        description: "Payment processing is currently disabled.",
        variant: "destructive"
      });
    }
  }, [isOpen, onClose]);

  const recordMembership = async (): Promise<void> => {
    if (!user) {
      console.error("User not authenticated during payment record.");
      return;
    }

    try {
      // Direct insertion to memberships table using authenticated user
      const { error } = await (supabase
        .from('memberships') as any)
        .insert({
          user_id: user.id,
          tier_name: tierName,
          amount: price,
          status: 'active',
          member_name: name || user.email,
          member_location: location || 'New York, NY'
        });

      if (error) {
        console.error('Error recording membership:', error);
        throw error;
      }

      // Also update the funding goal
      // In a real app, this should be a trigger or atomic transaction on the server
      const { data: currentGoal } = await (supabase
        .from('funding_goal') as any)
        .select('current_total')
        .single();

      if (currentGoal) {
        await (supabase
          .from('funding_goal') as any)
          .update({ current_total: Number(currentGoal.current_total) + Number(price) })
          .eq('goal_amount', 1000000); // Ideally use ID, but simplifying here
      }

    } catch (err) {
      console.error('Failed to record membership:', err);
      // Don't throw here to avoid showing error to user if payment succeeded but DB insert failed (edge case)
    }
  };

  const createPaymentIntent = async (): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          amount: price * 100,
          userId: user?.id || 'guest',
        }),
      }
    );
    const data = await response.json();
    console.log('Payment intent response:', data);
    if (data.error) throw new Error(data.error);
    if (!data.clientSecret) throw new Error('No client secret returned from payment service');
    return data.clientSecret;
  };

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (stripe && featureFlags.enablePayments) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: `${tierName} Sponsorship`,
          amount: price * 100, // Amount in cents
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
          const clientSecret = await createPaymentIntent();
          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

          if (confirmError) {
            ev.complete('fail');
            toast({ title: "Payment Failed", description: confirmError.message, variant: "destructive" });
            return;
          }

          ev.complete('success');

          if (paymentIntent?.status === 'succeeded') {
            setName(ev.payerName || name);
            await recordMembership();
            toast({
              title: "Sponsorship Confirmed!",
              description: `Thank you for your ${tierName} sponsorship via digital wallet!`,
              duration: 5000,
              className: "bg-green-50 border-green-200",
            });
            onClose();
          }
        } catch {
          ev.complete('fail');
        }
      });
    }
  }, [stripe, price, tierName, onClose, user, name]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!featureFlags.enablePayments) {
      setError("Payments are currently disabled.");
      return;
    }

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
      const clientSecret = await createPaymentIntent();

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
        await recordMembership();
        toast({
          title: "Sponsorship Confirmed!",
          description: `Thank you for your ${tierName} sponsorship!`,
          duration: 5000,
          className: "bg-green-50 border-green-200",
        });
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Payment Failed",
        description: "We couldn't process your payment. Please check your details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!featureFlags.enablePayments) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white text-gray-900 border-none shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-[#3B5998] p-6 text-white text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-[#F5F1E8]">Secure Checkout</DialogTitle>
            <DialogDescription className="text-[#F5F1E8]/80 text-lg">
              {tierName} Sponsorship
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-3xl font-bold text-[#C5A059]">
            ${price.toLocaleString()}
          </div>
        </div>

        <div className="p-6 pb-0">
           {paymentRequest && canMakePayment ? (
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Express Checkout</Label>
              <div className="w-full">
                <PaymentRequestButtonElement options={{ paymentRequest, style: { paymentRequestButton: { theme: 'dark', height: '48px' } } }} />
              </div>
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 font-medium">Or pay with card</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          <div className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Cardholder Name (For Digital Wall)</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                required
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-[#3B5998] focus:ring-[#3B5998]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                required
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-[#3B5998] focus:ring-[#3B5998]"
              />
            </div>

             <div className="grid gap-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">City / Location (Optional)</Label>
              <Input
                id="location"
                type="text"
                placeholder="New York, NY"
                value={location}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-[#3B5998] focus:ring-[#3B5998]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="card-element" className="text-sm font-medium text-gray-700">Card Details</Label>
              <div className="p-4 border rounded-md bg-gray-50 border-gray-200 focus-within:border-[#3B5998] focus-within:ring-1 focus-within:ring-[#3B5998]">
                <CardElement id="card-element" options={cardStyle} />
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
              className="w-full bg-[#3B5998] hover:bg-[#2d4474] text-white py-6 text-lg font-bold shadow-lg transition-all"
              disabled={!stripe || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Contribute ${price.toLocaleString()}
                  <Lock className="ml-2 h-4 w-4 opacity-70" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Payments secured by Stripe. No card data is stored on our servers.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
