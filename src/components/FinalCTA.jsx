
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const FinalCTA = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAction = () => {
     navigate('/mission');
     toast({
      title: "Public-Private Partnership",
      description: "Viewing proposal details.",
      className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]",
    });
  };

  return (
    <section className="w-full bg-gradient-to-br from-[#8E2DE2] via-[#A855F7] to-[#EC4899] py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-900 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/20 text-white text-sm font-bold tracking-wider mb-8 border border-white/30 backdrop-blur-sm shadow-lg"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              THE INFRASTRUCTURE OF DIGNITY
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-xl">
              We Can't Hold It In Anymore!
            </h2>
            
            <p className="text-white/95 text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Maslow is ready to partner with the City of New York. Join us in building a sustainable, dignified future for public sanitation.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group max-w-full"
            >
              <div className="absolute -inset-1 bg-white rounded-full blur opacity-40 group-hover:opacity-70 transition duration-300"></div>
              
              <Button 
                onClick={handleAction}
                className="relative bg-white text-[#8E2DE2] hover:bg-white/90 text-lg md:text-xl font-extrabold py-8 px-6 md:px-12 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border-4 border-transparent hover:border-purple-200 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto whitespace-normal h-auto text-center"
              >
                <FileText className="w-6 h-6 flex-shrink-0" />
                <span>View Public-Private Partnership Proposal</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
