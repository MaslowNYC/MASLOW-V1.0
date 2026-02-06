
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

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

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await signIn({ email, password });
      if (error) throw error;
      
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, phone_verified')
          .eq('id', data.user.id)
          .single();

        if (profile && !profile.phone_verified) {
          setShowVerification(true);
          setPendingUserId(data.user.id);
          return;
        }

        if (profile && profile.first_name) {
          navigate('/');
        } else {
          navigate('/profile');
        }
      }
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
      const cleanedPhone = phone.replace(/\D/g, '');

      if (cleanedPhone.length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

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
        
        console.log('⏳ Waiting for profile to be created by trigger...');
        
        // Wait for the profile to be created by the trigger
        let attempts = 0;
        let profileExists = false;
        
        while (attempts < 10 && !profileExists) {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { data: checkData } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id);
          
          if (checkData && checkData.length > 0) {
            profileExists = true;
            console.log('✅ Profile exists!');
          } else {
            attempts++;
            console.log(`⏳ Profile not ready yet... attempt ${attempts}/10`);
          }
        }
        
        // If trigger didn't work, create profile manually
        if (!profileExists) {
          console.log('⚠️ Trigger failed, creating profile manually...');
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: email,
              first_name: firstName,
              last_name: lastName,
              phone: cleanedPhone,
              phone_verified: false
            });
          
          if (insertError) {
            console.error('❌ Manual profile creation failed:', insertError);
            throw new Error(`Failed to create profile: ${insertError.message}`);
          }
          
          console.log('✅ Profile created manually');
        }
        
        // Send SMS verification via Twilio Verify API
        console.log('📱 Sending verification code via Twilio...');
        const { sendVerificationSMS } = await import('../utils/sendSMS');
        const smsResult = await sendVerificationSMS(cleanedPhone);

        if (!smsResult.success) {
          console.error('⚠️ SMS failed to send:', smsResult.error);
          throw new Error('Failed to send verification code. Please try again.');
        }

        console.log('✅ Verification SMS sent via Twilio');

        setPendingUserId(data.user.id);
        setShowVerification(true);

        safeToast({
          title: "Verification Code Sent",
          description: `We've sent a 6-digit code to ${phone}`,
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
      console.log('🔍 Verifying code with Twilio...');
      
      // Verify code using Twilio Verify API
      const { verifyCode } = await import('../utils/sendSMS');
      const cleanedPhone = phone.replace(/\D/g, '');
      const verifyResult = await verifyCode(cleanedPhone, verificationCode);

      if (!verifyResult.success) {
        throw new Error(verifyResult.error || 'Invalid verification code');
      }

      console.log('✅ Code verified by Twilio!');

      // Update profile to mark phone as verified
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ phone_verified: true })
        .eq('id', pendingUserId);

      if (updateError) {
        console.error('❌ Update error:', updateError);
        throw updateError;
      }

      safeToast({
        title: "Phone Verified! ✓",
        description: "Welcome to Maslow",
      });

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
      console.log('📱 Resending verification code...');
      
      // Resend via Twilio Verify API
      const { sendVerificationSMS } = await import('../utils/sendSMS');
      const cleanedPhone = phone.replace(/\D/g, '');
      const smsResult = await sendVerificationSMS(cleanedPhone);

      if (!smsResult.success) {
        throw new Error('Failed to resend code. Please try again.');
      }

      console.log('✅ New code sent via Twilio');
      
      safeToast({
        title: "New Code Sent",
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

  const handleBackToSignup = () => {
    setShowVerification(false);
    setVerificationCode('');
    setPendingUserId(null);
  };

  // SMS Verification Screen
  if (showVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2C5F8D] to-[#1a1a1a] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1a1a1a]/90 backdrop-blur border-[#C5A059]/30">
          <CardHeader className="space-y-1 pb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSignup}
              className="w-fit mb-2 text-white/60 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Signup
            </Button>
            <CardTitle className="text-2xl font-bold text-center text-[#C5A059]">
              Verify Your Phone
            </CardTitle>
            <CardDescription className="text-center text-white/60">
              Enter the 6-digit code we sent to {phone || 'your phone'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-white">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="bg-white/5 border-white/10 focus:border-[#C5A059] text-white text-center text-2xl tracking-widest"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-[#1a1a1a] font-bold"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                disabled={loading}
                className="w-full text-white/60 hover:text-white"
              >
                Didn't receive a code? Resend
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Login/Signup Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2C5F8D] to-[#1a1a1a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1a1a]/90 backdrop-blur border-[#C5A059]/30">
        <Tabs defaultValue={defaultTab} className="w-full">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex flex-col items-center mb-4">
              <h1 className="text-4xl font-bold text-[#C5A059] mb-2">Maslow</h1>
              <p className="text-white/60 text-sm">The Infrastructure of Dignity</p>
            </div>
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger value="login" className="data-[state=active]:bg-white/10">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white/10">
                Sign Up
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            {/* LOGIN FORM */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-white">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-[#C5A059] text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-white">Password</Label>
                  <Input
                    id="login-password"
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
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* SIGNUP FORM */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="text-white">First Name</Label>
                    <Input
                      id="first-name"
                      type="text"
                      placeholder="Patrick"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-white/5 border-white/10 focus:border-[#C5A059] text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name" className="text-white">Last Name</Label>
                    <Input
                      id="last-name"
                      type="text"
                      placeholder="May"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-white/5 border-white/10 focus:border-[#C5A059] text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
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
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="bg-white/5 border-white/10 focus:border-[#C5A059] text-white"
                    required
                  />
                  <p className="text-xs text-white/40">We'll send a verification code to this number</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-[#C5A059] text-white"
                    required
                  />
                  <p className="text-xs text-white/40">Minimum 6 characters</p>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-[#1a1a1a] font-bold mt-4"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default LoginPage;
