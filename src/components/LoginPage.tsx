import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, ADMIN_EMAILS } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { identifyUser } from '@/utils/customerio';
import { toE164 } from '@/utils/phoneFormat';
import PhoneInput from '@/components/auth/PhoneInput';
import OtpInput from '@/components/auth/OtpInput';
import LanguageModal from '@/components/LanguageModal';
import { useLanguage } from '@/hooks/useLanguage';

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

// Google Fonts URL for page-scoped fonts
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400&display=swap';

// Flag emoji mapping for all 13 supported languages
const LANGUAGE_FLAGS: Record<string, { flag: string; name: string }> = {
  en: { flag: '🇺🇸', name: 'English' },
  es: { flag: '🇪🇸', name: 'Spanish' },
  fr: { flag: '🇫🇷', name: 'French' },
  pt: { flag: '🇧🇷', name: 'Portuguese' },
  'zh-CN': { flag: '🇨🇳', name: 'Mandarin' },
  ar: { flag: '🇸🇦', name: 'Arabic' },
  hi: { flag: '🇮🇳', name: 'Hindi' },
  ru: { flag: '🇷🇺', name: 'Russian' },
  ja: { flag: '🇯🇵', name: 'Japanese' },
  ko: { flag: '🇰🇷', name: 'Korean' },
  ht: { flag: '🇭🇹', name: 'Haitian Creole' },
  bn: { flag: '🇧🇩', name: 'Bengali' },
  yi: { flag: '🇮🇱', name: 'Yiddish' },
};

// Languages array for the modal (with native greetings)
const LANGUAGES_FOR_MODAL = [
  { code: 'en', text: '🇺🇸 Welcome', language: 'English' },
  { code: 'es', text: '🇪🇸 Bienvenido', language: 'Spanish' },
  { code: 'fr', text: '🇫🇷 Bienvenue', language: 'French' },
  { code: 'pt', text: '🇧🇷 Bem-vindo', language: 'Portuguese' },
  { code: 'zh-CN', text: '🇨🇳 欢迎', language: 'Mandarin' },
  { code: 'ar', text: '🇸🇦 أهلاً', language: 'Arabic' },
  { code: 'hi', text: '🇮🇳 स्वागत', language: 'Hindi' },
  { code: 'ru', text: '🇷🇺 Добро пожаловать', language: 'Russian' },
  { code: 'ja', text: '🇯🇵 ようこそ', language: 'Japanese' },
  { code: 'ko', text: '🇰🇷 환영합니다', language: 'Korean' },
  { code: 'ht', text: '🇭🇹 Byenveni', language: 'Haitian Creole' },
  { code: 'bn', text: '🇧🇩 স্বাগতম', language: 'Bengali' },
  { code: 'yi', text: '🇮🇱 ברוכים הבאים', language: 'Yiddish' },
];

const LoginPage = () => {
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Two-step state (1 = entry form, 2 = OTP verify). Used by both signin and signup.
  const [step, setStep] = useState<1 | 2>(1);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  // E.164 phone captured at step 1, used by step 2 to verify.
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);

  // Member number preview
  const [nextMemberNumber, setNextMemberNumber] = useState<number | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Language modal and bar
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isLanguageBarDismissed, setIsLanguageBarDismissed] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();
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

  // Fetch next member number when signup tab is active
  useEffect(() => {
    const fetchNextNumber = async () => {
      try {
        // Use RPC function to bypass RLS and get next member number
        const { data, error } = await supabase.schema('public').rpc('get_next_member_number');

        if (error) {
          console.error('Error fetching next member number:', error);
          setNextMemberNumber(null);
          return;
        }

        if (data !== null && data !== undefined) {
          setNextMemberNumber(data);
        } else {
          setNextMemberNumber(1);
        }
      } catch (err) {
        console.error('Error fetching next member number:', err);
        setNextMemberNumber(null);
      }
    };

    // Only fetch when signup tab is shown
    if (activeTab === 'signup') {
      fetchNextNumber();
    }
  }, [activeTab]);

  const safeToast = (props: ToastProps) => {
    if (typeof toast === 'function') {
      toast(props);
    } else {
      console.warn('Toast system unavailable:', props);
    }
  };

  const resetToStep1 = () => {
    setStep(1);
    setCodeDigits(['', '', '', '', '', '']);
    setPendingPhone(null);
  };

  // Sign In step 1 — send OTP. shouldCreateUser: false → unknown phone returns error.
  const handleSigninSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const e164 = toE164(phone);
      if (!e164) {
        throw new Error('Please enter a valid phone number');
      }

      const { error } = await sendPhoneOtp({ phone: e164, shouldCreateUser: false });

      if (error) {
        const msg = error.message?.toLowerCase() ?? '';
        if (msg.includes('not found') || msg.includes('signups not allowed') || msg.includes('user not')) {
          throw new Error('No account found for this number. Tap Sign Up to create one.');
        }
        throw error;
      }

      setPendingPhone(e164);
      setStep(2);
      safeToast({
        title: t('login.codeSent'),
        description: `${t('login.codeSentDesc')} ${phone}`,
      });
    } catch (error) {
      safeToast({
        title: t('login.accessDenied'),
        description: error instanceof Error ? error.message : 'Unable to send code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Sign Up step 1 — collect name+email+phone, send OTP.
  const handleSignupSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!firstName.trim() || !lastName.trim()) {
        throw new Error('Please enter your first and last name');
      }
      if (!email.trim()) {
        throw new Error('Please enter your email');
      }

      const e164 = toE164(phone);
      if (!e164) {
        throw new Error('Please enter a valid phone number');
      }

      const { error } = await sendPhoneOtp({
        phone: e164,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });

      if (error) throw error;

      setPendingPhone(e164);
      setStep(2);
      safeToast({
        title: t('login.codeSent'),
        description: `${t('login.codeSentDesc')} ${phone}`,
      });
    } catch (error) {
      safeToast({
        title: t('login.signupFailed'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP. Shared by signin and signup; verifyOtp establishes the session.
  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!pendingPhone) return;
    setLoading(true);

    try {
      const token = codeDigits.join('');
      const { data, error } = await verifyPhoneOtp({ phone: pendingPhone, token });
      if (error) throw error;
      if (!data?.user) throw new Error('Verification failed');

      const verifiedUser = data.user;

      // Customer.io best-effort identify (do not block sign-in).
      const metaFirstName =
        (verifiedUser.user_metadata as Record<string, unknown> | undefined)?.first_name;
      try {
        identifyUser(verifiedUser, {
          first_name: typeof metaFirstName === 'string' ? metaFirstName : undefined,
        });
      } catch (err) {
        console.error('Customer.io identify failed, continuing:', err);
      }

      // Resolve admin routing using either auth.users.email or metadata.email.
      const metaEmail = (verifiedUser.user_metadata as Record<string, unknown> | undefined)?.email;
      const effectiveEmail =
        verifiedUser.email ?? (typeof metaEmail === 'string' ? metaEmail : null);
      const isAdminByEmail = !!(
        effectiveEmail && ADMIN_EMAILS.includes(effectiveEmail.toLowerCase())
      );

      const { data: profile } = await ((supabase as any)
        .schema('v2')
        .from('profiles') as any)
        .select('first_name, is_admin')
        .eq('id', verifiedUser.id)
        .single();

      safeToast({
        title: `${t('login.phoneVerified')} ✓`,
        description: t('login.signingYouIn'),
      });

      if (profile?.is_admin === true || isAdminByEmail) {
        navigate('/admin');
      } else if (profile && profile.first_name) {
        navigate('/');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      safeToast({
        title: t('login.verificationFailed'),
        description: error instanceof Error ? error.message : 'Invalid verification code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!pendingPhone) return;
    setLoading(true);
    try {
      const { error } = await sendPhoneOtp({
        phone: pendingPhone,
        ...(activeTab === 'signup'
          ? {
              firstName: firstName.trim() || undefined,
              lastName: lastName.trim() || undefined,
              email: email.trim() || undefined,
            }
          : { shouldCreateUser: false }),
      });
      if (error) throw error;

      setCodeDigits(['', '', '', '', '', '']);
      safeToast({
        title: t('login.newCodeSent'),
        description: t('login.checkYourPhone'),
      });
    } catch (error) {
      safeToast({
        title: t('login.resendFailed'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // OAuth Sign-In with Google
  const handleSignInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      safeToast({
        title: 'Sign in failed',
        description: error instanceof Error ? error.message : 'Unable to sign in with Google',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // OAuth Sign-In with Apple
  const handleSignInWithApple = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      safeToast({
        title: 'Sign in failed',
        description: error instanceof Error ? error.message : 'Unable to sign in with Apple',
        variant: 'destructive',
      });
      setLoading(false);
    }
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

  const inputClassName = "w-full px-4 py-3 rounded-lg text-[#2a2218] placeholder-[#b8ad9e] transition-all duration-200 focus:border-[#3C5999] focus:ring-2 focus:ring-[#3C5999]/10 focus:bg-white outline-none";

  const labelClassName = "block text-[9px] font-normal tracking-[0.24em] uppercase mb-1.5";
  const labelStyle = { color: 'rgba(196,159,88,0.85)', fontFamily: "'Jost', sans-serif" };

  const phonePrefixClassName =
    'w-[58px] flex-shrink-0 flex items-center justify-center rounded-lg text-[13px] text-[#2a2218]';
  const phonePrefixStyle = {
    fontFamily: "'Jost', sans-serif",
    background: 'rgba(255,255,255,0.72)',
    border: '1px solid rgba(196,159,88,0.2)',
  };

  const otpBoxClassName =
    'w-[42px] h-[46px] text-center text-xl font-light rounded-lg transition-all focus:border-[#3C5999] focus:ring-2 focus:ring-[#3C5999]/10 focus:bg-white outline-none';
  const otpBoxStyle = {
    fontFamily: "'Jost', sans-serif",
    color: '#2a2218',
    background: 'rgba(255,255,255,0.72)',
    border: '1px solid rgba(196,159,88,0.2)',
  };

  const renderStepDots = () => (
    <div className="flex justify-center gap-1.5 mb-4">
      {[1, 2].map((s) => (
        <div
          key={s}
          className="w-1 h-1 rounded-full transition-all duration-300"
          style={{
            background: step === s ? '#3C5999' : 'rgba(196,159,88,0.25)',
            transform: step === s ? 'scale(1.3)' : 'scale(1)',
          }}
        />
      ))}
    </div>
  );

  const renderOtpStep = (onSubmit: (e: FormEvent) => void) => (
    <motion.form
      key="otp"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={onSubmit}
      className="space-y-4"
    >
      {renderStepDots()}

      <p className="text-[11px] text-[#b8ad9e] text-center leading-relaxed mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>
        Enter the 6-digit code sent to your phone.
      </p>

      <OtpInput
        value={codeDigits}
        onChange={setCodeDigits}
        boxClassName={otpBoxClassName}
        boxStyle={otpBoxStyle}
      />

      <p className="text-[11px] text-[#b8ad9e] text-center" style={{ fontFamily: "'Jost', sans-serif" }}>
        Didn't get it?{' '}
        <button
          type="button"
          onClick={handleResendCode}
          disabled={loading}
          className="text-[#3C5999] hover:underline"
        >
          Resend
        </button>
      </p>

      <button
        type="submit"
        disabled={loading || codeDigits.some(d => !d)}
        className="w-full py-3.5 rounded-lg text-white uppercase tracking-[0.26em] text-[11px] font-normal transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
        style={{ fontFamily: "'Jost', sans-serif", background: '#3C5999', boxShadow: '0 4px 16px rgba(40,107,205,0.2)' }}
      >
        {loading ? (
          <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            ...
          </motion.span>
        ) : 'Verify & Enter'}
      </button>

      <button
        type="button"
        onClick={resetToStep1}
        className="w-full py-3 rounded-lg text-[#b8ad9e] uppercase tracking-[0.2em] text-[11px] font-normal transition-all border hover:border-[#3C5999]/30 hover:text-[#3C5999]"
        style={{ fontFamily: "'Jost', sans-serif", border: '1px solid rgba(196,159,88,0.22)' }}
      >
        ← Back
      </button>
    </motion.form>
  );

  // Main Login/Signup Screen
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4" style={{ background: 'linear-gradient(160deg, #fdf8f0 0%, #f5ede0 40%, #ede4d4 100%)' }}>
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

      {/* Dismissible Language Bar - Top */}
      <AnimatePresence>
        {!isLanguageBarDismissed && (
          <motion.div
            initial={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-0 left-0 right-0 z-20 overflow-hidden"
          >
            <div
              className="flex items-center justify-center px-4 py-2.5 relative"
              style={{
                background: 'rgba(196,159,88,0.08)',
                borderBottom: '1px solid rgba(196,159,88,0.15)',
              }}
            >
              <button
                onClick={() => setIsLanguageModalOpen(true)}
                className="flex items-center gap-2 transition-all hover:opacity-70"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  color: '#9a8e80',
                  textTransform: 'uppercase',
                }}
              >
                <span>{LANGUAGE_FLAGS[language]?.flag || '🌐'}</span>
                <span>{LANGUAGE_FLAGS[language]?.name || 'English'}</span>
              </button>

              {/* Dismiss button */}
              <button
                onClick={() => setIsLanguageBarDismissed(true)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-all hover:opacity-70"
                style={{
                  color: '#b8ad9e',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-[340px] flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-2.5 mt-12">
          <div
            className="w-[182px] h-[182px] rounded-full flex items-center justify-center mb-4"
          >
            <img
              src="/android-chrome-512x512.png"
              alt="Maslow"
              className="w-[182px] h-[182px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span style="font-family: Cormorant Garamond, serif; font-size: 72px; font-weight: 300; color: #3C5999;">M</span>';
              }}
            />
          </div>

          {/* Wordmark */}
          <div
            className="text-[18px] font-medium tracking-[0.35em] uppercase mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#2a2218' }}
          >
            Maslow
          </div>

          {/* Tagline */}
          <div
            className="text-[10px] font-normal tracking-[0.28em] uppercase"
            style={{ fontFamily: "'Jost', sans-serif", color: '#9a8e80', letterSpacing: '0.28em' }}
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
              onClick={() => { setActiveTab('signin'); resetToStep1(); }}
              className={`flex-1 text-center pb-3 text-[10.5px] font-normal tracking-[0.24em] uppercase transition-colors ${
                activeTab === 'signin' ? 'text-[#2a2218]' : 'text-[#b8ad9e]'
              }`}
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {t('login.signIn')}
            </button>
            <button
              onClick={() => { setActiveTab('signup'); resetToStep1(); }}
              className={`flex-1 text-center pb-3 text-[10.5px] font-normal tracking-[0.24em] uppercase transition-colors ${
                activeTab === 'signup' ? 'text-[#2a2218]' : 'text-[#b8ad9e]'
              }`}
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {t('login.signUp')}
            </button>

            {/* Animated underline */}
            <motion.div
              className="absolute bottom-[-1px] h-[1px] bg-[#D4AF6A]"
              animate={{
                left: activeTab === 'signin' ? '10%' : '60%',
                width: '30%',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {/* Sign In step 1 — phone only */}
            {activeTab === 'signin' && step === 1 && (
              <motion.form
                key="signin-1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSigninSendCode}
                className="space-y-4"
              >
                {renderStepDots()}

                <div>
                  <label className={labelClassName} style={labelStyle}>Mobile Number</label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    required
                    prefixClassName={phonePrefixClassName}
                    prefixStyle={phonePrefixStyle}
                    inputClassName={inputClassName + ' flex-1'}
                    inputStyle={inputStyle}
                  />
                </div>

                <p className="text-[11px] text-[#b8ad9e] text-center leading-relaxed" style={{ fontFamily: "'Jost', sans-serif" }}>
                  We'll send a one-time code to verify your number.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg text-white uppercase tracking-[0.26em] text-[11px] font-normal transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ fontFamily: "'Jost', sans-serif", background: '#3C5999', boxShadow: '0 4px 16px rgba(40,107,205,0.2)' }}
                >
                  {loading ? (
                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      ...
                    </motion.span>
                  ) : 'Send Code'}
                </button>

                {/* Social Sign-In Divider */}
                <div className="flex items-center gap-3 mt-5">
                  <div className="flex-1 h-px bg-[rgba(196,159,88,0.2)]" />
                  <span className="text-[10px] text-[#b8ad9e] uppercase tracking-wider" style={{ fontFamily: "'Jost', sans-serif" }}>or</span>
                  <div className="flex-1 h-px bg-[rgba(196,159,88,0.2)]" />
                </div>

                {/* Social Sign-In Buttons */}
                <div className="space-y-2.5 mt-4">
                  <button
                    type="button"
                    onClick={handleSignInWithGoogle}
                    disabled={loading}
                    className="w-full py-3 rounded-lg flex items-center justify-center gap-2.5 transition-all hover:opacity-90 disabled:opacity-50"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      background: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(196,159,88,0.2)',
                      color: '#2a2218',
                      fontSize: '12px',
                    }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    onClick={handleSignInWithApple}
                    disabled={loading}
                    className="w-full py-3 rounded-lg flex items-center justify-center gap-2.5 transition-all hover:opacity-90 disabled:opacity-50"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      background: '#000',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Continue with Apple
                  </button>
                </div>
              </motion.form>
            )}

            {/* Sign Up step 1 — name + email + phone */}
            {activeTab === 'signup' && step === 1 && (
              <motion.form
                key="signup-1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSignupSendCode}
                className="space-y-4"
              >
                {renderStepDots()}

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
                  <label className={labelClassName} style={labelStyle}>{t('login.lastName', 'LAST NAME')}</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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
                  <label className={labelClassName} style={labelStyle}>Mobile Number</label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    required
                    prefixClassName={phonePrefixClassName}
                    prefixStyle={phonePrefixStyle}
                    inputClassName={inputClassName + ' flex-1'}
                    inputStyle={inputStyle}
                  />
                </div>

                {/* Member number teaser */}
                {nextMemberNumber && (
                  <div
                    className="text-center text-[13px] italic"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#b8ad9e' }}
                  >
                    You'll be member <span style={{ color: '#3C5999' }}>#{String(nextMemberNumber).padStart(5, '0')}</span>
                  </div>
                )}

                <p className="text-[11px] text-[#b8ad9e] text-center leading-relaxed" style={{ fontFamily: "'Jost', sans-serif" }}>
                  We'll send a one-time code to verify your number.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg text-white uppercase tracking-[0.26em] text-[11px] font-normal transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ fontFamily: "'Jost', sans-serif", background: '#3C5999', boxShadow: '0 4px 16px rgba(40,107,205,0.2)' }}
                >
                  {loading ? (
                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      ...
                    </motion.span>
                  ) : 'Send Code'}
                </button>
              </motion.form>
            )}

            {/* Step 2 — OTP verification (shared by signin and signup) */}
            {step === 2 && renderOtpStep(handleVerifyCode)}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="text-[9.5px] text-[#b8ad9e] text-center mt-5 leading-relaxed"
          style={{ fontFamily: "'Jost', sans-serif", letterSpacing: '0.06em' }}
        >
          By continuing you agree to Maslow's<br />
          <Link
            to="/terms-of-service"
            className="hover:text-[#3C5999] transition-colors"
            style={{ color: '#9a8e80', textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            Terms of Service
          </Link>
          {' & '}
          <Link
            to="/privacy-policy"
            className="hover:text-[#3C5999] transition-colors"
            style={{ color: '#9a8e80', textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            Privacy Policy
          </Link>
        </motion.p>
      </motion.div>

      {/* Language Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onSelect={(lang) => {
          setLanguage(lang);
          setIsLanguageModalOpen(false);
        }}
        languages={LANGUAGES_FOR_MODAL}
        selectedLanguage={language}
      />
    </div>
  );
};

export default LoginPage;
