
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HullSection = () => {
  return (
    <section className="py-24 bg-[#3B5998] text-[#F5F1E8] relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#C5A059]/5 skew-x-12 transform translate-x-1/4"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10 flex flex-col md:flex-row items-center gap-16">
        
        <div className="flex-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-12 bg-[#C5A059]"></div>
              <span className="text-[#C5A059] uppercase tracking-widest font-bold text-sm">The Experience</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              Enter The Hull.
            </h2>
            <p className="text-xl opacity-80 font-light leading-relaxed mb-8">
              More than a restroom. It is a pressure vessel for peace.
              <br/><br/>
              Beneath the city streets, we have carved out a space of radical hospitality. 
              Sound-dampened corridors, circadian lighting that mimics the sun, and the "Social Contract" ensure that your 15-minute respite restores you completely.
            </p>
            
            <Link to="/hull">
              <Button className="bg-[#C5A059] text-[#3B5998] hover:bg-white hover:text-[#3B5998] font-bold text-lg px-8 py-6 rounded-none transition-all">
                Explore The Design <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="flex-1 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square md:aspect-[4/3] rounded-sm overflow-hidden border-2 border-[#C5A059]/30 shadow-2xl"
          >
            {/* Abstract representation of The Hull */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#3B5998]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-32 h-32 border border-[#C5A059] rounded-full flex items-center justify-center opacity-80 animate-pulse">
                  <div className="w-24 h-24 bg-[#C5A059] rounded-full blur-2xl opacity-40"></div>
               </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Architecture</p>
              <p className="font-serif text-2xl">The Center</p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HullSection;