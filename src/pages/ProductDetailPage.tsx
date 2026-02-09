
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { formatNumber } from '@/utils/formatting';
import { featureFlags } from '@/config/featureFlags';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

interface ProductImage {
  url: string;
}

interface ProductVariant {
  id: number;
  title: string;
  price_formatted: string;
  sale_price_formatted?: string;
  sale_price_in_cents?: number;
  inventory_quantity: number;
  manage_inventory?: boolean;
  image_url?: string;
}

interface AdditionalInfo {
  id: number;
  title: string;
  description: string;
  order: number;
}

interface Product {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  ribbon_text?: string;
  purchasable: boolean;
  additional_info?: AdditionalInfo[];
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '', 10);
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = useCallback(async () => {
    if (product && selectedVariant) {
      const availableQuantity = selectedVariant.inventory_quantity;
      try {
        await addToCart(product, selectedVariant, quantity, availableQuantity);

        const description = !featureFlags.enablePayments
          ? `${quantity} x ${product.title} added. Note: Checkout is currently disabled.`
          : `${quantity} x ${product.title} (${selectedVariant.title}) added.`;

        toast({
          title: "Added to Cart! 🛒",
          description: description,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        toast({
          variant: "destructive",
          title: "Oh no! Something went wrong.",
          description: errorMessage,
        });
      }
    }
  }, [product, selectedVariant, quantity, addToCart, toast]);

  const handleQuantityChange = useCallback((amount: number) => {
    setQuantity(prevQuantity => {
        const newQuantity = prevQuantity + amount;
        if (newQuantity < 1) return 1;
        return newQuantity;
    });
  }, []);

  const handlePrevImage = useCallback(() => {
    if (product?.images?.length && product.images.length > 1) {
      setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    }
  }, [product?.images?.length]);

  const handleNextImage = useCallback(() => {
    if (product?.images?.length && product.images.length > 1) {
      setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    }
  }, [product?.images?.length]);

  const handleVariantSelect = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);

    if (variant.image_url && product?.images?.length && product.images.length > 0) {
      const imageIndex = product.images.findIndex(image => image.url === variant.image_url);

      if (imageIndex !== -1) {
        setCurrentImageIndex(imageIndex);
      }
    }
  }, [product?.images]);

  useEffect(() => {
    const fetchProductData = async () => {
      if (isNaN(productId)) {
        setError("Invalid Product ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let fetchedProduct: Product;
        try {
          fetchedProduct = await getProduct(productId);
        } catch (apiError) {
          console.error("API Error fetching product:", apiError);
          throw new Error("Product not found");
        }

        if (!fetchedProduct) {
          throw new Error("Product not found");
        }

        try {
          const quantitiesResponse = await getProductQuantities({
            fields: 'inventory_quantity',
            product_ids: [fetchedProduct.id]
          });

          const variantQuantityMap = new Map<number, number>();
          if (quantitiesResponse.variants) {
            quantitiesResponse.variants.forEach((variant: { id: number; inventory_quantity: number }) => {
              variantQuantityMap.set(variant.id, variant.inventory_quantity);
            });
          }

          const productWithQuantities: Product = {
            ...fetchedProduct,
            variants: fetchedProduct.variants.map(variant => ({
              ...variant,
              inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
            }))
          };

          setProduct(productWithQuantities);

          if (productWithQuantities.variants && productWithQuantities.variants.length > 0) {
            setSelectedVariant(productWithQuantities.variants[0]);
          }
        } catch (quantityError) {
          console.warn("Failed to fetch quantities, using defaults", quantityError);
          setProduct(fetchedProduct);
          if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
            setSelectedVariant(fetchedProduct.variants[0]);
          }
        }
      } catch (err) {
        console.error("Product Detail Error:", err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load product';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] bg-[#F5F1E8]">
        <Loader2 className="h-16 w-16 text-[#C5A059] animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] px-4 py-8 w-full overflow-x-hidden">
        <div className="max-w-5xl mx-auto w-full">
          <Link to="/store" className="inline-flex items-center gap-2 text-[#3B5998] hover:text-[#C5A059] transition-colors mb-6 font-bold">
            <ArrowLeft size={16} />
            Back to Store
          </Link>
          <div className="text-center text-red-400 p-12 bg-white rounded-2xl shadow-lg border border-red-100">
            <XCircle className="mx-auto h-16 w-16 mb-4 text-red-400" />
            <h2 className="text-2xl font-bold text-[#3B5998] mb-2">Product Not Found</h2>
            <p className="mb-6 font-medium text-[#3B5998]/60">
              We couldn't find the product you're looking for. It may have been removed or the link is incorrect.
            </p>
            <Button onClick={() => navigate('/store')} className="bg-[#3B5998] text-white hover:bg-[#2d4475]">
              Return to Store
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const price = selectedVariant?.sale_price_formatted ?? selectedVariant?.price_formatted;
  const originalPrice = selectedVariant?.price_formatted;
  const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
  const isStockManaged = selectedVariant?.manage_inventory ?? false;
  const canAddToCart = !isStockManaged || quantity <= availableStock;

  const currentImage = product.images[currentImageIndex];
  const hasMultipleImages = product.images.length > 1;

  return (
    <>
      <Helmet>
        <title>{product.title} - Maslow Store</title>
        <meta name="description" content={product.description?.substring(0, 160) || product.title} />
      </Helmet>

      <div className="min-h-screen bg-[#F5F1E8] pb-12 w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-8 w-full">
          <Link to="/store" className="inline-flex items-center gap-2 text-[#3B5998] hover:text-[#C5A059] transition-colors mb-8 font-bold">
            <ArrowLeft size={16} />
            Back to Collection
          </Link>

          <div className="grid md:grid-cols-2 gap-12 bg-white p-6 md:p-12 rounded-2xl shadow-xl border border-[#3B5998]/5">
            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="relative w-full">
              <div className="relative overflow-hidden rounded-xl shadow-lg h-64 sm:h-96 md:h-[500px] bg-[#F5F1E8] border border-[#3B5998]/10 w-full">
                <img
                  src={!currentImage?.url ? placeholderImage : currentImage.url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {hasMultipleImages && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#3B5998] p-2 rounded-full transition-colors shadow-md"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#3B5998] p-2 rounded-full transition-colors shadow-md"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {product.ribbon_text && (
                  <div className="absolute top-4 left-4 bg-[#C5A059] text-[#3B5998] text-xs sm:text-sm font-bold px-3 py-1 sm:px-4 sm:py-2 rounded shadow-lg uppercase tracking-wider">
                    {product.ribbon_text}
                  </div>
                )}
              </div>

              {hasMultipleImages && (
                <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-[#C5A059] scale-105 shadow-md' : 'border-[#3B5998]/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={!image.url ? placeholderImage : image.url}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col w-full">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#3B5998] mb-3 break-words">{product.title}</h1>
              <p className="text-lg text-[#3B5998]/60 mb-6 italic break-words">{product.subtitle}</p>

              <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-[#F5F1E8]">
                <span className="text-3xl md:text-4xl font-bold text-[#C5A059]">{price}</span>
                {selectedVariant?.sale_price_in_cents && (
                  <span className="text-xl md:text-2xl text-[#3B5998]/40 line-through">{originalPrice}</span>
                )}
              </div>

              <div className="prose prose-blue text-[#3B5998]/80 mb-8 max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '' }} />

              {product.variants.length > 1 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-[#3B5998] uppercase tracking-wide mb-3">Style / Option</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map(variant => (
                      <Button
                        key={variant.id}
                        variant="outline"
                        onClick={() => handleVariantSelect(variant)}
                        className={`transition-all h-auto py-2 px-4 whitespace-normal text-left ${
                          selectedVariant?.id === variant.id
                            ? 'bg-[#3B5998] text-[#F5F1E8] border-[#3B5998] hover:bg-[#2d4475] hover:text-white'
                            : 'border-[#3B5998]/30 text-[#3B5998] hover:border-[#C5A059] hover:text-[#C5A059]'
                        }`}
                      >
                        {variant.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <div className="flex items-center border-2 border-[#3B5998]/10 rounded-lg p-1 bg-[#F5F1E8]">
                  <Button onClick={() => handleQuantityChange(-1)} variant="ghost" size="icon" className="h-10 w-10 text-[#3B5998] hover:bg-[#3B5998]/10 rounded-md"><Minus size={18} /></Button>
                  <span className="w-12 text-center text-[#3B5998] font-bold text-lg">{quantity}</span>
                  <Button onClick={() => handleQuantityChange(1)} variant="ghost" size="icon" className="h-10 w-10 text-[#3B5998] hover:bg-[#3B5998]/10 rounded-md"><Plus size={18} /></Button>
                </div>
                <div className="text-sm">
                   {isStockManaged && canAddToCart && product.purchasable && (
                    <p className="text-green-600 flex items-center gap-2 font-medium">
                      <CheckCircle size={16} /> In Stock
                    </p>
                  )}
                  {isStockManaged && !canAddToCart && product.purchasable && (
                     <p className="text-amber-500 flex items-center gap-2 font-medium">
                      <XCircle size={16} /> Only {formatNumber(availableStock)} left
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-[#3B5998] font-bold py-8 text-xl tracking-widest uppercase transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!canAddToCart || !product.purchasable}
                >
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Add to Cart
                </Button>

                {!featureFlags.enablePayments && (
                  <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">
                      You can add items to your cart, but checkout is currently disabled for maintenance.
                    </p>
                  </div>
                )}

                {!product.purchasable && (
                    <p className="text-sm text-red-500 mt-4 flex items-center justify-center gap-2 font-bold">
                      <XCircle size={16} /> Currently Unavailable
                    </p>
                )}
              </div>
            </motion.div>
          </div>

          {product.additional_info && product.additional_info.length > 0 && (
              <div className="mt-12 max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow border border-[#3B5998]/5 w-full">
                <h3 className="text-2xl font-serif font-bold text-[#3B5998] mb-6">Product Details</h3>
                <div className="grid gap-6">
                  {product.additional_info
                    .sort((a, b) => a.order - b.order)
                    .map((info) => (
                      <div key={info.id} className="border-l-4 border-[#C5A059] pl-6 py-1">
                        <h4 className="text-lg font-bold text-[#3B5998] mb-2">{info.title}</h4>
                        <div className="prose prose-sm text-[#3B5998]/70 max-w-none" dangerouslySetInnerHTML={{ __html: info.description }} />
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
