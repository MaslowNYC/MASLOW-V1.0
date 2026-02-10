// Prototype detail page with components, wiring, build steps
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Prototype {
  id: string;
  system_id: number;
  name: string;
  description: string;
  budget: number;
  hours: number;
  difficulty: number;
  status: string;
  progress: number;
  box_number: number;
  notes: string | null;
}

interface Component {
  id: string;
  name: string;
  quantity: number;
  price: number;
  vendor: string;
  vendor_url: string | null;
  status: string;
  location: string | null;
  notes: string | null;
}

interface BuildStep {
  id: string;
  step_number: number;
  title: string;
  description: string;
  estimated_minutes: number | null;
  completed: boolean;
}

const PrototypeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const prototypeId = id || '';
  const [activeTab, setActiveTab] = useState<'components' | 'wiring' | 'code' | 'steps'>('components');
  const [prototype, setPrototype] = useState<Prototype | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrototypeData();
  }, [prototypeId]);

  async function loadPrototypeData() {
    try {
      // Get prototype
      const { data: prototypeData, error: prototypeError } = await (supabase
        .from('prototypes') as any)
        .select('*')
        .eq('id', prototypeId)
        .single();

      if (prototypeError) throw prototypeError;
      setPrototype(prototypeData);

      // Get components
      const { data: componentsData, error: componentsError } = await (supabase
        .from('prototype_components') as any)
        .select('*')
        .eq('prototype_id', prototypeId)
        .order('sort_order');

      if (componentsError) throw componentsError;
      setComponents(componentsData || []);

      // Get build steps
      const { data: stepsData, error: stepsError } = await (supabase
        .from('build_steps') as any)
        .select('*')
        .eq('prototype_id', prototypeId)
        .order('step_number');

      if (stepsError) throw stepsError;
      setBuildSteps(stepsData || []);
    } catch (error) {
      console.error('Error loading prototype:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateComponentStatus(componentId: string, newStatus: string) {
    const { error } = await (supabase
      .from('prototype_components') as any)
      .update({ status: newStatus })
      .eq('id', componentId);

    if (!error) {
      setComponents(components.map(c =>
        c.id === componentId ? { ...c, status: newStatus } : c
      ));
    }
  }

  function getStatusIcon(status: string) {
    const icons: Record<string, string> = {
      'need': '⬜',
      'ordered': '🔄',
      'have': '✅'
    };
    return icons[status] || '⬜';
  }

  const totalCost = components.reduce((sum, c) => sum + (c.price * c.quantity), 0);
  const purchasedCount = components.filter(c => c.status === 'have').length;
  const purchaseProgress = components.length > 0
    ? Math.round((purchasedCount / components.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3B5998] animate-spin" />
      </div>
    );
  }

  if (!prototype) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[#3B5998] mb-4">Prototype not found</div>
          <Link to="/prototypes" className="text-[#C5A059] hover:underline">
            ← Back to all prototypes
          </Link>
        </div>
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
          <Link to="/prototypes/shopping" className="px-4 py-2 bg-[#3B5998] text-white rounded-lg text-sm font-semibold hover:bg-[#2d4373] transition">
            🛒 Shopping
          </Link>
          <Link to="/prototypes/shopping-cart" className="px-4 py-2 bg-[#3B5998]/20 text-[#3B5998] rounded-lg text-sm font-semibold hover:bg-[#3B5998]/30 transition">
            🛒 Cart
          </Link>
        </div>

        {/* Header */}
        <Link
          to={`/prototypes/system/${prototype.system_id}`}
          className="text-[#C5A059] hover:underline mb-4 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to System
        </Link>

        <div className="bg-white rounded-xl p-6 shadow-lg mb-6 mt-4">
          <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#3B5998] mb-2">
                Prototype {prototype.id}: {prototype.name}
              </h1>
              <p className="text-[#3B5998]/60">{prototype.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#C5A059] mb-1">
                Box #{prototype.box_number}
              </div>
              <div className="text-sm text-[#3B5998]/60">Sterilite Box</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-[#3B5998]/60 mb-1">Budget</div>
              <div className="text-xl font-bold text-[#3B5998]">${prototype.budget}</div>
            </div>
            <div>
              <div className="text-xs text-[#3B5998]/60 mb-1">Time</div>
              <div className="text-xl font-bold text-[#3B5998]">{prototype.hours}h</div>
            </div>
            <div>
              <div className="text-xs text-[#3B5998]/60 mb-1">Difficulty</div>
              <div className="text-xl">{'⭐'.repeat(prototype.difficulty)}</div>
            </div>
            <div>
              <div className="text-xs text-[#3B5998]/60 mb-1">Progress</div>
              <div className="text-xl font-bold text-[#C5A059]">{prototype.progress}%</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {['components', 'steps', 'wiring', 'code'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`flex-1 px-4 md:px-6 py-4 font-semibold capitalize transition text-sm md:text-base ${
                  activeTab === tab
                    ? 'text-[#C5A059] border-b-2 border-[#C5A059] bg-[#C5A059]/5'
                    : 'text-[#3B5998]/60 hover:text-[#3B5998]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* COMPONENTS TAB */}
            {activeTab === 'components' && (
              <div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                  <h2 className="text-2xl font-serif font-bold text-[#3B5998]">
                    Components ({purchasedCount}/{components.length})
                  </h2>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#C5A059]">
                      ${totalCost.toFixed(2)}
                    </div>
                    <div className="text-xs text-[#3B5998]/60">
                      {purchaseProgress}% purchased
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div
                    className="bg-[#C5A059] h-3 rounded-full transition-all"
                    style={{ width: `${purchaseProgress}%` }}
                  />
                </div>

                {/* Components list */}
                <div className="space-y-4">
                  {components.map((component) => (
                    <div
                      key={component.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#C5A059] transition"
                    >
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <button
                              onClick={() => {
                                const statuses = ['need', 'ordered', 'have'];
                                const currentIndex = statuses.indexOf(component.status);
                                const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                                updateComponentStatus(component.id, nextStatus);
                              }}
                              className="text-2xl hover:scale-110 transition"
                            >
                              {getStatusIcon(component.status)}
                            </button>
                            <div>
                              <h3 className="text-lg font-semibold text-[#3B5998]">
                                {component.name}
                              </h3>
                              <div className="text-sm text-[#3B5998]/60">
                                Qty: {component.quantity} | ${(component.price * component.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                              <span className="text-[#3B5998]/60">Vendor:</span>{' '}
                              <span className="font-semibold text-[#3B5998]">
                                {component.vendor}
                              </span>
                            </div>
                            {component.location && (
                              <div>
                                <span className="text-[#3B5998]/60">Location:</span>{' '}
                                <span className="font-semibold text-[#3B5998]">
                                  {component.location}
                                </span>
                              </div>
                            )}
                          </div>

                          {component.notes && (
                            <p className="text-sm text-[#3B5998]/60 mt-2 italic">
                              {component.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {component.vendor_url && (
                            <a
                              href={component.vendor_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#C5A059] text-white rounded-lg text-sm hover:bg-[#b08d4b] transition"
                            >
                              Buy
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {components.length === 0 && (
                    <div className="text-center py-12 text-[#3B5998]/60">
                      No components added yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BUILD STEPS TAB */}
            {activeTab === 'steps' && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-6">
                  Build Steps ({buildSteps.filter(s => s.completed).length}/{buildSteps.length})
                </h2>
                <div className="space-y-4">
                  {buildSteps.map((step) => (
                    <div
                      key={step.id}
                      className="border-2 border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#3B5998] text-white flex items-center justify-center font-bold">
                            {step.step_number}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#3B5998] mb-2">
                            {step.title}
                          </h3>
                          <p className="text-[#3B5998]/60 mb-2">
                            {step.description}
                          </p>
                          {step.estimated_minutes && (
                            <div className="text-sm text-[#3B5998]/60">
                              ⏱️ Estimated time: {step.estimated_minutes} minutes
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {buildSteps.length === 0 && (
                    <div className="text-center py-12 text-[#3B5998]/60">
                      No build steps added yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WIRING TAB */}
            {activeTab === 'wiring' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📐</div>
                <h3 className="text-xl font-bold text-[#3B5998] mb-2">
                  Wiring Diagrams
                </h3>
                <p className="text-[#3B5998]/60 mb-4">
                  Upload wiring diagrams and connection guides
                </p>
                <button className="px-6 py-3 bg-[#C5A059] text-white rounded-lg hover:bg-[#b08d4b] transition">
                  Upload Diagram
                </button>
              </div>
            )}

            {/* CODE TAB */}
            {activeTab === 'code' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💻</div>
                <h3 className="text-xl font-bold text-[#3B5998] mb-2">
                  Code Snippets
                </h3>
                <p className="text-[#3B5998]/60 mb-4">
                  Arduino/ESP32 code for this prototype
                </p>
                <button className="px-6 py-3 bg-[#C5A059] text-white rounded-lg hover:bg-[#b08d4b] transition">
                  Add Code
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrototypeDetailPage;
