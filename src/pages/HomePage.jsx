
import React from 'react';
import HeroSection from '@/components/HeroSection';
import ProblemSolution from '@/components/ProblemSolution';
import DigitalWall from '@/components/DigitalWall';
import MembershipTiers from '@/components/MembershipTiers';
import GoalMeter from '@/components/GoalMeter';
import MissionSection from '@/components/MissionSection';
import MaslowPhilosophy from '@/components/MaslowPhilosophy';
import FinalCTA from '@/components/FinalCTA';

const HomePage = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {/* 1. Hero Section - Current Maslow Blue */}
      <div className="bg-[#465c9e]">
        <HeroSection />
      </div>
      
      {/* 2. Maslow Philosophy - White */}
      <div className="bg-white">
        <MaslowPhilosophy />
      </div>

      {/* 3. Problem Solution - White */}
      <div className="bg-white">
        <ProblemSolution />
      </div>

      {/* 4. Digital Wall - Dark Slate Blue (Alternative Dark) */}
      <div className="bg-slate-900">
        <DigitalWall />
      </div>

      {/* 5. Membership Tiers - Maslow Blue */}
      <div className="bg-[#465c9e]">
        <MembershipTiers />
      </div>

      {/* 6. Goal Meter - White */}
      <div className="bg-white">
        <GoalMeter />
      </div>

      {/* 7. Mission Section - Maslow Blue */}
      <div className="bg-[#465c9e]">
        <MissionSection />
      </div>

      {/* 8. Final CTA - White */}
      <div className="bg-white">
        <FinalCTA />
      </div>
    </div>
  );
};

export default HomePage;
