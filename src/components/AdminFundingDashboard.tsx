import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Users, DollarSign, Shield, Lock, AlertTriangle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/utils/formatting';
import type { Profile } from '@/types/database.types';

interface Stats {
  totalUsers: number;
  totalFunding: number;
  tierBreakdown: Record<string, number>;
}

interface EfficiencyData {
  avgTurnaround: string;
  annualLoss: string;
  leakDetected: boolean;
}

interface UsageLogRow {
  turnaround_time: number | null;
  created_at: string | null;
}

const AdminFundingDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate: NavigateFunction = useNavigate();

  // Security State
  const [verifying, setVerifying] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // Data State
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalFunding: 0,
    tierBreakdown: {}
  });
  const [efficiencyData, setEfficiencyData] = useState<EfficiencyData | null>(null);
  const [recentPledges, setRecentPledges] = useState<Profile[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // 1. SECURITY CHECK
  useEffect(() => {
    const checkAdminStatus = async (): Promise<void> => {
      if (!user) {
        navigate('/');
        return;
      }
      const { data, error } = await (supabase
        .from('profiles') as any)
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error || !data || data.is_admin !== true) {
        console.warn("Unauthorized access attempt blocked.");
        navigate('/');
      } else {
        setIsAdmin(true);
        setVerifying(false);
        fetchData();
      }
    };
    checkAdminStatus();
  }, [user, navigate]);

  // 2. DATA FETCHING
  const fetchData = async (): Promise<void> => {
    try {
      // A. Fetch Users
      const { data: profiles } = await (supabase
        .from('profiles') as any)
        .select('*')
        .order('created_at', { ascending: false });

      setAllUsers((profiles as Profile[]) || []);

      // Calc User Stats
      const totalUsers = profiles?.length || 0;
      let totalFunding = 0;
      const tierBreakdown: Record<string, number> = {};

      profiles?.forEach((profile: Profile) => {
        const amount = profile.contribution_amount || getTierPrice(profile.membership_tier);
        totalFunding += amount;
        const tier = profile.membership_tier || 'Free/None';
        tierBreakdown[tier] = (tierBreakdown[tier] || 0) + 1;
      });

      setStats({ totalUsers, totalFunding, tierBreakdown });
      setRecentPledges((profiles?.slice(0, 10) as Profile[]) || []);

      // B. Fetch Operational Logs (The Efficiency Leak)
      const { data: logs } = await (supabase
        .from('usage_logs') as any)
        .select('turnaround_time, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logs && logs.length > 0) {
        // OPERATIONAL FORMULA
        const TARGET_TURNAROUND = 1.5; // 90 Seconds
        const SESSION_PRICE = 85;

        // Filter out nulls
        const validLogs = (logs as UsageLogRow[]).filter(l => l.turnaround_time !== null);
        const totalTurnaround = validLogs.reduce((acc, log) => acc + (log.turnaround_time ?? 0), 0);
        const avgTurnaround = validLogs.length > 0 ? totalTurnaround / validLogs.length : 0;

        // Calculate Revenue Loss based on 12h day (720 mins)
        const targetCycle = 30 + TARGET_TURNAROUND;
        const actualCycle = 30 + avgTurnaround;

        const potentialSessions = Math.floor(720 / targetCycle);
        const actualSessions = Math.floor(720 / actualCycle);

        const dailyLoss = (potentialSessions - actualSessions) * SESSION_PRICE;
        const annualLoss = dailyLoss * 365;

        setEfficiencyData({
          avgTurnaround: avgTurnaround.toFixed(1),
          annualLoss: annualLoss.toLocaleString(),
          leakDetected: avgTurnaround > TARGET_TURNAROUND
        });
      }

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const getTierPrice = (tierName: string | null | undefined): number => {
    switch (tierName) {
      case 'THE BUILDER': return 100;
      case 'THE FOUNDING MEMBER': return 500;
      case 'THE ARCHITECT': return 10000;
      case 'THE SOVEREIGN': return 25000;
      default: return 0;
    }
  };

  const downloadCSV = (): void => {
    if (allUsers.length === 0) return;
    const headers = ['ID', 'Email', 'First Name', 'Last Name', 'Tier', 'Total Contributed', 'Joined Date'];
    const rows = allUsers.map(profile => [
      profile.id,
      profile.email,
      profile.first_name || '',
      profile.last_name || '',
      profile.membership_tier || 'None',
      profile.contribution_amount || getTierPrice(profile.membership_tier),
      new Date(profile.created_at || '').toLocaleDateString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `maslow_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (verifying || loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F1E8]">
        <Lock className="w-12 h-12 text-[#C5A059] mb-4 animate-pulse" />
        <div className="text-[#3B5998] font-serif text-xl tracking-widest">VERIFYING SECURITY CLEARANCE...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto p-8 bg-[#F5F1E8] min-h-screen">

      {/* HERO IMAGE SECTION */}
      <div className="relative mb-12 rounded-2xl shadow-2xl overflow-hidden z-0">
        <img
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
          alt="Dashboard Hero"
          className="w-full h-64 md:h-80 object-cover"
        />
        {/* Backlit Glow Overlay */}
        <div className="absolute inset-0 ring-1 ring-white/20 rounded-2xl pointer-events-none bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-6 left-8 text-white z-10">
          <h2 className="text-3xl font-serif font-bold tracking-wide">Operational Command</h2>
          <p className="text-white/80 font-light">Status: Active Monitoring</p>
        </div>
      </div>

      {/* Header Row */}
      <div className="flex justify-between items-end mb-12 border-b-4 border-[#C5A059] pb-6">
        <div>
          <h1 className="text-4xl font-serif font-black text-[#3B5998] uppercase tracking-widest">Revenue Command</h1>
          <p className="text-[#C5A059] font-bold mt-2">Maslow Administrative Command</p>
        </div>
        <Button
          onClick={downloadCSV}
          className="bg-[#3B5998] text-white hover:bg-[#2d4475] flex items-center gap-2"
        >
          <Download size={18} /> Export CSV
        </Button>
      </div>

      {/* OPERATIONAL INTELLIGENCE ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

        {/* The Efficiency Leak Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className={`h-full border-l-8 ${efficiencyData?.leakDetected ? 'border-l-red-500 bg-red-50' : 'border-l-green-500 bg-green-50'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${efficiencyData?.leakDetected ? 'text-red-800' : 'text-green-800'}`}>
                <AlertTriangle className="h-5 w-5" />
                {efficiencyData?.leakDetected ? 'Efficiency Leak Detected' : 'Operations Optimal'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-black mb-2 ${efficiencyData?.leakDetected ? 'text-red-600' : 'text-green-600'}`}>
                 -${efficiencyData?.annualLoss || '0'}/yr
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Projected revenue loss per suite due to cleaning delays.
              </p>
              <div className="text-sm font-medium bg-white/50 p-2 rounded inline-block">
                Avg Turnaround: <span className="text-slate-900 font-bold">{efficiencyData?.avgTurnaround || '0'} min</span>
                <span className="text-slate-500 ml-2">(Target: 1.5 min)</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real-Time Grid Status */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="h-full bg-white border border-[#3B5998]/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#3B5998]">
                <Activity className="h-5 w-5" />
                Live Grid Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-black text-[#3B5998]">82%</div>
                <span className="text-green-500 font-bold text-sm">+4% vs avg</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Current active sessions across all suites.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* EXISTING METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <motion.div
          className="bg-white p-8 rounded-xl shadow-lg border border-[#3B5998]/10"
        >
          <div className="flex items-center gap-4 mb-2">
            <Users className="text-[#C5A059] w-8 h-8" />
            <h3 className="text-sm font-bold text-[#3B5998] uppercase">Total Members</h3>
          </div>
          <p className="text-5xl font-black text-[#3B5998]">{stats.totalUsers}</p>
        </motion.div>

        <motion.div
          className="bg-white p-8 rounded-xl shadow-lg border border-[#3B5998]/10"
        >
          <div className="flex items-center gap-4 mb-2">
            <DollarSign className="text-green-600 w-8 h-8" />
            <h3 className="text-sm font-bold text-[#3B5998] uppercase">Total Pledged</h3>
          </div>
          <p className="text-5xl font-black text-[#3B5998]">{formatNumber(stats.totalFunding)}</p>
        </motion.div>

        <motion.div
          className="bg-white p-8 rounded-xl shadow-lg border border-[#3B5998]/10"
        >
          <div className="flex items-center gap-4 mb-2">
            <Shield className="text-[#3B5998] w-8 h-8" />
            <h3 className="text-sm font-bold text-[#3B5998] uppercase">Top Tier</h3>
          </div>
          <div className="text-sm space-y-1">
            {Object.entries(stats.tierBreakdown).map(([tier, count]) => (
              <div key={tier} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                <span className="font-medium text-[#3B5998]">{tier}</span>
                <span className="font-bold text-[#C5A059]">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-lg border border-[#3B5998]/10 overflow-hidden">
        <div className="bg-[#3B5998] p-4">
          <h3 className="text-white font-bold uppercase tracking-wider">Recent Accessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold text-[#3B5998] uppercase">Email</th>
                <th className="p-4 text-xs font-bold text-[#3B5998] uppercase">Tier</th>
                <th className="p-4 text-xs font-bold text-[#3B5998] uppercase">Date</th>
                <th className="p-4 text-xs font-bold text-[#3B5998] uppercase text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentPledges.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-[#3B5998] font-medium">{profile.email}</td>
                  <td className="p-4 text-sm text-gray-600">
                    <span className="bg-[#F5F1E8] px-2 py-1 rounded text-[#3B5998] font-bold text-xs border border-[#C5A059]/30">
                      {profile.membership_tier || 'Guest'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{new Date(profile.created_at || '').toLocaleDateString()}</td>
                  <td className="p-4 text-right font-bold text-[#3B5998]">
                    {formatNumber(profile.contribution_amount || getTierPrice(profile.membership_tier))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFundingDashboard;
