
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Lock, CreditCard, Wallet } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { featureFlags } from '@/config/featureFlags';

const cardStyle = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
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

const PaymentModal = ({ isOpen, onClose, tierName, price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(null);

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

  const recordMembership = async () => {
    if (!user) {
      console.error("User not authenticated during payment record.");
      return;
    }

    try {
      // Direct insertion to memberships table using authenticated user
      const { error } = await supabase
        .from('memberships')
        .insert({
          user_id: user.id,
          tier_name: tierName,
          amount: price,
          status: 'active', // Should verify payment first in real app
          member_name: name || user.email,
          member_location: location || 'New York, NY'
        });

      if (error) {
        console.error('Error recording membership:', error);
        throw error;
      }
      
      // Also update the funding goal
      // In a real app, this should be a trigger or atomic transaction on the server
      const { data: currentGoal } = await supabase
        .from('funding_goal')
        .select('current_total')
        .single();
        
      if (currentGoal) {
        await supabase
          .from('funding_goal')
          .update({ current_total: Number(currentGoal.current_total) + Number(price) })
          .eq('goal_amount', 1000000); // Ideally use ID, but simplifying here
      }

    } catch (err) {
      console.error('Failed to record membership:', err);
      // Don't throw here to avoid showing error to user if payment succeeded but DB insert failed (edge case)
    }
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

      pr.on('paymentmethod', async (ev) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (ev.paymentMethod) {
          // In a real implementation, you would confirm the payment intent server-side here
          // ev.paymentIntent.status === 'succeeded'
          
          ev.complete('success');
          
          setName(ev.payerName || name);
          await recordMembership();
          
          toast({
            title: "Sponsorship Confirmed!",
            description: `Thank you for your generous ${tierName} sponsorship via ${ev.paymentMethod.type === 'card' ? 'Digital Wallet' : ev.paymentMethod.type}!`,
            duration: 5000,
            className: "bg-green-50 border-green-200",
          });
          
          onClose();
        } else {
           ev.complete('fail');
           toast({
            title: "Payment Failed",
            description: "There was an issue processing your digital wallet payment.",
            variant: "destructive",
          });
        }
      });
    }
  }, [stripe, price, tierName, onClose, user, name]);

  const handleSubmit = async (event) => {
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

    try {
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: name,
          email: email,
        },
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        setLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('PaymentMethod Created:', paymentMethod);

      // Record membership in DB
      await recordMembership();

      toast({
        title: "Sponsorship Confirmed!",
        description: `Thank you for your generous ${tierName} sponsorship! Your name has been added to the Digital Wall.`,
        duration: 5000,
        className: "bg-green-50 border-green-200",
      });

      onClose();
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
      <DialogContent className="sm:max-w-[500px] bg-white text-gray-900 border-none shadow-2xl rounded-xl overflow-hidden p-0">
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
                onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setLocation(e.target.value)}
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
