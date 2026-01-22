import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [memberNumber, setMemberNumber] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  // Fetch current waitlist count on load
  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('beta_signups')
        .select('*', { count: 'exact', head: true });
      if (count) setTotalCount(count);
    };
    fetchCount();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({ title: "Invalid Email", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // 1. Check if email already exists
      const { data: existing } = await supabase
        .from('beta_signups')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        setMemberNumber(existing.id);
        toast({ title: "Welcome back", description: `You are Member #${existing.id}` });
        setLoading(false);
        return;
      }

      // 2. Insert new member
      const { data, error } = await supabase
        .from('beta_signups')
        .insert([{ email, name: 'Founder Candidate' }]) 
        .select()
        .single();

      if (error) throw error;

      // 3. Set Member Number
      setMemberNumber(data.id);
      setTotalCount(prev => prev + 1);
      
      toast({
        title: "Spot Secured",
        description: "Welcome to the inner circle.",
        className: "bg-[#C5A059] text-[#1a1a1a]",
      });

    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not join list. Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F5F1E8] flex flex-col items-center justify-center relative overflow-hidden px-4">
      
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
      
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#3B5998] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-lg w-full text-center"
      >
        {/* LOGO SECTION */}
        <div className="mb-10 flex justify-center">
          <div className="w-32 h-32 md:w-40 md:h-40 relative flex items-center justify-center">
            {/* Glow effect behind the logo */}
            <div className="absolute inset-0 bg-[#C5A059] blur-[40px] opacity-20 rounded-full"></div>
            
            {/* The Real Logo - FIXED WITH LEADING SLASH */}
            <img 
              src="/MASLOW-logo-rev1-png2.png" 
              alt="Maslow NYC" 
              className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Headlines */}
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-tight">
          The Urban Pause.
        </h1>
        <p className="text-[#F5F1E8]/60 text-lg md:text-xl font-light mb-12 leading-relaxed">
          We are building the sanctuary New York deserves.<br/>
          <span className="text-[#C5A059]">Secure your Member Number before we break ground.</span>
        </p>

        {/* Member Card / Form */}
        {!memberNumber ? (
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="relative">
              <Input 
                type="email" 
                placeholder="Enter your email for access" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-center text-lg rounded-full focus:border-[#C5A059] focus:ring-[#C5A059] transition-all"
                autoFocus
              />
            </div>
            <Button 
              disabled={loading}
              className="w-full h-14 rounded-full bg-[#C5A059] hover:bg-[#b08d4b] text-[#0a0a0a] font-bold text-lg tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:shadow-[0_0_30px_rgba(197,160,89,0.5)]"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Claim My Spot"}
            </Button>
            <p className="text-xs text-[#F5F1E8]/30 uppercase tracking-widest mt-6">
              {totalCount > 0 ? `${totalCount.toLocaleString()} people in line` : 'Be the first'}
            </p>
          </form>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#F5F1E8] text-[#0a0a0a] p-8 rounded-2xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-[#C5A059]"></div>
            <CheckCircle2 className="w-12 h-12 text-[#3B5998] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#3B5998] mb-1">Spot Secured.</h2>
            <p className="text-[#3B5998]/60 mb-6">You are on the list.</p>
            
            <div className="bg-[#3B5998]/5 border border-[#3B5998]/10 rounded-lg p-4 mb-6">
              <p className="text-xs uppercase tracking-widest text-[#3B5998]/50 mb-1">Your Member Number</p>
              <p className="text-4xl font-serif font-bold text-[#3B5998]">#{String(memberNumber).padStart(4, '0')}</p>
            </div>

            <p className="text-sm text-[#3B5998]/70 italic">
              "Dignity is a right, not a privilege."
            </p>
          </motion.div>
        )}

      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center w-full opacity-30 text-xs uppercase tracking-widest">
        <Lock className="w-3 h-3 inline-block mr-2 mb-0.5" />
        Maslow NYC • Coming 2026
      </div>
    </div>
  );
};

export default HomePage;