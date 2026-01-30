
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
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-b from-[#F5F1E8] to-[#E8DCC8] py-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col items-center mb-12"
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

          {/* Dr. Maslow Biography Section */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="max-w-3xl mx-auto"
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
        <HeroSection variant="default" />
      )}
    </div>
  );
};

export default HomePage;