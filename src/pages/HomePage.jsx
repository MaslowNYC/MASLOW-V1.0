
import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/HeroSection';
import MissionSection from '@/components/MissionSection';
import HullSection from '@/components/HullSection';
import FinalCTA from '@/components/FinalCTA';

const HomePage = () => {
  return (
    <div className="w-full overflow-x-hidden bg-[#F5F1E8]">
      <Helmet>
        <title>Maslow NYC - The Infrastructure of Dignity</title>
      </Helmet>
      
      {/* The Sanctuary Hero (Heaven Mode) */}
      <HeroSection variant="sanctuary" />
      
      {/* The Rest of the Story (Visible to Insiders) */}
      <MissionSection />
      <HullSection />
      <FinalCTA />
    </div>
  );
};

export default HomePage;