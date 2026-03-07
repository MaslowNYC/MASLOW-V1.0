// Main prototypes page showing all 6 systems
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

interface System {
  id: number;
  name: string;
  description: string;
  icon: string;
  total_budget: number;
  total_hours: number;
  phase?: number;
  prototype_count?: number;
  avg_progress?: number;
}

const PrototypesPage: React.FC = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  useEffect(() => {
    loadSystems();
  }, []);

  async function loadSystems() {
    try {
      // Get systems
      const { data: systemsData, error: systemsError } = await (supabase
        .from('prototype_systems') as any)
        .select('*')
        .order('sort_order');

      if (systemsError) throw systemsError;

      // Get prototype counts and progress for each system
      const { data: prototypesData } = await (supabase
        .from('prototypes') as any)
        .select('system_id, progress');

      // Calculate stats per system
      const systemsWithStats = systemsData?.map((system: System) => {
        const systemPrototypes = prototypesData?.filter((p: any) => p.system_id === system.id) || [];
        const prototypeCount = systemPrototypes.length;
        const avgProgress = prototypeCount > 0
          ? Math.round(systemPrototypes.reduce((sum: number, p: any) => sum + p.progress, 0) / prototypeCount)
          : 0;

        return {
          ...system,
          prototype_count: prototypeCount,
          avg_progress: avgProgress
        };
      });

      setSystems(systemsWithStats || []);
    } catch (error) {
      console.error('Error loading systems:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filter systems by selected phase
  const filteredSystems = systems.filter(s => (s.phase || 1) === selectedPhase);
  const totalBudget = filteredSystems.reduce((sum, s) => sum + Number(s.total_budget), 0);
  const totalPrototypes = filteredSystems.reduce((sum, s) => sum + (s.prototype_count || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF4ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3C5999] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF4ED] p-4 md:p-8">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-3 mb-6">
        <Link to="/prototypes" className="px-4 py-2 bg-[#C49F58] text-white rounded-lg text-sm font-semibold">
          📋 Systems
        </Link>
        <Link to="/prototypes/boxes" className="px-4 py-2 bg-[#3C5999] text-white rounded-lg text-sm font-semibold hover:bg-[#2d4373] transition">
          📦 Boxes
        </Link>
        <Link to="/prototypes/shopping" className="px-4 py-2 bg-[#3C5999] text-white rounded-lg text-sm font-semibold hover:bg-[#2d4373] transition">
          🛒 Shopping
        </Link>
        <Link to="/prototypes/shopping-cart" className="px-4 py-2 bg-[#3C5999]/20 text-[#3C5999] rounded-lg text-sm font-semibold hover:bg-[#3C5999]/30 transition">
          🛒 Cart
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#3C5999] mb-2">
              MASLOW PROTOTYPES
            </h1>
            <p className="text-lg text-[#3C5999]/60">
              {filteredSystems.length} Systems | {totalPrototypes} Prototypes | ${totalBudget.toLocaleString()} Budget
            </p>
          </div>
        </div>

        {/* Phase Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedPhase(1)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedPhase === 1
                ? 'bg-[#3C5999] text-white shadow-lg'
                : 'bg-white text-[#3C5999] border-2 border-[#3C5999]/20 hover:border-[#3C5999]/50'
            }`}
          >
            🚀 Phase 1: MVP Launch
          </button>
          <button
            onClick={() => setSelectedPhase(2)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedPhase === 2
                ? 'bg-[#C49F58] text-white shadow-lg'
                : 'bg-white text-[#C49F58] border-2 border-[#C49F58]/20 hover:border-[#C49F58]/50'
            }`}
          >
            ⏳ Phase 2: Post-Launch
          </button>
        </div>
      </div>

      {/* System Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSystems.map((system) => (
          <Link
            key={system.id}
            to={`/prototypes/system/${system.id}`}
            className="block"
          >
            <div className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-[#C49F58] ${
              (system.phase || 1) === 2 ? 'opacity-90' : ''
            }`}>
              {/* Phase Badge (for Phase 2) */}
              {(system.phase || 1) === 2 && (
                <div className="mb-3">
                  <span className="px-3 py-1 bg-[#C49F58]/20 text-[#C49F58] text-xs font-bold rounded-full">
                    POST-LAUNCH
                  </span>
                </div>
              )}

              {/* Icon + Name */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{system.icon}</span>
                <h2 className="text-2xl font-serif font-bold text-[#3C5999]">
                  {system.name}
                </h2>
              </div>

              {/* Description */}
              <p className="text-[#3C5999]/60 text-sm mb-4 line-clamp-2">
                {system.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-[#3C5999]/60 mb-1">Prototypes</div>
                  <div className="text-lg font-bold text-[#3C5999]">
                    {system.prototype_count || 0}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#3C5999]/60 mb-1">Budget</div>
                  <div className="text-lg font-bold text-[#3C5999]">
                    ${system.total_budget}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#3C5999]/60 mb-1">Hours</div>
                  <div className="text-lg font-bold text-[#3C5999]">
                    {system.total_hours}h
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#3C5999]/60 mb-1">Progress</div>
                  <div className="text-lg font-bold text-[#C49F58]">
                    {system.avg_progress || 0}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#C49F58] h-2 rounded-full transition-all"
                  style={{ width: `${system.avg_progress || 0}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats Footer */}
      <div className="max-w-7xl mx-auto mt-8 bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#3C5999]">
            {selectedPhase === 1 ? '🚀 Phase 1 Stats' : '⏳ Phase 2 Stats'}
          </h3>
          {selectedPhase === 2 && (
            <span className="text-sm text-[#C49F58]">Post-Launch Features</span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-[#3C5999] mb-1">
              {totalPrototypes}
            </div>
            <div className="text-sm text-[#3C5999]/60">Total Prototypes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#C49F58] mb-1">
              ${totalBudget.toLocaleString()}
            </div>
            <div className="text-sm text-[#3C5999]/60">Total Budget</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#3C5999] mb-1">
              {filteredSystems.reduce((sum, s) => sum + s.total_hours, 0)}h
            </div>
            <div className="text-sm text-[#3C5999]/60">Total Hours</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#C49F58] mb-1">
              ~{Math.round(filteredSystems.reduce((sum, s) => sum + s.total_hours, 0) / 8)}
            </div>
            <div className="text-sm text-[#3C5999]/60">Weeks @ 8h/week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrototypesPage;
