import React, { useCallback, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Trash2, ArrowRight, Lock } from 'lucide-react';
import { useCart, CartItem } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { initializeCheckout, formatCurrency } from '@/api/EcommerceApi';
import { useToast } from '@/components/ui/use-toast';
import { featureFlags } from '@/config/featureFlags';

interface ShoppingCartProps {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleCheckout = useCallback(async () => {
    // UPDATED CHECK
    if (!featureFlags.enablePayments) {
      toast({
        title: 'Checkout Unavailable',
        description: 'Payment processing is temporarily unavailable. Please check back later.',
        variant: 'destructive',
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some products to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const items = cartItems.map(item => ({
        variant_id: String(item.variant.id),
        quantity: item.quantity,
      }));

      const successUrl = `${window.location.origin}/checkout-success`;
      const cancelUrl = window.location.href;

      const response = await initializeCheckout({ items, successUrl, cancelUrl });

      if (!response || !response.url) {
        throw new Error("Invalid checkout session URL received from server.");
      }

      window.location.href = response.url;
    } catch (error) {
      console.error("Checkout initialization failed:", error);
      toast({
        title: 'Checkout Unavailable',
        description: (error as Error).message || 'There was a problem connecting to the payment provider. Please try again later.',
        variant: 'destructive',
      });
    }
  }, [cartItems, toast]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#286BCD]/60 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FAF4ED] shadow-2xl z-50 flex flex-col border-l border-[#C49F58]"
            onClick={(e: MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#286BCD]/10 bg-white">
              <div className="flex items-center gap-3">
                <ShoppingCartIcon className="w-6 h-6 text-[#C49F58]" />
                <h2 className="text-xl font-bold text-[#286BCD] font-serif">Your Cart</h2>
              </div>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-[#286BCD] hover:bg-[#286BCD]/10">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-[#FAF4ED]">
              {cartItems.length === 0 ? (
                <div className="text-center text-[#286BCD]/40 h-full flex flex-col items-center justify-center">
                  <div className="bg-[#286BCD]/5 p-6 rounded-full mb-4">
                     <ShoppingCartIcon size={48} />
                  </div>
                  <p className="font-serif text-lg">Your cart is empty.</p>
                  <Button onClick={() => setIsCartOpen(false)} variant="link" className="text-[#C49F58] mt-2">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#286BCD]/5">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-[#FAF4ED] bg-[#286BCD]/10 flex items-center justify-center">
                      <span className="text-[#286BCD] font-serif text-xs text-center px-1">{item.product.title.slice(0, 20)}</span>
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-[#286BCD]">
                        <h3 className="line-clamp-1 font-serif">{item.product.title}</h3>
                        <p className="ml-4">{formatCurrency(item.variant.sale_price_in_cents ?? item.variant.price_in_cents, item.variant.currency_info)}</p>
                      </div>
                      <p className="mt-1 text-sm text-[#286BCD]/60">{item.variant.title}</p>

                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-[#286BCD]/20 rounded-md bg-[#FAF4ED]">
                          <button
                            onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-[#286BCD] hover:bg-[#286BCD]/10 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-[#286BCD] font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                            className="px-2 py-1 text-[#286BCD] hover:bg-[#286BCD]/10 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.variant.id)}
                          className="font-medium text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-xs">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#286BCD]/10 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-medium text-[#286BCD]">Subtotal</span>
                  <span className="text-2xl font-bold text-[#286BCD] font-serif">{getCartTotal()}</span>
                </div>
                <p className="mt-0.5 text-sm text-[#286BCD]/60 mb-6">Shipping and taxes calculated at checkout.</p>

                {/* UPDATED LOGIC HERE */}
                {!featureFlags.enablePayments ? (
                  <div className="w-full">
                    <Button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 font-bold py-6 text-lg tracking-wider transition-all cursor-not-allowed"
                    >
                      Checkout Disabled <Lock className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-center text-xs text-red-500 mt-2">
                      Payment processing is temporarily unavailable.
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-[#C49F58] hover:bg-[#b08d4b] text-[#286BCD] font-bold py-6 text-lg tracking-wider transition-all shadow-lg hover:shadow-xl"
                  >
                    Checkout <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
