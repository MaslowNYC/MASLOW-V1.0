import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true); // Start loading while we check token
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle the password reset flow
  useEffect(() => {
    let isMounted = true;

    const processResetToken = async () => {
      try {
        // Check if there's a hash fragment with tokens (from email link)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('Reset page loaded, type:', type, 'hasToken:', !!accessToken);

        // If we have a recovery token in the URL
        if (accessToken && type === 'recovery') {
          console.log('Processing password recovery token...');

          // Set the session using the tokens from the URL
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            if (isMounted) {
              setError('This reset link has expired. Please request a new one.');
              setLoading(false);
            }
            return;
          }

          if (data.session) {
            console.log('Session established for password reset');
            // Clear the hash from URL for cleaner look
            window.history.replaceState(null, '', window.location.pathname);

            if (isMounted) {
              setReady(true);
              setLoading(false);
            }
            return;
          }
        }

        // Check for existing valid session
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          console.log('Existing session found');
          if (isMounted) {
            setReady(true);
            setLoading(false);
          }
          return;
        }

        // No token and no session - invalid access
        console.log('No valid token or session');
        if (isMounted) {
          setError('Invalid or expired reset link. Please request a new one.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Password recovery error:', err);
        if (isMounted) {
          setError('Something went wrong. Please request a new reset link.');
          setLoading(false);
        }
      }
    };

    // Give Supabase a moment to process any URL params
    const timer = setTimeout(processResetToken, 100);

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      if (event === 'PASSWORD_RECOVERY' && session) {
        setError(null);
        setReady(true);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: t('login.resetFailed'),
        description: t('login.passwordsDoNotMatch'),
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: t('login.resetFailed'),
        description: t('login.passwordTip'),
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: t('login.passwordResetSuccess'),
        description: t('login.passwordResetSuccessDesc'),
      });

      // Sign out and redirect to login
      await supabase.auth.signOut();

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Password update error:', err);
      toast({
        title: t('login.resetFailed'),
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state while checking token
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2C5F8D] to-[#1a1a1a] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1a1a1a]/90 backdrop-blur border-[#C5A059]/30">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mb-4" />
              <CardTitle className="text-xl font-bold text-center text-white">
                Verifying reset link...
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2C5F8D] to-[#1a1a1a] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1a1a1a]/90 backdrop-blur border-[#C5A059]/30">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-red-400">
              {t('login.resetFailed')}
            </CardTitle>
            <CardDescription className="text-center text-white/60">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-[#1a1a1a] font-bold"
            >
              {t('login.backToLogin')}
            </Button>
            <p className="text-center text-white/40 text-sm">
              Click "Forgot Password?" on the login page to request a new link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2C5F8D] to-[#1a1a1a] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1a1a1a]/90 backdrop-blur border-[#C5A059]/30">
          <CardHeader className="space-y-1 pb-4">
            <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-[#C5A059]">
              {t('login.passwordResetSuccess')}
            </CardTitle>
            <CardDescription className="text-center text-white/60">
              {t('login.passwordResetSuccessDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-white/40 text-sm">
              Redirecting to login...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Reset password form - only show when ready
  if (!ready) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2C5F8D] to-[#1a1a1a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1a1a]/90 backdrop-blur border-[#C5A059]/30">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-4xl font-bold text-[#C5A059] mb-2">Maslow</h1>
            <p className="text-white/60 text-sm">The Infrastructure of Dignity</p>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">
            {t('login.resetPassword')}
          </CardTitle>
          <CardDescription className="text-center text-white/60">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-white">
                {t('login.newPassword')}
              </Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-[#C5A059] text-white"
                required
                minLength={6}
              />
              <p className="text-xs text-white/40">{t('login.passwordTip')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-white">
                {t('login.confirmPassword')}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-[#C5A059] text-white"
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-[#1a1a1a] font-bold mt-4"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t('login.resetPassword')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
