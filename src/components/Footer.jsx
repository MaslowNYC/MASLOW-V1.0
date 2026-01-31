
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1D5DA0] text-white pt-16 pb-8 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold tracking-widest">MASLOW</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              The Infrastructure of Dignity.
              <br />
              New York, NY.
            </p>
          </div>

          {/* SITEMAP */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs text-[#C5A059] mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/hull" className="text-white/70 hover:text-white transition-colors">The Hull</Link></li>
              <li><Link to="/lotus" className="text-white/70 hover:text-white transition-colors">Sanctuary Suites</Link></li>
              <li><Link to="/impact" className="text-white/70 hover:text-white transition-colors">Impact</Link></li>
              <li><Link to="/membership" className="text-white/70 hover:text-white transition-colors">Membership</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs text-[#C5A059] mb-6">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><span className="text-white/40 cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="text-white/40 cursor-not-allowed">Terms of Service</span></li>
            </ul>
          </div>

          {/* CONNECT */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs text-[#C5A059] mb-6">Connect</h4>
            <a href="mailto:hello@maslownyc.com" className="text-white/70 hover:text-white transition-colors text-sm block mb-4">
              hello@maslownyc.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © 2026 Maslow NYC. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <ShieldCheck className="w-3 h-3" />
            <span>Secure Infrastructure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;