
import React from 'react';
import { Helmet } from 'react-helmet';
import ProductsList from '@/components/ProductsList';
import { motion } from 'framer-motion';
import { ShieldCheck, Sprout, Factory, Leaf, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const StorePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Helmet>
        <title>Ethical Supply | Maslow NYC</title>
        <meta name="description" content="Procurement transparency. We only partner with brands that respect human dignity." />
      </Helmet>

      {/* --- HEADER: Supply Chain Manifesto --- */}
      <header className="bg-slate-900 text-white pt-24 pb-16 px-6 border-b-4 border-[#C5A059]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 opacity-70">
              <Factory className="w-4 h-4" />
              <span className="text-xs uppercase tracking-[0.2em] font-bold">Procurement Division</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight">
              Ethical Supply Chain.
            </h1>
            <p className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed">
              We do not stock products made with misery. Every item in the Maslow network is vetted for labor standards, ingredient purity, and ecological impact.
            </p>
          </motion.div>

          {/* Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 border-t border-slate-800 pt-8">
            {[
              { icon: <ShieldCheck className="w-5 h-5 text-[#C5A059]" />, label: "Labor Vetted" },
              { icon: <Sprout className="w-5 h-5 text-emerald-500" />, label: "Clean Ingredients" },
              { icon: <Factory className="w-5 h-5 text-sky-500" />, label: "US Manufacturing" },
              { icon: <Leaf className="w-5 h-5 text-lime-500" />, label: "Zero Plastic" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3">
                {badge.icon}
                <span className="text-xs uppercase tracking-widest font-bold text-slate-300">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-20">

        {/* --- SECTION 1: THE PARTNER SPOTLIGHT (Ursa Major) --- */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">01 // Primary Sanitation Partner</h2>
          </div>

          <Card className="overflow-hidden border-none shadow-xl bg-[#1E293B] text-white">
            <div className="grid md:grid-cols-2">
              {/* Image Side (Using a placeholder that looks like mountains/forest) */}
              <div className="h-64 md:h-auto bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-slate-900/40"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl font-serif font-bold italic">Ursa Major</h3>
                  <p className="text-xs uppercase tracking-widest opacity-80">Vermont, USA</p>
                </div>
              </div>

              {/* Text Side */}
              <CardContent className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-widest rounded-sm mb-4">
                    Official Supplier
                  </div>
                  <h4 className="text-2xl font-serif mb-3">Forest-Infused. Critical Purity.</h4>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    We chose Ursa Major because they refuse to use sulfates, parabens, or synthetic fragrances. 
                    Their "Golden Hour" recovery cream and "Fantastic Face Wash" are standard issue in every Maslow Sanctuary Suite.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-700">
                  <Button 
                    variant="link" 
                    className="text-[#C5A059] hover:text-[#e0b86a] p-0 h-auto text-xs uppercase tracking-widest"
                    onClick={() => window.open('https://www.ursamajorvt.com', '_blank')}
                  >
                    Inspect Supplier <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </section>

        {/* --- SECTION 2: THE UNIFORM (Product Grid) --- */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">02 // The Provisions</h2>
          </div>
          
          {/* We wrap the existing list in a clean container */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-10 shadow-sm">
             <ProductsList />
          </div>
        </section>

      </main>
    </div>
  );
};

export default StorePage;