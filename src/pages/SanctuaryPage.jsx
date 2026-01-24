
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Sun, Wind, Volume2, Shield, Heart, Zap, Star, Rocket } from 'lucide-react';

const SanctuaryPage = () => {
  const [knobRotation, setKnobRotation] = useState(0); // 0 = Source, 1 = Shield, 2 = Nature, 3 = Void
  
  const knobPositions = [
    { label: 'SOURCE', angle: -135, desc: 'Pure acoustic clarity.' },
    { label: 'SHIELD', angle: -45, desc: 'White noise isolation.' },
    { label: 'NATURE', angle: 45, desc: 'Biophilic soundscapes.' },
    { label: 'VOID', angle: 135, desc: 'Total silence.' }
  ];

  const philosophyPoints = [
    { 
      icon: Shield, 
      text: "Sanitation as a fundamental human right",
      gradient: "from-blue-500 to-cyan-400",
      shadow: "hover:shadow-blue-900/20"
    },
    { 
      icon: Heart, 
      text: "Dignity and well-being through access to clean facilities",
      gradient: "from-rose-500 to-pink-400",
      shadow: "hover:shadow-rose-900/20"
    },
    { 
      icon: Zap, 
      text: "Meeting physiological needs for health and safety",
      gradient: "from-amber-400 to-orange-500",
      shadow: "hover:shadow-amber-900/20"
    },
    { 
      icon: Star, 
      text: "Building self-esteem and confidence",
      gradient: "from-purple-500 to-indigo-400",
      shadow: "hover:shadow-purple-900/20"
    },
    { 
      icon: Rocket, 
      text: "Unlocking human potential and opportunity",
      gradient: "from-emerald-400 to-green-500",
      shadow: "hover:shadow-emerald-900/20"
    }
  ];

  const handleKnobClick = () => {
    setKnobRotation((prev) => (prev + 1) % 4);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#F5F1E8] font-sans overflow-x-hidden w-full">
      <Helmet>
        <title>The Sanctuary | Maslow NYC</title>
        <meta name="description" content="Experience the Artificial Sky, the Maslow Console, and ihospital-grade sanitation technology." />
      </Helmet>

      {/* Hero */}
      <section className="h-[70vh] flex items-center justify-center relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#1a1a1a] z-10"></div>
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 text-center px-4 max-w-full"
        >
          <span className="text-[#C5A059] tracking-[0.5em] text-sm uppercase mb-4 block">Enter the Refuge</span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-[#F5F1E8] mb-6">Sanctuary</h1>
          <p className="text-gray-400 max-w-xl mx-auto font-light text-lg">
            A pause button for the city that never sleeps.
          </p>
        </motion.div>
      </section>

      {/* Feature 1: Artificial Sky */}
      <section className="py-24 px-4 relative w-full">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
               <div className="w-64 sm:w-80 md:w-full aspect-square rounded-full bg-gradient-to-tr from-[#FFD700] via-[#F5F1E8] to-[#87CEEB] shadow-[0_0_100px_rgba(255,215,0,0.2)] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
                  <Sun className="w-24 h-24 text-white opacity-80" />
               </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl md:text-5xl font-serif mb-6">The Artificial Sky</h2>
                <div className="h-px w-20 bg-[#C5A059] mb-8"></div>
                <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-8">
                    Underground doesn't have to mean dark. Our Circadian Rhythm Lighting mimics the natural arc of the sun, shifting from the cool, awakening white of noon to the warm, amber glow of sunset.
                </p>
                <div className="flex gap-8">
                    <div>
                        <span className="block text-[#C5A059] font-bold text-2xl">6000K</span>
                        <span className="text-xs uppercase tracking-widest text-gray-500">Focus / Noon</span>
                    </div>
                    <div>
                        <span className="block text-[#C5A059] font-bold text-2xl">2700K</span>
                        <span className="text-xs uppercase tracking-widest text-gray-500">Rest / Sunset</span>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Feature 2: Maslow Console */}
      <section className="py-32 px-4 bg-[#0a0a0a] border-y border-white/5 w-full overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-4 text-[#C5A059]">The Maslow Console</h2>
            <p className="text-gray-400">Total environmental control at your fingertips.</p>
        </div>

        <div className="flex flex-col items-center justify-center w-full">
            {/* Interactive Knob UI */}
            <div className="relative w-64 h-64 mb-12 max-w-full">
                {/* Labels */}
                {knobPositions.map((pos, index) => {
                    return (
                        <div 
                            key={pos.label}
                            className={`absolute transition-all duration-500 font-bold tracking-widest text-sm
                                ${knobRotation === index ? 'text-[#C5A059] scale-110' : 'text-gray-600 scale-100'}
                            `}
                            style={{
                                top: index === 0 ? '85%' : index === 1 ? '15%' : index === 2 ? '15%' : '85%',
                                left: index === 0 ? '15%' : index === 1 ? '15%' : index === 2 ? '85%' : '85%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            {pos.label}
                        </div>
                    );
                })}

                {/* The Knob */}
                <motion.div 
                    className="w-40 h-40 bg-[#1a1a1a] rounded-full absolute top-1/2 left-1/2 -ml-20 -mt-20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#333] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                    animate={{ rotate: knobPositions[knobRotation].angle }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    onClick={handleKnobClick}
                >
                    {/* Texture */}
                    <div className="absolute inset-2 rounded-full border border-dashed border-[#333] opacity-50"></div>
                    {/* Indicator */}
                    <div className="w-1.5 h-8 bg-[#C5A059] absolute top-4 rounded-full shadow-[0_0_10px_#C5A059]"></div>
                    {/* Center Cap */}
                    <div className="w-16 h-16 bg-[#222] rounded-full shadow-inner border border-[#333]"></div>
                </motion.div>
            </div>

            {/* Active Description */}
            <div className="h-12 w-full text-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={knobRotation}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xl text-[#F5F1E8] font-light italic"
                    >
                        {knobPositions[knobRotation].desc}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
      </section>

      {/* Feature 3: The Ritual Cleansing */}
      <section className="py-24 px-4 w-full border-b border-white/5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#252525] p-8 rounded-xl border border-white/5 hover:border-[#C5A059]/30 transition-colors group"
             >
                <Shield className="w-10 h-10 text-[#C5A059] mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-serif text-[#F5F1E8] mb-4">UV-C Interlocks</h3>
                <p className="text-gray-400 leading-relaxed">
                    Hospital-grade sterilization activates automatically between every visit. The space creates a fresh slate for every guest, ensuring absolute biological safety.
                </p>
             </motion.div>

             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[#252525] p-8 rounded-xl border border-white/5 hover:border-[#C5A059]/30 transition-colors group"
             >
                <Wind className="w-10 h-10 text-[#C5A059] mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-serif text-[#F5F1E8] mb-4">Phantom Corridor</h3>
                <p className="text-gray-400 leading-relaxed">
                    Our proprietary "Invisible Maintenance" architecture allows staff to service utilities, restock supplies, and clean from behind the walls without ever intruding on your privacy.
                </p>
             </motion.div>
        </div>
      </section>

      {/* New Feature 4: Philosophy Points */}
      <section className="py-24 px-4 bg-[#111] w-full">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-serif text-[#C5A059] mb-6">Our Core Beliefs</h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              We believe in the power of basic needs to unlock higher potential.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {philosophyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    relative group bg-[#1a1a1a] rounded-lg p-8 border border-white/5 
                    hover:border-white/10 overflow-hidden transition-all duration-300
                    hover:scale-[1.02] hover:shadow-2xl ${point.shadow}
                  `}
                >
                  {/* Hover Gradient Background */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${point.gradient} 
                    opacity-0 group-hover:opacity-5 transition-opacity duration-500
                  `}></div>
                  
                  <div className="relative z-10">
                    <div className={`
                      w-12 h-12 rounded-lg bg-gradient-to-br ${point.gradient} 
                      mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg
                    `}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <p className="text-lg md:text-xl font-medium text-gray-200 leading-snug group-hover:text-white transition-colors">
                      {point.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SanctuaryPage;
