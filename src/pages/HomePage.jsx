
import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/HeroSection';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { User, MapPin, BookOpen, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // THE SUITE MENU ITEMS
  const menuItems = [
    { label: "My Concierge", icon: <User className="w-4 h-4" />, path: "/profile" },
    { label: "The Hull", icon: <MapPin className="w-4 h-4" />, path: "/hull" },
    { label: "Our Vision", icon: <BookOpen className="w-4 h-4" />, path: "/vision" },
    { label: "Impact", icon: <Heart className="w-4 h-4" />, path: "/impact" },
  ];

  return (
    <div className="w-full h-screen overflow-hidden">
      <Helmet>
        <title>Maslow NYC</title>
      </Helmet>
      
      {user ? (
        /* --- LOGGED IN: THE SUITE VIEW --- */
        <HeroSection variant="sanctuary">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mt-4"
          >
            {menuItems.map((item, index) => (
              <Button
                key={index}
                onClick={() => navigate(item.path)}
                variant="outline"
                className="
                  h-16 border-[#3B5998]/20 bg-white/50 backdrop-blur-sm 
                  hover:bg-[#3B5998] hover:text-white hover:border-[#3B5998]
                  text-[#3B5998] uppercase tracking-widest text-xs font-semibold
                  transition-all duration-300 shadow-sm
                  flex flex-col gap-1 items-center justify-center
                "
              >
                <span className="opacity-50 mb-1">{item.icon}</span>
                {item.label}
              </Button>
            ))}
          </motion.div>
          
          <p className="mt-8 text-[#3B5998]/40 text-[10px] uppercase tracking-[0.3em]">
            Sanctuary Status: Active
          </p>
        </HeroSection>
      ) : (
        /* --- PUBLIC: THE VELVET ROPE --- */
        /* HeroSection handles the default view internally, so we pass nothing */
        <HeroSection variant="default" />
      )}
    </div>
  );
};

export default HomePage;