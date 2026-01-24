
import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ImpactPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8] pt-24 pb-12 px-4">
      <Helmet>
        <title>Impact | Maslow NYC</title>
        <meta name="description" content="Solving the public restroom crisis in New York City." />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#3B5998]">
            The Dignity Deficit
          </h1>
          <p className="text-xl text-[#3B5998]/70 max-w-2xl mx-auto font-light">
            New York City has 8.5 million residents, 60 million tourists, and only 1,103 public restrooms.
          </p>
        </div>

        {/* The Problem Data */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#3B5998]">The Problem</h2>
            <p className="text-[#3B5998]/80 leading-relaxed text-lg">
              For decades, public restrooms have been closed, neglected, or designed defensively. The result is a city where finding a safe, clean place to go is a daily struggle for parents, drivers, tourists, and the unhoused alike.
            </p>
          </div>
          <div className="bg-[#3B5998] p-8 rounded-2xl text-[#F5F1E8] shadow-lg">
            <h3 className="text-5xl font-bold mb-2 text-[#C5A059]">93rd</h3>
            <p className="opacity-90 font-medium">
              Rank among the 100 largest U.S. cities for restrooms per capita.
            </p>
          </div>
        </div>

        {/* The Maslow Solution */}
        <div className="space-y-8 text-center border-t border-[#3B5998]/10 pt-16">
          <h2 className="text-3xl font-serif font-bold text-[#3B5998]">The Maslow Standard</h2>
          <p className="text-lg text-[#3B5998]/80 max-w-3xl mx-auto">
            We are building a network of "Hulls"—staffed, secure, and sacred spaces for rest and hygiene. By combining a free public access tier with premium private suites, we create a sustainable model for urban dignity.
          </p>
          
          <div className="pt-4">
            <Link to="/hull">
              <Button className="bg-[#C5A059] text-white hover:bg-[#b08d4b] px-8 py-6 text-lg rounded-md uppercase tracking-widest">
                Enter The Hull
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactPage;