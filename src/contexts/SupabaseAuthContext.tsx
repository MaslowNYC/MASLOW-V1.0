import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import type { User, AuthResponse, AuthError } from '@supabase/supabase-js';

// Admin emails - add new admins here
const ADMIN_EMAILS = [
  'patrick@maslownyc.com',
  'cat@maslownyc.com',
  'dayna@maslownyc.com',
  // Legacy domain fallbacks
  'patrick@maslow.nyc',
  'cat@maslow.nyc',
  'dayna@maslow.nyc'
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFounder: boolean;
  signUp: (data: { email: string; password: string }) => Promise<AuthResponse>;
  signIn: (data: { email: string; password: string }) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
          checkFounderStatus(session.user.id, session.user.email);
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
        checkFounderStatus(session.user.id, session.user.email);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkFounderStatus = async (userId: string, userEmail?: string | null) => {
    // First, check email-based admin list as a reliable fallback
    if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
      setIsFounder(true);
      return;
    }

    // Then check database
    try {
      const { data, error } = await (supabase
        .from('profiles') as any)
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Founder check query failed:", error);
        return;
      }

      if (data && data.is_admin) {
        setIsFounder(true);
      } else {
        setIsFounder(false);
      }
    } catch (error) {
      console.error("Founder check failed:", error);
    }
  };

  // Wrapped methods to ensure they return consistent structure even on crash
  const signUp = async (data: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      return await supabase.auth.signUp(data);
    } catch (error) {
      return { data: { user: null, session: null }, error: error as AuthError };
    }
  };

  const signIn = async (data: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      return await supabase.auth.signInWithPassword(data);
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
    signUp,
    signIn,
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
