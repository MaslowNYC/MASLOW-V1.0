// Box View - Components organized by Sterilite box number
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, X, ExternalLink, Check } from 'lucide-react';

interface BoxSummary {
  box_number: number;
  prototype_ids: string;
  prototype_names: string;
  total_budget: number;
  total_hours: number;
  component_count: number;
  components_have: number;
  components_ordered: number;
  components_need: number;
}

interface BoxComponent {
  id: string;
  component_name: string;
  quantity: number;
  price: number;
  vendor: string;
  vendor_url: string | null;
  status: string;
  location: string | null;
  prototype_id: string;
  prototype_name: string;
  box_number: number;
}

const BoxViewPage: React.FC = () => {
  const [boxes, setBoxes] = useState<BoxSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [boxComponents, setBoxComponents] = useState<BoxComponent[]>([]);
  const [loadingComponents, setLoadingComponents] = useState(false);

  useEffect(() => {
    loadBoxes();
  }, []);

  async function loadBoxes() {
    try {
      const { data, error } = await (supabase
        .from('box_summary') as any)
        .select('*')
        .order('box_number');

      if (error) throw error;
      setBoxes(data || []);
    } catch (error) {
      console.error('Error loading boxes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadBoxComponents(boxNumber: number) {
    setLoadingComponents(true);
    try {
      const { data, error } = await (supabase
        .from('components_by_box') as any)
        .select('*')
        .eq('box_number', boxNumber)
        .order('prototype_id');

      if (error) throw error;
      setBoxComponents(data || []);
    } catch (error) {
      console.error('Error loading box components:', error);
    } finally {
      setLoadingComponents(false);
    }
  }

  function handleBoxClick(boxNumber: number) {
    setSelectedBox(boxNumber);
    loadBoxComponents(boxNumber);
  }

  function getCompletionPercent(box: BoxSummary) {
    if (box.component_count === 0) return 0;
    return Math.round((box.components_have / box.component_count) * 100);
  }

  function getBoxColor(box: BoxSummary) {
    const percent = getCompletionPercent(box);
    if (percent === 0) return 'border-red-300 bg-red-50';
    if (percent === 100) return 'border-green-300 bg-green-50';
    return 'border-yellow-300 bg-yellow-50';
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'have': return 'bg-green-100 text-green-700';
      case 'ordered': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-red-100 text-red-700';
    }
  }

  async function updateComponentStatus(componentId: string, newStatus: string) {
    const { error } = await (supabase
      .from('prototype_components') as any)
      .update({ status: newStatus })
      .eq('id', componentId);

    if (!error) {
      setBoxComponents(boxComponents.map(c =>
        c.id === componentId ? { ...c, status: newStatus } : c
      ));
      // Reload boxes to update counts
      loadBoxes();
    }
  }

  async function markAllAsPurchased(boxNumber: number) {
    const componentsToUpdate = boxComponents.filter(c => c.status !== 'have');

    for (const component of componentsToUpdate) {
      await (supabase
        .from('prototype_components') as any)
        .update({ status: 'have' })
        .eq('id', component.id);
    }

    // Reload everything
    loadBoxComponents(boxNumber);
    loadBoxes();
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
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link to="/prototypes" className="px-4 py-2 bg-[#3B5998] text-white rounded-lg text-sm font-semibold hover:bg-[#2d4373] transition">
            📋 Systems
          </Link>
          <Link to="/prototypes/boxes" className="px-4 py-2 bg-[#C5A059] text-white rounded-lg text-sm font-semibold">
            📦 Boxes
          </Link>
          <Link to="/prototypes/shopping" className="px-4 py-2 bg-[#3B5998] text-white rounded-lg text-sm font-semibold hover:bg-[#2d4373] transition">
            🛒 Shopping
          </Link>
          <Link to="/prototypes/shopping-cart" className="px-4 py-2 bg-[#3B5998]/20 text-[#3B5998] rounded-lg text-sm font-semibold hover:bg-[#3B5998]/30 transition">
            🛒 Cart
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3B5998] mb-2">
            📦 Prototype Boxes (1-16)
          </h1>
          <p className="text-[#3B5998]/60">
            Each Sterilite box contains components for one prototype. Click a box to see contents.
          </p>
        </div>

        {/* Box Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
          {boxes.map((box) => {
            const percent = getCompletionPercent(box);
            return (
              <button
                key={box.box_number}
                onClick={() => handleBoxClick(box.box_number)}
                className={`p-4 md:p-6 rounded-xl border-2 text-left transition hover:shadow-lg hover:scale-105 ${getBoxColor(box)} ${selectedBox === box.box_number ? 'ring-2 ring-[#C5A059]' : ''}`}
              >
                <div className="text-3xl md:text-4xl mb-2">📦</div>
                <h3 className="text-lg md:text-xl font-bold text-[#3B5998]">
                  Box #{box.box_number}
                </h3>
                <p className="text-xs md:text-sm text-[#3B5998]/60 truncate mb-2">
                  {box.prototype_names || 'Empty'}
                </p>
                <p className="text-lg font-bold text-[#C5A059]">
                  ${box.total_budget?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs md:text-sm text-[#3B5998]/60">
                  {box.components_have || 0}/{box.component_count || 0} components
                </p>
                <p className="text-xs text-[#3B5998]/40">
                  ~{box.total_hours || 0}h build time
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className={`h-2 rounded-full transition-all ${percent === 100 ? 'bg-green-500' : percent > 0 ? 'bg-yellow-500' : 'bg-red-400'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-xs text-right mt-1 text-[#3B5998]/60">
                  {percent}% complete
                </p>
              </button>
            );
          })}
        </div>

        {/* Empty state for grid */}
        {boxes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-[#3B5998]/60">No boxes found. Run the SQL views first.</p>
          </div>
        )}

        {/* Component Modal */}
        {selectedBox !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b flex items-center justify-between bg-[#F5F1E8]">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#3B5998]">
                    📦 Box #{selectedBox}
                  </h2>
                  <p className="text-sm text-[#3B5998]/60">
                    {boxComponents.length} components
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBox(null)}
                  className="p-2 hover:bg-[#3B5998]/10 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-[#3B5998]" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loadingComponents ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-[#3B5998] animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Mark all button */}
                    {boxComponents.some(c => c.status !== 'have') && (
                      <button
                        onClick={() => markAllAsPurchased(selectedBox)}
                        className="w-full mb-4 px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Mark All as Purchased
                      </button>
                    )}

                    {/* Components list */}
                    <div className="space-y-3">
                      {boxComponents.map((component) => (
                        <div
                          key={component.id}
                          className="border rounded-lg p-4 hover:border-[#C5A059] transition"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-[#3B5998]">
                                  {component.component_name}
                                </h3>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(component.status)}`}>
                                  {component.status}
                                </span>
                              </div>
                              <p className="text-sm text-[#3B5998]/60">
                                Qty: {component.quantity} | ${(component.price * component.quantity).toFixed(2)} | {component.vendor}
                              </p>
                              <p className="text-xs text-[#3B5998]/40">
                                For: {component.prototype_name} ({component.prototype_id})
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <select
                                value={component.status}
                                onChange={(e) => updateComponentStatus(component.id, e.target.value)}
                                className="text-sm border rounded px-2 py-1"
                              >
                                <option value="need">Need</option>
                                <option value="ordered">Ordered</option>
                                <option value="have">Have</option>
                              </select>
                              {component.vendor_url && (
                                <a
                                  href={component.vendor_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-sm text-[#C5A059] hover:underline"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Buy
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {boxComponents.length === 0 && (
                        <div className="text-center py-8 text-[#3B5998]/60">
                          No components in this box
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#3B5998]/60">
                    Total: ${boxComponents.reduce((sum, c) => sum + (c.price * c.quantity), 0).toFixed(2)}
                  </span>
                  <button
                    onClick={() => setSelectedBox(null)}
                    className="px-4 py-2 bg-[#3B5998] text-white rounded-lg hover:bg-[#2d4373] transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoxViewPage;
