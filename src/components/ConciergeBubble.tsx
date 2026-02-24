'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import ConciergeModal from './ConciergeModal';

interface ConciergeBubbleProps {
  userId: string | null;
}

export default function ConciergeBubble({ userId }: ConciergeBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Load visibility preference from profile
  useEffect(() => {
    const loadPreference = async () => {
      if (!userId) return;

      try {
        const { data } = await (supabase
          .from('profiles') as any)
          .select('accessibility_settings')
          .eq('id', userId)
          .single();

        // Check if user has explicitly hidden the concierge
        const showConcierge = data?.accessibility_settings?.show_concierge;
        if (showConcierge === false) {
          setIsVisible(false);
        }
      } catch (err) {
        console.error('Error loading concierge preference:', err);
      }
    };

    loadPreference();

    // Listen for preference changes from settings modal
    const handlePreferenceChange = (event: CustomEvent) => {
      if (event.detail?.show_concierge !== undefined) {
        setIsVisible(event.detail.show_concierge);
      }
    };

    window.addEventListener('concierge-preference-change', handlePreferenceChange as EventListener);
    return () => {
      window.removeEventListener('concierge-preference-change', handlePreferenceChange as EventListener);
    };
  }, [userId]);

  // Handle dismiss - save preference to hide concierge
  const handleDismiss = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);

    if (userId) {
      try {
        // Get current settings first
        const { data } = await (supabase
          .from('profiles') as any)
          .select('accessibility_settings')
          .eq('id', userId)
          .single();

        const currentSettings = data?.accessibility_settings || {};
        const updatedSettings = {
          ...currentSettings,
          show_concierge: false,
        };

        await (supabase
          .from('profiles') as any)
          .update({ accessibility_settings: updatedSettings })
          .eq('id', userId);
      } catch (err) {
        console.error('Error saving concierge preference:', err);
      }
    }
  };

  // Don't render if no user or not visible
  if (!userId || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Floating Bubble */}
      <div
        className="fixed bottom-6 right-6 z-[9999]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* X button to dismiss - shows on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleDismiss}
              className="absolute -top-1 -right-1 z-10 w-5 h-5 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center shadow-lg transition-colors"
              aria-label="Hide AI Concierge"
            >
              <X className="w-3 h-3 text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          className="group"
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
      </div>

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
