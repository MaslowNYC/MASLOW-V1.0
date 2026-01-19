
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import BetaSignupModal from '@/components/BetaSignupModal';
import HeroImage from '@/components/HeroImage';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetInLine = () => {
    navigate('/login');
  };

  return (
    <section className="relative h-screen w-full flex flex-col overflow-hidden bg-[#1D5DA0] justify-between">
      {/* Background - Solid Color */}
      <div className="absolute inset-0 z-0 bg-[#1D5DA0]" />

      {/* Main Content Area - Logo focused at top/center */}
      <div className="flex-grow flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 relative z-10 pt-16 pb-8">
        <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl">
          {/* Logo Image Component - Sized up ~15% from original design */}
          <HeroImage className="w-56 h-56 md:w-80 md:h-80" />
        </div>
      </div>

      {/* Bottom Area - Text and Buttons grouped together */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }} 
        className="w-full pb-12 sm:pb-16 px-4 z-20 flex flex-col items-center gap-8"
      >
        {/* Headlines */}
        <div className="text-center space-y-5 max-w-2xl px-4">
           <h1 className="text-2xl md:text-3xl lg:text-4xl font-sans font-bold text-white tracking-tight leading-tight drop-shadow-sm">
            New York's First real{" "}
            <span className="relative inline-block">
              rest
              {/* Animated White Streak Underline */}
              <motion.span 
                className="absolute -bottom-1 left-0 h-[4px] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 1.6, // Reduced by 20% (from 2.0s to 1.6s)
                  ease: "easeInOut", 
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
              />
            </span>
            room . . .
          </h1>
          
          {/* Gold Divider */}
          <div className="w-16 h-1.5 bg-[#C5A059] rounded-full shadow-sm mx-auto"></div>
        </div>

        {/* Buttons - Reduced height/padding as requested */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm mx-auto">
          {/* Left Button - Join Mailing List */}
          <Button 
            onClick={() => setIsBetaModalOpen(true)} 
            variant="outline" 
            className="w-full sm:w-auto flex-1 bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1D5DA0] text-xs font-bold px-6 py-3 rounded-md uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:scale-105 h-auto flex flex-col items-center justify-center text-center min-w-[160px]"
          >
            <span className="leading-none mb-1">Join Mailing List</span>
            {/* Invisible placeholder for height consistency */}
            <span className="text-[9px] font-medium normal-case opacity-0 leading-none h-[10px] block"></span> 
          </Button>

          {/* Right Button - Get in Line */}
          <Button 
            onClick={handleGetInLine} 
            variant="default" 
            className="w-full sm:w-auto flex-1 bg-[#C5A059] border-2 border-[#C5A059] text-white hover:bg-[#b08d4b] hover:border-[#b08d4b] px-6 py-3 rounded-md transition-all group flex flex-col items-center justify-center text-center shadow-lg hover:shadow-xl hover:scale-105 h-auto min-w-[160px]"
          >
            <span className="text-xs font-bold uppercase tracking-widest leading-none mb-1">Get in Line!</span>
            <span className="text-[9px] font-medium normal-case opacity-90 text-center leading-none h-[10px] block">(open free account*)</span>
          </Button>
        </div>
      </motion.div>

      <BetaSignupModal isOpen={isBetaModalOpen} onClose={() => setIsBetaModalOpen(false)} />
    </section>
  );
};

export default HeroSection;
