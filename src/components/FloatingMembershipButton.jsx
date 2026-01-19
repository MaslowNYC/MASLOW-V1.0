
import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';

const FloatingMembershipButton = () => {
  const scrollToMembership = () => {
    // Scroll directly to the membership cards grid
    const element = document.getElementById('membership-cards-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 md:hidden">
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={scrollToMembership}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 0 0 rgba(197, 160, 89, 0)",
              "0 0 0 10px rgba(197, 160, 89, 0.3)",
              "0 0 0 20px rgba(197, 160, 89, 0)"
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
          className="absolute inset-0 rounded-full bg-[#C5A059] opacity-20"
        />
        
        <div className="relative flex items-center gap-2 bg-[#3B5998] text-[#F5F1E8] pl-5 pr-6 py-3.5 rounded-full shadow-2xl border-2 border-[#C5A059]">
          <HeartHandshake className="w-5 h-5 text-[#C5A059]" />
          <span className="font-bold text-sm uppercase tracking-wider">Sponsor Now</span>
        </div>
      </motion.button>
    </div>
  );
};

export default FloatingMembershipButton;
