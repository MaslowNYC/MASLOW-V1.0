
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative bg-[#F5F1E8] pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT COLUMN: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B5998]/10 text-[#3B5998] text-xs font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
            Live in NYC
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif text-[#3B5998] leading-[1.1] tracking-tight">
            The city is <br/>
            <span className="italic text-slate-800">relentless.</span><br/>
            Your sanctuary <br/>
            <span className="text-[#C5A059]">is here.</span>
          </h1>
          
          <p className="text-lg text-slate-600 max-w-md leading-relaxed">
            Maslow provides a network of private, hospital-grade smart suites for rest and sanitation. 
            Access dignity on demand, right from your phone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/membership">
              <Button className="h-14 px-8 bg-[#3B5998] hover:bg-[#2d4475] text-white rounded-full text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                Get Access <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/locations">
              <Button variant="outline" className="h-14 px-8 border-2 border-[#3B5998] text-[#3B5998] hover:bg-[#3B5998]/5 rounded-full text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Find a Suite
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: The Hero Image (Elevated & Backlit) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-0"
        >
          {/* THE BACKLIGHT GLOW */}
          <div className="absolute -inset-4 bg-[#C5A059] opacity-30 blur-3xl rounded-full pointer-events-none"></div>

          {/* THE IMAGE CONTAINER */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.01] transition-transform duration-700">
            <img 
              src="https://images.unsplash.com/photo-1551525091-64d8a0cb8b32?q=80&w=1974&auto=format&fit=crop" 
              alt="Maslow Sanctuary Suite Interior" 
              className="w-full h-[600px] object-cover"
            />
            
            {/* Subtle Gradient Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
            
            {/* Floating Badge */}
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50">
              <div className="text-[#3B5998] font-bold text-sm uppercase tracking-wider">Sanctuary Suite</div>
              <div className="text-slate-600 text-xs">Hygiene • Rest • Dignity</div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;