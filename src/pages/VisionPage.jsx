import React from 'react';
import { Helmet } from 'react-helmet';
import MissionSection from '@/components/MissionSection';
import HullSection from '@/components/HullSection';
import FinalCTA from '@/components/FinalCTA';
import { motion } from 'framer-motion';

const VisionPage = () => {
  return (
    <div className="w-full overflow-x-hidden bg-[#F5F1E8]">
      <Helmet>
        <title>Our Mission | Maslow NYC</title>
      </Helmet>
      
      <div className="bg-[#1E293B] text-[#F5F1E8] py-20 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-serif mb-4"
        >
          Our Collective Mission.
        </motion.h1>
        <p className="text-[#94A3B8] max-w-xl mx-auto uppercase tracking-widest text-xs">
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