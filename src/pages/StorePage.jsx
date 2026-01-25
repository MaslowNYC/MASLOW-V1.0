
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShieldCheck, Droplets, Heart, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const StorePage = () => {
  const navigate = useNavigate();

  const partners = [
    {
      name: "Ursa Major",
      origin: "Vermont, USA",
      category: "Sanitation Standards",
      description: "We refuse to use synthetic fragrances or sulfates. Ursa Major sets the baseline for our 'Sanctuary Grade' amenities with forest-infused, clean formulas.",
      image: "https://images.unsplash.com/photo-1616789916365-1d6eb7501a30?auto=format&fit=crop&q=80", // Forest/Clean vibe
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      color: "text-emerald-400"
    },
    {
      name: "Cora",
      origin: "San Francisco, USA",
      category: "Dignity & Care",
      description: "Period care is infrastructure, not a luxury. We align with Cora for their 100% organic cotton commitment and their mission to end period poverty globally.",
      image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80", // Soft/Cotton vibe
      icon: <Heart className="w-4 h-4 text-rose-400" />,
      color: "text-rose-400"
    },
    {
      name: "Skoolmilk",
      origin: "New York, NYC", 
      category: "Modern Wellness",
      description: "Reimagining the basics of nourishment. Skoolmilk represents the future of foundational health—simple, honest, and designed for the modern urban athlete.",
      image: "https://images.unsplash.com/photo-1626139576127-452178225026?auto=format&fit=crop&q=80", // Minimalist/Milk vibe
      icon: <Droplets className="w-4 h-4 text-sky-400" />,
      color: "text-sky-400"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Helmet>
        <title>The Standard | Maslow NYC</title>
        <meta name="description" content="Our curated list of ethical partners. We only work with brands that respect human dignity." />
      </Helmet>

      {/* --- HEADER: The Philosophy --- */}
      <header className="bg-slate-900 text-white pt-24 pb-20 px-6 border-b-4 border-[#C5A059]">
        <div className="max-w-6xl mx-auto text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Procurement Division</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-serif tracking-tight">
              The Maslow Standard.
            </h1>
            
            <p className="text-slate-400 max-w-2xl text-lg md:text-xl font-light leading-relaxed">
              We don't just stock shelves. We curate dignity. <br className="hidden md:block"/>
              These are the partners we have chosen to build the future of public sanitation.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20 space-y-24">

        {/* --- SECTION 1: THE PARTNER GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partners.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden group">
                
                {/* Image Area */}
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors duration-500 z-10" />
                  <img 
                    src={partner.image} 
                    alt={partner.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold border border-slate-200">
                    {partner.origin}
                  </div>
                </div>

                {/* Content Area */}
                <CardContent className="p-8 space-y-6 relative">
                  <div>
                    <div className={`flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest ${partner.color}`}>
                      {partner.icon}
                      {partner.category}
                    </div>
                    <h3 className="text-3xl font-serif text-slate-900 mb-4 group-hover:text-[#3B5998] transition-colors">
                      {partner.name}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {partner.description}
                    </p>
                  </div>
                  
                  {/* "Why We Chose Them" Stamp */}
                  <div className="pt-6 border-t border-slate-100">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                      Status: <span className="text-slate-900">Preferred Alignment</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* --- SECTION 2: THE ONLY THING FOR SALE --- */}
        <section className="bg-[#1E293B] rounded-2xl p-8 md:p-16 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <div className="w-16 h-16 bg-[#C5A059]/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Lock className="w-8 h-8 text-[#C5A059]" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-serif text-white">
              Earn The Access.
            </h2>
            
            <p className="text-slate-400 text-lg leading-relaxed">
              We don't sell merchandise. We sell infrastructure access. 
              The Maslow Pass is your digital key to every Sanctuary Suite in the network.
            </p>

            <Button 
              onClick={() => navigate('/login?mode=signup')}
              className="bg-[#C5A059] hover:bg-[#b08d4b] text-[#0F172A] font-bold py-6 px-12 text-sm uppercase tracking-[0.2em] rounded-sm transition-all shadow-[0_0_30px_rgba(197,160,89,0.2)] hover:shadow-[0_0_50px_rgba(197,160,89,0.4)]"
            >
              Secure Your Pass <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-4">
              Founder Tier // Limited Release
            </p>
          </div>
        </section>

      </main>
    </div>
  );
};

export default StorePage;