import React from 'react';
import { motion } from 'framer-motion';

const PowderRoomInterior: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Powder Room Container */}
      <div className="relative h-96 bg-gradient-to-b from-white to-[#F5F1E8] rounded-lg shadow-2xl overflow-hidden border-2 border-[#3B5998]/10">

        {/* Subway Tile Pattern Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-8 grid-rows-12 h-full gap-1 p-4">
            {[...Array(96)].map((_, i: number) => (
              <div key={i} className="bg-white border border-gray-200 rounded-sm"></div>
            ))}
          </div>
        </div>

        {/* Lighting Effect */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-32 bg-gradient-radial from-[#C5A059]/20 to-transparent blur-2xl"></div>

        {/* Mirror */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-48 h-56 bg-gradient-to-br from-gray-100 via-white to-gray-200 rounded-lg border-4 border-[#C5A059] shadow-xl">
          {/* Mirror Reflection Effect */}
          <div className="absolute inset-2 bg-gradient-to-br from-white/40 via-transparent to-white/20 rounded"></div>

          {/* Subtle Maslow Logo Reflection */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <img
              src="/MASLOW - Round.png"
              alt="Reflection"
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>

        {/* Vanity/Sink */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-56 h-20">
          {/* Countertop */}
          <div className="absolute bottom-0 w-full h-16 bg-gradient-to-b from-[#E8DCC8] to-[#D4C4A8] rounded-t-lg border-t-2 border-[#C5A059]/30 shadow-lg">
            {/* Sink */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-10 bg-gradient-to-b from-white to-gray-100 rounded-full border-2 border-gray-300 shadow-inner">
              {/* Faucet */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-6 bg-gradient-to-b from-[#C5A059] to-[#b08d4b] rounded-full shadow-md"></div>
                <div className="w-6 h-3 bg-gradient-to-b from-[#C5A059] to-[#b08d4b] rounded-t-full -mt-1 shadow-md"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Glow Effects */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#C5A059]/10 to-transparent"></div>
      </div>
    </motion.div>
  );
};

export default PowderRoomInterior;
