
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card.jsx';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowRight, Mail, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const LoginPage = () => {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for Card A (Guest List)
  const [guestEmail, setGuestEmail] = useState('');
  
  // State for Card B (Founding Member)
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Handler: Guest List
  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if (!guestEmail) return;

    localStorage.setItem('maslow_guest_list_email', guestEmail);
    
    toast({
      title: "You're on the list",
      description: "We'll keep you posted on public opening days.",
      className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]",
    });
    setGuestEmail('');
  };

  // Handler: Member Auth
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsAuthLoading(true);

    try {
      let result;
      if (isLoginMode) {
        result = await signIn(authEmail, authPassword);
      } else {
        result = await signUp(authEmail, authPassword);
      }

      const { error } = result;
      
      if (!error) {
        toast({
          title: isLoginMode ? "Welcome Home" : "Founder Account Created",
          description: "Access granted to the sanctuary.",
          className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059] font-serif",
        });
        navigate('/');
      } else {
        throw error;
      }
    } catch (err) {
      toast({
        title: "Access Denied",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <Helmet>
        <title>The Foyer | Maslow NYC</title>
      </Helmet>

      {/* Ambient Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F1E8] via-[#e6dfcc] to-[#d6cbae] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3B5998] via-[#C5A059] to-[#3B5998]"></div>

      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center mb-16 relative z-10"
      >
        <Link to="/" className="inline-block p-4 rounded-full border border-[#C5A059]/30 bg-white/40 backdrop-blur-md shadow-xl mb-8 group">
            <div className="w-16 h-16 bg-[#3B5998] rounded-full flex items-center justify-center border-2 border-[#C5A059] shadow-inner group-hover:bg-[#2d4475] transition-colors duration-300">
                <span className="text-[#F5F1E8] font-serif font-bold text-3xl">M</span>
            </div>
        </Link>
        <h1 className="text-5xl md:text-6xl font-serif text-[#3B5998] mb-4 tracking-tight drop-shadow-sm">The Foyer</h1>
        <p className="text-[#3B5998]/70 font-light tracking-[0.2em] uppercase text-sm">Welcome to the community</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10 perspective-1000">
        
        {/* CARD A: THE GUEST LIST (Public) */}
        <motion.div 
          initial={{ opacity: 0, x: -50, rotateY: 5 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="h-full bg-white/80 backdrop-blur-md border border-[#3B5998]/10 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#3B5998]/20 group-hover:bg-[#3B5998] transition-colors duration-500"></div>
            <CardHeader className="pt-10 pb-4 px-8">
              <CardTitle className="text-3xl font-serif text-[#3B5998] mb-2 flex items-center gap-3">
                The Guest List
              </CardTitle>
              <p className="text-[#3B5998]/60 font-sans leading-relaxed">
                Not ready to join? Sign up for updates on our public opening.
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleGuestSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="guest-email" className="text-[#3B5998] uppercase tracking-wider text-xs font-bold pl-1">Email Address</Label>
                  <Input 
                    id="guest-email" 
                    type="email" 
                    placeholder="citizen@maslow.nyc" 
                    className="bg-white border-[#3B5998]/10 focus:border-[#3B5998] text-[#3B5998] h-12 transition-all"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                  />
                </div>
                <Button variant="outline" className="w-full border-[#3B5998] text-[#3B5998] hover:bg-[#3B5998] hover:text-[#F5F1E8] h-12 font-bold tracking-widest text-xs uppercase transition-all duration-300">
                  Join the Guest List
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* CARD B: FOUNDING MEMBER (Auth) */}
        <motion.div 
          initial={{ opacity: 0, x: 50, rotateY: -5 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="h-full bg-[#3B5998] border border-[#3B5998] shadow-2xl overflow-hidden relative group">
            {/* Texture & Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B5998] to-[#243456]"></div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#C5A059] rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>

            <CardHeader className="relative z-10 pt-10 pb-4 px-8">
              <div className="flex justify-between items-start">
                 <div>
                    <CardTitle className="text-3xl font-serif text-[#F5F1E8] mb-2 flex items-center gap-3">
                        Founding Member <Sparkles className="w-5 h-5 text-[#C5A059]" />
                    </CardTitle>
                    <p className="text-[#F5F1E8]/70 font-sans leading-relaxed">
                        Create an account to unlock the Store, view the Dashboard, and secure your spot.
                    </p>
                 </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10 px-8 pb-8">
              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="auth-email" className="text-[#C5A059] uppercase tracking-wider text-xs font-bold pl-1">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5F1E8]/30" />
                    <Input 
                        id="auth-email" 
                        type="email" 
                        placeholder="member@maslow.nyc" 
                        className="bg-[#1a1a1a]/20 border-[#F5F1E8]/10 focus:border-[#C5A059] text-[#F5F1E8] h-12 pl-10 placeholder:text-[#F5F1E8]/20 transition-all"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auth-password" className="text-[#C5A059] uppercase tracking-wider text-xs font-bold pl-1">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5F1E8]/30" />
                    <Input 
                        id="auth-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-[#1a1a1a]/20 border-[#F5F1E8]/10 focus:border-[#C5A059] text-[#F5F1E8] h-12 pl-10 placeholder:text-[#F5F1E8]/20 transition-all"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        required
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-[#C5A059] hover:bg-[#d4b06a] text-[#1a1a1a] font-bold h-12 tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] transition-all duration-300 mt-2"
                  disabled={isAuthLoading}
                >
                  {isAuthLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <>
                      {isLoginMode ? "Sign In" : "Create Account"} 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="relative z-10 border-t border-[#F5F1E8]/5 p-6 flex justify-center bg-[#000]/10 mt-auto">
              <button 
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-xs text-[#F5F1E8]/50 hover:text-[#C5A059] transition-colors hover:underline underline-offset-4 uppercase tracking-widest"
              >
                {isLoginMode ? "Apply for Membership" : "Already a Member? Log In"}
              </button>
            </CardFooter>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};

export default LoginPage;
