
import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/HeroSection';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="w-full h-screen overflow-hidden">
      <Helmet>
        <title>Maslow NYC</title>
      </Helmet>

      {user ? (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#F5F1E8] to-[#E8DCC8]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col items-center"
          >
            {/* Restroom Door */}
            <div className="relative w-64 h-96 bg-gradient-to-b from-[#3B5998] to-[#2A406E] rounded-lg shadow-2xl border-4 border-[#C5A059]/30 overflow-hidden">
              {/* Door Frame Detail */}
              <div className="absolute inset-0 border-8 border-[#2A406E]/20 rounded-lg"></div>

              {/* Logo Circle - Centered */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/95 shadow-xl flex items-center justify-center border-4 border-[#C5A059]/50">
                <img
                  src="/MASLOW - Round.png"
                  alt="Maslow Logo"
                  className="w-28 h-28 object-contain"
                />
              </div>

              {/* Door Handle */}
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-12 bg-[#C5A059] rounded-full shadow-lg"></div>
                <div className="w-6 h-6 bg-[#C5A059] rounded-full -mt-3 -ml-1.5 shadow-lg"></div>
              </div>

              {/* Door Panels */}
              <div className="absolute inset-0 flex flex-col p-6 gap-4 opacity-20">
                <div className="flex-1 border-2 border-white/30 rounded"></div>
                <div className="flex-1 border-2 border-white/30 rounded"></div>
              </div>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 text-[#3B5998]/70 text-sm uppercase tracking-[0.3em] font-light"
            >
              Welcome Home
            </motion.p>
          </motion.div>
        </div>
      ) : (
        <HeroSection variant="default" />
      )}
    </div>
  );
};

export default HomePage;