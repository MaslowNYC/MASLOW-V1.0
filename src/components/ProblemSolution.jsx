
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2 } from 'lucide-react';
import SignupModal from '@/components/SignupModal';

const ProblemSolution = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <section className="bg-[#F5F1E8] py-24 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 relative">
          
          {/* Problem Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
              The Crisis
            </div>
            <h3 className="text-3xl md:text-4xl font-serif text-[#3B5998] mb-4">
              The Bathroom Desert
            </h3>
            <div className="text-6xl md:text-7xl font-bold text-[#C5A059] mb-6 flex flex-wrap items-baseline gap-2">
              7,700
              <span className="text-lg text-gray-500 font-normal w-32 leading-tight">people per public toilet</span>
            </div>
            <p className="text-xl text-[#3B5998]/90 leading-relaxed font-medium">
              New York City faces a critical sanitation infrastructure crisis. With only ~1,100 public restrooms for 8 million residents plus millions of tourists, a basic human need has become a daily indignity.
            </p>
          </motion.div>

          {/* Divider (Desktop) */}
          <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 w-px justify-center">
            <div className="h-full w-px bg-gradient-to-b from-transparent via-[#C5A059]/50 to-transparent"></div>
          </div>

          {/* Solution Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider mb-4">
                The Solution
              </div>
              <h3 className="text-3xl md:text-4xl font-serif text-[#3B5998]">
                A Dual-Tier Infrastructure
              </h3>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#3B5998]/10">
                <h4 className="text-xl font-bold text-[#3B5998] mb-2 flex items-center gap-2">
                   <MapPin className="w-5 h-5 text-[#C5A059]" />
                   The Hull (Public)
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  The <span className="font-bold text-[#C5A059]">FREE</span> central town hall. An open-air sanctuary providing the community with hydration, charging, and a safe space to gather. No purchase necessary
                  <button 
                    onClick={() => setIsSignupModalOpen(true)}
                    className="text-[#3B5998] font-bold hover:text-[#C5A059] hover:underline cursor-pointer transition-colors"
                  >
                    , just a free account
                  </button>.
                </p>
              </div>

              <div className="bg-[#3B5998] p-6 rounded-xl shadow-lg border border-[#3B5998]">
                <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                   <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
                   The Maslow Suite (Private)
                </h4>
                <p className="text-[#F5F1E8]/90 leading-relaxed">
                  The <span className="font-bold text-[#C5A059]">PAID</span> utility. A soundproof, hospital-grade private restroom ensuring revenue generation to sustain the free public services. Accessible via membership or single-use pass.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />
    </section>
  );
};

export default ProblemSolution;
