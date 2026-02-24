import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import HeroCarousel from '@/components/HeroCarousel';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import PreferencesModal from '@/components/PreferencesModal';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [showPreferences, setShowPreferences] = useState(false);

  // Check if we should show preferences modal on login
  useEffect(() => {
    const checkPreferences = async () => {
      if (!user) return;

      // Check if user has already seen/skipped the modal this session
      const sessionKey = `maslow_prefs_shown_${user.id}`;
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        const { data } = await (supabase
          .from('profiles') as any)
          .select('accessibility_settings')
          .eq('id', user.id)
          .single();

        // Show modal if user hasn't opted out
        const skipModal = data?.accessibility_settings?.skip_preferences_modal;
        if (!skipModal) {
          setShowPreferences(true);
        }

        // Mark as shown for this session
        sessionStorage.setItem(sessionKey, 'true');
      } catch (err) {
        console.error('Error checking preferences:', err);
      }
    };

    checkPreferences();
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Maslow NYC | The Infrastructure of Dignity</title>
      </Helmet>

      {/* Full-screen hero with carousel background */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Background Carousel */}
        <HeroCarousel />

        {/* Content Overlay */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          {user ? (
            // Logged in view - clean, no buttons
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-7xl font-serif font-bold mb-4 drop-shadow-lg">
                {t('home.welcomeBack')} {user.user_metadata?.full_name?.split(' ')[0] || 'Friend'}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light drop-shadow">
                {t('home.yourSanctuaryAwaits')}
              </p>
            </motion.div>
          ) : (
            // Logged out view
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-7xl md:text-8xl font-serif font-bold mb-6 drop-shadow-lg">
                MASLOW
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 mb-8 font-light drop-shadow">
                The Infrastructure of Dignity.
              </p>
              <p className="text-sm text-white/50 mt-4">
                {t('home.signUpCommunity')}
              </p>
            </motion.div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-white/60 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </section>

      {/* Preferences Modal - shown on first login */}
      <PreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </>
  );
};

export default HomePage;
