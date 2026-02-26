import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import es from './locales/es.json';
import zh from './locales/zh.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import ru from './locales/ru.json';
import he from './locales/he.json';

// Translation resources
const resources = {
  en: { translation: en },
  es: { translation: es },
  'zh-CN': { translation: zh },
  fr: { translation: fr },
  ja: { translation: ja },
  de: { translation: de },
  it: { translation: it },
  pt: { translation: pt },
  ko: { translation: ko },
  ar: { translation: ar },
  ru: { translation: ru },
  hi: { translation: hi },
  he: { translation: he },
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'maslow_preferred_language',
      caches: ['localStorage'],
    },
  });

export default i18n;
