
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Zap } from 'lucide-react';

const MissionSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3B5998] mb-6">
            The Maslow Standard
          </h2>
          <p className="text-lg md:text-xl text-[#3B5998]/70 leading-relaxed font-light">
            We aren't just building restrooms. We are building a self-sustaining infrastructure for human dignity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#F5F1E8] p-8 rounded-2xl border border-[#3B5998]/10 hover:border-[#C5A059] transition-all group"
          >
            <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7 text-[#C5A059]" />
            </div>
            <h3 className="text-xl font-bold text-[#3B5998] mb-3">Sanctuary</h3>
            <p className="text-[#3B5998]/70 leading-relaxed">
              Safe, staffed, and spotless. Every location features the "Hull"—a protected public commons—and private suites for total isolation.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-[#F5F1E8] p-8 rounded-2xl border border-[#3B5998]/10 hover:border-[#C5A059] transition-all group"
          >
            <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-[#C5A059]" />
            </div>
            <h3 className="text-xl font-bold text-[#3B5998] mb-3">Economic Engine</h3>
            <p className="text-[#3B5998]/70 leading-relaxed">
              A sustainable model. Revenue from premium memberships and retail partners subsidizes the maintenance of the public infrastructure.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-[#F5F1E8] p-8 rounded-2xl border border-[#3B5998]/10 hover:border-[#C5A059] transition-all group"
          >
            <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <Heart className="w-7 h-7 text-[#C5A059]" />
            </div>
            <h3 className="text-xl font-bold text-[#3B5998] mb-3">Impact</h3>
            <p className="text-[#3B5998]/70 leading-relaxed">
              Profit with purpose. A portion of every transaction funds the <span className="font-bold">Maslow Non-Profit</span>, bringing facilities to underserved neighborhoods.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MissionSection;