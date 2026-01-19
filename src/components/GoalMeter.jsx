
import React, { useEffect, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TrendingUp, Users, Target, AlertCircle, RefreshCcw } from 'lucide-react';
import { formatNumber } from '@/utils/formatting';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/customSupabaseClient';

const GoalMeter = () => {
  const controls = useAnimation();
  
  // Initialization: Ensure strict null defaults to avoid any fallback assumptions
  const [fundingData, setFundingData] = useState({
    currentTotal: 0,
    goalAmount: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(0);

  const fetchFunding = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('GoalMeter: Fetching funding data from Supabase...');
      
      const { data, error } = await supabase
        .from('funding_goal')
        .select('*')
        .single();

      if (error) {
        console.error('GoalMeter: Supabase fetch error:', error);
        throw error;
      }

      console.log('GoalMeter: Fetched data:', data);

      if (data) {
        // Explicit conversion to ensure numbers
        const goal = Number(data.goal_amount);
        const total = Number(data.current_total || 0);

        console.log('GoalMeter: Setting state - Goal:', goal, 'Total:', total);

        setFundingData({
          goalAmount: goal,
          currentTotal: total
        });
      } else {
        console.warn('GoalMeter: No data returned from funding_goal table');
        setError('No active funding goal found.');
      }
    } catch (err) {
      console.error('GoalMeter: Critical error during fetch:', err);
      setError('Unable to load funding data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFunding();

    const subscription = supabase
      .channel('public:funding_goal')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'funding_goal' }, (payload) => {
         console.log('GoalMeter: Real-time update received:', payload);
         setFundingData({
           goalAmount: Number(payload.new.goal_amount),
           currentTotal: Number(payload.new.current_total || 0)
         });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchFunding]);

  // Derived state
  const percentage = fundingData.goalAmount && fundingData.goalAmount > 0 
    ? Math.min((fundingData.currentTotal / fundingData.goalAmount) * 100, 100)
    : 0;

  // Debugging log for render
  useEffect(() => {
    if (!loading && fundingData.goalAmount) {
      console.log('GoalMeter: Rendering with values:', {
        rawTotal: fundingData.currentTotal,
        rawGoal: fundingData.goalAmount,
        formattedTotal: formatNumber(fundingData.currentTotal, { type: 'currency', maximumFractionDigits: 0 }),
        formattedGoal: formatNumber(fundingData.goalAmount, { type: 'currency', maximumFractionDigits: 0 })
      });
    }
  }, [loading, fundingData]);

  useEffect(() => {
    if (!loading && !error && fundingData.goalAmount) {
      controls.start({
        width: `${percentage}%`,
        transition: { duration: 1.5, ease: "easeOut", delay: 0.5 }
      });

      let start = 0;
      const duration = 1500;
      const end = fundingData.currentTotal;
      const increment = end > 0 ? end / (duration / 16) : 0; 
      
      setDisplayCount(0);

      if (end === 0) {
        setDisplayCount(0);
        return;
      }

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayCount(end);
          clearInterval(timer);
        } else {
          setDisplayCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [fundingData, percentage, controls, loading, error]);

  const milestones = [25, 50, 75];

  if (loading) {
    return (
      <section className="relative pt-8 pb-16 w-full bg-gradient-to-b from-[#3B5998] to-[#2d4475]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8">
             <div className="flex justify-between items-end mb-8">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-32 bg-white/10" />
                  <Skeleton className="h-10 w-64 bg-white/10" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-24 ml-auto bg-white/10" />
                  <Skeleton className="h-12 w-48 bg-white/10" />
                </div>
             </div>
             <Skeleton className="h-6 w-full rounded-full bg-white/10" />
             <div className="grid grid-cols-3 gap-6 mt-8">
               <Skeleton className="h-16 w-full bg-white/10" />
               <Skeleton className="h-16 w-full bg-white/10" />
               <Skeleton className="h-16 w-full bg-white/10" />
             </div>
           </div>
        </div>
      </section>
    );
  }

  // Show error if fetch failed OR if we loaded but have no goal amount
  if (error || (!loading && !fundingData.goalAmount)) {
    return (
      <section className="relative pt-8 pb-16 w-full bg-gradient-to-b from-[#3B5998] to-[#2d4475]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
             <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
             <h3 className="text-xl text-[#F5F1E8] font-bold mb-2">Failed to load funding data</h3>
             <p className="text-[#F5F1E8]/70 mb-6">{error || "No funding goal data available"}</p>
             <Button onClick={fetchFunding} variant="outline" className="gap-2 border-white/20 text-[#3B5998] hover:bg-white/90">
               <RefreshCcw className="w-4 h-4" />
               Retry Connection
             </Button>
           </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-8 pb-16 w-full overflow-hidden bg-gradient-to-b from-[#3B5998] to-[#2d4475]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C5A059] rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F5F1E8] rounded-full mix-blend-overlay filter blur-[100px] opacity-10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-[#C5A059]" />
                  <span className="text-[#C5A059] font-bold uppercase tracking-wider text-sm">Funding Goal</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-[#F5F1E8] font-bold">
                  Join The Founders
                </h2>
              </div>
              
              <div className="text-right">
                <p className="text-[#F5F1E8]/70 text-sm mb-1 uppercase tracking-wide">Raised So Far</p>
                <div className="text-4xl md:text-5xl font-bold text-[#C5A059] tabular-nums">
                  {formatNumber(displayCount, { type: 'currency', maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative pt-6 pb-2">
              {/* Background Track */}
              <div className="h-6 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 relative">
                
                {/* Animated Progress Fill */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={controls}
                  className="h-full bg-gradient-to-r from-[#C5A059] via-[#e6c885] to-[#C5A059] relative"
                >
                  {/* Shine Effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent" />
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                </motion.div>
              </div>

              {/* Milestones Markers */}
              {milestones.map((milestone) => (
                <div 
                  key={milestone} 
                  className="absolute top-6 bottom-0 w-px bg-white/20 h-6 z-10"
                  style={{ left: `${milestone}%` }}
                >
                  <div className="absolute -top-6 -translate-x-1/2 text-[10px] font-bold text-[#F5F1E8]/50">
                    {milestone}%
                  </div>
                </div>
              ))}
              
              {/* End Marker - FIXED DISPLAY */}
              <div className="absolute top-0 right-0 -translate-y-full mb-2 flex items-center gap-1">
                 <span className="text-[#F5F1E8] font-bold text-sm">
                   {formatNumber(fundingData.goalAmount, { type: 'currency', maximumFractionDigits: 0 })} Goal
                 </span>
              </div>
            </div>

            {/* Footer Stats/Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-[#C5A059]/20 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <p className="text-[#F5F1E8] font-bold">{percentage.toFixed(0)}% Funded</p>
                  <p className="text-xs text-[#F5F1E8]/60">We are on our way!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-[#C5A059]/20 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <p className="text-[#F5F1E8] font-bold">Community Backed</p>
                  <p className="text-xs text-[#F5F1E8]/60">Join hundreds of founders</p>
                </div>
              </div>

              <div className="md:col-span-1 flex items-center justify-end">
                 <p className="text-xs text-[#F5F1E8]/40 text-right italic max-w-[200px]">
                   * Funds are fully refundable if goal is not met.
                 </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GoalMeter;
