
import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/HeroSection';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  UserCheck,    
  PanelTop,     
  Armchair,     
  Landmark,     
  BookOpen,     
  Handshake     
} from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // THE NEW "CLOUDS" MENU
  const menuItems = [
    { 
      label: "My Preferences",  
      sub: "Your Personal Setup", 
      icon: <UserCheck className="w-5 h-5" />, 
      path: "/profile" 
    },
    { 
      label: "The Hull", 
      sub: "Facility Access", 
      icon: <PanelTop className="w-5 h-5" />, 
      path: "/hull" 
    },
    { 
      label: "Sanctuary Suites", 
      sub: "Private Restoration", 
      icon: <Armchair className="w-5 h-5" />, 
      path: "/hull" 
    },
    { 
      label: "Civic Outreach", 
      sub: "Municipal Partners", 
      icon: <Landmark className="w-5 h-5" />, 
      path: "/impact" 
    },
    { 
      label: "Ethical Supply", 
      sub: "Our Partners", 
      icon: <Handshake className="w-5 h-5" />, 
      path: "/store" 
    },
    { 
      label: "Our Vision", 
      sub: "The Blueprint", // <--- CHANGED FROM "The Manifesto"
      icon: <BookOpen className="w-5 h-5" />, 
      path: "/vision" 
    },
  ];

  return (
    <div className="w-full h-screen overflow-hidden">
      <Helmet>
        <title>Maslow NYC</title>
      </Helmet>
      
      {user ? (
        <HeroSection variant="sanctuary">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 gap-3 w-full max-w-2xl mt-4 px-4"
          >
            {menuItems.map((item, index) => (
              <Button
                key={index}
                onClick={() => navigate(item.path)}
                variant="outline"
                className="
                  h-20 border-slate-200 bg-white/60 backdrop-blur-md 
                  hover:bg-sky-50 hover:border-sky-200 hover:text-[#3B5998]
                  text-slate-600 
                  transition-all duration-300 shadow-sm hover:shadow-md
                  flex flex-col items-center justify-center gap-1
                "
              >
                <div className="opacity-70">{item.icon}</div>
                <div className="flex flex-col leading-tight">
                  <span className="uppercase tracking-widest text-[10px] font-bold">{item.label}</span>
                  <span className="text-[8px] opacity-60 font-serif tracking-wide lowercase italic">{item.sub}</span>
                </div>
              </Button>
            ))}
          </motion.div>
          
          <p className="mt-8 text-slate-400 text-[9px] uppercase tracking-[0.3em]">
            System Status: Nominal
          </p>
        </HeroSection>
      ) : (
        <HeroSection variant="default" />
      )}
    </div>
  );
};

export default HomePage;