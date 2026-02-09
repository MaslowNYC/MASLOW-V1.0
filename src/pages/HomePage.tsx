import React from 'react';
import { Helmet } from 'react-helmet';
import HeroCarousel from '@/components/HeroCarousel';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { user } = useAuth();

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
                Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'Friend'}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light drop-shadow">
                Your sanctuary awaits.
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
                Sign up to join our community and receive updates.
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
    </>
  );
};

export default HomePage;
