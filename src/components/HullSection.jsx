
import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Snowflake, Wifi, Hand, Accessibility, BatteryCharging, Layout, DoorOpen, ShieldCheck, Zap, HardHat } from 'lucide-react';
import HullPassMockup from '@/components/HullPassMockup';

const HullSection = () => {
  return (
    <section className="bg-[#3B5998] pt-20 pb-0 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Architecture Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8 text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-serif text-[#F5F1E8] mb-6">
            The Reactor Core Design
          </h3>
          <p className="text-xl text-[#F5F1E8]/80 max-w-3xl mx-auto font-light leading-relaxed">
            Our "Concentric Horseshoe" architecture creates a secure, self-sustaining ecosystem that balances public access with private utility.
          </p>
        </motion.div>

        {/* Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          
          {/* 1. The Entry */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#F5F1E8] rounded-xl p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DoorOpen className="w-24 h-24 text-[#3B5998]" />
            </div>
            <h4 className="text-2xl font-serif font-bold text-[#3B5998] mb-4 flex items-center gap-3">
              <span className="bg-[#C5A059] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              The Entry
            </h4>
            <p className="text-[#3B5998]/80 leading-relaxed font-medium">
              Designed for New York's seasons. In summer, the entire storefront rolls up via garage doors to welcome the street breeze. In winter, an accessible "wicket door" preserves warmth while maintaining our open invitation to the city.
            </p>
          </motion.div>

          {/* 2. The Center (Hull) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#3B5998] border-2 border-[#C5A059] rounded-xl p-8 relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Layout className="w-24 h-24 text-[#F5F1E8]" />
            </div>
            <h4 className="text-2xl font-serif font-bold text-[#F5F1E8] mb-4 flex items-center gap-3">
              <span className="bg-[#C5A059] text-[#3B5998] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              The Center: "The Hull"
            </h4>
            <p className="text-[#F5F1E8]/90 leading-relaxed">
              The heart of the facility. An open-air atrium and <span className="text-[#C5A059] font-bold">free public sanctuary</span>. This is the town hall of the space—a safe, monitored zone for hydration, device charging, and community connection.
            </p>
          </motion.div>

          {/* 3. The Perimeter (Suites) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#2a4070] rounded-xl p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-24 h-24 text-[#C5A059]" />
            </div>
            <h4 className="text-2xl font-serif font-bold text-[#C5A059] mb-4 flex items-center gap-3">
              <span className="bg-[#F5F1E8] text-[#3B5998] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              The Perimeter: "The Suites"
            </h4>
            <p className="text-[#F5F1E8]/80 leading-relaxed">
              Surrounding the Hull is a ring of private, soundproof <span className="text-[#F5F1E8] font-bold">Maslow Suites</span>. These are the revenue-generating utility units—hospital-grade private restrooms available via membership or pay-per-use.
            </p>
          </motion.div>

          {/* 4. The Phantom Corridor */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#F5F1E8] rounded-xl p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-24 h-24 text-[#3B5998]" />
            </div>
            <h4 className="text-2xl font-serif font-bold text-[#3B5998] mb-4 flex items-center gap-3">
              <span className="bg-[#C5A059] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              The Phantom Corridor
            </h4>
            <p className="text-[#3B5998]/80 leading-relaxed font-medium">
              The secret to our operations. A hidden service alley runs behind the suites, allowing staff to clean, restock, and maintain utilities from the rear without ever entering the public lobby or disrupting the user experience.
            </p>
          </motion.div>

        </div>

        {/* Free Amenities */}
        <div className="bg-[#3B5998]/50 border-t border-[#F5F1E8]/20 pt-16 pb-16">
            <h4 className="text-center text-[#C5A059] font-bold tracking-widest uppercase mb-12">Included in The Hull (Free Access)</h4>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="flex flex-col items-center gap-3 w-32">
              <Wifi className="w-10 h-10 text-[#F5F1E8]" />
              <span className="text-[#F5F1E8]/80 text-sm font-medium text-center">Free Wifi</span>
            </div>
            <div className="flex flex-col items-center gap-3 w-32">
              <Droplets className="w-10 h-10 text-[#F5F1E8]" />
              <span className="text-[#F5F1E8]/80 text-sm font-medium text-center">Filtered Water</span>
            </div>
            <div className="flex flex-col items-center gap-3 w-32">
              <Hand className="w-10 h-10 text-[#F5F1E8]" />
              <span className="text-[#F5F1E8]/80 text-sm font-medium text-center">Hand Washing</span>
            </div>
            <div className="flex flex-col items-center gap-3 w-32">
              <Accessibility className="w-10 h-10 text-[#F5F1E8]" />
              <span className="text-[#F5F1E8]/80 text-sm font-medium text-center">Accessible</span>
            </div>
            <div className="flex flex-col items-center gap-3 w-32">
              <Snowflake className="w-10 h-10 text-[#F5F1E8]" />
              <span className="text-[#F5F1E8]/80 text-sm font-medium text-center">Ice</span>
            </div>
            <div className="flex flex-col items-center gap-3 w-32">
              <BatteryCharging className="w-10 h-10 text-[#F5F1E8]" />
              <span className="text-[#F5F1E8]/80 text-sm font-medium text-center">Power</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Economics of Dignity Section */}
      <div className="w-full bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] py-24 border-t border-[#C5A059]/30 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center justify-center p-3 bg-[#C5A059]/10 rounded-full mb-6 border border-[#C5A059]/30">
                  <HardHat className="w-8 h-8 text-[#C5A059]" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight uppercase">
                    The Unit Economics of Dignity
                </h2>
                <div className="h-1 w-24 bg-[#C5A059] mx-auto mb-10"></div>
                <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-4xl mx-auto">
                    "We reject value engineering. We dig deep. We strip the building to its shell and rebuild from the dirt up—ensuring hospital-grade sanitation and prison-grade durability. We do not cover problems with luxury finishes; we solve them with heavy infrastructure."
                </p>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HullSection;
