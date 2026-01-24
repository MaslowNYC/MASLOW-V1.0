
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import BetaSignupModal from '@/components/BetaSignupModal';
import { ArrowRight, Lock, Loader2 } from 'lucide-react';

const HeroSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      // 1. Insert into beta_signups table
      const { error } = await supabase
        .from('beta_signups')
        .insert([{ email, status: 'pending' }]);

      if (error) {
        // If duplicate email, just treat as success (security through obscurity)
        if (error.code === '23505') {
           toast({
            title: "Already Registered",
            description: "You are already on the list. Watch your inbox.",
            className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]",
          });
          setLoading(false);
          return;
        }
        throw error;
      }

      // 2. Success
      toast({
        title: "Access Requested",
        description: "You have been added to the priority queue.",
        className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]",
      });
      setEmail('');
      
      // Optional: Open the modal to upsell membership immediately?
      // setIsBetaModalOpen(true); 

    } catch (error) {
      console.error('Waitlist Error:', error);
      toast({
        title: "System Error",
        description: "Could not process request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
      
      {/* Background Video/Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        {/* Replace with your subway tile video or image */}
        <img 
          src="https://images.unsplash.com/photo-1555617778-02518510b9fa?q=80&w=2070&auto=format&fit=crop" 
          alt="Subway Tiles" 
          className="w-full h-full object-cover grayscale opacity-40"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-4xl px-4 text-center">
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-[#F5F1E8] tracking-widest uppercase mb-2">
            Maslow
          </h1>
          <div className="h-1 w-24 bg-[#C5A059] mx-auto"></div>
        </motion.div>

        {/* Tagline */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12 space-y-4"
        >
          <p className="text-xl md:text-2xl text-[#F5F1E8]/80 font-light tracking-wide">
            The Infrastructure of Dignity.
          </p>
          <p className="text-sm text-[#C5A059] uppercase tracking-[0.2em] font-bold">
            Coming to NYC 2026
          </p>
        </motion.div>

        {/* The Gate (Email Form) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="max-w-md mx-auto bg-white/5 backdrop-blur-md p-1 rounded-full border border-white/10 flex items-center"
        >
          <form onSubmit={handleWaitlistSubmit} className="flex w-full">
            <Input 
              type="email" 
              placeholder="Enter access code or email..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none text-white placeholder:text-white/40 h-12 px-6 focus-visible:ring-0 rounded-l-full flex-grow"
              required
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#C5A059] hover:bg-[#b08d4b] text-[#1a1a1a] font-bold h-12 px-8 rounded-full transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request Access"}
            </Button>
          </form>
        </motion.div>

        {/* Member Login Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16"
        >
          <Button 
            variant="link" 
            onClick={() => navigate('/login')}
            className="text-white/30 hover:text-[#C5A059] text-xs uppercase tracking-widest transition-colors"
          >
            <Lock className="w-3 h-3 mr-2" />
            Member Login
          </Button>
        </motion.div>

      </div>

      {/* Beta Modal (Hidden by default, can be triggered) */}
      <BetaSignupModal 
        isOpen={isBetaModalOpen} 
        onClose={() => setIsBetaModalOpen(false)} 
      />
    </div>
  );
};

export default HeroSection;