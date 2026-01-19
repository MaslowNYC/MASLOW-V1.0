
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStripe, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { CreditCard, Wallet, Banknote, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { PAYMENT_DISABLED } from '@/config/featureFlags';

const PaymentOptionsModal = ({ isOpen, onClose, tierName, price, onPayWithCard }) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(null);
  const [loadingMethod, setLoadingMethod] = useState(null);

  // Force close if payments are disabled
  useEffect(() => {
    if (PAYMENT_DISABLED && isOpen) {
      onClose();
      toast({
        title: "Payments Unavailable",
        description: "Payment processing is currently disabled.",
        variant: "destructive"
      });
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (stripe && isOpen && !PAYMENT_DISABLED) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: `${tierName} Sponsorship`,
          amount: price * 100,
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
         ev.complete('success');
         toast({
            title: "Sponsorship Confirmed!",
            description: `Thank you for your generous ${tierName} sponsorship via Digital Wallet!`,
            duration: 5000,
            className: "bg-green-50 border-green-200",
          });
          onClose();
      });
    }
  }, [stripe, price, tierName, isOpen, onClose]);

  const handleExternalPayment = (method) => {
    if (PAYMENT_DISABLED) return;

    setLoadingMethod(method);
    
    // Simulate API call/redirect
    setTimeout(() => {
      setLoadingMethod(null);
      if (method === 'paypal') {
        window.open('https://www.paypal.com/checkoutnow', '_blank');
        toast({
          title: "Redirecting to PayPal",
          description: "Please complete your transaction in the new window.",
        });
      } else if (method === 'venmo') {
        window.open('https://venmo.com', '_blank');
        toast({
            title: "Opening Venmo",
            description: "Please complete your transaction via Venmo app or web.",
        });
      }
      onClose();
    }, 1500);
  };

  const handleCardClick = () => {
    if (PAYMENT_DISABLED) return;
    
    setLoadingMethod('card');
    setTimeout(() => {
        setLoadingMethod(null);
        onPayWithCard();
    }, 500);
  };

  if (PAYMENT_DISABLED) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-[#F5F1E8] p-0 overflow-hidden shadow-2xl border-0 rounded-xl">
        <div className="bg-[#3B5998] p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-[#F5F1E8]">Select Payment Method</DialogTitle>
            <DialogDescription className="text-[#F5F1E8]/80 text-lg mt-2">
              Complete your {tierName} sponsorship
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-3xl font-bold text-[#C5A059]">
            ${price.toLocaleString()}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Digital Wallet (Apple Pay / Google Pay) */}
          {paymentRequest && canMakePayment && (
            <div className="w-full mb-2">
               <div className="h-12 w-full">
                <PaymentRequestButtonElement 
                    options={{ 
                        paymentRequest, 
                        style: { 
                            paymentRequestButton: { 
                                theme: 'dark', 
                                height: '48px' 
                            } 
                        } 
                    }} 
                />
               </div>
               <p className="text-xs text-center text-gray-500 mt-2 flex items-center justify-center gap-1">
                 <Wallet className="w-3 h-3" />
                 Fast, secure checkout with your device
               </p>
            </div>
          )}

          {/* Credit Card */}
          <Button 
            variant="outline"
            className="w-full h-16 flex items-center justify-between px-6 border-2 border-[#3B5998]/10 hover:border-[#3B5998] hover:bg-white bg-white group transition-all duration-300"
            onClick={handleCardClick}
            disabled={loadingMethod === 'card'}
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#3B5998]/10 p-2 rounded-full group-hover:bg-[#3B5998] transition-colors duration-300">
                <CreditCard className="w-6 h-6 text-[#3B5998] group-hover:text-white" />
              </div>
              <span className="text-lg font-bold text-[#3B5998]">Credit / Debit Card</span>
            </div>
            {loadingMethod === 'card' ? <Loader2 className="w-5 h-5 animate-spin text-[#C5A059]" /> : <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#C5A059]" />}
          </Button>

          {/* PayPal */}
          <Button 
            variant="outline"
            className="w-full h-16 flex items-center justify-between px-6 border-2 border-[#3B5998]/10 hover:border-[#003087] hover:bg-white bg-white group transition-all duration-300"
            onClick={() => handleExternalPayment('paypal')}
            disabled={loadingMethod === 'paypal'}
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#003087]/10 p-2 rounded-full group-hover:bg-[#003087] transition-colors duration-300">
                <span className="font-bold text-[#003087] group-hover:text-white italic text-lg px-1">P</span>
              </div>
              <span className="text-lg font-bold text-[#003087]">PayPal</span>
            </div>
            {loadingMethod === 'paypal' ? <Loader2 className="w-5 h-5 animate-spin text-[#003087]" /> : <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#003087]" />}
          </Button>

          {/* Venmo / Cash App */}
          <Button 
            variant="outline"
            className="w-full h-16 flex items-center justify-between px-6 border-2 border-[#3B5998]/10 hover:border-[#008CFF] hover:bg-white bg-white group transition-all duration-300"
            onClick={() => handleExternalPayment('venmo')}
            disabled={loadingMethod === 'venmo'}
          >
             <div className="flex items-center gap-4">
              <div className="bg-[#008CFF]/10 p-2 rounded-full group-hover:bg-[#008CFF] transition-colors duration-300">
                <Banknote className="w-6 h-6 text-[#008CFF] group-hover:text-white" />
              </div>
              <span className="text-lg font-bold text-[#008CFF]">Venmo</span>
            </div>
            {loadingMethod === 'venmo' ? <Loader2 className="w-5 h-5 animate-spin text-[#008CFF]" /> : <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#008CFF]" />}
          </Button>

          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
             <ShieldCheck className="w-4 h-4 text-[#3B5998]" />
             <span>All transactions are secure and encrypted.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentOptionsModal;
