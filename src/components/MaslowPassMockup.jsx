
import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Wifi } from 'lucide-react';

const MaslowPassMockup = () => {
  const maslowLogoUrl = "https://horizons-cdn.hostinger.com/7adf1ef9-c634-4976-bcba-ad9bbe695f8b/c5e307fc776c59afba00eb9cf58742d3.jpg";

  return (
    <div className="mt-24 w-full">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-serif text-[#3B5998] mb-4">
          Your Key to the City
        </h3>
        <p className="text-xl text-[#3B5998]/80 max-w-2xl mx-auto font-medium">
          Instant access right from your phone's wallet.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-24 overflow-hidden py-10">
        
        {/* iPhone Mockup */}
        <motion.div
          initial={{ opacity: 0, x: -50, rotateY: -15 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-[300px] h-[600px] bg-black rounded-[50px] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[30px] w-[100px] bg-black rounded-b-2xl z-20"></div>
          
          {/* Screen Content */}
          <div className="w-full h-full bg-gray-100 pt-14 px-4 flex flex-col items-center">
            {/* Wallet Header */}
            <div className="w-full flex justify-between items-center mb-6 px-2">
              <span className="text-black font-bold text-xl">Wallet</span>
              <div className="flex gap-1">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-xs">+</div>
              </div>
            </div>

            {/* The Pass */}
            <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-[#3B5998] to-[#1e3a6e] rounded-xl p-4 text-white relative shadow-lg overflow-hidden flex flex-col justify-between">
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C5A059]/20 rounded-full blur-xl"></div>
              
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-3">
                   {/* Logo Image */}
                   <div className="w-10 h-10 rounded-md overflow-hidden shadow-sm border border-[#C5A059]/30">
                     <img src={maslowLogoUrl} alt="Maslow Logo" className="w-full h-full object-cover" />
                   </div>
                   <span className="font-bold tracking-wide uppercase text-sm">Maslow</span>
                </div>
                <span className="text-[#C5A059] font-bold text-xs uppercase tracking-wider border border-[#C5A059] px-2 py-0.5 rounded">Founder</span>
              </div>
              
              <div className="z-10">
                <div className="text-[#C5A059] text-xs uppercase mb-1">Pass Holder</div>
                <div className="text-xl font-bold font-serif">Alex Morgan</div>
              </div>

              {/* QR Code Placeholder */}
              <div className="absolute bottom-4 right-4 bg-white p-1 rounded">
                 <QrCode className="w-8 h-8 text-black" />
              </div>
            </div>

            {/* Other Cards Stacked Behind */}
            <div className="w-[90%] h-12 bg-gray-300 rounded-t-xl mt-[-10px] opacity-50 mx-auto"></div>
            <div className="w-[85%] h-12 bg-gray-400 rounded-t-xl mt-[-35px] opacity-30 mx-auto"></div>

          </div>
        </motion.div>

        {/* Android Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotateY: 15 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-[300px] h-[610px] bg-[#2d2d2d] rounded-[35px] border-[4px] border-[#4a4a4a] shadow-2xl overflow-hidden"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
        >
          {/* Punch Hole Camera */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-20"></div>

          {/* Screen Content */}
          <div className="w-full h-full bg-white pt-12 px-4 flex flex-col">
             <div className="flex justify-center mb-8">
               <span className="text-gray-500 font-medium">Google Wallet</span>
             </div>

             {/* The Pass */}
             <div className="w-full bg-[#3B5998] rounded-2xl overflow-hidden shadow-md">
                {/* Top Section */}
                <div className="p-5 bg-[#3B5998] text-white relative">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059] rounded-bl-[100px] opacity-20"></div>
                   
                   <div className="flex items-center gap-3 mb-6">
                      {/* Logo Image */}
                      <div className="w-12 h-12 rounded-md overflow-hidden shadow-sm border border-white/20">
                        <img src={maslowLogoUrl} alt="Maslow Logo" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">Maslow NYC</div>
                        <div className="text-[#C5A059] text-xs uppercase">Visionary Tier</div>
                      </div>
                   </div>

                   <div className="flex justify-between items-end">
                      <div>
                        <div className="text-white/60 text-xs uppercase mb-1">Member</div>
                        <div className="font-medium text-lg">Jordan Lee</div>
                      </div>
                      <Wifi className="w-6 h-6 text-white/50 rotate-90" />
                   </div>
                </div>

                {/* Divider with notches */}
                <div className="h-4 bg-[#3B5998] relative flex items-center justify-center">
                   <div className="w-full border-t border-dashed border-white/20"></div>
                   <div className="absolute left-[-10px] w-5 h-5 bg-white rounded-full"></div>
                   <div className="absolute right-[-10px] w-5 h-5 bg-white rounded-full"></div>
                </div>

                {/* Bottom Section (QR) */}
                <div className="bg-[#3B5998] p-5 flex justify-center pb-8">
                   <div className="bg-white p-2 rounded-lg">
                      <QrCode className="w-24 h-24 text-black" />
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default MaslowPassMockup;
