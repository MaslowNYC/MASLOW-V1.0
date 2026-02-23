
import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import HeroImage from '@/components/HeroImage';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import LanguageBubble from '@/components/LanguageBubble';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';

// "Get In Line" variations from around the world
// Each one "corrects" the previous - a celebration of how humans wait
const LINE_VARIATIONS = [
  // English variations (marked with isEnglish for interleaving)
  { text: 'Get In Line', region: 'American English', isEnglish: true },
  { text: 'Get ON Line', region: 'New York City', isEnglish: true },
  { text: 'Join the Queue', region: 'British English', isEnglish: true },
  { text: 'Queue Up', region: 'UK / Australia', isEnglish: true },
  { text: 'Line Up', region: 'Canadian English', isEnglish: true },
  { text: 'Fall In', region: 'Military English', isEnglish: true },
  { text: 'Take Your Place', region: 'Formal English', isEnglish: true },
  { text: 'Hop In Line', region: 'Casual American', isEnglish: true },
  { text: 'Stand in Line', region: 'Ireland', isEnglish: true },
  { text: 'Get in the Queue', region: 'Scotland', isEnglish: true },
  { text: 'Form a Queue', region: 'New Zealand', isEnglish: true },
  { text: 'Wait in Line', region: 'Midwestern US', isEnglish: true },

  // Spanish variations
  { text: 'Hacer Cola', region: 'España' },
  { text: 'Ponerse en la Fila', region: 'México' },
  { text: 'Hacer Fila', region: 'América Latina' },
  { text: 'Meterse en la Cola', region: 'Argentina' },
  { text: 'Formar Fila', region: 'Colombia' },
  { text: 'Colocarse en la Fila', region: 'Venezuela' },

  // Portuguese variations
  { text: 'Entrar na Fila', region: 'Brasil' },
  { text: 'Pegar a Fila', region: 'Brasil (coloquial)' },
  { text: 'Fazer Fila', region: 'Portugal' },
  { text: 'Entrar na Bicha', region: 'Portugal (coloquial)' },

  // French variations
  { text: 'Faire la Queue', region: 'France' },
  { text: 'Se Mettre en File', region: 'Québec' },
  { text: 'Prendre la File', region: 'Belgique' },
  { text: 'Faire la File', region: 'Suisse' },

  // German variations
  { text: 'Anstellen', region: 'Deutschland' },
  { text: 'In die Schlange Stellen', region: 'Österreich' },
  { text: 'Einreihen', region: 'Schweiz' },
  { text: 'Sich Anstellen', region: 'Formal Deutsch' },

  // Italian variations
  { text: 'Fare la Fila', region: 'Italia' },
  { text: 'Mettersi in Coda', region: 'Italia (Nord)' },
  { text: 'Fare la Coda', region: 'Italia (Sud)' },

  // Chinese variations
  { text: '排队', region: '中国大陆' },
  { text: '排隊', region: '台灣' },
  { text: '排隊等候', region: '香港' },
  { text: '轮候', region: '新加坡' },

  // Japanese variations
  { text: '列に並ぶ', region: '日本' },
  { text: '並んで待つ', region: '日本 (丁寧)' },
  { text: '順番を待つ', region: '日本 (フォーマル)' },

  // Korean variations
  { text: '줄서기', region: '한국' },
  { text: '줄을 서다', region: '한국 (정중)' },
  { text: '대기하다', region: '한국 (공식)' },

  // Arabic variations
  { text: 'انضم للطابور', region: 'الفصحى' },
  { text: 'قف في الصف', region: 'مصر' },
  { text: 'خذ دورك', region: 'الخليج' },
  { text: 'استنى دورك', region: 'لبنان' },
  { text: 'وقّف بالصف', region: 'الأردن' },
  { text: 'ادخل الطابور', region: 'السعودية' },
  { text: 'قيّد في الطابور', region: 'اليمن' },
  { text: 'خش الطابور', region: 'السودان' },

  // Russian variations
  { text: 'Встать в Очередь', region: 'Россия' },
  { text: 'Занять Очередь', region: 'Россия (разг.)' },
  { text: 'Стать в Чергу', region: 'Україна' },

  // Hindi variations
  { text: 'लाइन में लगें', region: 'भारत' },
  { text: 'कतार में लगें', region: 'भारत (औपचारिक)' },
  { text: 'क़तार में आएं', region: 'उर्दू' },

  // Hebrew variations
  { text: 'הצטרף לתור', region: 'ישראל' },
  { text: 'עמוד בתור', region: 'ישראל (רשמי)' },
  { text: 'קח תור', region: 'ישראל (דיבור)' },

  // Dutch variations
  { text: 'In de Rij Gaan Staan', region: 'Nederland' },
  { text: 'Aanschuiven', region: 'België' },

  // Polish variations
  { text: 'Ustawić się w Kolejce', region: 'Polska' },
  { text: 'Stanąć w Kolejce', region: 'Polska (potoczny)' },

  // Turkish variations
  { text: 'Sıraya Gir', region: 'Türkiye' },
  { text: 'Kuyruğa Gir', region: 'Türkiye (günlük)' },

  // Greek variations
  { text: 'Μπες στην Ουρά', region: 'Ελλάδα' },
  { text: 'Πάρε Σειρά', region: 'Κύπρος' },

  // Swedish variations
  { text: 'Ställ Dig i Kön', region: 'Sverige' },
  { text: 'Köa', region: 'Sverige (vardagligt)' },

  // Norwegian variations
  { text: 'Stå i Kø', region: 'Norge' },
  { text: 'Still Deg i Køen', region: 'Norge (formelt)' },

  // Danish variations
  { text: 'Stå i Kø', region: 'Danmark' },
  { text: 'Stil Dig i Køen', region: 'Danmark (formelt)' },

  // Finnish variations
  { text: 'Jonoon', region: 'Suomi' },
  { text: 'Mene Jonoon', region: 'Suomi (virallinen)' },

  // Thai variations
  { text: 'ต่อแถว', region: 'ไทย' },
  { text: 'เข้าแถว', region: 'ไทย (ทางการ)' },

  // Vietnamese variations
  { text: 'Xếp Hàng', region: 'Việt Nam' },
  { text: 'Vào Hàng', region: 'Việt Nam (miền Nam)' },

  // Indonesian variations
  { text: 'Antre', region: 'Indonesia' },
  { text: 'Mengantri', region: 'Indonesia (formal)' },

  // Malay variations
  { text: 'Beratur', region: 'Malaysia' },
  { text: 'Berbaris', region: 'Malaysia (formal)' },

  // Tagalog/Filipino variations
  { text: 'Pumila', region: 'Pilipinas' },
  { text: 'Sumali sa Pila', region: 'Pilipinas (pormal)' },

  // Swahili variations
  { text: 'Simama Kwenye Foleni', region: 'Kenya / Tanzania' },
  { text: 'Ingia Foleni', region: 'Afrika Mashariki' },

  // Yoruba (Nigeria)
  { text: 'Dúró Ní Ìlà', region: 'Nigeria (Yorùbá)' },

  // Zulu (South Africa)
  { text: 'Yima Emgqeni', region: 'South Africa (isiZulu)' },

  // Haitian Creole
  { text: 'Fè Liy', region: 'Ayiti' },

  // Hawaiian
  { text: 'E Kū i ka Laina', region: 'Hawaiʻi' },

  // Irish Gaelic
  { text: 'Seas sa Scuaine', region: 'Éire' },

  // Scottish Gaelic
  { text: 'Seas san t-Sreath', region: 'Alba' },

  // Welsh
  { text: 'Sefwch yn y Ciw', region: 'Cymru' },

  // Catalan
  { text: 'Fer Cua', region: 'Catalunya' },

  // Basque
  { text: 'Ilaran Jarri', region: 'Euskadi' },
];

// Shuffle array helper
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Create interleaved array with English every 3 options (NYC-based app)
const createInterleavedVariations = () => {
  const english = shuffleArray(LINE_VARIATIONS.filter(v => v.isEnglish));
  const nonEnglish = shuffleArray(LINE_VARIATIONS.filter(v => !v.isEnglish));

  const result: typeof LINE_VARIATIONS = [];
  let engIndex = 0;
  let nonEngIndex = 0;

  // Pattern: English, non-English, non-English, English, non-English, non-English...
  while (engIndex < english.length || nonEngIndex < nonEnglish.length) {
    // Add English variation at positions 0, 3, 6, 9...
    if (engIndex < english.length) {
      result.push(english[engIndex++]);
    }
    // Add 2 non-English variations
    for (let i = 0; i < 2 && nonEngIndex < nonEnglish.length; i++) {
      result.push(nonEnglish[nonEngIndex++]);
    }
  }

  return result;
};

interface HeroSectionProps {
  variant?: 'default' | 'sanctuary';
  children?: ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({ variant = 'default', children }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isSanctuary = variant === 'sanctuary';
  const FOUNDER_SEED_COUNT = 254;
  const [memberCount, setMemberCount] = useState<number>(FOUNDER_SEED_COUNT);
  const { language, setLanguage } = useLanguage();

  // Rotating "Get In Line" button state - English every 3 options for NYC
  const [lineVariations] = useState(() => createInterleavedVariations());
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // Fetch the live member count to show "Scarcity/Demand"
  useEffect(() => {
    if (isSanctuary) return;
    const fetchCount = async (): Promise<void> => {
      try {
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: betaCount } = await supabase.from('beta_signups').select('*', { count: 'exact', head: true });
        setMemberCount(FOUNDER_SEED_COUNT + (userCount || 0) + (betaCount || 0));
      } catch (err) { console.error(err); }
    };
    fetchCount();
  }, [isSanctuary]);

  // Rotate through line variations every 2.5 seconds
  useEffect(() => {
    if (isSanctuary) return;
    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => (prev + 1) % lineVariations.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isSanctuary, lineVariations.length]);

  const currentLine = lineVariations[currentLineIndex];

  return (
    <section className={`relative min-h-[100dvh] w-full flex flex-col items-center justify-center py-24 overflow-hidden`}>
      {/* Language Selection Bubble - only show on public view */}
      {!isSanctuary && (
        <LanguageBubble
          onLanguageSelect={setLanguage}
          selectedLanguage={language}
        />
      )}

      {/* BACKGROUND LAYER - "The Vibe" */}
      {isSanctuary ? (
        <>
           <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-50 to-white" />
           <div className="absolute inset-0 z-0 bg-white/60" />
        </>
      ) : (
        /* Dark Mode for the Velvet Rope (Public Face) */
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0F172A] via-[#020617] to-black" />
      )}

      {/* CONTENT LAYER */}
      <div className="relative z-20 flex flex-col items-center gap-8 max-w-md w-full px-6">

        {/* LOGO AREA - "The Artifact" */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
        >
          {/* The Pulse/Glow behind the logo */}
          <div className={`absolute inset-0 blur-[60px] rounded-full animate-pulse ${isSanctuary ? 'bg-sky-200 opacity-40' : 'bg-[#C5A059] opacity-10'}`}></div>

          {/* This uses your custom HeroImage component to render the Logo */}
          <HeroImage className={`w-32 h-32 md:w-56 md:h-56 drop-shadow-2xl transition-all duration-1000 ${isSanctuary ? 'brightness-105 contrast-100' : ''}`} />
        </motion.div>

        {/* HEADER TEXT - "The Mission" */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center space-y-8 w-full"
        >
          <div>
            <h1 className={`${isSanctuary ? 'text-slate-800' : 'text-[#F5F1E8]'} text-sm md:text-lg font-serif tracking-[0.25em] uppercase mb-4 opacity-90 transition-colors duration-1000`}>
              The Infrastructure of Dignity
            </h1>
            <div className={`w-8 h-0.5 mx-auto opacity-60 mb-8 transition-colors duration-1000 ${isSanctuary ? 'bg-[#3B5998]' : 'bg-[#C5A059]'}`}></div>
          </div>

          {/* DYNAMIC CONTENT */}
          {children ? (
             <div className="space-y-4 w-full">{children}</div>
          ) : (
            /* DEFAULT PUBLIC VIEW (THE VELVET ROPE) */
            <>
              {/* The Live Counter */}
              <div className="space-y-1 mb-8">
                <p className="text-[#94A3B8] text-[10px] uppercase tracking-[0.3em] font-medium">{t('hero.waitlistPosition')}</p>
                <div className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tighter tabular-nums">#{memberCount}</div>
              </div>

              {/* The Action Buttons */}
              <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                {/* Rotating "Get In Line" Button */}
                <div className="relative h-[52px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentLineIndex}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                        mass: 0.8,
                      }}
                      className="absolute inset-0"
                    >
                      <Button
                        onClick={() => navigate('/login?mode=signup')}
                        className="w-full h-full bg-transparent border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0F172A] text-xs font-bold uppercase tracking-[0.15em] rounded-sm transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <span className="truncate">{currentLine.text}</span>
                        <ArrowRight className="w-4 h-4 flex-shrink-0" />
                      </Button>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Region indicator */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentLineIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#94A3B8]/40 text-[9px] uppercase tracking-[0.2em] text-center -mt-2"
                  >
                    {currentLine.region}
                  </motion.p>
                </AnimatePresence>

                <Button
                  variant="link"
                  onClick={() => navigate('/login')}
                  className="w-full text-[#94A3B8]/30 hover:text-[#C5A059] text-[10px] uppercase tracking-widest h-auto py-2 p-0"
                >
                  <Lock className="w-3 h-3 mr-2" /> {t('hero.memberAccess')}
                </Button>
              </div>
            </>
          )}
        </motion.div>

      </div>
         </section>
  );
};

export default HeroSection;
