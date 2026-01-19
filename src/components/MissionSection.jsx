
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Briefcase, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MissionSection = () => {
  return (
    <section className="bg-[#3B5998] py-20 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-12"
          >
            <div className="space-y-4">
               <h3 className="text-4xl md:text-5xl font-serif text-[#F5F1E8]">
                The Maslow Project
              </h3>
              <p className="text-[#F5F1E8]/60 uppercase tracking-widest font-bold text-sm">Strategic Alignment & Social Impact</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-[#F5F1E8]/90 text-lg leading-relaxed font-light text-left">
              
              {/* WBE Highlight */}
              <div className="md:col-span-2 bg-[#C5A059]/10 p-8 rounded-xl border border-[#C5A059]/30 flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-[#C5A059] p-3 rounded-full text-[#3B5998]">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-[#C5A059] font-bold text-xl mb-2">Certified Women-Owned Business Enterprise (WBE)</h4>
                  <p className="text-[#F5F1E8]/90">
                    Maslow LLC is proud to be a Certified WBE with <span className="font-bold text-white">64% female ownership</span>. We are a strategic partner for the City of New York, uniquely positioned to help fulfill city procurement goals while solving the sanitation crisis with a perspective grounded in safety and inclusivity.
                  </p>
                </div>
              </div>

              {/* Non-Profit Impact with Impact Protocol Button */}
              <div className="flex flex-col gap-4 bg-[#F5F1E8]/5 p-6 rounded-lg border border-[#F5F1E8]/10 h-full hover:bg-[#F5F1E8]/10 transition-colors duration-300">
                <div className="flex-grow">
                  <Heart className="w-8 h-8 text-[#C5A059] mb-4" />
                  <p className="mb-6">
                    Once established, Maslow will work with our non-profit arm to build mini-Maslow locations in underserved neighborhoods. Dignity isn't negotiable. Access shouldn't depend on your zip code.
                  </p>
                </div>
                <Link to="/impact" className="mt-auto">
                  <Button 
                    variant="outline" 
                    className="w-full border-white/30 text-white hover:bg-white hover:text-[#3B5998] bg-transparent uppercase tracking-widest text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    View The Impact Protocol <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col gap-4 bg-[#F5F1E8]/5 p-6 rounded-lg border border-[#F5F1E8]/10 h-full hover:bg-[#F5F1E8]/10 transition-colors duration-300">
                <div className="flex-grow">
                  <Users className="w-8 h-8 text-[#C5A059] mb-4" />
                  <p>
                    Beyond traditional facilities, we prioritize fundamental access. Universally accessible hand washing stations ensure basic hygiene and comfort for every member of our community.
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col md:flex-row items-center gap-6 bg-[#F5F1E8]/5 p-6 rounded-lg border border-[#F5F1E8]/10 hover:bg-[#F5F1E8]/10 transition-colors duration-300">
                <Briefcase className="w-8 h-8 text-[#C5A059] flex-shrink-0" />
                <p>
                  Our "Open Door" hiring model partners with neurodiversity advocacy 
                  groups to create meaningful employment opportunities. We build 
                  infrastructure. We build community. We build futures.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-[#F5F1E8]/10">
              <p className="text-2xl text-[#C5A059] font-serif italic">
                "Infrastructure for all. Funded by those who can."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
