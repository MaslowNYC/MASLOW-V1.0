import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Heart, Home, ArrowRight, Shirt } from 'lucide-react'; // Changed WashingMachine to Shirt as standard lucide icon, or using generic icon if unavailable. *Correction*: Lucide has a 'WashingMachine' icon in newer versions, but 'Shirt' or 'Waves' are safer if version is unsure. Let's stick to standard imports or generic shapes. I will use 'Waves' for laundry/water or just 'Heart' context. actually 'Shirt' works well for laundry.

const ImpactPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <Helmet>
        <title>The Maslow Impact | Maslow NYC</title>
        <meta name="description" content="Business for good. Maslow's for-profit arm funds our non-profit initiative to bring dignified amenities to underserved communities." />
      </Helmet>
      
      {/* Header */}
      <div className="bg-[#3B5998] py-24 px-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-serif text-[#F5F1E8] mb-6 uppercase tracking-wider"
        >
          The Maslow Impact
        </motion.h1>
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#F5F1E8]/80 text-lg max-w-2xl mx-auto font-light"
        >
            Leveraging commerce to fund community dignity.
        </motion.p>
      </div>

       {/* The Model: Profit funds Non-Profit */}
       <section className="py-20 px-4 bg-white border-b border-[#3B5998]/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#3B5998]/5 p-8 md:p-12 rounded-2xl border border-[#3B5998]/10"
          >
            <h2 className="text-3xl font-serif text-[#3B5998] mb-6">One Mission, Two Arms</h2>
            <p className="text-xl text-[#3B5998]/80 font-sans leading-relaxed mb-8">
              Maslow operates as a dual-engine for change. The <span className="font-bold">Maslow For-Profit</span> company funds the <span className="font-bold text-[#C5A059]">MaslowNYC.org Non-Profit</span>.
            </p>
            <p className="text-lg text-[#3B5998]/70">
              We believe dignity should not be a luxury. A portion of every membership and purchase at our flagship "Hull" locations goes directly towards building infrastructure in the neighborhoods that need it most.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Non-Profit Mission: Smaller Locations & Laundry */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif text-[#3B5998] mb-6">Community-Focused Hubs</h2>
            <div className="h-1 w-20 bg-[#C5A059] mb-8"></div>
            <p className="text-lg text-[#3B5998]/80 font-sans leading-relaxed mb-6">
              While our flagship locations feature "The Hull" for public gathering in high-traffic zones, our non-profit initiative builds smaller, agile Maslow locations specifically for underserved communities.
            </p>
            <p className="text-lg text-[#3B5998]/80 font-sans leading-relaxed">
              These facilities are designed not for spectacle, but for service. They are focused entirely on meeting the urgent, day-to-day needs of local residents.
            </p>
            
            <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                    <div className="bg-[#C5A059]/20 p-2 rounded-full text-[#C5A059]"><Home className="w-5 h-5" /></div>
                    <span className="text-[#3B5998] font-medium mt-1">Smaller footprint integrated into the neighborhood fabric.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="bg-[#C5A059]/20 p-2 rounded-full text-[#C5A059]"><Shirt className="w-5 h-5" /></div>
                    <span className="text-[#3B5998] font-medium mt-1">Free and reduced-cost laundry services.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="bg-[#C5A059]/20 p-2 rounded-full text-[#C5A059]"><Heart className="w-5 h-5" /></div>
                    <span className="text-[#3B5998] font-medium mt-1">Essential hygiene and sanitation services out of reach for many.</span>
                </li>
            </ul>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="relative"
          >
             <div className="aspect-[4/5] bg-gray-200 rounded-2xl overflow-hidden shadow-2xl border border-[#3B5998]/10">
                <img 
                    src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop" 
                    alt="Community Library and Service Center" 
                    className="w-full h-full object-cover grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-[#3B5998] mix-blend-multiply opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#3B5998]/90 to-transparent text-white">
                    <p className="font-serif text-xl">Dignity is a right.</p>
                    <p className="text-sm opacity-80 mt-1">Access for everyone, everywhere.</p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#1a1a1a] text-[#F5F1E8] text-center relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Support the Maslow Project</h2>
            <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                By joining Maslow as a member, you aren't just buying access to a restroom. You are funding a pipeline of resources that builds clean, safe facilities in communities that have been left behind.
            </p>
            <a 
                href="https://themaslowproject.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C5A059] text-[#1a1a1a] px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#d4b06a] transition-all shadow-lg hover:shadow-[#C5A059]/20"
            >
                Visit The Non-Profit <ArrowRight className="w-5 h-5" />
            </a>
        </div>
      </section>
    </div>
  );
};

export default ImpactPage;
