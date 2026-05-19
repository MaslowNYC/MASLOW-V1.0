import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import type { User, AuthResponse, AuthError } from '@supabase/supabase-js';

// Admin emails - add new admins here
export const ADMIN_EMAILS = [
  'patrick@maslownyc.com',
  'cat@maslownyc.com',
  'dayna@maslownyc.com',
  // Legacy domain fallbacks
  'patrick@maslow.nyc',
  'cat@maslow.nyc',
  'dayna@maslow.nyc'
];

interface SendPhoneOtpParams {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  shouldCreateUser?: boolean;
}

interface VerifyPhoneOtpParams {
  phone: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFounder: boolean;
  sendPhoneOtp: (params: SendPhoneOtpParams) => Promise<{ error: AuthError | null }>;
  verifyPhoneOtp: (params: VerifyPhoneOtpParams) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Read email from auth.users.email, falling back to raw_user_meta_data.email.
// Phone-OTP users do not have auth.users.email populated; their email lives in metadata.
const getEffectiveEmail = (user: User | null | undefined): string | null => {
  if (!user) return null;
  if (user.email) return user.email;
  const metadataEmail = (user.user_metadata as Record<string, unknown> | undefined)?.email;
  return typeof metadataEmail === 'string' ? metadataEmail : null;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFounder, setIsFounder] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkFounderStatus(session.user.id, getEffectiveEmail(session.user));
        }
      } catch (err) {
        console.error("Session check failed", err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkFounderStatus(session.user.id, getEffectiveEmail(session.user));
      } else {
        setIsFounder(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkFounderStatus = async (userId: string, effectiveEmail: string | null) => {
    const isAdminByEmail = !!(effectiveEmail && ADMIN_EMAILS.includes(effectiveEmail.toLowerCase()));

    try {
      const { data, error } = await (supabase
        .from('profiles') as any)
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setIsFounder(data.is_admin === true || isAdminByEmail);
        return;
      }

      if (error) {
        console.error("Founder check query failed:", error);
      }
    } catch (error) {
      console.error("Founder check failed:", error);
    }

    setIsFounder(isAdminByEmail);
  };

  const sendPhoneOtp = async ({
    phone,
    firstName,
    lastName,
    email,
    shouldCreateUser,
  }: SendPhoneOtpParams): Promise<{ error: AuthError | null }> => {
    try {
      const metadata: Record<string, unknown> = {};
      if (firstName !== undefined) metadata.first_name = firstName;
      if (lastName !== undefined) metadata.last_name = lastName;
      if (email !== undefined) metadata.email = email;

      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: shouldCreateUser ?? true,
          ...(Object.keys(metadata).length > 0 ? { data: metadata } : {}),
        },
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const verifyPhoneOtp = async ({ phone, token }: VerifyPhoneOtpParams): Promise<AuthResponse> => {
    try {
      return await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    } catch (error) {
      return { data: { user: null, session: null }, error: error as AuthError };
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      return await supabase.auth.signOut();
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Exposed value
  const value: AuthContextType = {
    sendPhoneOtp,
    verifyPhoneOtp,
    signOut,
    user,
    loading,
    isFounder,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
