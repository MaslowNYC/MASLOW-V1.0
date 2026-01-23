
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Wind, Zap, Droplets, Eye, Server } from 'lucide-react';

const ReactorCorePage = () => {
  const systems = [
    {
      icon: <Wind className="w-12 h-12 text-[#C5A059]" />,
      title: "Atmospheric Scrubbing",
      desc: "Hospital-grade HEPA-14 filtration cycles the air 12 times per hour. Negative pressure zones ensure odors never leave the suite."
    },
    {
      icon: <Droplets className="w-12 h-12 text-[#C5A059]" />,
      title: "Auto-Sanitization",
      desc: "UV-C light arrays and steam-injection nozzles sanitize surfaces between every single visit. It is cleaner than your home."
    },
    {
      icon: <Eye className="w-12 h-12 text-[#C5A059]" />,
      title: "Biometric Security",
      desc: "Access is strictly controlled via app-generated QR codes. Our spaces are monitored 24/7 by active sensors (privacy preserved)."
    },
    {
      icon: <Server className="w-12 h-12 text-[#C5A059]" />,
      title: "Predictive Maintenance",
      desc: "IoT sensors monitor water pressure, soap levels, and paper supply in real-time. We restock before you even know it's low."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-[#3B5998] text-[#F5F1E8]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-widest mb-6">
              Reactor Core
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-80 max-w-3xl mx-auto">
              The Infrastructure of Dignity. See the engineering that keeps Maslow safe, clean, and private.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Systems Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {systems.map((sys, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-xl shadow-xl border border-[#3B5998]/10 hover:border-[#C5A059] transition-colors group"
              >
                <div className="mb-6 bg-[#3B5998]/5 w-24 h-24 rounded-full flex items-center justify-center group-hover:bg-[#3B5998] transition-colors duration-300">
                  <div className="text-[#C5A059] group-hover:text-[#F5F1E8] transition-colors duration-300">
                    {sys.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#3B5998] mb-4 font-serif">{sys.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {sys.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="py-20 bg-[#C5A059] text-[#3B5998] text-center px-6">
        <h2 className="text-3xl font-black uppercase tracking-wider mb-8">This is Public Utility meets Private Luxury.</h2>
        <div className="flex justify-center gap-4">
            <Shield className="w-8 h-8" />
            <Zap className="w-8 h-8" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReactorCorePage;