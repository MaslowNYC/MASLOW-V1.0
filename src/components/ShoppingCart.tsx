import React, { useCallback, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Trash2, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/components/ui/use-toast';
import { featureFlags } from '@/config/featureFlags';

// Types for cart items based on the useCart hook
interface ProductVariant {
  id: number;
  title: string;
  price_formatted: string;
  sale_price_formatted?: string;
  price_in_cents: number;
  sale_price_in_cents?: number;
  currency_info?: unknown;
  manage_inventory?: boolean;
}

interface Product {
  id: number | string;
  title: string;
  image: string;
}

interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface ShoppingCartProps {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart() as {
    cartItems: CartItem[];
    removeFromCart: (variantId: number) => void;
    updateQuantity: (variantId: number, quantity: number) => void;
    getCartTotal: () => string;
  };

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
            className="fixed inset-0 bg-[#3B5998]/60 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F5F1E8] shadow-2xl z-50 flex flex-col border-l border-[#C5A059]"
            onClick={(e: MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#3B5998]/10 bg-white">
              <div className="flex items-center gap-3">
                <ShoppingCartIcon className="w-6 h-6 text-[#C5A059]" />
                <h2 className="text-xl font-bold text-[#3B5998] font-serif">Your Cart</h2>
              </div>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-[#3B5998] hover:bg-[#3B5998]/10">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-[#F5F1E8]">
              {cartItems.length === 0 ? (
                <div className="text-center text-[#3B5998]/40 h-full flex flex-col items-center justify-center">
                  <div className="bg-[#3B5998]/5 p-6 rounded-full mb-4">
                     <ShoppingCartIcon size={48} />
                  </div>
                  <p className="font-serif text-lg">Your cart is empty.</p>
                  <Button onClick={() => setIsCartOpen(false)} variant="link" className="text-[#C5A059] mt-2">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#3B5998]/5">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-[#F5F1E8]">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-[#3B5998]">
                        <h3 className="line-clamp-1 font-serif">{item.product.title}</h3>
                        <p className="ml-4">{item.variant.sale_price_formatted || item.variant.price_formatted}</p>
                      </div>
                      <p className="mt-1 text-sm text-[#3B5998]/60">{item.variant.title}</p>

                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-[#3B5998]/20 rounded-md bg-[#F5F1E8]">
                          <button
                            onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-[#3B5998] hover:bg-[#3B5998]/10 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-[#3B5998] font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                            className="px-2 py-1 text-[#3B5998] hover:bg-[#3B5998]/10 transition-colors"
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
              <div className="p-6 border-t border-[#3B5998]/10 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-medium text-[#3B5998]">Subtotal</span>
                  <span className="text-2xl font-bold text-[#3B5998] font-serif">{getCartTotal()}</span>
                </div>
                <p className="mt-0.5 text-sm text-[#3B5998]/60 mb-6">Shipping and taxes calculated at checkout.</p>

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
                    className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-[#3B5998] font-bold py-6 text-lg tracking-wider transition-all shadow-lg hover:shadow-xl"
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
