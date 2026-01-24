
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFounder, setIsFounder] = useState(false);

  // --- HARDCODED FOUNDER LIST ---
  // Ensure your email is here, exactly as it appears in Supabase
  const FOUNDER_EMAILS = [
    'patrick@maslownyc.com',
    // Add other founder emails here
  ];

  useEffect(() => {
    // 1. Initial Session Check
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          // CRITICAL FIX: Await the founder check before stopping loading
          await checkFounderStatus(session.user);
        } else {
          setUser(null);
          setIsFounder(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await checkFounderStatus(session.user);
      } else {
        setUser(null);
        setIsFounder(false);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkFounderStatus = async (currentUser) => {
    if (!currentUser || !currentUser.email) {
      setIsFounder(false);
      return;
    }

    // Check Hardcoded List (Case insensitive)
    const email = currentUser.email.toLowerCase();
    const isHardcodedFounder = FOUNDER_EMAILS.includes(email);
    
    if (isHardcodedFounder) {
      console.log(`Founder access confirmed for: ${email}`);
      setIsFounder(true);
    } else {
      setIsFounder(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Login Error:", error.message);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsFounder(false);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading, isFounder }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};