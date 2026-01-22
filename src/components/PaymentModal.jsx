
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '@/api/EcommerceApi';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { featureFlags } from '@/config/featureFlags'; // <--- UPDATED IMPORT

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
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: user?.email || '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
    }
  });

  // Effect to pre-fill user data
  useEffect(() => {
    if (user) {
        setBillingDetails(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  // Create PaymentIntent when modal opens
  useEffect(() => {
    if (isOpen && price && !succeeded && featureFlags.enablePayments) { // <--- UPDATED CHECK
      const fetchPaymentIntent = async () => {
        try {
            setLoading(true);
            const data = await createPaymentIntent({ 
                amount: price * 100, // Convert to cents
                currency: 'usd',
                description: `Maslow Membership: ${tierName}`,
                metadata: {
                    tier: tierName,
                    userId: user?.id
                }
            });
            setClientSecret(data.clientSecret);
        } catch (err) {
            console.error("Payment intent error:", err);
            setError("Failed to initialize payment. Please try again.");
        } finally {
            setLoading(false);
        }
      };
      
      fetchPaymentIntent();
    }
  }, [isOpen, price, tierName, user, succeeded]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // DOUBLE CHECK: Stop if payments are disabled
    if (!featureFlags.enablePayments) {
        setLoading(false);
        setError("Payments are currently disabled.");
        return;
    }

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: billingDetails
      }
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setLoading(false);
    } else {
      setError(null);
      setSucceeded(true);
      setLoading(false);
      toast({
        title: "Welcome to Maslow.",
        description: "Your membership has been secured.",
      });
      // Here you would typically trigger a database update to upgrade the user
      setTimeout(() => {
          onClose();
      }, 2000);
    }
  };

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name.includes('.')) {
          const [parent, child] = name.split('.');
          setBillingDetails(prev => ({
              ...prev,
              [parent]: { ...prev[parent], [child]: value }
          }));
      } else {
          setBillingDetails(prev => ({ ...prev, [name]: value }));
      }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#3B5998]/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 bg-[#3B5998] text-[#F5F1E8] flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl font-serif font-bold">Secure Membership</h3>
                        <p className="text-[#F5F1E8]/70 text-sm mt-1">{tierName} • ${price}</p>
                    </div>
                    <button onClick={onClose} className="text-[#F5F1E8]/70 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {succeeded ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h4 className="text-2xl font-bold text-[#3B5998] mb-2">Payment Successful</h4>
                            <p className="text-gray-500">Your Member ID is being generated.</p>
                        </div>
                    ) : !featureFlags.enablePayments ? (
                        // DISABLED STATE
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-[#3B5998] mb-2">Checkout Closed</h4>
                            <p className="text-gray-500 mb-6">We are currently in Waitlist Mode. Payments are disabled.</p>
                            <Button onClick={onClose} variant="outline" className="w-full">
                                Return to Site
                            </Button>
                        </div>
                    ) : (
                        // ACTIVE FORM