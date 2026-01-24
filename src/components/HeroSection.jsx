
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import BetaSignupModal from '@/components/BetaSignupModal';
import HeroImage from '@/components/HeroImage';

const HeroSection = () => {
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(254);

  // Scarcity Counter Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMemberCount(254); 
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* 1. Dark Backlit Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1D5DA0]/20 via-black to-black" />
      
      {/* 2. Grid Texture (Subtle) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>

      {/* Central Content */}
      <div className="relative z-20 flex flex-col items-center gap-12 max-w-md w-full px-6">
        
        {/* 3. The Backlit "M" */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
        >
          {/* The Glow Effect behind the logo */}
          <div className="absolute inset-0 bg-[#C5A059] blur-[100px] opacity-20 rounded-full animate-pulse"></div>
          
          <HeroImage className="w-72 h-72 md:w-96 md:h-96 drop-shadow-[0_0_50px_rgba(197,160,89,0.3)]" />
        </motion.div>

        {/* 4. Minimalist Text & Counter */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center space-y-8 w-full"
        >
          <div>
            <h1 className="text-white/90 text-xl font-serif tracking-[0.2em] uppercase mb-2">
              The Infrastructure of Dignity
            </h1>
            <div className="w-12 h-0.5 bg-[#C5A059] mx-auto opacity-50"></div>
          </div>

          <div className="space-y-1">
            <p className="text-white/40 text-xs uppercase tracking-widest font-light">
              Waitlist Position
            </p>
            <div className="text-5xl font-serif text-white font-bold tracking-tighter">
              #{memberCount}
            </div>
          </div>

          {/* 5. The Only Way Forward */}
          <Button 
            onClick={() => setIsBetaModalOpen(true)}
            className="bg-transparent border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black text-sm font-bold py-6 px-12 uppercase tracking-[0.2em] rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(197,160,89,0.1)] hover:shadow-[0_0_40px_rgba(197,160,89,0.4)]"
          >
            Get In Line
          </Button>
        </motion.div>
      </div>

      <BetaSignupModal isOpen={isBetaModalOpen} onClose={() => setIsBetaModalOpen(false)} />
    </section>
  );
};

export default HeroSection;