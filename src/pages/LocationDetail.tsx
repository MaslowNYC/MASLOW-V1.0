
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { MapPin, Clock, Calendar, Sun, Volume2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LocationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Flagship Content (SoHo)
  if (slug === 'soho') {
    return (
      <div className="min-h-screen bg-[#F5F1E8] pb-24">
        <Helmet>
          <title>SoHo Flagship | Maslow NYC</title>
          <meta name="description" content="Experience the Maslow Flagship at SoHo Historic District. The future of public sanitation." />
        </Helmet>

        {/* Hero */}
        <div className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-[#3B5998]">
            <img
              src="https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=2070&auto=format&fit=crop"
              alt="SoHo Streets"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F5F1E8] via-transparent to-transparent"></div>

          <div className="absolute bottom-0 left-0 w-full p-8 pb-16 md:p-16">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
                <div className="flex items-center gap-2 text-[#C5A059] mb-4">
                    <MapPin className="w-5 h-5" />
                    <span className="uppercase tracking-widest text-sm font-bold">Flagship Location</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-serif text-[#3B5998] mb-4">SoHo</h1>
                <p className="text-2xl text-[#3B5998] font-light max-w-xl">
                    SoHo Historic District<br/>
                    New York, NY 10013
                </p>
            </motion.div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="container mx-auto px-4 -mt-12 relative z-10">
            <div className="grid md:grid-cols-3 gap-6">
                {/* Card 1: Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-[#C5A059]"
                >
                    <Calendar className="w-8 h-8 text-[#C5A059] mb-4" />
                    <h3 className="text-xl font-serif text-[#3B5998] mb-2">Opening Timeline</h3>
                    <p className="text-[#3B5998]/70">Grand Opening: <span className="font-bold">Spring 2026</span></p>
                    <p className="text-[#3B5998]/70 text-sm mt-2 italic">Founding Member previews begin Winter 2025.</p>
                </motion.div>

                {/* Card 2: Hours */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-[#3B5998]"
                >
                    <Clock className="w-8 h-8 text-[#3B5998] mb-4" />
                    <h3 className="text-xl font-serif text-[#3B5998] mb-2">Hours of Operation</h3>
                    <ul className="text-[#3B5998]/70 text-sm space-y-1">
                        <li className="flex justify-between"><span>Mon - Fri</span> <span>6:00 AM - 10:00 PM</span></li>
                        <li className="flex justify-between"><span>Sat - Sun</span> <span>8:00 AM - 12:00 AM</span></li>
                    </ul>
                </motion.div>

                {/* Card 3: Significance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#1a1a1a] p-8 rounded-xl shadow-xl border-t-4 border-[#C5A059] text-[#F5F1E8]"
                >
                    <div className="w-8 h-8 rounded-full border border-[#C5A059] flex items-center justify-center mb-4 text-[#C5A059] font-serif font-bold">M</div>
                    <h3 className="text-xl font-serif mb-2">The Significance</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Our flagship location reclaims a historic cast-iron building, proving that dignity can be woven into the very fabric of New York's architectural heritage.
                    </p>
                </motion.div>
            </div>
        </div>

        {/* Immersive Features */}
        <div className="container mx-auto px-4 py-24">
            <h2 className="text-4xl font-serif text-[#3B5998] mb-12 text-center">Sanctuary Features</h2>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="group">
                    <div className="aspect-square bg-[#3B5998]/5 rounded-lg mb-6 flex items-center justify-center group-hover:bg-[#3B5998]/10 transition-colors">
                        <Sun className="w-16 h-16 text-[#C5A059]" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#3B5998] mb-2">The Artificial Sky</h3>
                    <p className="text-[#3B5998]/70 text-sm leading-relaxed">
                        Circadian lighting that adjusts from cool noon capability to warm sunset restoration, recalibrating your biological clock instantly.
                    </p>
                </div>

                <div className="group">
                    <div className="aspect-square bg-[#3B5998]/5 rounded-lg mb-6 flex items-center justify-center group-hover:bg-[#3B5998]/10 transition-colors">
                        <Volume2 className="w-16 h-16 text-[#C5A059]" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#3B5998] mb-2">The Maslow Console</h3>
                    <p className="text-[#3B5998]/70 text-sm leading-relaxed">
                        Tactile audio control allowing you to switch between four distinct sonic environments: Source, Shield, Nature, and Void.
                    </p>
                </div>

                <div className="group">
                    <div className="aspect-square bg-[#3B5998]/5 rounded-lg mb-6 flex items-center justify-center group-hover:bg-[#3B5998]/10 transition-colors">
                        <Shield className="w-16 h-16 text-[#C5A059]" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#3B5998] mb-2">Invisible Hygiene</h3>
                    <p className="text-[#3B5998]/70 text-sm leading-relaxed">
                        Self-cleaning UV-C interlocks and Phantom Corridor maintenance ensure a hospital-grade sterile environment without intrusion.
                    </p>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // Fallback for other locations (Coming Soon)
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-8 text-center">
      <Helmet>
        <title>Coming Soon | Maslow NYC</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
          <div className="w-24 h-24 border-2 border-[#C5A059] rounded-full mx-auto mb-8 flex items-center justify-center">
             <MapPin className="w-10 h-10 text-[#C5A059]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#F5F1E8] mb-6">Coming Soon</h1>
          <p className="text-[#F5F1E8]/60 max-w-xl mx-auto text-lg font-light mb-12">
            The infrastructure of dignity is expanding. Additional Maslow locations are currently in development across the five boroughs.
          </p>

          <Link to="/">
             <Button className="bg-[#C5A059] text-[#1a1a1a] hover:bg-[#d4b06a] font-bold tracking-widest px-8 py-6">
                Return Home
             </Button>
          </Link>
      </motion.div>
    </div>
  );
};

export default LocationDetail;
