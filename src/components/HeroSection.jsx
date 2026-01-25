
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
        // Count real users (Profiles)
        const { count: userCount } = await supabase
          .from('profiles') // Fixed: now points to correct table
          .select('*', { count: 'exact', head: true });
          
        // Count beta signups (Legacy)
        const { count: betaCount } = await supabase
          .from('beta_signups')
          .select('*', { count: 'exact', head: true });

        // Total "Waitlist" Number
        setMemberCount(FOUNDER_SEED_COUNT + (userCount || 0) + (betaCount || 0));
      } catch (err) {
        console.error('Connection error:', err);
      }
    };

    fetchCount();
  }, [isSanctuary]);

  // --- STYLES CONFIG ---
  const styles = isSanctuary ? {
    // Heaven / Sanctuary Mode
    bg: "bg-[#F5F1E8]",
    gradient: "from-[#F5F1E8] via-[#E8DCC4] to-[#F5F1E8]", // Warm light gradient
    textColor: "text-[#3B5998]", // Maslow Blue
    subTextColor: "text-[#3B5998]/60",
    glow: "bg-[#C5A059] opacity-20",
    textureOpacity: "opacity-5",
  } : {
    // Velvet Rope Mode (Default)
    bg: "bg-[#0F172A]",
    gradient: "from-[#1E293B] via-[#0F172A] to-[#020617]", // Deep dark slate
    textColor: "text-[#F5F1E8]", // Cream/White
    subTextColor: "text-[#94A3B8]",
    glow: "bg-[#C5A059] opacity-10",
    textureOpacity: "opacity-10",
  };

  return (
    <section className={`relative h-screen w-full flex flex-col items-center justify-center overflow-hidden ${styles.bg}`}>
      {/* 1. Background Gradient */}
      <div className={`absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${styles.gradient}`} />
      
      {/* 2. Texture Overlay (Stardust) */}
      <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] ${styles.textureOpacity} z-0`}></div>

      {/* Central Content */}
      <div className="relative z-20 flex flex-col items-center gap-10 max-w-md w-full px-6">
        
        {/* 3. The Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
        >
          {/* The Glow Effect */}
          <div className={`absolute inset-0 blur-[80px] rounded-full animate-pulse ${styles.glow}`}></div>
          
          {/* Logo */}
          <HeroImage className="w-56 h-56 md:w-72 md:h-72 drop-shadow-[0_0_40px_rgba(197,160,89,0.15)]" />
        </motion.div>

        {/* 4. Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center space-y-8 w-full"
        >
          <div>
            <h1 className={`${styles.textColor} text-lg md:text-xl font-serif tracking-[0.25em] uppercase mb-3 opacity-90`}>
              {isSanctuary ? "Welcome Home" : "The Infrastructure of Dignity"}
            </h1>
            <div className="w-8 h-0.5 bg-[#C5A059] mx-auto opacity-60"></div>
          </div>

          {/* --- PUBLIC ONLY: Member Count --- */}
          {!isSanctuary && (
            <div className="space-y-1">
              <p className={`${styles.subTextColor} text-[10px] uppercase tracking-[0.3em] font-medium`}>
                Current Member Count
              </p>
              <div className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tighter tabular-nums">
                #{memberCount}
              </div>
            </div>
          )}

          {/* --- PUBLIC ONLY: Waitlist Button --- */}
          {!isSanctuary && (
            <Button 
              onClick={() => navigate('/login?mode=signup')}
              className="bg-transparent border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0F172A] text-xs font-bold py-6 px-10 uppercase tracking-[0.2em] rounded-sm transition-all duration-500 shadow-[0_0_20px_rgba(197,160,89,0.05)] hover:shadow-[0_0_30px_rgba(197,160,89,0.3)]"
            >
              Join The Waitlist <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}

          {/* --- MEMBER ONLY: Subtle Scroll Hint --- */}
          {isSanctuary && (
             <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="pt-12 opacity-40"
             >
                <ChevronDown className={`w-6 h-6 ${styles.textColor}`} />
             </motion.div>
          )}
        </motion.div>

        {/* --- PUBLIC ONLY: Login Link --- */}
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