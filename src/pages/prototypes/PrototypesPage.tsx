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
  prototype_count?: number;
  avg_progress?: number;
}

const PrototypesPage: React.FC = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totalBudget = systems.reduce((sum, s) => sum + Number(s.total_budget), 0);
  const totalPrototypes = systems.reduce((sum, s) => sum + (s.prototype_count || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3B5998] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#3B5998] mb-2">
              MASLOW PROTOTYPES
            </h1>
            <p className="text-lg text-[#3B5998]/60">
              {systems.length} Systems | {totalPrototypes} Prototypes | ${totalBudget.toLocaleString()} Budget
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/prototypes/shopping-cart"
              className="px-6 py-3 bg-[#C5A059] text-white rounded-lg hover:bg-[#b08d4b] transition font-bold"
            >
              Shopping Cart
            </Link>
          </div>
        </div>
      </div>

      {/* System Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((system) => (
          <Link
            key={system.id}
            to={`/prototypes/system/${system.id}`}
            className="block"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-[#C5A059]">
              {/* Icon + Name */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{system.icon}</span>
                <h2 className="text-2xl font-serif font-bold text-[#3B5998]">
                  {system.name}
                </h2>
              </div>

              {/* Description */}
              <p className="text-[#3B5998]/60 text-sm mb-4 line-clamp-2">
                {system.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-[#3B5998]/60 mb-1">Prototypes</div>
                  <div className="text-lg font-bold text-[#3B5998]">
                    {system.prototype_count || 0}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#3B5998]/60 mb-1">Budget</div>
                  <div className="text-lg font-bold text-[#3B5998]">
                    ${system.total_budget}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#3B5998]/60 mb-1">Hours</div>
                  <div className="text-lg font-bold text-[#3B5998]">
                    {system.total_hours}h
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#3B5998]/60 mb-1">Progress</div>
                  <div className="text-lg font-bold text-[#C5A059]">
                    {system.avg_progress || 0}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#C5A059] h-2 rounded-full transition-all"
                  style={{ width: `${system.avg_progress || 0}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats Footer */}
      <div className="max-w-7xl mx-auto mt-8 bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-[#3B5998] mb-1">
              {totalPrototypes}
            </div>
            <div className="text-sm text-[#3B5998]/60">Total Prototypes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#C5A059] mb-1">
              ${totalBudget.toLocaleString()}
            </div>
            <div className="text-sm text-[#3B5998]/60">Total Budget</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#3B5998] mb-1">
              {systems.reduce((sum, s) => sum + s.total_hours, 0)}h
            </div>
            <div className="text-sm text-[#3B5998]/60">Total Hours</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#C5A059] mb-1">
              ~{Math.round(systems.reduce((sum, s) => sum + s.total_hours, 0) / 8)}
            </div>
            <div className="text-sm text-[#3B5998]/60">Weeks @ 8h/week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrototypesPage;
