
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatNumber } from '@/utils/formatting';

const Header = ({ setIsCartOpen }) => {
  const { user, signOut, isFounder } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  // If no user is authenticated, hide the header completely
  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  // UPDATED: "The Lotus" is now a standard public link
  const navLinks = [
    { name: 'IMPACT', path: '/impact' }, 
    { name: 'THE HULL', path: '/sanctuary' },
    { name: 'THE LOTUS', path: '/lotus' },
    { name: 'MEMBERSHIP', path: '/membership' },
    { name: 'STORE', path: '/store' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5F1E8]/90 backdrop-blur-md border-b border-[#3B5998]/10 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between w-full">
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#3B5998]/20 group-hover:border-[#C5A059] transition-colors shadow-sm">
            <img 
              src="https://horizons-cdn.hostinger.com/7adf1ef9-c634-4976-bcba-ad9bbe695f8b/3c7aa64b62346b6f961bc303f289feac.png" 
              alt="Maslow Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-serif font-bold text-[#3B5998] tracking-widest group-hover:text-[#C5A059] transition-colors uppercase hidden sm:block">
            Maslow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-xs font-bold tracking-widest transition-colors uppercase ${isActive('/') ? 'text-[#C5A059]' : 'text-[#3B5998] hover:text-[#C5A059]'}`}
          >
            Home
          </Link>
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              className={`text-xs font-bold tracking-widest transition-colors uppercase ${isActive(link.path) ? 'text-[#C5A059]' : 'text-[#3B5998] hover:text-[#C5A059]'}`}
            >
              {link.name}
            </Link>
          ))}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-[#3B5998] hover:text-[#C5A059] hover:bg-[#3B5998]/5"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C5A059] text-[#F5F1E8] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {formatNumber(cartCount)}
              </span>
            )}
          </Button>

          {/* User Controls */}
          <div className="flex items-center gap-2 border-l border-[#3B5998]/20 pl-6">
            {/*
