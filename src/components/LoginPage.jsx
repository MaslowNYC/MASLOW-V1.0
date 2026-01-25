
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient'; // Added for profile check
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const defaultTab = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const safeToast = (props) => {
    if (typeof toast === 'function') {
      toast(props);
    } else {
      console.warn('Toast system unavailable:', props);
    }
  };

  // Helper to decide where to send them
  const checkProfileAndRedirect = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', userId)
        .single();

      if (data && data.first_name) {
        navigate('/'); // Profile complete -> Go to Home
      } else {
        navigate('/profile'); // Incomplete -> Go to Setup
      }
    } catch (e) {
      navigate('/'); // Fallback
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await signIn({ email, password });
      if (error) throw error;
      if (data?.user) await checkProfileAndRedirect(data.user.id);
    } catch (error) {
      safeToast({
        title: "Access Denied",
        description: error.message || "Invalid credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await signUp({ email, password });
      
      if (error) {
        if (error.message?.includes('already registered') || error.status === 422) {
           safeToast({
            title: "Account Exists",
            description: "That email is already in use. Please log in.",
            className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]",
          });
          return;
        }
        throw error;
      }
      
      safeToast({
        title: "Welcome to Maslow",
        description: "Let's set up your preferences.",
        className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]",
      });
      
      if (data?.user) navigate('/profile'); // New users ALWAYS go to profile first

    } catch (error) {
      console.error("Signup Error:", error);
      safeToast({
        title: "Registration Failed",
        description: error.message || "Could not create account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-white/50 hover:text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Maslow
      </Button>

      <Card className="w-full max-w-md bg-white/5 backdrop-blur-md border-white/10 text-white shadow-2xl">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center mb-4 text-[#1a1a1a]">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-serif tracking-wide">Member Access</CardTitle>
          <CardDescription className="text-white/50">
            {defaultTab === 'signup' ? 'Create your account to secure your spot.' : 'Enter your credentials to access the facility.'}
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border-b border-white/10 rounded-none p-0 h-12">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#C5A059] data-[state=active]:text-[#C5A059] rounded-none h-full transition-all text-white/50 hover:text-white"
            >
              Log In
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#C5A059] data-[state=active]:text-[#C5A059] rounded-none h-full transition-all text-white/50 hover:text-white"
            >
              Join Waitlist
            </TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-8">
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="member@maslownyc.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-[#C5A059] text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-[#C5A059] text-white"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-[#1a1a1a] font-bold mt-4"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enter Dashboard"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-[#C5A059] text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Create Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-[#C5A059] text-white"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-[#3B5998] hover:bg-[#2d4475] text-white font-bold mt-4 border border-white/10"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reserve My Spot"}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex justify-center pb-8">
          <p className="text-xs text-white/30 text-center max-w-[200px]">
            By reserving your spot, you agree to the Maslow Privacy Protocol.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;