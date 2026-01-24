import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, ShieldCheck, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulating save to localStorage as requested
    try {
        localStorage.setItem('maslow_newsletter_email', email);
        
        // Small delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 600));

        toast({
          title: "Welcome to the Movement! 🎉",
          description: "We'll keep you updated on our progress.",
          duration: 4000,
          className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]",
        });
        setEmail('');
    } catch (error) {
        toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#F5F1E8] border-t border-[#3B5998]/10 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Funding Goal Disclaimer */}
        <div className="bg-[#3B5998]/5 border border-[#3B5998]/10 rounded-xl p-6 max-w-3xl mx-auto mb-16 text-center">
          <div className="flex justify-center mb-3">
             <ShieldCheck className="w-8 h-8 text-[#C5A059]" />
          </div>
          <p className="text-[#3B5998] font-medium text-lg leading-relaxed">
            Our Guarantee: <span className="text-[#C5A059] font-bold">Every contribution goes directly towards securing our first location and building the infrastructure of dignity.</span> Your trust builds our foundation.
          </p>
        </div>

        {/* Email Capture */}
        <div className="text-center mb-16">
          <h4 className="text-2xl font-serif text-[#3B5998] mb-6">
            Join the Waiting List
          </h4>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B5998]/40" />
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Your email address" 
                className="w-full bg-white border border-[#3B5998]/20 rounded-md py-3 pl-11 pr-4 text-[#3B5998] placeholder:text-[#3B5998]/40 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all" 
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="bg-[#3B5998] text-[#F5F1E8] hover:bg-[#C5A059] hover:text-[#3B5998] font-bold px-8 transition-all duration-300 uppercase tracking-wider">
              {isSubmitting ? '...' : 'Subscribe'}
            </Button>
          </form>
        </div>

        {/* Links and Contact */}
        <div className="grid md:grid-cols-4 gap-8 text-center md:text-left mb-12 border-b border-[#3B5998]/10 pb-12">
          <div>
            <h5 className="text-[#C5A059] font-bold mb-3 uppercase tracking-wide text-sm">Website</h5>
            <a href="https://maslownyc.com" target="_blank" rel="noopener noreferrer" className="text-[#3B5998]/80 hover:text-[#C5A059] transition-colors">
              maslownyc.com
            </a>
          </div>
          <div>
            <h5 className="text-[#C5A059] font-bold mb-3 uppercase tracking-wide text-sm">Non-Profit Project</h5>
            {/* UPDATED LINK AND TEXT BELOW */}
            <a href="https://maslownyc.org" target="_blank" rel="noopener noreferrer" className="text-[#3B5998]/80 hover:text-[#C5A059] transition-colors">
              maslownyc.org
            </a>
          </div>
          <div>
            <h5 className="text-[#C5A059] font-bold mb-3 uppercase tracking-wide text-sm">Partnerships</h5>
            <Link to="/impact" className="text-[#3B5998]/80 hover:text-[#C5A059] transition-colors flex items-center gap-2 justify-center md:justify-start">
               <FileText className="w-4 h-4" />
               View Proposal
            </Link>
          </div>
          <div>
            <h5 className="text-[#C5A059] font-bold mb-3 uppercase tracking-wide text-sm">Contact</h5>
            <a href="mailto:Patrick@Maslownyc.com" className="text-[#3B5998]/80 hover:text-[#C5A059] transition-colors">
              Patrick@Maslownyc.com
            </a>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center pt-8">
          <p className="text-[#3B5998]/80 font-medium italic text-lg">
            Built by Families. Majority Women-Owned.
          </p>
          <p className="text-[#3B5998]/30 text-xs mt-4 uppercase tracking-widest">
            © 2026 Maslow NYC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
