
import React from 'react';
import { Helmet } from 'react-helmet';
import RevenueSimulator from '@/components/RevenueSimulator';

const ReactorCorePage = () => {
  return (
    <div className="w-full bg-[#F5F1E8] min-h-screen pt-24 pb-12">
      <Helmet>
        <title>The Lotus | Maslow NYC</title>
        <meta name="description" content="Unfolding the layers of operational infrastructure." />
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B5998] mb-4">
            The Lotus
          </h1>
          <p className="text-[#3B5998]/80 text-lg max-w-2xl mx-auto font-light italic">
            "Like the lotus, dignity unfolds in layers."
          </p>
          <p className="text-[#C5A059] text-sm font-bold tracking-widest mt-4 uppercase">
            Internal Operations & Unit Economics
          </p>
        </div>
        
        <RevenueSimulator />
      </div>
    </div>
  );
};

export default ReactorCorePage;