// Shopping cart page grouped by vendor
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ArrowLeft, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CartItem {
  id: string;
  component_name: string;
  quantity: number;
  price: number;
  vendor: string;
  vendor_url: string | null;
  prototype_id: string;
  prototype_name: string;
  phase: number;
}

interface VendorGroup {
  vendor: string;
  items: CartItem[];
  total: number;
}

const ShoppingCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      // Get all components with status "need"
      const { data: componentsData, error: componentsError } = await (supabase
        .from('prototype_components') as any)
        .select(`
          id,
          name,
          quantity,
          price,
          vendor,
          vendor_url,
          prototype_id,
          prototypes (
            name,
            phase
          )
        `)
        .eq('status', 'need')
        .order('vendor');

      if (componentsError) throw componentsError;

      const items = componentsData?.map((item: any) => ({
        id: item.id,
        component_name: item.name,
        quantity: item.quantity,
        price: item.price,
        vendor: item.vendor,
        vendor_url: item.vendor_url,
        prototype_id: item.prototype_id,
        prototype_name: item.prototypes?.name || 'Unknown',
        phase: item.prototypes?.phase || 1
      })) || [];

      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }

  // Group items by vendor
  const vendorGroups: VendorGroup[] = cartItems.reduce((acc, item) => {
    const existingGroup = acc.find(g => g.vendor === item.vendor);
    if (existingGroup) {
      existingGroup.items.push(item);
      existingGroup.total += item.price * item.quantity;
    } else {
      acc.push({
        vendor: item.vendor,
        items: [item],
        total: item.price * item.quantity
      });
    }
    return acc;
  }, [] as VendorGroup[]);

  const grandTotal = vendorGroups.reduce((sum, g) => sum + g.total, 0);
  const phase1Total = cartItems.filter(i => i.phase === 1).reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const phase2Total = cartItems.filter(i => i.phase === 2).reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const phase1Count = cartItems.filter(i => i.phase === 1).length;
  const phase2Count = cartItems.filter(i => i.phase === 2).length;

  function copyVendorLinks(vendor: string) {
    const items = cartItems.filter(i => i.vendor === vendor && i.vendor_url);
    const links = items.map(i => i.vendor_url).join('\n');
    navigator.clipboard.writeText(links);
    toast({
      title: "Links Copied",
      description: `Copied ${items.length} links for ${vendor}`,
    });
  }

  function copyAllLinks() {
    const links = cartItems
      .filter(i => i.vendor_url)
      .map(i => `${i.component_name}: ${i.vendor_url}`)
      .join('\n\n');
    navigator.clipboard.writeText(links);
    toast({
      title: "All Links Copied",
      description: `Copied ${cartItems.length} component links`,
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF4ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#286BCD] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF4ED] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link to="/prototypes" className="px-4 py-2 bg-[#286BCD] text-white rounded-lg text-sm font-semibold hover:bg-[#2d4373] transition">
            📋 Systems
          </Link>
          <Link to="/prototypes/boxes" className="px-4 py-2 bg-[#286BCD] text-white rounded-lg text-sm font-semibold hover:bg-[#2d4373] transition">
            📦 Boxes
          </Link>
          <Link to="/prototypes/shopping" className="px-4 py-2 bg-[#286BCD] text-white rounded-lg text-sm font-semibold hover:bg-[#2d4373] transition">
            🛒 Shopping
          </Link>
          <Link to="/prototypes/shopping-cart" className="px-4 py-2 bg-[#C49F58] text-white rounded-lg text-sm font-semibold">
            🛒 Cart
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#286BCD]">
              Shopping Cart
            </h1>
            <p className="text-[#286BCD]/60 mt-2">
              {cartItems.length} items | {vendorGroups.length} vendors | ${grandTotal.toFixed(2)} total
            </p>
          </div>
          <button
            onClick={copyAllLinks}
            className="px-6 py-3 bg-[#C49F58] text-white rounded-lg hover:bg-[#b08d4b] transition font-semibold flex items-center gap-2"
          >
            <Copy className="w-4 h-4" /> Copy All Links
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-serif font-bold text-[#286BCD] mb-2">
              Cart is Empty!
            </h2>
            <p className="text-[#286BCD]/60 mb-6">
              All components are either purchased or on order.
            </p>
            <Link
              to="/prototypes"
              className="inline-block px-6 py-3 bg-[#286BCD] text-white rounded-lg hover:bg-[#2d4475] transition"
            >
              View Prototypes
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Vendor Groups */}
            {vendorGroups.map((group) => (
              <div key={group.vendor} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Vendor Header */}
                <div className="bg-[#286BCD] text-white p-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-serif font-bold">{group.vendor}</h2>
                    <p className="text-sm opacity-90">
                      {group.items.length} items | ${group.total.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => copyVendorLinks(group.vendor)}
                    className="px-4 py-2 bg-white text-[#286BCD] rounded-lg hover:bg-gray-100 transition font-semibold text-sm flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" /> Copy Links
                  </button>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-200">
                  {group.items.map((item) => (
                    <div key={item.id} className={`p-4 hover:bg-gray-50 transition ${item.phase === 2 ? 'bg-[#C49F58]/5' : ''}`}>
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-[#286BCD]">
                              {item.component_name}
                            </h3>
                            {item.phase === 2 && (
                              <span className="px-2 py-0.5 bg-[#C49F58]/20 text-[#C49F58] text-xs font-bold rounded">
                                PHASE 2
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-[#286BCD]/60 mb-2">
                            For: <span className="font-semibold">{item.prototype_name}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-[#286BCD]/60">Qty:</span>{' '}
                            <span className="font-semibold text-[#286BCD]">{item.quantity}</span>
                            {' | '}
                            <span className="text-[#286BCD]/60">Unit:</span>{' '}
                            <span className="font-semibold text-[#286BCD]">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#C49F58] mb-2">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.vendor_url ? (
                            <a
                              href={item.vendor_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#C49F58] text-white rounded-lg text-sm hover:bg-[#b08d4b] transition"
                            >
                              <ExternalLink className="w-4 h-4" /> View
                            </a>
                          ) : (
                            <div className="text-xs text-[#286BCD]/60">
                              No link available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vendor Total */}
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <div className="font-semibold text-[#286BCD]/60">
                    {group.vendor} Subtotal:
                  </div>
                  <div className="text-2xl font-bold text-[#286BCD]">
                    ${group.total.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}

            {/* Phase Breakdown */}
            {phase2Count > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 p-4 bg-[#286BCD]/5 rounded-lg">
                    <div className="text-sm text-[#286BCD]/60 mb-1">🚀 Phase 1: MVP</div>
                    <div className="text-2xl font-bold text-[#286BCD]">${phase1Total.toFixed(2)}</div>
                    <div className="text-xs text-[#286BCD]/60">{phase1Count} items</div>
                  </div>
                  <div className="flex-1 p-4 bg-[#C49F58]/10 rounded-lg">
                    <div className="text-sm text-[#C49F58] mb-1">⏳ Phase 2: Post-Launch</div>
                    <div className="text-2xl font-bold text-[#C49F58]">${phase2Total.toFixed(2)}</div>
                    <div className="text-xs text-[#C49F58]/60">{phase2Count} items</div>
                  </div>
                </div>
              </div>
            )}

            {/* Grand Total */}
            <div className="bg-[#C49F58] text-white rounded-xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <div className="text-sm opacity-90 mb-1">Grand Total</div>
                  <div className="text-4xl font-serif font-bold">
                    ${grandTotal.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={() => toast({ title: "Coming Soon", description: "Mark all as ordered feature coming soon" })}
                  className="px-6 py-3 bg-white text-[#C49F58] rounded-lg hover:bg-gray-100 transition font-bold"
                >
                  Mark All as Ordered
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;
