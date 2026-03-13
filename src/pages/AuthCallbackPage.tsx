import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash (Supabase OAuth redirects with tokens in hash)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Auth callback error:', sessionError);
          setError(sessionError.message);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (session) {
          // Check if profile exists and has required fields
          const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('first_name, phone_verified')
            .eq('id', session.user.id)
            .single();

          // If this is a new OAuth user, they may need to complete profile
          if (!profile?.first_name) {
            // For Apple/Google sign-in, try to get name from user metadata
            const metadata = session.user.user_metadata;
            if (metadata?.full_name || metadata?.name) {
              const fullName = metadata.full_name || metadata.name;
              const nameParts = fullName.split(' ');
              const firstName = nameParts[0];
              const lastName = nameParts.slice(1).join(' ') || '';

              await (supabase
                .from('profiles') as any)
                .update({
                  first_name: firstName,
                  last_name: lastName,
                })
                .eq('id', session.user.id);
            }
          }

          // Redirect to profile or home
          navigate(profile?.first_name ? '/' : '/profile');
        } else {
          // No session, redirect to login
          navigate('/login');
        }
      } catch (err) {
        console.error('Auth callback exception:', err);
        setError('Authentication failed. Redirecting...');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #fdf8f0 0%, #f5ede0 40%, #ede4d4 100%)' }}>
      <div className="text-center">
        {error ? (
          <>
            <p className="text-red-600 mb-2">{error}</p>
            <p className="text-sm text-[#9a8e80]">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="w-8 h-8 border-2 border-[#3C5999] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#2a2218]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Signing you in...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
