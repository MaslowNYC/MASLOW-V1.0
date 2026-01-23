
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Users, DollarSign, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/utils/formatting';

const AdminFundingDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Security State
  const [verifying, setVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Data State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFunding: 0,
    tierBreakdown: {}
  });
  const [recentPledges, setRecentPledges] = useState([]);
  const [allUsers, setAllUsers] = useState([]); 
  const [loadingData, setLoadingData] = useState(true);

  // 1. SECURITY CHECK (The Bouncer)
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/'); // Not logged in? Get out.
        return;
      }

      // Check the 'is_admin' flag in Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error || !data || data.is_admin !== true) {
        console.warn("Unauthorized access attempt blocked.");
        navigate('/'); // Logged in but not Admin? Get out.
      } else {
        setIsAdmin(true); // Welcome, Sir.
        setVerifying(false);
        fetchData(); // Only fetch sensitive data AFTER verifying admin
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  // 2. DATA FETCHING (Only runs if Admin)
  const fetchData = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAllUsers(profiles); 

      // Calculate Stats
      const totalUsers = profiles.length;
      let totalFunding = 0;
      const tierBreakdown = {};

      profiles.forEach(user => {
        const amount = user.contribution_amount || getTierPrice(user.membership_tier);
        totalFunding += amount;

        const tier = user.membership_tier || 'Free/None';
        tierBreakdown[tier] = (tierBreakdown[tier] || 0) + 1;
      });

      setStats({ totalUsers, totalFunding, tierBreakdown });
      setRecentPledges(profiles.slice(0, 10)); 
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const getTierPrice = (tierName) => {
    switch (tierName) {
      case 'THE BUILDER': return 100;
      case 'THE FOUNDING MEMBER': return 500;
      case 'THE ARCHITECT': return 10000;
      case 'THE SOVEREIGN': return 25000;
      default: return 0;
    }
  };

  const downloadCSV = () => {
    if (allUsers.length === 0) return;
    const headers = ['ID', 'Email', 'First Name', 'Last Name', 'Tier', 'Total Contributed', 'Joined Date'];
    const rows = allUsers.map(user => [
      user.id,
      user.email,
      user.first_name || '',
      user.last_name || '',
      user.membership_tier || 'None',
      user.contribution_amount || getTierPrice(user.membership_tier),
      new Date(user.created_at).toLocaleDateString()
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

  // 3. LOADING SCREEN (While verifying identity)
  if (verifying || loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F1E8]">
        <Lock className="w-12 h-12 text-[#C5A059] mb-4 animate-pulse" />
        <div className="text-[#3B5998] font-serif text-xl tracking-widest">VERIFYING SECURITY CLEARANCE...</div>
      </div>
    );
  }

  // 4. THE DASHBOARD (Only renders if isAdmin is true)
  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto p-8 bg-[#F5F1E8] min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b-4 border-[#C5A059] pb-6">
        <div>
          <h1 className="text-4xl font-serif font-black text-[#3B5998] uppercase tracking-widest">Reactor Core</h1>
          <p className="text-[#C5A059] font-bold mt-2">Maslow Administrative Command</p>
        </div>
        <Button 
          onClick={downloadCSV}
          className="bg-[#3B5998] text-white hover:bg-[#2d4475] flex items-center gap-2"
        >
          <Download size={18} /> Export CSV
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-lg border border-[#3B5998]/10"
        >
          <div className="flex items-center gap-4 mb-2">
            <Users className="text-[#C5A059] w-8 h-8" />
            <h3 className="text-sm font-bold text-[#3B5998] uppercase">Total Members</h3>
          </div>
          <p className="text-5xl font-black text-[#3B5998]">{stats.totalUsers}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-xl shadow-lg border border-[#3B5998]/10"
        >
          <div className="flex items-center gap-4 mb-2">
            <DollarSign className="text-green-600 w-8 h-8" />
            <h3 className="text-sm font-bold text-[#3B5998] uppercase">Total Pledged</h3>
          </div>
          <p className="text-5xl font-black text-[#3B5998]">{formatNumber(stats.totalFunding)}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
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
              {recentPledges.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-[#3B5998] font-medium">{user.email}</td>
                  <td className="p-4 text-sm text-gray-600">
                    <span className="bg-[#F5F1E8] px-2 py-1 rounded text-[#3B5998] font-bold text-xs border border-[#C5A059]/30">
                      {user.membership_tier || 'Guest'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right font-bold text-[#3B5998]">
                    {formatNumber(user.contribution_amount || getTierPrice(user.membership_tier))}
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