
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

  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  // UPDATED: 'THE HULL' points to /hull
  const navLinks = [
    { name: 'IMPACT', path: '/impact' }, 
    { name: 'THE HULL', path: '/hull' },
    { name: 'THE LOTUS', path: '/lotus' },
    { name: 'MEMBERSHIP', path: '/membership' },
    { name: 'STORE', path: '/store' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5F1E8]/90 backdrop-blur-md border-b border-[#3B5998]/10 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between w-full">
        {/* Logo Area - Points to /hull */}
        <Link to="/hull" className="flex items-center gap-3 group shrink-0">
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
            to="/hull" 
            className={`text-xs font-bold tracking-widest transition-colors uppercase ${isActive('/hull') ? 'text-[#C5A059]' : 'text-[#3B5998] hover:text-[#C5A059]'}`}
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
            {isFounder && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-[#3B5998] hover:text-[#C5A059] hover:bg-[#3B5998]/5 h-8 text-xs uppercase tracking-wider">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            )}
            
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[#3B5998]/60 hover:text-red-600 hover:bg-red-50 h-8">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
            <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-[#3B5998] hover:text-[#C5A059]"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C5A059] text-[#F5F1E8] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {formatNumber(cartCount)}
              </span>
            )}
          </Button>
          <Button 
            variant="ghost" 
            className="text-[#3B5998]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F5F1E8] border-t border-[#3B5998]/10 py-6 absolute w-full shadow-xl left-0 right-0 h-screen z-50">
          <div className="container mx-auto px-4 flex flex-col gap-6">
            <Link 
              to="/hull" 
              className={`text-lg font-bold tracking-widest uppercase ${isActive('/hull') ? 'text-[#C5A059]' : 'text-[#3B5998]'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`text-lg font-bold tracking-widest uppercase ${isActive(link.path) ? 'text-[#C5A059]' : 'text-[#3B5998]'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-px bg-[#3B5998]/10 my-2" />
            
            {isFounder && (
              <Link 
                to="/admin" 
                className="text-[#3B5998] hover:text-[#C5A059] font-medium tracking-wide transition-colors uppercase text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            <Button 
              onClick={handleLogout} 
              className="text-red-500 hover:bg-red-100 w-full justify-start pl-0 uppercase text-sm"
              variant="ghost"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;