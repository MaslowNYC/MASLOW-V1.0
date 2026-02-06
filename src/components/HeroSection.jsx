
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

  // Fetch the live member count to show "Scarcity/Demand"
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

  return (
    <section className={`relative min-h-[100dvh] w-full flex flex-col items-center justify-center py-24 overflow-hidden`}>
      
      {/* BACKGROUND LAYER - "The Vibe" */}
      {isSanctuary ? (
        <>
           <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-50 to-white" />
           <div className="absolute inset-0 z-0 bg-white/60" />
        </>
      ) : (
        /* Dark Mode for the Velvet Rope (Public Face) */
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0F172A] via-[#020617] to-black" />
      )}

      {/* CONTENT LAYER */}
      <div className="relative z-20 flex flex-col items-center gap-8 max-w-md w-full px-6">
        
        {/* LOGO AREA - "The Artifact" */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
        >
          {/* The Pulse/Glow behind the logo */}
          <div className={`absolute inset-0 blur-[60px] rounded-full animate-pulse ${isSanctuary ? 'bg-sky-200 opacity-40' : 'bg-[#C5A059] opacity-10'}`}></div>
          
          {/* This uses your custom HeroImage component to render the Logo */}
          <HeroImage className={`w-32 h-32 md:w-56 md:h-56 drop-shadow-2xl transition-all duration-1000 ${isSanctuary ? 'brightness-105 contrast-100' : ''}`} />
        </motion.div>

        {/* HEADER TEXT - "The Mission" */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center space-y-8 w-full"
        >
          <div>
            <h1 className={`${isSanctuary ? 'text-slate-800' : 'text-[#F5F1E8]'} text-sm md:text-lg font-serif tracking-[0.25em] uppercase mb-4 opacity-90 transition-colors duration-1000`}>
              The Infrastructure of Dignity
            </h1>
            <div className={`w-8 h-0.5 mx-auto opacity-60 mb-8 transition-colors duration-1000 ${isSanctuary ? 'bg-[#3B5998]' : 'bg-[#C5A059]'}`}></div>
          </div>

          {/* DYNAMIC CONTENT */}
          {children ? (
             <div className="space-y-4 w-full">{children}</div>
          ) : (
            /* DEFAULT PUBLIC VIEW (THE VELVET ROPE) */
            <>
              {/* The Live Counter */}
              <div className="space-y-1 mb-8">
                <p className="text-[#94A3B8] text-[10px] uppercase tracking-[0.3em] font-medium">Waitlist Position</p>
                <div className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tighter tabular-nums">#{memberCount}</div>
              </div>
              
              {/* The Action Buttons */}
              <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                <Button 
                    onClick={() => navigate('/login?mode=signup')}
                    className="w-full bg-transparent border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0F172A] text-xs font-bold py-6 uppercase tracking-[0.2em] rounded-sm transition-all duration-500"
                >
                    Get In Line <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                
                <Button 
                  variant="link" 
                  onClick={() => navigate('/login')}
                  className="w-full text-[#94A3B8]/30 hover:text-[#C5A059] text-[10px] uppercase tracking-widest h-auto py-2 p-0"
                >
                  <Lock className="w-3 h-3 mr-2" /> Member Access
                </Button>
              </div>
            </>
          )}
        </motion.div>

      </div>
      <script async data-uid="5d27517f5d" src="https://maslownyc.kit.com/5d27517f5d/index.js"></script>
    </section>
  );
};

export default HeroSection;