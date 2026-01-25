
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import HeroImage from '@/components/HeroImage';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

const HeroSection = ({ variant = 'default', children }) => {
  const navigate = useNavigate();
  const isSanctuary = variant === 'sanctuary';
  
  const FOUNDER_SEED_COUNT = 254; 
  const [memberCount, setMemberCount] = useState(FOUNDER_SEED_COUNT);

  useEffect(() => {
    if (isSanctuary) return;
    const fetchCount = async () => {
      try {
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: betaCount } = await supabase.from('beta_signups').select('*', { count: 'exact', head: true });
        setMemberCount(FOUNDER_SEED_COUNT + (userCount || 0) + (betaCount || 0));
      } catch (err) { console.error(err); }
    };
    fetchCount();
  }, [isSanctuary]);

  // STYLES
  const textColor = isSanctuary ? 'text-slate-800' : 'text-[#F5F1E8]';
  const lineColor = isSanctuary ? 'bg-[#3B5998]' : 'bg-[#C5A059]';

  return (
    <section className={`relative h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000 ${isSanctuary ? 'bg-white' : 'bg-[#0F172A]'}`}>
      
      {/* BACKGROUND LAYER */}
      {isSanctuary ? (
        <>
          <motion.div 
            className="absolute inset-0 z-0 bg-[size:400%_400%] bg-gradient-to-br from-white via-slate-50 to-sky-50"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 z-0 bg-white/60" />
        </>
      ) : (
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1E293B] via-[#0F172A] to-[#020617]" />
      )}

      {/* TEXTURE */}
      <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] ${isSanctuary ? 'opacity-[0.03] invert' : 'opacity-10'} z-0`}></div>

      {/* CONTENT LAYER */}
      <div className="relative z-20 flex flex-col items-center gap-8 max-w-md w-full px-6">
        
        {/* LOGO */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
        >
          <div className={`absolute inset-0 blur-[60px] rounded-full animate-pulse ${isSanctuary ? 'bg-sky-200 opacity-40' : 'bg-[#C5A059] opacity-10'}`}></div>
          <HeroImage className={`w-48 h-48 md:w-64 md:h-64 drop-shadow-2xl transition-all duration-1000 ${isSanctuary ? 'brightness-105 contrast-100' : ''}`} />
        </motion.div>

        {/* HEADER TEXT */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center w-full"
        >
          <h1 className={`${textColor} text-lg md:text-xl font-serif tracking-[0.25em] uppercase mb-4 opacity-90 transition-colors duration-1000`}>
            The Infrastructure of Dignity
          </h1>
          <div className={`w-8 h-0.5 mx-auto opacity-60 mb-8 transition-colors duration-1000 ${lineColor}`}></div>

          {/* INJECTED MENU (LOGGED IN) OR PUBLIC CONTENT */}
          {children ? (
             <div className="space-y-4">{children}</div>
          ) : (
            /* DEFAULT PUBLIC VIEW */
            <>
              <div className="space-y-1 mb-8">
                <p className="text-[#94A3B8] text-[10px] uppercase tracking-[0.3em] font-medium">Current Member Count</p>
                <div className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tighter tabular-nums">#{memberCount}</div>
              </div>
              
              <div className="flex flex-col gap-4">
                <Button 
                    onClick={() => navigate('/login?mode=signup')}
                    className="bg-transparent border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0F172A] text-xs font-bold py-6 px-10 uppercase tracking-[0.2em] rounded-sm transition-all duration-500 shadow-[0_0_20px_rgba(197,160,89,0.05)] hover:shadow-[0_0_30px_rgba(197,160,89,0.3)]"
                >
                    Join The Waitlist <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                
                <Button 
                  variant="link" 
                  onClick={() => navigate('/vision')}
                  className="text-[#94A3B8]/50 hover:text-white text-[10px] uppercase tracking-widest"
                >
                  Read The Blueprint {/* <--- THIS IS THE FIX */}
                </Button>
              </div>
            </>
          )}
        </motion.div>

        {/* Login Link (Public Only) */}
        {!isSanctuary && !children && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <Button variant="link" onClick={() => navigate('/login')} className="text-[#94A3B8]/30 hover:text-[#C5A059] text-[10px] uppercase tracking-widest h-auto p-0">
              <Lock className="w-3 h-3 mr-2" /> Member Access
            </Button>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default HeroSection;