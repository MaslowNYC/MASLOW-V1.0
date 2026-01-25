
import React from 'react';
import { motion } from 'framer-motion';

const MissionSection = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#F5F1E8] text-[#1a1a1a]">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Intro */}
        <div className="text-center space-y-6">
          <motion.div 
             initial={{ opacity: 0 }} 
             whileInView={{ opacity: 1 }} 
             viewport={{ once: true }}
             className="w-12 h-0.5 bg-[#C5A059] mx-auto"
          ></motion.div>
          <h2 className="text-3xl md:text-4xl font-serif leading-tight">
            Public sanitation is not a luxury.<br/>
            It is the baseline of civilization.
          </h2>
        </div>

        {/* The Problem / Solution Grid */}
        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]">The Crisis</h3>
            <p className="font-serif text-2xl leading-snug">
              New York City has 1 public restroom for every 7,000 residents.
            </p>
            <p className="text-[#1a1a1a]/70 leading-relaxed">
              For decades, the city has failed to provide basic infrastructure for human needs. 
              The result is a public health hazard and a daily indignity for millions.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#3B5998]">The Blueprint</h3> {/* <--- CHANGED FROM MANIFESTO */}
            <p className="font-serif text-2xl leading-snug">
              A private network for the public good.
            </p>
            <p className="text-[#1a1a1a]/70 leading-relaxed">
              We are building a grid of high-dignity, secure, and maintained facilities. 
              Accessible to members via digital key, and maintained by a fair-wage workforce.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MissionSection;