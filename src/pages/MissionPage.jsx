
import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const MissionPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <Helmet>
        <title>Our Mission | Maslow NYC</title>
        <meta name="description" content="We do not use 'luxury' as a code word for exclusion. Maslow is Public Utility meets Private Luxury." />
      </Helmet>
      
      {/* Header */}
      <div className="bg-[#3B5998] py-24 px-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif text-[#F5F1E8] mb-6"
        >
          The Mission
        </motion.h1>
      </div>

      {/* Section 1: The NYC Dignity Gap */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-4xl font-serif text-[#3B5998] mb-6">The NYC Dignity Gap</h2>
            <div className="h-1 w-20 bg-[#C5A059] mb-8"></div>
            <p className="text-lg text-[#3B5998]/80 font-sans leading-relaxed mb-6">
              New York City is in a crisis of basic human necessity. With over 8.5 million residents and millions more annual tourists, the city offers only approximately 1,100 public restrooms.
            </p>
            <p className="text-xl font-bold text-[#3B5998] font-serif italic">
              That is roughly one public toilet for every 7,700 people.
            </p>
          </div>
          <div className="relative">
             <div className="aspect-[4/5] bg-gray-200 rounded-lg overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500">
                <img 
                    src="https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?q=80&w=2070&auto=format&fit=crop" 
                    alt="Crowded NYC Street" 
                    className="w-full h-full object-cover grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-[#3B5998] mix-blend-multiply opacity-20"></div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Section 2: The Ethos */}
      <section className="py-24 px-4 bg-white border-y border-[#3B5998]/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[#3B5998] mb-12">The Ethos</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="p-6 border border-[#C5A059]/20 rounded bg-[#F5F1E8]/30">
                    <h3 className="text-[#C5A059] font-bold text-lg mb-2 uppercase tracking-widest">Anti-Racist</h3>
                    <p className="text-[#3B5998]/70 text-sm">Dismantling barriers to access for marginalized communities.</p>
                </div>
                <div className="p-6 border border-[#C5A059]/20 rounded bg-[#F5F1E8]/30">
                    <h3 className="text-[#C5A059] font-bold text-lg mb-2 uppercase tracking-widest">Inclusive</h3>
                    <p className="text-[#3B5998]/70 text-sm">Designed for all abilities, genders, and families.</p>
                </div>
                <div className="p-6 border border-[#C5A059]/20 rounded bg-[#F5F1E8]/30">
                    <h3 className="text-[#C5A059] font-bold text-lg mb-2 uppercase tracking-widest">Local</h3>
                    <p className="text-[#3B5998]/70 text-sm">Built by New Yorkers, for New York.</p>
                </div>
            </div>

            <blockquote className="text-2xl md:text-4xl font-serif text-[#3B5998] leading-tight italic max-w-3xl mx-auto relative">
              <span className="text-[#C5A059] text-6xl absolute -top-8 -left-8 opacity-30">"</span>
              We do not use 'luxury' as a code word for exclusion.
              <span className="text-[#C5A059] text-6xl absolute -bottom-12 -right-8 opacity-30">"</span>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Section 3: The Model */}
      <section className="py-24 px-4 bg-[#1a1a1a] text-[#F5F1E8] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
          >
             <h2 className="text-4xl md:text-6xl font-serif text-[#F5F1E8] mb-6">
                Public Utility meets <span className="text-[#C5A059]">Private Luxury</span>.
             </h2>
             <p className="text-lg text-gray-400 font-light leading-relaxed mb-8">
                Maslow reimagines the public restroom not as a burden, but as a sanctuary. By blending the operational excellence of high-end hospitality with the accessibility of a public utility, we create a sustainable model for urban hygiene.
             </p>
             <ul className="space-y-4">
                <li className="flex items-center gap-4 text-[#C5A059]">
                    <span className="h-px w-8 bg-[#C5A059]"></span>
                    <span className="uppercase tracking-widest text-sm font-bold">Self-Sustaining Economy</span>
                </li>
                <li className="flex items-center gap-4 text-[#C5A059]">
                    <span className="h-px w-8 bg-[#C5A059]"></span>
                    <span className="uppercase tracking-widest text-sm font-bold">Universal Design</span>
                </li>
             </ul>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm"
          >
             <div className="space-y-6">
                 <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="font-serif text-xl">The Old Model</span>
                    <span className="text-red-400 font-bold">Broken</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="font-serif text-xl">The Maslow Model</span>
                    <span className="text-[#C5A059] font-bold">Sustainable</span>
                 </div>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MissionPage;
