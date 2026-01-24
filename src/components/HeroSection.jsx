
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import BetaSignupModal from '@/components/BetaSignupModal';
import HeroImage from '@/components/HeroImage';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom'; // Added for Login link
import { Lock } from 'lucide-react'; // Added for Login icon

const HeroSection = () => {
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const navigate = useNavigate();
  // We start at 254 to maintain the "Velvet Rope" scarcity illusion
  const FOUNDER_SEED_COUNT = 254; 
  const [memberCount, setMemberCount] = useState(FOUNDER_SEED_COUNT);

  useEffect(() => {
    // 1. Fetch the initial count from the database
    const fetchCount = async () => {
      try {
        const { count, error } = await supabase
          .from('beta_signups')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching count:', error);
        } else {
          // Display = Seed (254) + Real Signups
          setMemberCount(FOUNDER_SEED_COUNT + (count || 0));
        }
      } catch (err) {
        console.error('Connection error:', err);
      }
    };

    fetchCount();

    // 2. Set up Real-Time Listener
    const subscription = supabase
      .channel('public:beta_signups')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'beta_signups' }, 
        (payload) => {
          setMemberCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0F172A]">
      {/* 1. Matte Dark Slate Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1E293B] via-[#0F172A] to-[#020617]" />
      
      {/* 2. Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-0"></div>

      {/* Central Content */}
      <div className="relative z-20 flex flex-col items-center gap-10 max-w-md w-full px-6">
        
        {/* 3. The Refined Backlit "M" */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
        >
          {/* The Glow Effect */}
          <div className="absolute inset-0 bg-[#C5A059] blur-[80px] opacity-10 rounded-full animate-pulse"></div>
          
          {/* Logo */}
          <HeroImage className="w-56 h-56 md:w-72 md:h-72 drop-shadow-[0_0_40px_rgba(197,160,89,0.15)]" />
        </motion.div>

        {/* 4. Minimalist Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center space-y-8 w-full"
        >
          <div>
            <h1 className="text-[#F5F1E8] text-lg md:text-xl font-serif tracking-[0.25em] uppercase mb-3 opacity-90">
              The Infrastructure of Dignity
            </h1>
            <div className="w-8 h-0.5 bg-[#C5A059] mx-auto opacity-60"></div>
          </div>

          <div className="space-y-1">
            <p className="text-[#94A3B8] text-[10px] uppercase tracking-[0.3em] font-medium">
              Current Waitlist Position
            </p>
            <div className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tighter tabular-nums">
              #{memberCount}
            </div>
          </div>

          {/* 5. The "Velvet Rope" Button */}
          <Button 
            onClick={() => setIsBetaModalOpen(true)}
            className="bg-transparent border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0F172A] text-xs font-bold py-6 px-10 uppercase tracking-[0.2em] rounded-sm transition-all duration-500 shadow-[0_0_20px_rgba(197,160,89,0.05)] hover:shadow-[0_0_30px_rgba(197,160,89,0.3)]"
          >
            Get In Line
          </Button>
        </motion.div>

        {/* 6. Member Login Link (Subtle) */}
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

      </div>

      <BetaSignupModal isOpen={isBetaModalOpen} onClose={() => setIsBetaModalOpen(false)} />
    </section>
  );
};

export default HeroSection;