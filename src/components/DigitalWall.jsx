
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, UserPlus, RefreshCcw, DollarSign, AlertCircle } from 'lucide-react';
import { useFounders } from '@/hooks/useFounders';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/customSupabaseClient';
import { formatNumber } from '@/utils/formatting';

const DigitalWall = () => {
  const { founders, loading: loadingFounders } = useFounders();
  const [fundingTotal, setFundingTotal] = useState(0);
  const [loadingFunding, setLoadingFunding] = useState(true);
  const [error, setError] = useState(null);

  const fetchFunding = async () => {
    setLoadingFunding(true);
    setError(null);
    try {
      // Use select('*') to match consistent data fetching pattern required
      const { data, error } = await supabase
        .from('funding_goal')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setFundingTotal(Number(data.current_total || 0));
      }
    } catch (err) {
      console.error('Error fetching funding for Digital Wall:', err);
      setError('Failed to load funding data.');
    } finally {
      setLoadingFunding(false);
    }
  };

  useEffect(() => {
    fetchFunding();
  }, []);

  return (
    <section className="bg-[#3B5998] py-16 w-full overflow-hidden border-t border-[#C5A059]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif text-[#F5F1E8] mb-3"
          >
            Our Founding Sponsors
          </motion.h3>
          
          <div className="flex flex-col items-center justify-center gap-2 mb-4">
            <p className="text-[#C5A059] uppercase tracking-widest text-sm font-bold">
              Building the future of dignity together
            </p>
            
            {/* Funding Display Area */}
            <div className="mt-2 min-h-[40px] flex items-center justify-center">
              {loadingFunding ? (
                <Skeleton className="h-8 w-48 bg-white/10 rounded-full" />
              ) : error ? (
                <div className="flex items-center gap-2 text-red-300 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={fetchFunding}
                    className="h-6 px-2 text-xs hover:bg-white/10 hover:text-white"
                  >
                    <RefreshCcw className="w-3 h-3 mr-1" /> Retry
                  </Button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#F5F1E8]"
                >
                  <DollarSign className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-semibold tabular-nums">
                    {formatNumber(fundingTotal, { type: 'currency', maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-white/60 text-sm">raised to date</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {loadingFounders ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {[...Array(8)].map((_, i) => (
               <Skeleton key={i} className="h-20 bg-white/5 rounded-lg" />
             ))}
           </div>
        ) : founders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#F5F1E8]/60 bg-white/5 rounded-xl border border-white/10 border-dashed">
            <UserPlus className="w-12 h-12 mb-4 text-[#C5A059]" />
            <p className="text-lg font-medium">The wall is waiting for its first stone.</p>
            <p className="text-sm opacity-70">Be the first founding member to write your name in history.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {founders.map((sponsor, index) => (
              <motion.div
                key={`${sponsor.name}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`bg-white/5 backdrop-blur-sm border border-[#C5A059]/30 rounded-lg p-4 flex flex-col justify-center transition-all duration-300 shadow-md hover:shadow-xl hover:bg-white/10 group`}
              >
                <span className="font-medium text-base md:text-lg mb-1 group-hover:text-[#C5A059] transition-colors truncate text-[#F5F1E8]">
                  {sponsor.name}
                </span>
                <div className="flex items-center gap-1.5 text-[#F5F1E8]/60 text-xs uppercase tracking-wide">
                  <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
                  <span className="truncate">{sponsor.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {founders.length > 0 && (
          <div className="text-center mt-12">
             <p className="text-[#F5F1E8]/40 text-sm italic">
               Join {founders.length} visionaries building the Hull.
             </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DigitalWall;
