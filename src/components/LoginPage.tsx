import { useState, useEffect, useRef, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { identifyUser } from '@/utils/customerio';
import LanguageModal from '@/components/LanguageModal';
import { useLanguage } from '@/hooks/useLanguage';

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

// Google Fonts URL for page-scoped fonts
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400&display=swap';

const LoginPage = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode] = useState('+1');
  const [loading, setLoading] = useState(false);

  // Multi-step signup state
  const [signupStep, setSignupStep] = useState(1);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Member number preview
  const [nextMemberNumber, setNextMemberNumber] = useState<number | null>(null);

  // SMS Verification state
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Language modal
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set default tab from URL params
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setActiveTab('signup');
    }
  }, [searchParams]);

  // Inject page-scoped fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = FONT_URL;
    link.rel = 'stylesheet';
    link.id = 'login-page-fonts';
    document.head.appendChild(link);

    return () => {
      const existingLink = document.getElementById('login-page-fonts');
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    };
  }, []);

  // Fetch next member number on mount
  useEffect(() => {
    const fetchNextNumber = async () => {
      try {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        setNextMemberNumber((count || 0) + 1);
      } catch (err) {
        console.error('Error fetching member count:', err);
      }
    };
    fetchNextNumber();
  }, []);

  const safeToast = (props: ToastProps) => {
    if (typeof toast === 'function') {
      toast(props);
    } else {
      console.warn('Toast system unavailable:', props);
    }
  };

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  // Code digit input handlers
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...codeDigits];
    newDigits[index] = value.slice(-1);
    setCodeDigits(newDigits);

    // Auto-advance to next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  // Login handler
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await signIn({ email, password });
      if (error) throw error;

      if (data?.user) {
        const { data: profile } = await (supabase
          .from('profiles') as any)
          .select('first_name, phone_verified')
          .eq('id', data.user.id)
          .single();

        if (profile && !profile.phone_verified) {
          // User needs to verify phone - go to step 3
          setPendingUserId(data.user.id);
          setActiveTab('signup');
          setSignupStep(3);
          return;
        }

        identifyUser(data.user, { first_name: profile?.first_name || undefined });

        if (profile && profile.first_name) {
          navigate('/');
        } else {
          navigate('/profile');
        }
      }
    } catch (error) {
      safeToast({
        title: t('login.accessDenied'),
        description: error instanceof Error ? error.message : "Invalid credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Signup Step 1 - Validate and continue
  const handleSignupStep1 = async (e: FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      safeToast({
        title: t('login.signupFailed'),
        description: 'Please enter your first name',
        variant: "destructive",
      });
      return;
    }

    if (!email.trim() || !password.trim()) {
      safeToast({
        title: t('login.signupFailed'),
        description: 'Please enter email and password',
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      safeToast({
        title: t('login.signupFailed'),
        description: 'Password must be at least 6 characters',
        variant: "destructive",
      });
      return;
    }

    setSignupStep(2);
  };

  // Signup Step 2 - Create account and send SMS
  const handleSignupStep2 = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanedPhone = phone.replace(/\D/g, '');

      if (cleanedPhone.length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      console.log('📝 Starting signup...');

      const { data, error } = await signUp({
        email,
        password,
      });

      if (error) {
        if (error.message?.includes('already registered')) {
          safeToast({
            title: t('login.accountExists'),
            description: t('login.accountExistsDesc'),
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

          const { data: checkData } = await (supabase
            .from('profiles') as any)
            .select('id')
            .eq('id', data.user.id);

          if (checkData && checkData.length > 0) {
            profileExists = true;
            console.log('✅ Profile exists!');

            try {
              identifyUser(data.user, { member_number: null, first_name: firstName });
            } catch (err) {
              console.error('Customer.io failed, continuing signup:', err);
            }
          } else {
            attempts++;
            console.log(`⏳ Profile not ready yet... attempt ${attempts}/10`);
          }
        }

        // If trigger didn't work, create profile manually
        if (!profileExists) {
          console.log('⚠️ Trigger failed, creating profile manually...');

          const { error: insertError } = await (supabase
            .from('profiles') as any)
            .insert({
              id: data.user.id,
              email: email,
              first_name: firstName,
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
        setSignupStep(3);

        safeToast({
          title: t('login.codeSent'),
          description: `${t('login.codeSentDesc')} ${phone}`,
        });
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      safeToast({
        title: t('login.signupFailed'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Signup Step 3 - Verify code
  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const verificationCode = codeDigits.join('');

    try {
      console.log('🔍 Verifying code with Twilio...');

      const { verifyCode } = await import('../utils/sendSMS');
      const cleanedPhone = phone.replace(/\D/g, '');
      const verifyResult = await verifyCode(cleanedPhone, verificationCode);

      if (!verifyResult.success) {
        throw new Error(verifyResult.error || 'Invalid verification code');
      }

      console.log('✅ Code verified by Twilio!');

      const { error: updateError } = await (supabase
        .from('profiles') as any)
        .update({ phone_verified: true })
        .eq('id', pendingUserId);

      if (updateError) {
        console.error('❌ Update error:', updateError);
        throw updateError;
      }

      safeToast({
        title: `${t('login.phoneVerified')} ✓`,
        description: t('login.signingYouIn'),
      });

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError;
      }

      navigate('/profile');
    } catch (error) {
      console.error('❌ Verification error:', error);
      safeToast({
        title: t('login.verificationFailed'),
        description: error instanceof Error ? error.message : 'Unknown error',
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

      const { sendVerificationSMS } = await import('../utils/sendSMS');
      const cleanedPhone = phone.replace(/\D/g, '');
      const smsResult = await sendVerificationSMS(cleanedPhone);

      if (!smsResult.success) {
        throw new Error('Failed to resend code. Please try again.');
      }

      console.log('✅ New code sent via Twilio');
      setCodeDigits(['', '', '', '', '', '']);

      safeToast({
        title: t('login.newCodeSent'),
        description: t('login.checkYourPhone'),
      });
    } catch (error) {
      safeToast({
        title: t('login.resendFailed'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackStep = () => {
    if (signupStep === 2) {
      setSignupStep(1);
    } else if (signupStep === 3) {
      setSignupStep(2);
      setCodeDigits(['', '', '', '', '', '']);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      safeToast({
        title: t('login.forgotPassword'),
        description: t('login.enterEmailFirst'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetEmailSent(true);
      safeToast({
        title: t('login.resetEmailSent'),
        description: t('login.checkYourEmail'),
      });
    } catch (error) {
      safeToast({
        title: t('login.resetFailed'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetEmailSent(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  // Input styles
  const inputStyle = {
    fontFamily: "'Jost', sans-serif",
    background: 'rgba(255,255,255,0.72)',
    border: '1px solid rgba(196,159,88,0.2)',
  };

  const inputClassName = "w-full px-4 py-3 rounded-lg text-[#2a2218] placeholder-[#b8ad9e] transition-all duration-200 focus:border-[#286BCD] focus:ring-2 focus:ring-[#286BCD]/10 focus:bg-white outline-none";

  const labelClassName = "block text-[9px] font-normal tracking-[0.24em] uppercase mb-1.5";
  const labelStyle = { color: 'rgba(196,159,88,0.85)', fontFamily: "'Jost', sans-serif" };

  // Forgot Password Screen
  if (showForgotPassword) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #fdf8f0 0%, #f5ede0 40%, #ede4d4 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 0%, rgba(255,255,255,0.8) 0%, transparent 60%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-[340px]"
        >
          {/* Card */}
          <div
            className="rounded-xl p-7"
            style={{
              background: 'rgba(255,255,255,0.52)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 8px 32px rgba(42,34,24,0.08)',
            }}
          >
            <button
              onClick={handleBackToLogin}
              className="flex items-center gap-1 text-[#b8ad9e] hover:text-[#286BCD] transition-colors mb-4 text-sm"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              ← {t('login.backToLogin')}
            </button>

            <h2
              className="text-xl font-normal text-[#2a2218] mb-2 text-center"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {t('login.forgotPassword')}
            </h2>

            <p className="text-sm text-[#9a8e80] text-center mb-6" style={{ fontFamily: "'Jost', sans-serif" }}>
              {resetEmailSent ? t('login.resetEmailSentDesc') : t('login.forgotPasswordDesc')}
            </p>

            {resetEmailSent ? (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 mx-auto bg-[#286BCD]/10 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#286BCD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <button
                  onClick={handleBackToLogin}
                  className="w-full py-3 rounded-lg text-white uppercase tracking-[0.26em] text-[11px] font-normal transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ fontFamily: "'Jost', sans-serif", background: '#286BCD', boxShadow: '0 4px 16px rgba(40,107,205,0.2)' }}
                >
                  {t('login.backToLogin')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className={labelClassName} style={labelStyle}>{t('login.email')}</label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClassName}
                    style={inputStyle}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-white uppercase tracking-[0.26em] text-[11px] font-normal transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ fontFamily: "'Jost', sans-serif", background: '#286BCD', boxShadow: '0 4px 16px rgba(40,107,205,0.2)' }}
                >
                  {loading ? (
                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      ...
                    </motion.span>
                  ) : t('login.sendResetLink')}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Main Login/Signup Screen
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Warm cream background with light bloom */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #fdf8f0 0%, #f5ede0 40%, #ede4d4 100%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 0%, rgba(255,255,255,0.8) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(240,235,255,0.4) 0%, transparent 45%)' }} />

      {/* Subtle linen texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.08) 3px, rgba(255,255,255,0.08) 4px)',
        }}
      />

      {/* Language Button - Top Right */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsLanguageModalOpen(true)}
        className="absolute top-5 right-5 z-20 px-4 py-1.5 rounded-full border transition-all hover:border-[#C49F58] hover:text-[#C49F58]"
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '10px',
          letterSpacing: '0.1em',
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(196,159,88,0.2)',
          color: '#b8ad9e',
        }}
      >
        {language.toUpperCase()} ▾
      </motion.button>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-[340px] flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-2.5">
          <div
            className="w-[110px] h-[110px] rounded-full flex items-center justify-center mb-4"
            style={{
              background: '#286BCD',
              boxShadow: '0 8px 32px rgba(40,107,205,0.18), 0 2px 8px rgba(40,107,205,0.12), 0 0 0 6px rgba(40,107,205,0.06), 0 0 0 12px rgba(40,107,205,0.03)',
            }}
          >
            <img
              src="/MASLOW - Round.png"
              alt="Maslow"
              className="w-[92px] h-[92px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span style="font-family: Cormorant Garamond, serif; font-size: 60px; font-weight: 300; color: #FAF4ED;">M</span>';
              }}
            />
          </div>

          {/* Wordmark */}
          <div
            className="text-[11px] font-light tracking-[0.55em] uppercase mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#b8ad9e' }}
          >
            Maslow NYC
          </div>

          {/* Tagline */}
          <div
            className="text-[15px] italic"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: 'rgba(154,142,128,0.85)', letterSpacing: '0.03em' }}
          >
            {t('hero.tagline')}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="w-[1px] h-7 my-5"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(196,159,88,0.4), transparent)' }}
        />

        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="w-full rounded-xl p-7"
          style={{
            background: 'rgba(255,255,255,0.52)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 8px 32px rgba(42,34,24,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          {/* Tabs */}
          <div className="relative flex justify-center border-b border-[rgba(196,159,88,0.18)] mb-6">
            <button
              onClick={() => { setActiveTab('signin'); setSignupStep(1); }}
              className={`flex-1 text-center pb-3 text-[10.5px] font-normal tracking-[0.24em] uppercase transition-colors ${
                activeTab === 'signin' ? 'text-[#2a2218]' : 'text-[#b8ad9e]'
              }`}
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {t('login.signIn')}
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 text-center pb-3 text-[10.5px] font-normal tracking-[0.24em] uppercase transition-colors ${
                activeTab === 'signup' ? 'text-[#2a2218]' : 'text-[#b8ad9e]'
              }`}
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {t('login.signUp')}
            </button>

            {/* Animated underline */}
            <motion.div
              className="absolute bottom-[-1px] h-[1px] bg-[#C49F58]"
              animate={{
                left: activeTab === 'signin' ? '10%' : '60%',
                width: '30%',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Sign In Form */}
          <AnimatePresence mode="wait">
            {activeTab === 'signin' && (
              <motion.form
                key="signin"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label className={labelClassName} style={labelStyle}>{t('login.email')}</label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClassName}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label className={labelClassName} style={labelStyle}>{t('login.password')}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClassName}
                    style={inputStyle}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg text-white uppercase tracking-[0.26em] text-[11px] font-normal transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ fontFamily: "'Jost', sans-serif", background: '#286BCD', boxShadow: '0 4px 16px rgba(40,107,205,0.2)' }}
                >
                  {loading ? (
                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      ...
                    </motion.span>
                  ) : 'Enter'}
                </button>
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[13px] text-[#b8ad9e] hover:text-[#286BCD] transition-colors"
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  >
                    {t('login.forgotPassword')}?
                  </button>
                </div>
              </motion.form>
            )}

            {/* Sign Up Step 1 */}
            {activeTab === 'signup' && signupStep === 1 && (
              <motion.form
                key="signup-1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSignupStep1}
                className="space-y-4"
              >
                {/* Step dots */}
                <div className="flex justify-center gap-1.5 mb-4">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className="w-1 h-1 rounded-full transition-all duration-300"
                      style={{
                        background: signupStep === step ? '#286BCD' : 'rgba(196,159,88,0.25)',
                        transform: signupStep === step ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>

                <div>
                  <label className={labelClassName} style={labelStyle}>{t('login.firstName')}</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClassName}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label className={labelClassName} style={labelStyle}>{t('login.email')}</label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClassName}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label className={labelClassName} style={labelStyle}>{t('login.password')}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClassName}
                    style={inputStyle}
                    required
                  />
                </div>

                {/* Member number teaser */}
                {nextMemberNumber && (
                  <div
                    className="text-center text-[13px] italic"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#b8ad9e' }}
                  >
                    You'll be member <span style={{ color: '#286BCD' }}>#{String(nextMemberNumber).padStart(5, '0')}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg text-white uppercase tracking-[0.26em] text-[11px] font-normal transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ fontFamily: "'Jost', sans-serif", background: '#286BCD', boxShadow: '0 4px 16px rgba(40,107,205,0.2)' }}
                >
                  Continue
                </button>
              </motion.form>
            )}

            {/* Sign Up Step 2 - Phone */}
            {activeTab === 'signup' && signupStep === 2 && (
              <motion.form
                key="signup-2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSignupStep2}
                className="space-y-4"
              >
                {/* Step dots */}
                <div className="flex justify-center gap-1.5 mb-4">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className="w-1 h-1 rounded-full transition-all duration-300"
                      style={{
                        background: signupStep === step ? '#286BCD' : 'rgba(196,159,88,0.25)',
                        transform: signupStep === step ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>

                <div>
                  <label className={labelClassName} style={labelStyle}>Mobile Number</label>
                  <div className="flex gap-2">
                    <div
                      className="w-[58px] flex-shrink-0 flex items-center justify-center rounded-lg text-[13px] text-[#2a2218]"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        background: 'rgba(255,255,255,0.72)',
                        border: '1px solid rgba(196,159,88,0.2)',
                      }}
                    >
                      🇺🇸 {countryCode}
                    </div>
                    <input
                      type="tel"
                      placeholder="(212) 555-0100"
                      value={phone}
                      onChange={handlePhoneChange}
                      className={inputClassName + " flex-1"}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <p className="text-[11px] text-[#b8ad9e] text-center leading-relaxed" style={{ fontFamily: "'Jost', sans-serif" }}>
                  We'll send a one-time code to verify your number.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg text-white uppercase tracking-[0.26em] text-[11px] font-normal transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ fontFamily: "'Jost', sans-serif", background: '#286BCD', boxShadow: '0 4px 16px rgba(40,107,205,0.2)' }}
                >
                  {loading ? (
                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      ...
                    </motion.span>
                  ) : 'Send Code'}
                </button>

                <button
                  type="button"
                  onClick={handleBackStep}
                  className="w-full py-3 rounded-lg text-[#b8ad9e] uppercase tracking-[0.2em] text-[11px] font-normal transition-all border hover:border-[#286BCD]/30 hover:text-[#286BCD]"
                  style={{ fontFamily: "'Jost', sans-serif", border: '1px solid rgba(196,159,88,0.22)' }}
                >
                  ← Back
                </button>
              </motion.form>
            )}

            {/* Sign Up Step 3 - Verify Code */}
            {activeTab === 'signup' && signupStep === 3 && (
              <motion.form
                key="signup-3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleVerifyCode}
                className="space-y-4"
              >
                {/* Step dots */}
                <div className="flex justify-center gap-1.5 mb-4">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className="w-1 h-1 rounded-full transition-all duration-300"
                      style={{
                        background: signupStep === step ? '#286BCD' : 'rgba(196,159,88,0.25)',
                        transform: signupStep === step ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>

                <p className="text-[11px] text-[#b8ad9e] text-center leading-relaxed mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>
                  Enter the 6-digit code sent to your phone.
                </p>

                {/* 6 digit code boxes */}
                <div className="flex gap-2 justify-center">
                  {codeDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { codeInputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(index, e)}
                      className="w-[42px] h-[46px] text-center text-xl font-light rounded-lg transition-all focus:border-[#286BCD] focus:ring-2 focus:ring-[#286BCD]/10 focus:bg-white outline-none"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        color: '#2a2218',
                        background: 'rgba(255,255,255,0.72)',
                        border: '1px solid rgba(196,159,88,0.2)',
                      }}
                    />
                  ))}
                </div>

                <p className="text-[11px] text-[#b8ad9e] text-center" style={{ fontFamily: "'Jost', sans-serif" }}>
                  Didn't get it?{' '}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-[#286BCD] hover:underline"
                  >
                    Resend
                  </button>
                </p>

                <button
                  type="submit"
                  disabled={loading || codeDigits.some(d => !d)}
                  className="w-full py-3.5 rounded-lg text-white uppercase tracking-[0.26em] text-[11px] font-normal transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ fontFamily: "'Jost', sans-serif", background: '#286BCD', boxShadow: '0 4px 16px rgba(40,107,205,0.2)' }}
                >
                  {loading ? (
                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      ...
                    </motion.span>
                  ) : 'Verify & Enter'}
                </button>

                <button
                  type="button"
                  onClick={handleBackStep}
                  className="w-full py-3 rounded-lg text-[#b8ad9e] uppercase tracking-[0.2em] text-[11px] font-normal transition-all border hover:border-[#286BCD]/30 hover:text-[#286BCD]"
                  style={{ fontFamily: "'Jost', sans-serif", border: '1px solid rgba(196,159,88,0.22)' }}
                >
                  ← Back
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="text-[9.5px] text-[#b8ad9e] text-center mt-5 leading-relaxed"
          style={{ fontFamily: "'Jost', sans-serif", letterSpacing: '0.06em' }}
        >
          By continuing you agree to Maslow's<br />Terms of Service & Privacy Policy
        </motion.p>
      </motion.div>

      {/* Language Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onSelectLanguage={(lang) => {
          setLanguage(lang);
          setIsLanguageModalOpen(false);
        }}
      />
    </div>
  );
};

export default LoginPage;
