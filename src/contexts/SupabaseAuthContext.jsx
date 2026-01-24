
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFounder, setIsFounder] = useState(false);

  // --- HARDCODED FOUNDER LIST ---
  // This ensures your email ALWAYS triggers the Dashboard button
  const FOUNDER_EMAILS = [
    'patrick@maslownyc.com',
    // Add other founder emails here if needed
  ];

  useEffect(() => {
    // Check active session on load
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        checkFounderStatus(session.user);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkFounderStatus(session.user);
      } else {
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

    // 1. Check Hardcoded List (Case insensitive)
    const email = currentUser.email.toLowerCase();
    const isHardcodedFounder = FOUNDER_EMAILS.includes(email);
    
    if (isHardcodedFounder) {
      console.log(`Founder access granted for: ${email}`);
      setIsFounder(true);
      return;
    }

    // 2. (Optional) You can add database role checks here later
    setIsFounder(false);
  };

  // --- RESTORED FUNCTIONS ---

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