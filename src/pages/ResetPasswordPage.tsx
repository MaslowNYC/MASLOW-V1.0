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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user came from a valid reset link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // If no session and no hash in URL, redirect to login
      if (!session && !window.location.hash.includes('access_token')) {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };

    checkSession();

    // Listen for auth state changes (when user clicks reset link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User clicked the reset link, they can now reset their password
        setError(null);
      }
    });

    return () => subscription.unsubscribe();
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

    setLoading(true);
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

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast({
        title: t('login.resetFailed'),
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
          <CardContent>
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-[#1a1a1a] font-bold"
            >
              {t('login.backToLogin')}
            </Button>
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

  // Reset password form
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
              disabled={loading}
              className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-[#1a1a1a] font-bold mt-4"
            >
              {loading ? (
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
