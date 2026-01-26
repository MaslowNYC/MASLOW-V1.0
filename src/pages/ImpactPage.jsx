
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, Shield, Droplets, Users, Building2, MapPin, TrendingUp } from 'lucide-react';

const ImpactPage = () => {
  // Static Impact Data (The "North Star" metrics)
  // TODO: Eventually hook these up to a 'public_impact_stats' table in Supabase
  const impactMetrics = {
    peopleServed: "12,450",
    dignityScore: "98/100",
    hygieneHours: "6,225",
    spiralingPrevented: "84%" 
  };

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
      icon: <Shield className="w-5 h-5 text-orange-500" /> 
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
        <title>Civic Impact | Maslow NYC</title>
      </Helmet>

      {/* HEADER */}
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
                <span className="text-xs uppercase tracking-[0.2em] font-bold">Community Impact Report</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-2">
                Restoring Dignity.
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-light leading-relaxed">
                Maslow isn't just a facility. It's a dignity grid. We provide the essential sanitation and rest that allows New Yorkers to rebuild their lives.
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        
        {/* SECTION 1: THE HUMAN METRICS */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">01 // Community Vitality</h2>
            <Separator className="flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-800 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <Users className="h-4 w-4" /> People Served
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600 mb-1">{impactMetrics.peopleServed}</div>
                <p className="text-xs text-blue-700">New Yorkers accessed safe sanitation.</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-800 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <Heart className="h-4 w-4" /> Dignity Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600 mb-1">{impactMetrics.dignityScore}</div>
                <p className="text-xs text-purple-700">Reported feeling of "restored humanity".</p>
              </CardContent>
            </Card>

            <Card className="bg-cyan-50 border-cyan-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-cyan-800 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <Droplets className="h-4 w-4" /> Hygiene Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-cyan-600 mb-1">{impactMetrics.hygieneHours}</div>
                <p className="text-xs text-cyan-700">Hours of private shower time delivered.</p>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50 border-emerald-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-800 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <Shield className="h-4 w-4" /> Prevention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-emerald-600 mb-1">{impactMetrics.spiralingPrevented}</div>
                <p className="text-xs text-emerald-700">Users stopped from "giving up".</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 2: THE PROBLEM SOLVED */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">02 // The Reality Gap</h2>
            <Separator className="flex-1 bg-slate-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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

        {/* SECTION 3: THE MODEL */}
        <section className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-serif text-[#3B5998]">We don't build restrooms.<br/>We build dignity grids.</h3>
              <p className="text-slate-600 leading-relaxed">
                The Maslow Model decentralizes public sanitation. Instead of relying on expensive, standalone municipal structures, we activate underutilized urban spaces into a network of <strong>"Sanctuary Suites."</strong>
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  "Hospital-grade sanitation standards.",
                  "ADA compliant accessibility.",
                  "Zero to minimal maintenance cost to the city.",
                  "Real-time usage analytics."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium"><div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 rounded-lg p-8 relative overflow-hidden h-80 flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="relative z-10 text-center">
                 <MapPin className="w-16 h-16 text-[#C5A059] mx-auto mb-4 animate-bounce" />
                 <div className="text-white font-bold text-xl">Node Active</div>
                 <div className="text-slate-400 text-xs uppercase tracking-widest mt-2">Maslow Network V1.0</div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ImpactPage;