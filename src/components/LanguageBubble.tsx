'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageModal from './LanguageModal';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useTranslation } from 'react-i18next';

// Welcome in different languages
const WELCOME_TRANSLATIONS = [
  { code: 'en', text: 'Welcome', language: 'English' },
  { code: 'es', text: 'Bienvenido', language: 'Spanish' },
  { code: 'zh-CN', text: '欢迎', language: 'Chinese (Simplified)' },
  { code: 'fr', text: 'Bienvenue', language: 'French' },
  { code: 'de', text: 'Willkommen', language: 'German' },
  { code: 'it', text: 'Benvenuto', language: 'Italian' },
  { code: 'ja', text: 'ようこそ', language: 'Japanese' },
  { code: 'ko', text: '환영합니다', language: 'Korean' },
  { code: 'pt', text: 'Bem-vindo', language: 'Portuguese' },
  { code: 'ru', text: 'Добро пожаловать', language: 'Russian' },
  { code: 'ar', text: 'مرحبا', language: 'Arabic' },
  { code: 'hi', text: 'स्वागत है', language: 'Hindi' },
  { code: 'zh-HK', text: '歡迎', language: 'Chinese (Cantonese)' },
];

interface LanguageBubbleProps {
  onLanguageSelect?: (languageCode: string) => void;
  selectedLanguage?: string;
}

export default function LanguageBubble({
  onLanguageSelect,
  selectedLanguage
}: LanguageBubbleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const previousLanguageRef = useRef<string>(selectedLanguage || 'en');
  const { toast } = useToast();
  const { i18n } = useTranslation();

  // Rotate through languages every 1.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % WELCOME_TRANSLATIONS.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleBubbleClick = () => {
    setIsPaused(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPaused(false);
  };

  const handleSelectLanguage = (code: string) => {
    // Store previous language before changing
    const prevLang = selectedLanguage || previousLanguageRef.current;
    previousLanguageRef.current = prevLang;

    // Apply the new language
    onLanguageSelect?.(code);
    handleCloseModal();

    // Find language name for toast
    const langName = WELCOME_TRANSLATIONS.find(l => l.code === code)?.language || code;

    // Show toast with undo option
    toast({
      title: 'Language changed',
      description: `Now using ${langName}`,
      duration: 4000,
      action: (
        <ToastAction
          altText="Undo language change"
          onClick={() => {
            // Revert to previous language
            onLanguageSelect?.(prevLang);
            i18n.changeLanguage(prevLang);
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  const currentWelcome = WELCOME_TRANSLATIONS[currentIndex];

  return (
    <>
      {/* Floating Bubble */}
      <motion.button
        className="fixed bottom-6 right-4 md:right-6 z-50 group"
        onClick={handleBubbleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        aria-label="Select language"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#C5A059] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />

        {/* Main bubble */}
        <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#C5A059]/40 rounded-full px-6 py-3 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-[#C5A059] font-medium text-lg block min-w-[120px] text-center"
            >
              {currentWelcome.text}
            </motion.span>
          </AnimatePresence>

          {/* Language indicator */}
          <motion.span
            key={`lang-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white/40 text-[10px] uppercase tracking-wider text-center block mt-1"
          >
            {currentWelcome.language}
          </motion.span>
        </div>

        {/* Tap hint */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white/70 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Tap to select language
        </div>
      </motion.button>

      {/* Language Selection Modal */}
      <LanguageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelect={handleSelectLanguage}
        languages={WELCOME_TRANSLATIONS}
        selectedLanguage={selectedLanguage}
      />
    </>
  );
}

export { WELCOME_TRANSLATIONS };
