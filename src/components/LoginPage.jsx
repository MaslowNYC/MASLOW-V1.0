import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, ArrowLeft, Phone } from 'lucide-react';

const LoginPage = () => {
  // Login/Signup state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  
  // SMS Verification state
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingUserId, setPendingUserId] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null); // For test mode
  
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
        .select('first_name, phone_verified')
        .eq('id', userId)
        .single();

      // If phone not verified, show verification screen
      if (data && !data.phone_verified) {
        setShowVerification(true);
        setPendingUserId(userId);
        return;
      }

      // If profile complete, go home
      if (data && data.first_name) {
        navigate('/');
      } else {
        // Profile incomplete, go to setup
        navigate('/profile');
      }
    } catch (e) {
      navigate('/');
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

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate phone number
      const cleanedPhone = phone.replace(/\D/g, '');
      if (cleanedPhone.length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Validate required fields
      if (!firstName.trim() || !lastName.trim()) {
        throw new Error('Please enter your first and last name');
      }

      console.log('📝 Starting signup...');

      const { data, error } = await signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: cleanedPhone,
            phone_verified: false
          }
        }
      });
      
      if (error) {
        if (error.message?.includes('already registered') || error.status === 422) {
          safeToast({
            title: "Account Exists",
            description: "That email is already in use. Please log in.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }
      
      if (data?.user) {
        console.log('✅ User created:', data.user.id);
        
        // CRITICAL: Get the session token into the client
        console.log('🔄 Refreshing session to get auth token...');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session refresh failed:', sessionError);
        } else {
          console.log('✅ Session established:', sessionData.session ? 'Yes' : 'No');
        }
        
        // Generate verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        
        console.log('🔑 Generated code:', code);
        console.log('⏳ Waiting for profile to be created by trigger...');
        
        // Wait for the profile to be created by the trigger (give it up to 5 seconds)
        let attempts = 0;
        let profileExists = false;
        
        while (attempts < 10 && !profileExists) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
          
          const { data: checkData, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id);
          
          if (checkData && checkData.length > 0) {
            profileExists = true;
            console.log('✅ Profile exists! Storing verification code...');
          } else {
            attempts++;
            console.log(`⏳ Profile not ready yet... attempt ${attempts}/10`);
          }
        }
        
        // If trigger didn't work, create profile manually
        if (!profileExists) {
          console.log('⚠️ Trigger failed, creating profile manually...');
          console.log('📋 Profile data to insert:', {
            id: data.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            phone: cleanedPhone,
            phone_verified: false
          });
          
          const { data: insertData, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: email,
              first_name: firstName,
              last_name: lastName,
              phone: cleanedPhone,
              phone_verified: false
            })
            .select(); // Return the inserted row
          
          if (insertError) {
            console.error('❌ Manual profile creation failed:', insertError);
            console.error('❌ Error details:', JSON.stringify(insertError, null, 2));
            throw new Error(`Failed to create profile: ${insertError.message}`);
          }
          
          console.log('✅ Profile created manually:', insertData);
        }
        
        // Store verification code using secure RPC function (bypasses RLS)
        console.log('💾 Storing verification code via RPC...');
        const { error: updateError } = await supabase.rpc('store_verification_code', {
          user_id: data.user.id,
          code: code,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
        });
        
        if (updateError) {
          console.error('❌ Failed to store verification code:', updateError);
          throw updateError;
        }
        
        console.log('✅ Verification code stored successfully');
        
        setPendingUserId(data.user.id);
        setShowVerification(true);
        
        // In production, send SMS here
        console.log(`📱 SMS VERIFICATION CODE: ${code}`); // Remove this in production
        
        safeToast({
          title: "Verification Code Sent",
          description: `We've sent a code to ${phone}`,
        });
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      safeToast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔍 Checking verification for user:', pendingUserId);
      
      // Get the stored code and expiration
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('verification_code, code_expires_at')
        .eq('id', pendingUserId);

      console.log('📊 Query result:', { data, error: fetchError });

      if (fetchError) {
        console.error('❌ Fetch error:', fetchError);
        throw fetchError;
      }
      
      if (!data || data.length === 0) {
        console.error('❌ No profile found for user:', pendingUserId);
        throw new Error('Profile not found. Please try signing up again.');
      }
      
      const profile = data[0];
      console.log('✅ Profile found:', profile);

      // Check if code expired
      const expiresAt = new Date(profile.code_expires_at);
      const now = new Date();
      console.log('⏰ Time check:', { 
        expiresAt: expiresAt.toISOString(), 
        now: now.toISOString(),
        expired: expiresAt < now 
      });
      
      if (expiresAt < now) {
        console.error('⏰ Code expired');
        throw new Error('Verification code expired. Please request a new one.');
      }

      // Check if code matches
      console.log('🔑 Comparing codes:', { 
        entered: verificationCode, 
        stored: profile.verification_code 
      });
      
      if (profile.verification_code !== verificationCode) {
        throw new Error('Invalid verification code');
      }

      console.log('✅ Code matched! Updating profile...');

      // Mark phone as verified
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          phone_verified: true,
          verification_code: null,
          code_expires_at: null
        })
        .eq('id', pendingUserId);

      if (updateError) {
        console.error('❌ Update error:', updateError);
        throw updateError;
      }

      console.log('✅ Phone verified successfully!');

      safeToast({
        title: "Phone Verified! ✓",
        description: "Welcome to Maslow",
      });

      // Proceed to profile setup or home
      navigate('/profile');
    } catch (error) {
      console.error('❌ Verification error:', error);
      safeToast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      // Generate new code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      
      // Update database using RPC
      const { error } = await supabase.rpc('store_verification_code', {
        user_id: pendingUserId,
        code: code,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      });
      
      if (error) throw error;
      
      console.log(`📱 NEW SMS CODE: ${code}`); // Remove in production
      
      safeToast({
        title: "Code Resent",
        description: "Check your phone for the new code",
      });
    } catch (error) {
      safeToast({
        title: "Resend Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // If showing verification screen
  if (showVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8] p-4">
        <Card className="w-full max-w-md border-[#3B5998]">
          <CardHeader className="space-y-2">
            <button
              onClick={() => {
                setShowVerification(false);
                setPendingUserId(null);
                setVerificationCode('');
                setGeneratedCode(null);
              }}
              className="flex items-center text-sm text-[#3B5998] hover:text-[#2d4373] mb-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Signup
            </button>
            <div className="flex items-center gap-2">
              <Phone className="h-6 w-6 text-[#3B5998]" />
              <CardTitle className="text-2xl text-[#3B5998]">Verify Your Phone</CardTitle>
            </div>
            <CardDescription>
              Enter the 6-digit code we sent to {phone || 'your phone'}
            </CardDescription>
            {/* TESTING ONLY - REMOVE IN PRODUCTION */}
            {generatedCode && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-sm">
                <strong>TEST MODE:</strong> Your code is <strong>{generatedCode}</strong>
              </div>
            )}
            {!generatedCode && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded text-sm">
                <strong>No code found.</strong> Click "Back to Signup" and try again.
              </div>
            )}
          </CardHeader>
          <form onSubmit={handleVerifyCode}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full bg-[#3B5998] hover:bg-[#2d4373]"
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Phone'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                disabled={loading}
                className="w-full text-[#3B5998]"
              >
                Resend Code
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // Normal login/signup screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8] p-4">
      <Card className="w-full max-w-md border-[#3B5998]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-[#3B5998]">Maslow</CardTitle>
          <CardDescription className="text-center">
            The Infrastructure of Dignity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#3B5998] hover:bg-[#2d4373]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* SIGNUP TAB */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    We'll send a verification code to this number
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500">
                    Minimum 6 characters
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#3B5998] hover:bg-[#2d4373]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
