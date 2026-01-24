
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import BetaSignupModal from '@/components/BetaSignupModal';
import HeroImage from '@/components/HeroImage';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(254);
  const navigate = useNavigate();

  // The "Live" Pulse Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setMemberCount(prev => prev === 254 ? 254 : 254); // Keeps it steady at 254 for now
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#1D5DA0]">
      {/* Background - Deep Blue with subtle texture */}
      <div className="absolute inset-0 z-0 bg-[#1D5DA0]" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>

      {/* Central Content */}
      <div className="relative z-20 flex flex-col items-center gap-10 max-w-md w-full px-6">
        
        {/* The Circle Logo (Pulsing) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          {/* Logo Sized Up for Impact */}
          <HeroImage className="w-64 h-64 md:w-80 md:h-80 shadow-2xl" />
          
          {/* "Live" Status Indicator */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="absolute -bottom-4 -right-4 bg-[#C5A059] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg border-2 border-[#1D5DA0]"
          >
            Live
          </motion.div>
        </motion.div>

        {/* The "Member 255" Hook */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center space-y-6 w-full"
        >
          <div className="space-y-2">
            <h1 className="text-white text-lg font-serif tracking-widest uppercase opacity-80 mb-4">
              The Infrastructure of Dignity
            </h1>
            
            <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-light">
              Current Member Count
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl md:text-6xl font-serif text-white font-bold tracking-tighter">
                {memberCount}
              </span>
              <span className="text-white/40 text-xl font-light">/ 1000</span>
            </div>
            <p className="text-[#C5A059] text-xs font-bold uppercase tracking-widest animate-pulse">
              Next Allocation: #255
            </p>
          </div>

          {/* The Action Buttons */}
          <div className="flex flex-col gap-3 w-full pt-6">
            <Button 
              onClick={() => setIsBetaModalOpen(true)}
              className="w-full bg-white text-[#1D5DA0] hover:bg-[#F5F1E8] text-lg font-bold py-6 uppercase tracking-widest rounded-none border border-transparent hover:border-[#C5A059] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Get In Line
            </Button>
            
            <Button 
              onClick={() => navigate('/login')}
              variant="ghost" 
              className="text-white/40 hover:text-white text-xs uppercase tracking-widest"
            >
              Member Login
            </Button>
          </div>
        </motion.div>
      </div>

      <BetaSignupModal isOpen={isBetaModalOpen} onClose={() => setIsBetaModalOpen(false)} />
    </section>
  );
};

export default HeroSection;