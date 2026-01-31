import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import RotatingLogo from '@/components/RotatingLogo';
import WelcomeMessages from '@/components/WelcomeMessages';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDoorClick = () => {
    if (!user) {
      navigate('/login');
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Helmet>
        <title>Maslow NYC</title>
      </Helmet>

      {user ? (
        /* LOGGED IN - Hero Placeholder (awaiting vanity image) */
        <div className="relative min-h-screen w-full">
          {/* Hero Section - Placeholder */}
          <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#2A406E] via-[#3B5998] to-[#1a2744]">
            {/* Elegant overlay */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Logo Placeholder - Will be replaced with vanity image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Logo with subtle glow */}
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-[#C5A059]/30 rounded-full"></div>
                <img
                  src="/MASLOW - Round.png"
                  alt="Maslow"
                  className="relative w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
                />
              </div>

              {/* Optional: Add text indicating this is a placeholder */}
              <p className="mt-8 text-white/40 text-xs uppercase tracking-[0.3em]">
                Vanity Image Coming Soon
              </p>
            </motion.div>

            {/* Welcome Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative z-10 mt-auto mb-16"
            >
              <WelcomeMessages />
            </motion.div>
          </div>

          {/* Dr. Maslow Biography Section - Scrollable Below */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-3xl mx-auto px-4 py-16 bg-gradient-to-b from-[#E8DCC8] to-[#F5F1E8]"
          >
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3B5998] tracking-tight mb-2">
                Dr. Abraham Maslow
              </h1>
              <p className="text-md text-[#3B5998]/70 font-medium">
                April 1, 1908 – June 8, 1970
              </p>
            </header>

            <p className="text-lg text-[#3B5998]/90 font-light leading-relaxed mb-6">
              Abraham Maslow was an American psychologist best known for creating <strong className="text-[#3B5998]">Maslow's hierarchy of needs</strong>, a theory of human motivation that places our most basic physical and emotional needs at the foundation, and the need for meaning and fulfillment at the top.
            </p>

            <h2 className="text-xl font-serif font-bold text-[#3B5998] mt-10 mb-3">
              The five levels of the hierarchy
            </h2>
            <p className="text-[#3B5998]/90 leading-relaxed mb-3">
              Maslow described human needs in five levels, often shown as a pyramid. Until the lower levels are reasonably met, the higher ones are harder to reach.
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-[#3B5998]/90 leading-relaxed mb-6">
              <li><strong className="text-[#3B5998]">Physiological</strong> — Air, water, food, shelter, sleep, basic bodily function. Without these, little else is possible.</li>
              <li><strong className="text-[#3B5998]">Safety</strong> — Security, stability, freedom from fear and harm. We need to feel safe before we can fully engage with others or ourselves.</li>
              <li><strong className="text-[#3B5998]">Belongingness and love</strong> — Connection, family, friendship, community. We are social beings who need to belong.</li>
              <li><strong className="text-[#3B5998]">Esteem</strong> — Respect, recognition, achievement, a sense of competence. We need to feel valued by others and by ourselves.</li>
              <li><strong className="text-[#3B5998]">Self-actualization</strong> — Becoming who we are capable of being: creativity, meaning, growth, and the pursuit of our highest potential.</li>
            </ol>

            <h2 className="text-xl font-serif font-bold text-[#3B5998] mt-10 mb-3">
              Why we bear his name
            </h2>
            <p className="text-[#3B5998]/90 leading-relaxed mb-6">
              Maslow understood that <strong className="text-[#3B5998]">dignity begins with meeting basic needs</strong>. You cannot ask someone to thrive, create, or participate fully in community if they don't have a safe place to rest, wash, or use the bathroom. Public restrooms are not a luxury; they are the base of the pyramid. Maslow NYC exists to meet that need with care—so that everyone in the city can move up the pyramid from a foundation of dignity.
            </p>

            <h2 className="text-xl font-serif font-bold text-[#3B5998] mt-10 mb-3">
              A digital memorial
            </h2>
            <p className="text-[#3B5998]/90 leading-relaxed mb-12">
              We hope one day to acquire <strong className="text-[#3B5998]">maslow.com</strong> and turn it into a proper digital memorial to Dr. Maslow—his life, his work, and his lasting influence on psychology and on how we think about human need and dignity. Until then, we carry his name and his insight into everything we build.
            </p>
          </motion.article>
        </div>
      ) : (
        /* LOGGED OUT - Door with Rotating Logo + Click to Enter */
        <div className="relative h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#F5F1E8] to-[#E8DCC8] overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col items-center cursor-pointer group"
            onClick={handleDoorClick}
          >
            {/* Restroom Door */}
            <div className="relative w-56 sm:w-64 md:w-80 h-80 sm:h-96 md:h-[28rem] bg-gradient-to-b from-[#3B5998] to-[#2A406E] rounded-lg shadow-2xl border-4 border-[#C5A059]/30 overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(197,160,89,0.5)]">
              {/* Door Frame Detail */}
              <div className="absolute inset-0 border-8 border-[#2A406E]/20 rounded-lg"></div>

              {/* Rotating Logo in Center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <RotatingLogo className="w-40 h-40 md:w-48 md:h-48" />
              </div>

              {/* Door Handle - Glows on Hover */}
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(197,160,89,0.8)]">
                <div className="w-3 h-12 bg-[#C5A059] rounded-full shadow-lg group-hover:bg-[#d4b36a]"></div>
                <div className="w-6 h-6 bg-[#C5A059] rounded-full -mt-3 -ml-1.5 shadow-lg group-hover:bg-[#d4b36a]"></div>
              </div>

              {/* Door Panels */}
              <div className="absolute inset-0 flex flex-col p-6 gap-4 opacity-20">
                <div className="flex-1 border-2 border-white/30 rounded"></div>
                <div className="flex-1 border-2 border-white/30 rounded"></div>
              </div>
            </div>

            {/* Enter Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-[#3B5998]/80 text-sm uppercase tracking-[0.3em] font-light mb-2">
                Click to
              </p>
              <p className="text-[#3B5998] text-2xl font-serif font-bold group-hover:text-[#C5A059] transition-colors">
                ENTER
              </p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;