
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeroImageProps {
  className?: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ className }) => {
  return (
    <motion.div
      className={cn("relative z-10 flex items-center justify-center", className)}
      initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{
        scale: 1.05,
        rotateX: 5,
        rotateY: 5,
        filter: "brightness(1.05)"
      }}
      style={{ perspective: 1000 }}
    >
      <div className="relative w-full h-full shadow-[0_25px_60px_-10px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden border border-white/10">
        <img
          src="/maslow-logo.png"
          alt="Maslow Sign"
          className="w-full h-full object-contain"
        />

        {/* Subtle gloss overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/5 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default HeroImage;
