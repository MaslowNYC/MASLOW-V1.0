// Shopping List - Aggregated view of components needed
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ExternalLink, Copy, Check, Search, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AggregatedItem {
  component_name: string;
  vendor: string;
  vendor_url: string | null;
  unit_price: number;
  total_quantity: number;
  quantity_have: number;
  quantity_ordered: number;
  quantity_need: number;
  still_needed: number;
  total_cost: number;
  used_in_prototypes: string;
  prototype_count: number;
}

interface VendorGroup {
  vendor: string;
  item_count: number;
  total_quantity: number;
  total_cost: number;
  items: AggregatedItem[];
}

const ShoppingListPage: React.FC = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<AggregatedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'items' | 'vendors'>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [showOnlyNeeded, setShowOnlyNeeded] = useState(true);

  useEffect(() => {
    loadShoppingList();
  }, []);

  async function loadShoppingList() {
    try {
      const { data, error } = await (supabase
        .from('shopping_list_aggregated') as any)
        .select('*')
        .order('total_cost', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading shopping list:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filter items
  const filteredItems = items.filter(item => {
    if (showOnlyNeeded && item.still_needed <= 0) return false;
    if (selectedVendor !== 'all' && item.vendor !== selectedVendor) return false;
    if (searchQuery && !item.component_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Group by vendor
  const vendorGroups: VendorGroup[] = React.useMemo(() => {
    const groups: Record<string, VendorGroup> = {};

    filteredItems.forEach(item => {
      const vendor = item.vendor || 'Unknown';
      if (!groups[vendor]) {
        groups[vendor] = {
          vendor,
          item_count: 0,
          total_quantity: 0,
          total_cost: 0,
          items: []
        };
      }
      groups[vendor].item_count++;
      groups[vendor].total_quantity += item.still_needed;
      groups[vendor].total_cost += item.unit_price * item.still_needed;
      groups[vendor].items.push(item);
    });

    return Object.values(groups).sort((a, b) => b.total_cost - a.total_cost);
  }, [filteredItems]);

  // Get unique vendors for filter
  const vendors = [...new Set(items.map(i => i.vendor))].filter(Boolean).sort();

  // Calculate totals
  const totalCost = filteredItems.reduce((sum, item) => sum + (item.unit_price * item.still_needed), 0);
  const totalItems = filteredItems.reduce((sum, item) => sum + item.still_needed, 0);

  async function copyVendorLinks(vendor: string) {
    const vendorItems = filteredItems.filter(i => i.vendor === vendor && i.vendor_url);
    const links = vendorItems.map(i => i.vendor_url).filter(Boolean);

    if (links.length === 0) {
      toast({
        title: 'No links available',
        description: `No product links found for ${vendor}`,
        variant: 'destructive'
      });
      return;
    }

    await navigator.clipboard.writeText(links.join('\n'));
    toast({
      title: 'Links copied!',
      description: `${links.length} ${vendor} links copied to clipboard`
    });
  }

  function exportToCSV() {
    const headers = ['Component', 'Vendor', 'Quantity Needed', 'Unit Price', 'Total Cost', 'URL', 'Used In'];
    const rows = filteredItems.map(item => [
      item.component_name,
      item.vendor,
      item.still_needed,
      item.unit_price,
      (item.unit_price * item.still_needed).toFixed(2),
      item.vendor_url || '',
      item.used_in_prototypes
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maslow-shopping-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Exported!',
      description: 'Shopping list downloaded as CSV'
    });
  }

  async function updateItemStatus(componentName: string, vendor: string, newStatus: string) {
    // Update all components with this name and vendor
    const { error } = await (supabase
      .from('prototype_components') as any)
      .update({ status: newStatus })
      .eq('name', componentName)
      .eq('vendor', vendor);

    if (!error) {
      toast({
        title: 'Status updated',
        description: `${componentName} marked as ${newStatus}`
      });
      loadShoppingList();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3B5998] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link to="/prototypes" className="px-4 py-2 bg-[#3B5998] text-white rounded-lg text-sm font-semibold hover:bg-[#2d4373] transition">
            📋 Systems
          </Link>
          <Link to="/prototypes/boxes" className="px-4 py-2 bg-[#3B5998] text-white rounded-lg text-sm font-semibold hover:bg-[#2d4373] transition">
            📦 Boxes
          </Link>
          <Link to="/prototypes/shopping" className="px-4 py-2 bg-[#C5A059] text-white rounded-lg text-sm font-semibold">
            🛒 Shopping
          </Link>
          <Link to="/prototypes/shopping-cart" className="px-4 py-2 bg-[#3B5998]/20 text-[#3B5998] rounded-lg text-sm font-semibold hover:bg-[#3B5998]/30 transition">
            🛒 Cart
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3B5998] mb-2">
            🛒 Aggregated Shopping List
          </h1>
          <p className="text-[#3B5998]/60">
            Components needed across all prototypes, grouped and totaled.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-sm text-[#3B5998]/60">Total Cost</div>
            <div className="text-2xl font-bold text-[#C5A059]">${totalCost.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-sm text-[#3B5998]/60">Items Needed</div>
            <div className="text-2xl font-bold text-[#3B5998]">{totalItems}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-sm text-[#3B5998]/60">Unique Products</div>
            <div className="text-2xl font-bold text-[#3B5998]">{filteredItems.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-sm text-[#3B5998]/60">Vendors</div>
            <div className="text-2xl font-bold text-[#3B5998]">{vendorGroups.length}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-4 shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg overflow-hidden border">
              <button
                onClick={() => setViewMode('items')}
                className={`px-4 py-2 text-sm font-semibold transition ${viewMode === 'items' ? 'bg-[#3B5998] text-white' : 'bg-white text-[#3B5998]'}`}
              >
                By Item
              </button>
              <button
                onClick={() => setViewMode('vendors')}
                className={`px-4 py-2 text-sm font-semibold transition ${viewMode === 'vendors' ? 'bg-[#3B5998] text-white' : 'bg-white text-[#3B5998]'}`}
              >
                By Vendor
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3B5998]/40" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            {/* Vendor Filter */}
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Vendors</option>
              {vendors.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>

            {/* Show Only Needed Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyNeeded}
                onChange={(e) => setShowOnlyNeeded(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-[#3B5998]">Only needed</span>
            </label>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-[#3B5998]/10 text-[#3B5998] rounded-lg hover:bg-[#3B5998]/20 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Items View */}
        {viewMode === 'items' && (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <div
                key={`${item.component_name}-${item.vendor}-${index}`}
                className="bg-white rounded-xl p-4 shadow border-l-4 border-[#C5A059]"
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#3B5998]">
                      📦 {item.component_name}
                    </h3>
                    <p className="text-sm text-[#3B5998]/60">
                      Need: <span className="font-bold text-red-600">{item.still_needed}x</span> |
                      Cost: <span className="font-bold text-[#C5A059]">${(item.unit_price * item.still_needed).toFixed(2)}</span> |
                      {item.vendor}
                    </p>
                    <p className="text-xs text-[#3B5998]/40 mt-1">
                      Used in: {item.used_in_prototypes}
                    </p>
                    {item.quantity_have > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Already have {item.quantity_have}x
                      </p>
                    )}
                    {item.quantity_ordered > 0 && (
                      <p className="text-xs text-yellow-600 mt-1">
                        🔄 {item.quantity_ordered}x on order
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          updateItemStatus(item.component_name, item.vendor, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="">Mark as...</option>
                      <option value="ordered">Ordered</option>
                      <option value="have">Have</option>
                    </select>
                    {item.vendor_url && (
                      <a
                        href={item.vendor_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#C5A059] text-white rounded-lg text-sm hover:bg-[#b08d4b] transition flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Buy
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-[#3B5998]/60">
                  {showOnlyNeeded ? 'All components purchased!' : 'No components found.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Vendors View */}
        {viewMode === 'vendors' && (
          <div className="space-y-6">
            {vendorGroups.map((group) => (
              <div
                key={group.vendor}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                {/* Vendor Header */}
                <div className="p-4 bg-[#3B5998] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{group.vendor}</h3>
                    <p className="text-sm text-white/80">
                      {group.item_count} items | {group.total_quantity} units | ${group.total_cost.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => copyVendorLinks(group.vendor)}
                    className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy All Links
                  </button>
                </div>

                {/* Vendor Items */}
                <div className="divide-y">
                  {group.items.map((item, index) => (
                    <div
                      key={`${item.component_name}-${index}`}
                      className="p-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-semibold text-[#3B5998]">{item.component_name}</p>
                        <p className="text-sm text-[#3B5998]/60">
                          {item.still_needed}x @ ${item.unit_price} = ${(item.unit_price * item.still_needed).toFixed(2)}
                        </p>
                      </div>
                      {item.vendor_url && (
                        <a
                          href={item.vendor_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C5A059] hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Buy
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {vendorGroups.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-[#3B5998]/60">No items to purchase!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListPage;
