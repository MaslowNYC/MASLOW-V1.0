
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const CheckoutSuccessPage: React.FC = () => {
  const { clearCart } = useCart();

  // Clear the cart when landing on success page
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF4ED] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-[#C49F58]"
      >
        <div className="p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#C49F58]/10 p-6 rounded-full">
              <CheckCircle className="w-20 h-20 text-[#C49F58]" />
            </div>
          </div>

          <h1 className="text-4xl font-serif font-bold text-[#3C5999] mb-4">
            Payment Successful!
          </h1>

          <p className="text-lg text-[#3C5999]/70 mb-8 max-w-lg mx-auto">
            Thank you for your contribution to Maslow. Your order has been confirmed and you are helping build the infrastructure of dignity.
          </p>

          <div className="bg-[#FAF4ED] rounded-xl p-6 mb-8 text-left border border-[#3C5999]/10">
            <h3 className="font-bold text-[#3C5999] mb-2 uppercase tracking-wide text-sm">Next Steps</h3>
            <ul className="space-y-2 text-[#3C5999]/80 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#C49F58] font-bold">•</span>
                <span>You will receive a confirmation email shortly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C49F58] font-bold">•</span>
                <span>Your Maslow Passes (if applicable) will be sent to your digital wallet.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C49F58] font-bold">•</span>
                <span>Physical items will be shipped within 3-5 business days.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/store">
              <Button className="w-full sm:w-auto bg-[#3C5999] hover:bg-[#2d4475] text-[#FAF4ED] px-8 py-6 font-bold tracking-wider">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto border-[#3C5999] text-[#3C5999] hover:bg-[#3C5999]/10 px-8 py-6 font-bold tracking-wider">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-[#3C5999] p-4 text-center">
          <p className="text-[#FAF4ED]/60 text-sm">
            Order Reference: {Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccessPage;
