
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFounder, setIsFounder] = useState(false);

  // --- FOUNDER WHITELIST ---
  // 1. Make sure your email is in this list.
  // 2. We use lowercase for comparison to avoid capitalization issues.
  const FOUNDER_EMAILS = [
    'patrick@maslownyc.com',
    'patrickmay@maslownyc.com', // Added just in case
    // Add any other aliases here
  ];

  useEffect(() => {
    // 1. Initial Session Check
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Auth: Session found for", session.user.email);
          setUser(session.user);
          // CRITICAL: We await this to ensure isFounder is set BEFORE loading becomes false
          await checkFounderStatus(session.user);
        } else {
          console.log("Auth: No session found.");
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

    // 2. Listen for Auth Changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth Event: ${event}`);
      
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
      console.log("Auth: No user email to check.");
      setIsFounder(false);
      return;
    }

    // Normalize email (lowercase + trim whitespace)
    const email = currentUser.email.toLowerCase().trim();
    
    console.log(`Auth: Checking founder status for [${email}]...`);
    
    const isHardcodedFounder = FOUNDER_EMAILS.includes(email);
    
    if (isHardcodedFounder) {
      console.log("Auth: ✅ Founder Access GRANTED.");
      setIsFounder(true);
    } else {
      console.log("Auth: ❌ Founder Access DENIED. Email not in whitelist.");
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