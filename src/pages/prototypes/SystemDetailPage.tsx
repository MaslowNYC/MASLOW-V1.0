// System detail page showing all prototypes within a system
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Prototype {
  id: string;
  name: string;
  description: string;
  budget: number;
  hours: number;
  difficulty: number;
  status: string;
  progress: number;
  box_number: number;
  phase?: number;
  component_count?: number;
  components_purchased?: number;
}

interface System {
  id: number;
  name: string;
  description: string;
  icon: string;
  total_budget: number;
  total_hours: number;
  phase?: number;
}

const SystemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const systemId = parseInt(id || '0');
  const [system, setSystem] = useState<System | null>(null);
  const [prototypes, setPrototypes] = useState<Prototype[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemData();
  }, [systemId]);

  async function loadSystemData() {
    try {
      // Get system details
      const { data: systemData, error: systemError } = await (supabase
        .from('prototype_systems') as any)
        .select('*')
        .eq('id', systemId)
        .single();

      if (systemError) throw systemError;
      setSystem(systemData);

      // Get prototypes in this system
      const { data: prototypesData, error: prototypesError } = await (supabase
        .from('prototypes') as any)
        .select('*')
        .eq('system_id', systemId)
        .order('sort_order');

      if (prototypesError) throw prototypesError;

      // Get component counts for each prototype
      const { data: componentsData } = await (supabase
        .from('prototype_components') as any)
        .select('prototype_id, status');

      const prototypesWithCounts = prototypesData?.map((prototype: Prototype) => {
        const prototypeComponents = componentsData?.filter((c: any) => c.prototype_id === prototype.id) || [];
        const componentCount = prototypeComponents.length;
        const componentsPurchased = prototypeComponents.filter((c: any) => c.status === 'have').length;

        return {
          ...prototype,
          component_count: componentCount,
          components_purchased: componentsPurchased
        };
      });

      setPrototypes(prototypesWithCounts || []);
    } catch (error) {
      console.error('Error loading system data:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const badges: Record<string, { text: string; color: string }> = {
      'not_started': { text: 'Not Started', color: 'bg-gray-200 text-gray-700' },
      'building': { text: 'Building', color: 'bg-blue-100 text-blue-700' },
      'testing': { text: 'Testing', color: 'bg-yellow-100 text-yellow-700' },
      'complete': { text: 'Complete', color: 'bg-green-100 text-green-700' }
    };
    const badge = badges[status] || badges.not_started;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.text}
      </span>
    );
  }

  function getDifficultyStars(difficulty: number) {
    return '⭐'.repeat(difficulty);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3B5998] animate-spin" />
      </div>
    );
  }

  if (!system) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[#3B5998] mb-4">System not found</div>
          <Link to="/prototypes" className="text-[#C5A059] hover:underline">
            ← Back to all systems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] p-4 md:p-8">
      {/* Navigation */}
      <div className="max-w-6xl mx-auto flex flex-wrap gap-3 mb-6">
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
      <div className="max-w-6xl mx-auto mb-8">
        <Link to="/prototypes" className="text-[#C5A059] hover:underline mb-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Systems
        </Link>

        <div className="flex items-center gap-4 mb-4 mt-4">
          <span className="text-6xl">{system.icon}</span>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-serif font-bold text-[#3B5998]">
                {system.name}
              </h1>
              {(system.phase || 1) === 2 && (
                <span className="px-3 py-1 bg-[#C5A059]/20 text-[#C5A059] text-sm font-bold rounded-full">
                  POST-LAUNCH
                </span>
              )}
            </div>
            <p className="text-lg text-[#3B5998]/60">
              {system.description}
            </p>
          </div>
        </div>

        <div className="flex gap-6 text-sm text-[#3B5998]/60">
          <div><strong className="text-[#3B5998]">{prototypes.length}</strong> Prototypes</div>
          <div><strong className="text-[#3B5998]">${system.total_budget}</strong> Budget</div>
          <div><strong className="text-[#3B5998]">{system.total_hours}h</strong> Time Estimate</div>
        </div>
      </div>

      {/* Prototypes List */}
      <div className="max-w-6xl mx-auto space-y-6">
        {prototypes.map((prototype) => (
          <Link
            key={prototype.id}
            to={`/prototypes/prototype/${prototype.id}`}
            className="block"
          >
            <div className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition border-2 border-transparent hover:border-[#C5A059] ${
              (prototype.phase || 1) === 2 ? 'bg-gradient-to-r from-white to-[#C5A059]/5' : ''
            }`}>
              {/* Phase 2 Banner */}
              {(prototype.phase || 1) === 2 && (
                <div className="mb-4 -mt-2 -mx-2">
                  <div className="bg-[#C5A059]/10 text-[#C5A059] px-4 py-2 rounded-t-lg text-sm font-semibold flex items-center gap-2">
                    ⏳ Phase 2: Post-Launch Feature
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-2xl font-serif font-bold text-[#3B5998]">
                      Prototype {prototype.id}: {prototype.name}
                    </h2>
                    {getStatusBadge(prototype.status)}
                    {(prototype.phase || 1) === 2 && (
                      <span className="px-2 py-1 bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold rounded">
                        PHASE 2
                      </span>
                    )}
                  </div>
                  <p className="text-[#3B5998]/60 mb-3">
                    {prototype.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-[#C5A059]">
                    Box #{prototype.box_number}
                  </div>
                  <div className="text-xs text-[#3B5998]/60">
                    Sterilite Box
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <div className="text-xs text-[#3B5998]/60 mb-1">Budget</div>
                  <div className="text-lg font-bold text-[#3B5998]">
                    ${prototype.budget}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#3B5998]/60 mb-1">Hours</div>
                  <div className="text-lg font-bold text-[#3B5998]">
                    {prototype.hours}h
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#3B5998]/60 mb-1">Difficulty</div>
                  <div className="text-lg">
                    {getDifficultyStars(prototype.difficulty)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#3B5998]/60 mb-1">Components</div>
                  <div className="text-lg font-bold text-[#3B5998]">
                    {prototype.components_purchased || 0}/{prototype.component_count || 0}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#3B5998]/60 mb-1">Progress</div>
                  <div className="text-lg font-bold text-[#C5A059]">
                    {prototype.progress}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#C5A059] h-3 rounded-full transition-all"
                  style={{ width: `${prototype.progress}%` }}
                />
              </div>

              {/* View Button */}
              <div className="mt-4 text-right">
                <span className="text-[#C5A059] font-semibold hover:underline">
                  View Details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SystemDetailPage;
