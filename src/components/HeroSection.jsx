
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import HeroImage from '@/components/HeroImage';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ChevronDown } from 'lucide-react';

const HeroSection = ({ variant = 'default' }) => {
  const navigate = useNavigate();
  const isSanctuary = variant === 'sanctuary';
  
  // We start at 254 to maintain the "Velvet Rope" scarcity illusion
  const FOUNDER_SEED_COUNT = 254; 
  const [memberCount, setMemberCount] = useState(FOUNDER_SEED_COUNT);

  useEffect(() => {
    // Only fetch count if we are in "Velvet Rope" (default) mode
    if (isSanctuary) return;

    const fetchCount = async () => {
      try {
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        const { count: betaCount } = await supabase
          .from('beta_signups')
          .select('*', { count: 'exact', head: true });

        setMemberCount(FOUNDER_SEED_COUNT + (userCount || 0) + (betaCount || 0));
      } catch (err) {
        console.error('Connection error:', err);
      }
    };

    fetchCount();
  }, [isSanctuary]);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-900">
      
      {/* =========================================
          BACKGROUND LAYER (The visual difference)
         ========================================= */}
      
      {isSanctuary ? (
        // --- SANCTUARY MODE (The Spa) ---
        // Colors: Stone-50, Slate-100, and a hint of Emerald-50 (Sage)
        <motion.div 
          className="absolute inset-0 z-0 bg-[size:400%_400%] bg-gradient-to-br from-[#FAFAF9] via-[#F1F5F9] to-[#ECFDF5]"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        // --- VELVET ROPE MODE (The Nightclub) ---
        // Colors: Deep Slate, Midnight, Void
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1E293B] via-[#0F172A] to-[#020617]" />
      )}

      {/* Common Texture Overlay (Subtle noise) */}
      <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] ${isSanctuary ? 'opacity-[0.03]' : 'opacity-10'} z-0`}></div>

      {/* =========================================
          CONTENT LAYER
         ========================================= */}
      <div className="relative z-20 flex flex-col items-center gap-10 max-w-md w-full px-6">
        
        {/* LOGO AREA */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
        >
          {/* The Pulse/Glow */}
          <div className={`absolute inset-0 blur-[80px] rounded-full animate-pulse ${isSanctuary ? 'bg-[#94A3B8] opacity-20' : 'bg-[#C5A059] opacity-10'}`}></div>
          
          {/* Logo */}
          <HeroImage className="w-56 h-56 md:w-72 md:h-72 drop-shadow-2xl" />
        </motion.div>

        {/* TEXT AREA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center space-y-8 w-full"
        >
          <div>
            <h1 className={`${isSanctuary ? 'text-[#475569]' : 'text-[#F5F1E8]'} text-lg md:text-xl font-serif tracking-[0.25em] uppercase mb-3 opacity-90`}>
              {isSanctuary ? "Welcome Home" : "The Infrastructure of Dignity"}
            </h1>
            <div className={`w-8 h-0.5 mx-auto opacity-60 ${isSanctuary ? 'bg-[#94A3B8]' : 'bg-[#C5A059]'}`}></div>
          </div>

          {/* PUBLIC: Member Count */}
          {!isSanctuary && (
            <div className="space-y-1">
              <p className="text-[#94A3B8] text-[10px] uppercase tracking-[0.3em] font-medium">
                Current Member Count
              </p>
              <div className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tighter tabular-nums">
                #{memberCount}
              </div>
            </div>
          )}

          {/* PUBLIC: Waitlist Button */}
          {!isSanctuary && (
            <Button 
              onClick={() => navigate('/login?mode=signup')}
              className="bg-transparent border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0F172A] text-xs font-bold py-6 px-10 uppercase tracking-[0.2em] rounded-sm transition-all duration-500 shadow-[0_0_20px_rgba(197,160,89,0.05)] hover:shadow-[0_0_30px_rgba(197,160,89,0.3)]"
            >
              Join The Waitlist <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}

          {/* MEMBER: Scroll Hint */}
          {isSanctuary && (
             <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="pt-12 opacity-30"
             >
                <ChevronDown className="w-6 h-6 text-[#475569]" />
             </motion.div>
          )}
        </motion.div>

        {/* PUBLIC: Login Link */}
        {!isSanctuary && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-4"
          >
            <Button 
              variant="link" 
              onClick={() => navigate('/login')}
              className="text-[#94A3B8]/30 hover:text-[#C5A059] text-[10px] uppercase tracking-widest transition-colors h-auto p-0"
            >
              <Lock className="w-3 h-3 mr-2" />
              Member Access
            </Button>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default HeroSection;