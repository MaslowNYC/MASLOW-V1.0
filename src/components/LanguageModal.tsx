'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Globe } from 'lucide-react';

interface Language {
  code: string;
  text: string;
  language: string;
}

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  languages: Language[];
  selectedLanguage?: string;
}

export default function LanguageModal({
  isOpen,
  onClose,
  onSelect,
  languages,
  selectedLanguage = 'en',
}: LanguageModalProps) {
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, code: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(code);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#C5A059]/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="language-modal-title"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#C5A059]" />
                  <h2
                    id="language-modal-title"
                    className="text-lg font-semibold text-white"
                  >
                    Select Language
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Grid - 2 columns */}
              <div className="p-3">
                <div className="grid grid-cols-2 gap-1.5">
                  {languages.map((lang, index) => (
                    <motion.button
                      key={lang.code}
                      onClick={() => onSelect(lang.code)}
                      onKeyDown={(e) => handleKeyDown(e, lang.code)}
                      className={`
                        flex items-center justify-between px-3 py-2.5 rounded-lg transition-all
                        ${selectedLanguage === lang.code
                          ? 'bg-[#C5A059]/20 border border-[#C5A059]/50'
                          : 'hover:bg-white/5 border border-transparent'
                        }
                      `}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      role="option"
                      aria-selected={selectedLanguage === lang.code}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Native welcome text */}
                        <span className="text-lg font-medium text-white">
                          {lang.text}
                        </span>
                        {/* Language name */}
                        <span className="text-white/40 text-xs truncate">
                          {lang.language}
                        </span>
                      </div>

                      {/* Selected indicator */}
                      {selectedLanguage === lang.code && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-[#C5A059] rounded-full p-0.5 ml-1 flex-shrink-0"
                        >
                          <Check className="w-3 h-3 text-black" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-white/10">
                <p className="text-white/40 text-[10px] text-center">
                  Saved to your profile
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
