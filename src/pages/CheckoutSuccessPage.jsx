
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const CheckoutSuccessPage = () => {
  const { clearCart } = useCart();

  // Clear the cart when landing on success page
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F1E8] px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-[#C5A059]"
      >
        <div className="p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#C5A059]/10 p-6 rounded-full">
              <CheckCircle className="w-20 h-20 text-[#C5A059]" />
            </div>
          </div>
          
          <h1 className="text-4xl font-serif font-bold text-[#3B5998] mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-[#3B5998]/70 mb-8 max-w-lg mx-auto">
            Thank you for your contribution to Maslow. Your order has been confirmed and you are helping build the infrastructure of dignity.
          </p>

          <div className="bg-[#F5F1E8] rounded-xl p-6 mb-8 text-left border border-[#3B5998]/10">
            <h3 className="font-bold text-[#3B5998] mb-2 uppercase tracking-wide text-sm">Next Steps</h3>
            <ul className="space-y-2 text-[#3B5998]/80 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>You will receive a confirmation email shortly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>Your Maslow Passes (if applicable) will be sent to your digital wallet.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>Physical items will be shipped within 3-5 business days.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/store">
              <Button className="w-full sm:w-auto bg-[#3B5998] hover:bg-[#2d4475] text-[#F5F1E8] px-8 py-6 font-bold tracking-wider">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto border-[#3B5998] text-[#3B5998] hover:bg-[#3B5998]/10 px-8 py-6 font-bold tracking-wider">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-[#3B5998] p-4 text-center">
          <p className="text-[#F5F1E8]/60 text-sm">
            Order Reference: {Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccessPage;
