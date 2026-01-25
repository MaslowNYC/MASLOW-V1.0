
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Users, Droplets, ShieldCheck, MapPin, Building2, Mail } from 'lucide-react';

const ImpactPage = () => {
  
  // Data points that sound official and urgent
  const stats = [
    { 
      label: "Current Deficit", 
      value: "1 : 7,000", 
      sub: "Restrooms per Resident in NYC",
      icon: <Users className="w-5 h-5 text-red-500" /> 
    },
    { 
      label: "Public Health Risk", 
      value: "High", 
      sub: "Street-level sanitation reports",
      icon: <ShieldCheck className="w-5 h-5 text-orange-500" /> 
    },
    { 
      label: "Maslow Solution", 
      value: "Zero Cost", 
      sub: "To municipal taxpayers",
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" /> 
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Helmet>
        <title>Civic Outreach | Maslow NYC</title>
      </Helmet>

      {/* --- HEADER: The Official Briefing --- */}
      <header className="bg-slate-900 text-white pt-20 pb-16 px-6 border-b-4 border-[#C5A059]">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-4 opacity-70">
                <Building2 className="w-4 h-4" />
                <span className="text-xs uppercase tracking-[0.2em] font-bold">Municipal Partnership Division</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-2">
                Civic Utility Report.
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-light leading-relaxed">
                Addressing the New York City public sanitation crisis through private-sector infrastructure grids.
              </p>
            </div>
            
            <div className="text-right hidden md:block">
              <div className="text-xs uppercase tracking-widest text-slate-500 mb-1">Report Status</div>
              <div className="text-[#C5A059] font-bold">ACTIVE // 2024</div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* --- SECTION 1: THE DATA GRID --- */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">01 // The Current Reality</h2>
            <Separator className="flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-slate-500 text-xs uppercase tracking-wider flex justify-between items-center">
                      {stat.label}
                      {stat.icon}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                    <p className="text-xs text-slate-500">{stat.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- SECTION 2: THE MODEL (Solution) --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">02 // The Infrastructure Model</h2>
              <Separator className="flex-1 bg-slate-200" />
            </div>
            
            <h3 className="text-3xl font-serif text-[#3B5998]">
              We don't build restrooms.<br/>We build dignity grids.
            </h3>
            
            <p className="text-slate-600 leading-relaxed">
              The Maslow Model decentralizes public sanitation. Instead of relying on expensive, standalone municipal structures that cost millions to build and maintain, we activate underutilized urban spaces into a network of <strong>"Sanctuary Suites."</strong>
            </p>

            <ul className="space-y-3 mt-4">
              {[
                "Hospital-grade sanitation standards.",
                "ADA compliant accessibility.",
                "Zero maintenance cost to the city.",
                "Real-time usage analytics."
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual Representation of the Grid */}
          <div className="bg-slate-900 rounded-lg p-8 relative overflow-hidden h-80 flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 text-center">
               <MapPin className="w-16 h-16 text-[#C5A059] mx-auto mb-4 animate-bounce" />
               <div className="text-white font-bold text-xl">Node Active</div>
               <div className="text-slate-400 text-xs uppercase tracking-widest mt-2">Maslow Network V1.0</div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: MUNICIPAL PARTNERSHIP --- */}
        <section className="bg-white border border-slate-200 rounded-xl p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-xl space-y-4">
              <h2 className="text-2xl font-serif text-slate-900">Open a Municipal Channel</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                We are currently accepting inquiries from the <strong>Office of the Mayor</strong>, 
                <strong> Department of Sanitation</strong>, and <strong>City Council</strong> members. 
                Let's discuss how Maslow can integrate into your district's 2025 roadmap.
              </p>
            </div>
            
            <div className="shrink-0">
               <Button 
                 className="bg-[#3B5998] hover:bg-[#2d4475] text-white px-8 py-6 text-sm uppercase tracking-widest"
                 onClick={() => window.location.href = 'mailto:partnerships@maslownyc.com?subject=Municipal%20Inquiry:%20[District%20Name]'}
               >
                 <Mail className="w-4 h-4 mr-2" />
                 Contact Our Liaisons
               </Button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ImpactPage;