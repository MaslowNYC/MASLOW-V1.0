
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { DollarSign, Users, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DatabaseReset from './DatabaseReset';

const AdminFundingDashboard = () => {
  const { user, isFounder } = useAuth();
  const [stats, setStats] = useState({
    totalRaised: 0,
    memberCount: 0,
    averageContribution: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // --- MANUAL OVERRIDE CONTROLS ---
  const [overrideMode, setOverrideMode] = useState(false);
  const [manualMemberCount, setManualMemberCount] = useState(250);
  const [manualRaised, setManualRaised] = useState(500000);

  useEffect(() => {
    // 1. Trust the Auth Context. If not founder, stop.
    if (!isFounder) {
      return; 
    }
    
    fetchRealData();
  }, [isFounder]);

  const fetchRealData = async () => {
    setLoading(true);
    try {
      // Fetch actual signups
      const { count, error } = await supabase
        .from('beta_signups')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;

      // Mock financial data since we aren't taking real money yet
      const estimatedValue = (count || 0) * 25000; // Assuming $25k per head for now

      setStats({
        totalRaised: estimatedValue,
        memberCount: count || 0,
        averageContribution: 25000
      });
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toast({
        title: "Data Error",
        description: "Could not fetch live stats.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // If the user is not a founder, show Access Denied (or return null if protected route handles it)
  if (!isFounder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8] text-[#3B5998]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p>This terminal is restricted to Founders only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#3B5998]">Founder Dashboard</h1>
            <p className="text-[#3B5998]/60">Live funding & membership metrics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchRealData} className="border-[#3B5998] text-[#3B5998]">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
            <DatabaseReset />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-[#3B5998]/10 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#3B5998]/60 uppercase tracking-widest">
                Total Raised (Est)
              </CardTitle>
              <DollarSign className="w-5 h-5 text-[#C5A059]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#3B5998]">
                ${(overrideMode ? manualRaised : stats.totalRaised).toLocaleString()}
              </div>
              <p className="text-xs text-[#3B5998]/40 mt-1">+0% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#3B5998]/10 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#3B5998]/60 uppercase tracking-widest">
                Waitlist Count
              </CardTitle>
              <Users className="w-5 h-5 text-[#C5A059]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#3B5998]">
                {(overrideMode ? manualMemberCount : stats.memberCount).toLocaleString()}
              </div>
              <p className="text-xs text-[#3B5998]/40 mt-1">potential members</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#3B5998]/10 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#3B5998]/60 uppercase tracking-widest">
                Avg. Ticket Size
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-[#C5A059]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#3B5998]">
                $25,000
              </div>
              <p className="text-xs text-[#3B5998]/40 mt-1">Sovereign Tier</p>
            </CardContent>
          </Card>
        </div>

        {/* Simulation Controls */}
        <Card className="bg-[#3B5998] text-[#F5F1E8] border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-[#C5A059]">Reality Distortion Field</CardTitle>
            <p className="text-white/60 text-sm">Override live data for investor presentations.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Label className="min-w-[100px]">Override Mode</Label>
              <Button 
                variant={overrideMode ? "default" : "secondary"}
                className={overrideMode ? "bg-[#C5A059] text-black" : "bg-white/10 text-white"}
                onClick={() => setOverrideMode(!overrideMode)}
              >
                {overrideMode ? "ON" : "OFF"}
              </Button>
            </div>

            {overrideMode && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Simulated Members</Label>
                    <span className="font-mono text-[#C5A059]">{manualMemberCount}</span>
                  </div>
                  <Slider 
                    value={[manualMemberCount]} 
                    min={0} 
                    max={1000} 
                    step={10} 
                    onValueChange={(val) => setManualMemberCount(val[0])}
                    className="py-4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Simulated Revenue</Label>
                    <span className="font-mono text-[#C5A059]">${manualRaised.toLocaleString()}</span>
                  </div>
                  <Slider 
                    value={[manualRaised]} 
                    min={0} 
                    max={25000000} 
                    step={50000} 
                    onValueChange={(val) => setManualRaised(val[0])}
                    className="py-4"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AdminFundingDashboard;