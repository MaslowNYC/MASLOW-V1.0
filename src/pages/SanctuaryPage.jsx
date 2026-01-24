
import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Sun, CloudRain, Clock, Users } from 'lucide-react';

const SanctuaryPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#3B5998] font-sans overflow-x-hidden w-full pt-20">
      <Helmet>
        <title>The Hull | Maslow NYC</title>
        <meta name="description" content="A transient respite for the city. 15 minutes of peace." />
      </Helmet>

      {/* Hero: The Artificial Sky */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-[#3B5998]/20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB]/20 to-[#F5F1E8] z-0"></div>
        
        {/* The "Skylight" Effect */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-10 w-[80%] h-[40%] bg-white rounded-[100%] blur-3xl opacity-60 mix-blend-overlay"
        ></motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#3B5998] mb-6">
            The Hull
          </h1>
          <p className="text-xl md:text-2xl font-light text-[#3B5998]/80 italic">
            "A public living room for the city that never stops."
          </p>
        </div>
      </section>

      {/* The Features Grid */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          {/* Left: The Atmosphere */}
          <div className="space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-[#C5A059]">
                <Sun className="w-8 h-8" />
                <h3 className="text-xl font-bold uppercase tracking-widest">Circadian Skylight</h3>
              </div>
              <p className="text-lg leading-relaxed text-[#3B5998]/80">
                Deep underground, we mimic the sun. Our artificial skylight tracks the real-time movement of the sun across New York City, shifting from the cool blue of dawn to the warm amber of sunset, keeping your body clock anchored to the world above.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-[#C5A059]">
                <Users className="w-8 h-8" />
                <h3 className="text-xl font-bold uppercase tracking-widest">Restored Pews</h3>
              </div>
              <p className="text-lg leading-relaxed text-[#3B5998]/80">
                We’ve salvaged and restored church pews from forgotten sanctuaries across the five boroughs. Solid oak, worn by decades of prayer and rest, providing a communal seat for anyone who needs to take a load off.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-[#C5A059]">
                <CloudRain className="w-8 h-8" />
                <h3 className="text-xl font-bold uppercase tracking-widest">The Wudu Station</h3>
              </div>
              <p className="text-lg leading-relaxed text-[#3B5998]/80">
                Dignity respects ritual. We provide a dedicated, hygienic foot-washing station for those preparing for prayer, alongside standard hand-washing and hydration stations for all guests.
              </p>
            </motion.div>
          </div>

          {/* Right: The Rules of Engagement */}
          <div className="bg-[#3B5998] text-[#F5F1E8] p-10 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Clock className="w-32 h-32" />
            </div>
            
            <h2 className="text-3xl font-serif font-bold mb-8">The Social Contract</h2>
            
            <ul className="space-y-8 relative z-10">
              <li className="flex gap-4">
                <span className="font-bold text-[#C5A059] text-xl">01.</span>
                <div>
                  <h4 className="font-bold text-lg mb-1">The 15-Minute Respite</h4>
                  <p className="font-light opacity-80">
                    The Hull is a transient space. We ask guests to limit their stay to 15 minutes so there is always room for the next New Yorker who needs a breath.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-[#C5A059] text-xl">02.</span>
                <div>
                  <h4 className="font-bold text-lg mb-1">The Hull Pass</h4>
                  <p className="font-light opacity-80">
                    For the safety of our community, access requires an active Maslow Pass (Apple/Google Wallet). It is free to acquire, but ensures accountability for everyone in the room.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-[#C5A059] text-xl">03.</span>
                <div>
                  <h4 className="font-bold text-lg mb-1">Pop-Up Culture</h4>
                  <p className="font-light opacity-80">
                    The Hull is a stage. We invite guest chefs to use our prep kitchen and niche retailers to showcase their craft. You might walk in for water and leave with a new favorite local brand.
                  </p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </section>
    </div>
  );
};

export default SanctuaryPage;