
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hammer, Mail, QrCode } from 'lucide-react';
import BetaSignupModal from '@/components/BetaSignupModal';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ThreePaths = () => {
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToMembership = () => {
    const element = document.getElementById('membership-tiers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/membership');
    }
  };

  return (
    <section className="bg-[#F5F1E8] py-20 px-4 -mt-20 relative z-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        
        {/* Path 1: Waitlist */}
        <motion.div 
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-gradient-to-br from-white to-[#F5F1E8] p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center border border-[#3B5998]/10"
        >
          <div className="p-4 bg-[#3B5998]/10 rounded-full mb-6 text-[#3B5998]">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-[#3B5998] mb-3 font-serif">Join the Waitlist</h3>
          <p className="text-[#3B5998]/70 font-light mb-8 leading-relaxed min-h-[3rem]">
            Get email updates on our launch, location announcements, and progress reports.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsBetaModalOpen(true)}
            className="mt-auto border-[#3B5998] text-[#3B5998] hover:bg-[#3B5998] hover:text-[#F5F1E8] transition-all uppercase tracking-wider text-xs font-bold px-8 py-6 rounded-lg w-full"
          >
            Sign Up
          </Button>
        </motion.div>

        {/* Path 2: Hull Pass - Highlighted */}
        <motion.div 
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-gradient-to-br from-[#3B5998] to-[#2a406e] p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center border-2 border-[#C5A059] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-[#C5A059] text-[#3B5998] text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase shadow-sm">
             Priority Access
          </div>
          <div className="p-4 bg-[#F5F1E8]/10 rounded-full mb-6 text-[#C5A059]">
            <QrCode className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-[#F5F1E8] mb-3 font-serif">Claim Hull Pass</h3>
          <p className="text-[#F5F1E8]/80 font-light mb-8 leading-relaxed min-h-[3rem]">
            Create a Free Account to access The Hull (Lobby) once we launch. Safe, clean, dignified.
          </p>
          <Button 
            onClick={() => setIsBetaModalOpen(true)}
            className="mt-auto bg-[#C5A059] text-[#3B5998] hover:bg-[#d4b06a] hover:text-[#3B5998] border-none transition-all uppercase tracking-wider text-xs font-bold px-8 py-6 rounded-lg w-full shadow-md"
          >
            Join the Beta
          </Button>
        </motion.div>

        {/* Path 3: Builder */}
        <motion.div 
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-gradient-to-br from-white to-[#F5F1E8] p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center border border-[#3B5998]/10"
        >
          <div className="p-4 bg-[#3B5998]/10 rounded-full mb-6 text-[#3B5998]">
            <Hammer className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-[#3B5998] mb-3 font-serif">Become a Builder</h3>
          <p className="text-[#3B5998]/70 font-light mb-8 leading-relaxed min-h-[3rem]">
            Help us break ground. Pre-purchase your passes today to fund the construction and lock in Founding Member status for life.
          </p>
          <Button 
            onClick={scrollToMembership}
            variant="outline"
            className="mt-auto border-[#3B5998] text-[#3B5998] hover:bg-[#3B5998] hover:text-[#F5F1E8] transition-all uppercase tracking-wider text-xs font-bold px-8 py-6 rounded-lg w-full"
          >
            Become a Founder
          </Button>
        </motion.div>

      </div>

      <BetaSignupModal 
        isOpen={isBetaModalOpen} 
        onClose={() => setIsBetaModalOpen(false)} 
      />
    </section>
  );
};

export default ThreePaths;
