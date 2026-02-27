import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, Menu, X, CircleUser, Cpu, ClipboardList, ChevronDown, Settings } from 'lucide-react';
import { resetIdentity } from '@/utils/customerio';

// Admin emails - add new admins here
const ADMIN_EMAILS = [
  'patrick@maslownyc.com',
  'cat@maslownyc.com',
  'dayna@maslownyc.com',
  // Legacy domain fallbacks
  'patrick@maslow.nyc',
  'cat@maslow.nyc',
  'dayna@maslow.nyc'
];

interface HeaderProps {
  setIsCartOpen?: (open: boolean) => void;
}

const Header = ({ setIsCartOpen: _setIsCartOpen }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);

  // Close admin menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  const handleLogout = async () => {
    resetIdentity();
    await signOut();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'IMPACT', path: '/impact' },
    { name: 'THE HULL', path: '/hull' },
    { name: 'EVENTS', path: '/events' },
    { name: 'SUITES', path: '/suites' },
    { name: 'PARTNERSHIPS', path: '/partnerships' },
    { name: 'FUTURE', path: '/future' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5F1E8]/90 backdrop-blur-md border-b border-[#3B5998]/10 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#3B5998]/20 group-hover:border-[#C5A059] transition-colors shadow-sm">
            <img
              src="/MASLOW - Round.png"
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
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-xs font-bold tracking-widest transition-colors uppercase ${isActive(link.path) ? 'text-[#C5A059]' : 'text-[#3B5998] hover:text-[#C5A059]'}`}
            >
              {link.name}
            </Link>
          ))}

          {/* User Controls */}
          <div className="flex items-center gap-2 border-l border-[#3B5998]/20 pl-6">
            <Link to="/profile">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 text-xs uppercase tracking-wider ${isActive('/profile') ? 'text-[#C5A059]' : 'text-[#3B5998] hover:text-[#C5A059]'}`}
              >
                <CircleUser className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>

            {isAdmin && (
              <div className="relative" ref={adminMenuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className="text-[#3B5998] hover:text-[#C5A059] hover:bg-[#3B5998]/5 h-8 text-xs uppercase tracking-wider"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} />
                </Button>
                {adminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#3B5998]/10 py-2 z-50">
                    <Link
                      to="/admin"
                      onClick={() => setAdminMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-[#3B5998] hover:bg-[#3B5998]/5 hover:text-[#C5A059]"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/field-research"
                      onClick={() => setAdminMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-[#3B5998] hover:bg-[#3B5998]/5 hover:text-[#C5A059]"
                    >
                      <ClipboardList className="w-4 h-4 mr-3" />
                      Research
                    </Link>
                    <Link
                      to="/prototypes"
                      onClick={() => setAdminMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-[#3B5998] hover:bg-[#3B5998]/5 hover:text-[#C5A059]"
                    >
                      <Cpu className="w-4 h-4 mr-3" />
                      Prototypes
                    </Link>
                  </div>
                )}
              </div>
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

            <Link
              to="/profile"
              className={`text-lg font-bold tracking-widest uppercase ${isActive('/profile') ? 'text-[#C5A059]' : 'text-[#3B5998]'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="text-lg font-bold tracking-widest uppercase text-[#3B5998]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/prototypes"
                className="text-lg font-bold tracking-widest uppercase text-[#3B5998]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Prototypes
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/field-research"
                className="text-lg font-bold tracking-widest uppercase text-[#3B5998]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Research
              </Link>
            )}

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-left text-lg font-bold tracking-widest uppercase text-red-600"
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
