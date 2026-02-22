import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/customSupabaseClient';

const STORAGE_KEY = 'maslow_preferred_language';
const DEFAULT_LANGUAGE = 'en';

interface UseLanguageReturn {
  language: string;
  setLanguage: (code: string) => Promise<void>;
  isLoading: boolean;
}

export function useLanguage(userId?: string): UseLanguageReturn {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<string>(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;
    }
    return DEFAULT_LANGUAGE;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync i18n with stored language on mount
  useEffect(() => {
    const storedLang = localStorage.getItem(STORAGE_KEY);
    if (storedLang && storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  // Load language from profile on mount (if user is logged in)
  useEffect(() => {
    const loadUserLanguage = async () => {
      if (!userId) return;

      try {
        const { data, error } = await (supabase
          .from('profiles') as any)
          .select('preferred_language')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error loading language preference:', error);
          return;
        }

        if (data?.preferred_language) {
          setLanguageState(data.preferred_language);
          localStorage.setItem(STORAGE_KEY, data.preferred_language);
          i18n.changeLanguage(data.preferred_language);
        }
      } catch (err) {
        console.error('Failed to load language:', err);
      }
    };

    loadUserLanguage();
  }, [userId, i18n]);

  // Set language and persist to Supabase + localStorage
  const setLanguage = useCallback(async (code: string) => {
    setIsLoading(true);
    setLanguageState(code);
    localStorage.setItem(STORAGE_KEY, code);

    // Update i18next language
    i18n.changeLanguage(code);

    // If user is logged in, save to profile
    if (userId) {
      try {
        const { error } = await (supabase
          .from('profiles') as any)
          .update({ preferred_language: code })
          .eq('id', userId);

        if (error) {
          console.error('Error saving language preference:', error);
        }
      } catch (err) {
        console.error('Failed to save language:', err);
      }
    }

    setIsLoading(false);
  }, [userId]);

  return { language, setLanguage, isLoading };
}

// Utility to detect browser language
export function detectBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;

  const browserLang = navigator.language || (navigator as any).userLanguage;

  // Map browser language codes to our supported languages
  const languageMap: Record<string, string> = {
    'en': 'en',
    'es': 'es',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-HK',
    'zh-HK': 'zh-HK',
    'zh': 'zh-CN',
    'fr': 'fr',
    'de': 'de',
    'it': 'it',
    'ja': 'ja',
    'ko': 'ko',
    'pt': 'pt',
    'ru': 'ru',
    'ar': 'ar',
    'hi': 'hi',
  };

  // Check for exact match first
  if (languageMap[browserLang]) {
    return languageMap[browserLang];
  }

  // Check for language without region
  const baseLang = browserLang.split('-')[0];
  if (languageMap[baseLang]) {
    return languageMap[baseLang];
  }

  return DEFAULT_LANGUAGE;
}

// Country to language mapping for geolocation detection
export const COUNTRY_LANGUAGE_MAP: Record<string, { language: string; name: string }> = {
  'MX': { language: 'es', name: 'Spanish' },
  'ES': { language: 'es', name: 'Spanish' },
  'AR': { language: 'es', name: 'Spanish' },
  'CO': { language: 'es', name: 'Spanish' },
  'CN': { language: 'zh-CN', name: 'Chinese' },
  'HK': { language: 'zh-HK', name: 'Cantonese' },
  'TW': { language: 'zh-HK', name: 'Chinese' },
  'FR': { language: 'fr', name: 'French' },
  'DE': { language: 'de', name: 'German' },
  'AT': { language: 'de', name: 'German' },
  'CH': { language: 'de', name: 'German' },
  'IT': { language: 'it', name: 'Italian' },
  'JP': { language: 'ja', name: 'Japanese' },
  'KR': { language: 'ko', name: 'Korean' },
  'BR': { language: 'pt', name: 'Portuguese' },
  'PT': { language: 'pt', name: 'Portuguese' },
  'RU': { language: 'ru', name: 'Russian' },
  'SA': { language: 'ar', name: 'Arabic' },
  'AE': { language: 'ar', name: 'Arabic' },
  'EG': { language: 'ar', name: 'Arabic' },
  'IN': { language: 'hi', name: 'Hindi' },
};
