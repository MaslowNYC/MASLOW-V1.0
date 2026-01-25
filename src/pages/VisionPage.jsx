
import React from 'react';
import { Helmet } from 'react-helmet';
import MissionSection from '@/components/MissionSection';
import HullSection from '@/components/HullSection';
import FinalCTA from '@/components/FinalCTA';
import { motion } from 'framer-motion';

const VisionPage = () => {
  return (
    <div className="w-full overflow-x-hidden bg-white">
      <Helmet>
        <title>Our Mission | Maslow NYC</title>
      </Helmet>
      
      {/* Airy Sky Gradient Header */}
      <div className="bg-gradient-to-b from-sky-50 to-white py-24 px-6 text-center border-b border-slate-100">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-serif mb-4 text-slate-900"
        >
          Our Collective Mission.
        </motion.h1>
        <p className="text-[#3B5998] max-w-xl mx-auto uppercase tracking-[0.3em] text-[10px] font-bold">
          The Blueprint for Dignity
        </p>
      </div>

      <MissionSection />
      <HullSection />
      <FinalCTA />
    </div>
  );
};

export default VisionPage;