
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '@/components/HeroCarousel';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
            // Logged in view
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-7xl font-serif font-bold mb-4 drop-shadow-lg">
                Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'Friend'}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 font-light drop-shadow">
                Your sanctuary awaits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-[#C5A059] hover:bg-[#b08d4b] text-white shadow-xl text-lg px-8 py-6"
                  onClick={() => navigate('/pass')}
                >
                  View Your Pass
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white/20 shadow-xl text-lg px-8 py-6"
                  onClick={() => navigate('/locations')}
                >
                  Find a Location
                </Button>
              </div>
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
              <Button 
                size="lg" 
                className="bg-[#C5A059] hover:bg-[#b08d4b] text-white shadow-xl text-lg px-10 py-7"
                onClick={() => navigate('/signup')}
              >
                Join the Waitlist
              </Button>
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

      {/* Rest of your content goes here */}
      {/* Keep any other sections you have below the hero */}
    </>
  );
};

export default HomePage;