
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const LocationsPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <Helmet>
        <title>Locations | Maslow NYC</title>
        <meta name="description" content="Visit our flagship SoHo location. The first of many sanctuaries." />
      </Helmet>

      <div className="bg-[#3B5998] text-[#F5F1E8] pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059] rounded-full filter blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif mb-6"
          >
            Locations
          </motion.h1>
          <p className="text-xl opacity-80 font-light">
            We are breaking ground on a network of dignity.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-20 pb-24">
        {/* SoHo Flagship Card */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-xl shadow-2xl overflow-hidden border border-[#C5A059]/20"
        >
            <div className="grid md:grid-cols-2">
                <div className="h-64 md:h-auto bg-gray-200 relative">
                     <img 
                        src="https://images.unsplash.com/photo-1555109307-f7d9da25c244?q=80&w=2073&auto=format&fit=crop" 
                        alt="SoHo Streets" 
                        className="w-full h-full object-cover grayscale"
                     />
                     <div className="absolute inset-0 bg-[#3B5998] mix-blend-multiply opacity-40"></div>
                     <div className="absolute top-4 left-4 bg-[#C5A059] text-[#3B5998] text-xs font-bold px-3 py-1 uppercase tracking-widest">
                        Flagship
                     </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-4xl font-serif text-[#3B5998] mb-2">SoHo</h2>
                    <p className="text-[#3B5998]/60 text-sm mb-8 uppercase tracking-wide">New York City</p>
                    
                    <div className="space-y-6 mb-8">
                        <div className="flex items-start gap-4">
                            <MapPin className="w-6 h-6 text-[#C5A059] mt-1" />
                            <div>
                                <span className="block font-bold text-[#3B5998]">Target Zone</span>
                                <span className="text-gray-600">Broadway & Prince St.</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Calendar className="w-6 h-6 text-[#C5A059] mt-1" />
                            <div>
                                <span className="block font-bold text-[#3B5998]">Opening Timeline</span>
                                <span className="text-gray-600">Late 2026</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#F5F1E8] p-6 rounded-lg border-l-4 border-[#C5A059]">
                        <p className="text-sm text-[#3B5998]/80 italic">
                            "Our flagship location redefines the intersection of commerce and community in one of the world's most iconic neighborhoods."
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Future Expansion */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
        >
            <h3 className="text-2xl font-serif text-[#3B5998] mb-8">Coming Soon</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Midtown', 'Williamsburg', 'Downtown Brooklyn', 'West Village'].map((loc) => (
                    <div key={loc} className="p-4 border border-[#3B5998]/10 rounded bg-white text-[#3B5998] font-bold opacity-50 cursor-not-allowed">
                        {loc}
                    </div>
                ))}
            </div>
            
            <div className="mt-16">
                 <Link to="/membership">
                    <Button className="bg-[#3B5998] text-white px-8 py-6 text-lg hover:bg-[#2d4474]">
                        Fund the Expansion <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                 </Link>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LocationsPage;
