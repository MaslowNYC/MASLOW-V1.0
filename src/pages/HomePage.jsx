
import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/HeroSection';
import ProblemSolution from '@/components/ProblemSolution';
import MissionSection from '@/components/MissionSection';
import HullSection from '@/components/HullSection';
import FinalCTA from '@/components/FinalCTA';

const HomePage = () => {
  return (
    <div className="w-full overflow-x-hidden bg-[#F5F1E8]">
      <Helmet>
        <title>Maslow NYC - The Infrastructure of Dignity</title>
        <meta name="description" content="New York City has 8 million people and only 1,100 public restrooms. Maslow is the sanctuary the city deserves." />
      </Helmet>
      
      {/* The Velvet Rope Hero serves as the intro */}
      <HeroSection />
      
      {/* The Rest of the Story (Visible to Insiders) */}
      <ProblemSolution />
      <MissionSection />
      <HullSection />
      <FinalCTA />
    </div>
  );
};

export default HomePage;