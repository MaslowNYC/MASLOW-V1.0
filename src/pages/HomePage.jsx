
import React from 'react';
import HeroSection from '@/components/HeroSection';
import ProblemSolution from '@/components/ProblemSolution';
import MissionSection from '@/components/MissionSection';
import HullSection from '@/components/HullSection';
import FinalCTA from '@/components/FinalCTA';
import { Helmet } from 'react-helmet';

const HomePage = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Helmet>
        <title>Maslow NYC - The Infrastructure of Dignity</title>
        <meta name="description" content="New York City has 8 million people and only 1,100 public restrooms. Maslow is the sanctuary the city deserves." />
      </Helmet>
      
      <HeroSection />
      <ProblemSolution />
      <MissionSection />
      <HullSection />
      <FinalCTA />
    </div>
  );
};

export default HomePage;