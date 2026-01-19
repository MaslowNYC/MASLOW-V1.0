
import React from 'react';
import { Helmet } from 'react-helmet';
import RevenueSimulator from '@/components/RevenueSimulator';

const ReactorCorePage = () => {
  return (
    <div className="w-full bg-[#F5F1E8] min-h-screen pt-24 pb-12">
      <Helmet>
        <title>Reactor Core | Maslow NYC</title>
        <meta name="description" content="Operational metrics and financial simulation." />
      </Helmet>
      
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B5998] mb-8 text-center">
          The Reactor Core
        </h1>
        <p className="text-center text-[#3B5998]/80 text-lg mb-12 max-w-2xl mx-auto font-light">
          Real-time operational metrics and unit economics simulation.
        </p>
        
        <RevenueSimulator />
      </div>
    </div>
  );
};

export default ReactorCorePage;
