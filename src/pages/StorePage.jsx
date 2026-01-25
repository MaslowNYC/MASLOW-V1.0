
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Sparkles, ArrowRight, Lock, Wind, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const StorePage = () => {
  const navigate = useNavigate();

  const partners = [
    {
      name: "Ursa Major",
      category: "Sanitation Standards",
      description: "B Corp certified performance. We use their forest-infused formulas because dignity shouldn't smell like a hospital—it should smell like the outdoors.",
      image: "https://images.unsplash.com/photo-1616789916365-1d6eb7501a30?auto=format&fit=crop&q=80",
      icon: <Wind className="w-4 h-4 text-emerald-400" />,
      color: "text-emerald-400"
    },
    {
      name: "Cora",
      category: "Human Rights",
      description: "Period care is infrastructure. We partner with Cora to provide 100% organic cotton supplies, ensuring that essential care is never an afterthought.",
      image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80",
      icon: <Heart className="w-4 h-4 text-rose-400" />,
      color: "text-rose-400"
    },
    {
      name: "Dr. Bronner's",
      category: "Foundation Clean",
      description: "The gold standard for fair-trade, organic soap. 18-in-1 formulas that respect the worker and the user in every Sanctuary Suite.",
      image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&q=80",
      icon: <Zap className="w-4 h-4 text-sky-400" />,
      color: "text-sky-400"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Helmet><title>The Standard | Maslow NYC</title></Helmet>
      <header className="bg-slate-900 text-white pt-24 pb-20 px-6 border-b-4 border-[#C5A059]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
              <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">The Standard of Care</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-serif tracking-tight">Ethical Procurement.</h1>
            <p className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed">
              We only partner with companies that treat their workers and the planet with dignity.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner, i) => (
            <Card key={i} className="bg-white border-slate-100 shadow-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                <div className="h-40 overflow-hidden">
                  <img src={partner.image} alt={partner.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <CardContent className="p-6 space-y-3">
                  <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${partner.color}`}>
                    {partner.icon} {partner.category}
                  </div>
                  <h3 className="text-xl font-serif">{partner.name}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{partner.description}</p>
                </CardContent>
            </Card>
          ))}
        </div>
        <section className="bg-slate-900 rounded-2xl p-12 text-center text-white border border-[#C5A059]/30">
          <h2 className="text-3xl font-serif mb-4">Earn The Access.</h2>
          <Button onClick={() => navigate('/login?mode=signup')} className="bg-[#C5A059] text-slate-900 font-bold px-12 py-6 rounded-none uppercase tracking-widest">
            Join The Mission <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </section>
      </main>
    </div>
  );
};

export default StorePage;