
import React from 'react';
import { motion } from 'framer-motion';

const MaslowPhilosophy = () => {
  return (
    <section className="bg-white py-20 w-full overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gray-50 border border-gray-200 rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden"
        >
          {/* Decorative elements - subtle pattern for light background */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <svg className="h-full w-full" fill="none" viewBox="0 0 100 100">
              <path d="M0 0h100v100H0z" fill="url(#pattern-maslow-v2)"/>
              <defs>
                <pattern id="pattern-maslow-v2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M5 0V20M0 5H20" stroke="#CBD5E1" strokeWidth="0.5"/>
                </pattern>
              </defs>
            </svg>
          </div>

          <div className="relative z-10 text-center space-y-10">
            {/* Quote 1 */}
            <div className="space-y-3">
              <p className="text-2xl md:text-3xl font-serif text-gray-900 leading-relaxed italic">
                "What is necessary to change a person is to change his awareness of himself."
              </p>
              <p className="text-lg font-bold text-gray-700">— Abraham Maslow</p>
            </div>

            {/* Divider */}
            <div className="w-16 h-1 bg-gray-300 mx-auto rounded-full opacity-50"></div>

            {/* Quote 2 */}
            <div className="space-y-3">
              <p className="text-2xl md:text-3xl font-serif text-gray-900 leading-relaxed italic">
                "You can't pull yourself up by your bootstraps if you have no boots."
              </p>
              <p className="text-lg font-bold text-gray-700">— Rutger Bregman</p>
            </div>

            {/* Connection / Context */}
            <div className="pt-8 border-t border-gray-200 mt-8">
              <h3 className="text-xl md:text-2xl font-semibold text-[#3B5998] mb-4">The Foundation of Dignity</h3>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Access to basic sanitation is not just a convenience; it's a fundamental human right that underpins dignity and well-being.
                Without secure and hygienic bathroom access, individuals are constantly hindered from meeting their most basic physiological needs,
                making higher pursuits like self-esteem and self-actualization an impossible dream. We believe that providing this fundamental "boot"—manifested in The Hull—is essential for unlocking human potential for unlocking human potential and fostering a society where everyone has the opportunity to thrive.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MaslowPhilosophy;
