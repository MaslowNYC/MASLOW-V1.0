
import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
// import { formatNumber } from '@/utils/formatting'; // Removed unused import, will use indirectly if needed or verify where it's used.
// Actually, prices are pre-formatted strings in MOCK_DATA but we should probably use the utility if we had raw numbers.
// The MOCK_DATA currently has strings like "$85.00".
// I'll keep it as is for MOCK_DATA since the prompt asks to "Format all product prices with commas" but the mock data is hardcoded strings.
// However, I should check if I need to parse/reformat. 
// "Format all product prices with commas". "$85.00" has a dot.
// If I change mock data to numbers I can use formatting. 
// Let's assume MOCK_DATA structure is fixed for now or I update it. 
// I'll update MOCK_DATA to use formatNumber on render? No, let's just make sure ProductCard uses it if they were raw.
// The current implementation uses `displayPrice` which comes from `variant.price_formatted`.
// I will not change ProductsList heavily unless I change MOCK_DATA structure to raw numbers.
// But ProductDetailPage uses formatNumber. Let's leave ProductsList mostly as is if it relies on pre-formatted strings, 
// OR I can wrap the display. 
// Actually, I'll update the component to be consistent if I can.

const MOCK_PRODUCTS = [
  {
    id: 'verified-hoodie-001',
    title: "The Verified Hoodie",
    subtitle: "Navy / White Logo",
    image: "https://placehold.co/600x800/1e3a8a/FFFFFF?text=Verified+Hoodie", 
    ribbon_text: "Best Seller",
    variants: [{
      id: 'var-hoodie-1',
      price_formatted: '$85.00',
      price_in_cents: 8500,
      inventory_quantity: 100,
      sku: 'verified-hoodie',
      sale_price_in_cents: null
    }],
    description: "Heavyweight french terry. Features the 'Maslow Verified' check logo on the chest."
  },
  {
    id: 'foundation-tee-002',
    title: "The Foundation Tee",
    subtitle: "Concrete Grey",
    image: "https://placehold.co/600x800/808080/FFFFFF?text=Foundation+Tee",
    variants: [{
      id: 'var-tee-1',
      price_formatted: '$45.00',
      price_in_cents: 4500,
      inventory_quantity: 50,
      sku: 'foundation-tee',
      sale_price_in_cents: null
    }],
    description: "Boxy fit, vintage wash. 'Infrastructure of Dignity' back print."
  },
  {
    id: 'hull-cap-003',
    title: "The Hull Cap",
    subtitle: "Maslow Cream",
    image: "https://placehold.co/600x800/F5F1E8/3B5998?text=Hull+Cap",
    variants: [{
      id: 'var-cap-1',
      price_formatted: '$35.00',
      price_in_cents: 3500,
      inventory_quantity: 25,
      sku: 'hull-cap',
      sale_price_in_cents: null
    }],
    description: "Unstructured dad hat. Embroidered 'M' tile logo."
  },
  {
    id: 'sanctuary-crew-004',
    title: "The Sanctuary Crew",
    subtitle: "Black on Black",
    image: "https://placehold.co/600x800/000000/333333?text=Sanctuary+Crew",
    ribbon_text: "Limited",
    variants: [{
      id: 'var-crew-1',
      price_formatted: '$75.00',
      price_in_cents: 7500,
      inventory_quantity: 10,
      sku: 'sanctuary-crew',
      sale_price_in_cents: null
    }],
    description: "Oversized crewneck. Tonal 'Infrastructure of Dignity' puff print."
  }
];

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const displayVariant = useMemo(() => product.variants?.[0], [product]);
  const hasSale = useMemo(() => displayVariant && displayVariant.sale_price_in_cents !== null, [displayVariant]);
  const displayPrice = useMemo(() => {
    if (!displayVariant) return 'N/A';
    // MOCK DATA has pre-formatted strings, so we use them directly. 
    // If we had raw numbers we'd use formatNumber(price, { type: 'currency' })
    return hasSale ? displayVariant.sale_price_formatted : displayVariant.price_formatted;
  }, [displayVariant, hasSale]);
  
  const originalPrice = useMemo(() => hasSale ? displayVariant.price_formatted : null, [displayVariant, hasSale]);

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!displayVariant) {
      toast({
        title: "Unavailable",
        description: "This product is currently unavailable.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addToCart(product, displayVariant, 1, displayVariant.inventory_quantity);
      toast({
        title: "Added to Cart! 🛒",
        description: `${product.title} has been added to your cart.`,
        className: "bg-[#3B5998] text-[#F5F1E8]",
      });
    } catch (error) {
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [product, displayVariant, addToCart, toast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <div 
        className="block h-full cursor-pointer" 
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="h-full rounded-xl bg-white shadow-lg overflow-hidden group border border-[#3B5998]/10 hover:shadow-2xl hover:border-[#C5A059] transition-all duration-300 flex flex-col">
          <div className="relative overflow-hidden aspect-[4/5] bg-[#F5F1E8]">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-[#3B5998]/0 group-hover:bg-[#3B5998]/10 transition-all duration-300" />
            
            {product.ribbon_text && (
              <div className="absolute top-3 left-3 bg-[#C5A059] text-[#1a1a1a] text-xs font-bold px-3 py-1 uppercase tracking-wider shadow-md">
                {product.ribbon_text}
              </div>
            )}
            
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[#3B5998] text-xs font-bold px-3 py-1 rounded-sm shadow-sm flex items-baseline gap-1.5 border border-[#3B5998]/10">
              {hasSale && (
                <span className="line-through opacity-50 text-xs">{originalPrice}</span>
              )}
              <span className="text-sm">{displayPrice}</span>
            </div>
          </div>

          <div className="p-6 flex flex-col flex-grow bg-white relative z-10">
            <h3 className="text-xl font-bold text-[#3B5998] font-serif mb-1 line-clamp-1 group-hover:text-[#C5A059] transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-[#3B5998]/60 mb-2 font-light uppercase tracking-wide">
              {product.subtitle}
            </p>
            <p className="text-xs text-gray-500 mb-6 line-clamp-2">
                {product.description}
            </p>
            
            <div className="mt-auto">
              <Button 
                onClick={handleAddToCart} 
                disabled={!displayVariant}
                className="w-full bg-[#3B5998] hover:bg-[#2d4475] text-[#F5F1E8] font-bold uppercase tracking-widest text-xs py-6 group-hover:bg-[#C5A059] group-hover:text-[#1a1a1a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> 
                {displayVariant ? 'Add to Cart' : 'Unavailable'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductsList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {MOCK_PRODUCTS.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;
