'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConciergeModal from './ConciergeModal';

interface ConciergeBubbleProps {
  userId: string | null;
}

export default function ConciergeBubble({ userId }: ConciergeBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Don't render if no user
  if (!userId) {
    return null;
  }

  return (
    <>
      {/* Floating Bubble */}
      <motion.button
        className="fixed bottom-6 right-6 z-[9999] group"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        aria-label="Open AI Concierge chat"
      >
        {/* Pulsing glow effect */}
        <div className="absolute inset-0 rounded-full bg-[#286ABC] animate-pulse-glow" />

        {/* Main bubble */}
        <div className="relative w-14 h-14 bg-[#286ABC] rounded-full flex items-center justify-center shadow-2xl border-2 border-[#286ABC]/30 group-hover:border-[#C5A059]/50 transition-all">
          {/* Maslow M Logo */}
          <div className="w-10 h-10 bg-[#FAF4ED] rounded-full flex items-center justify-center">
            <span className="text-[#286ABC] font-bold text-xl">M</span>
          </div>
        </div>

        {/* Label */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/95 text-[#286ABC] text-xs font-semibold px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Concierge
        </div>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <ConciergeModal
            userId={userId}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Custom pulsing animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.1;
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
