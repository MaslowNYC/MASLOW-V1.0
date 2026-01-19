
import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Wifi, Battery, Signal, User, CheckCircle2 } from 'lucide-react';

const HullPassMockup = () => {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* Phone Frame */}
        <div className="relative rounded-[50px] bg-[#1a1a1a] p-3 shadow-2xl border-[6px] border-[#2f2f2f]">
          {/* Dynamic Island / Notch Area */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-7 w-32 bg-black rounded-b-3xl z-30"></div>
          
          {/* Screen Content */}
          <div className="relative rounded-[40px] overflow-hidden bg-[#F5F1E8] h-[580px] flex flex-col font-sans">
            
            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 pt-5 pb-2 text-xs font-medium text-[#3B5998]">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* App Content */}
            <div className="flex-1 flex flex-col p-6 pt-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                 <div className="w-8 h-8 rounded bg-[#3B5998] flex items-center justify-center text-[#F5F1E8] font-serif font-bold text-xs">M</div>
                 <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                    <User className="w-4 h-4 text-[#3B5998]" />
                 </div>
              </div>

              {/* Pass Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-[#3B5998]/10 overflow-hidden flex flex-col flex-grow max-h-[420px]">
                {/* Card Header */}
                <div className="bg-[#3B5998] p-5 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[#C5A059]/10"></div>
                    <h2 className="text-[#F5F1E8] font-serif text-2xl font-bold relative z-10 tracking-wide">HULL PASS</h2>
                    <p className="text-[#F5F1E8]/70 text-xs uppercase tracking-widest mt-1 relative z-10">Standard Access</p>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col items-center justify-between flex-grow bg-gradient-to-b from-white to-[#F5F1E8]/30">
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full border border-green-100 shadow-sm mb-4">
                    <CheckCircle2 className="w-4 h-4 fill-green-600 text-white" />
                    <span className="text-xs font-bold tracking-wide uppercase">Status: Active</span>
                  </div>

                  {/* QR Code Area */}
                  <div className="w-48 h-48 bg-white p-3 rounded-xl border-2 border-dashed border-[#3B5998]/20 flex items-center justify-center relative group shadow-sm">
                     <QrCode className="w-32 h-32 text-[#3B5998] opacity-90" strokeWidth={1.5} />
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/90">
                        <span className="text-xs font-bold text-[#3B5998]">TAP TO SCAN</span>
                     </div>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-[#3B5998] font-bold text-lg">Guest Member</p>
                    <p className="text-[#3B5998]/60 text-xs mt-1">Refreshes automatically</p>
                  </div>
                </div>

                {/* Footer Decor */}
                <div className="h-2 bg-[#C5A059] w-full"></div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-[10px] text-[#3B5998]/50 uppercase tracking-widest">The Infrastructure of Dignity</p>
              </div>

            </div>
            
            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full"></div>
          </div>
        </div>

        {/* Shadow/Reflection */}
        <div className="absolute -bottom-4 left-10 right-10 h-8 bg-black/20 blur-xl rounded-full z-0"></div>
      </motion.div>
    </div>
  );
};

export default HullPassMockup;
