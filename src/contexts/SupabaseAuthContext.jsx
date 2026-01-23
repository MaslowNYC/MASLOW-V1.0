
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/customSupabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // UPDATED: Added emailRedirectTo to bring them back to the live site
  const signUp = async (email, password, metadata = {}) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        // This line is crucial: it tells Supabase where to send them back
        emailRedirectTo: window.location.origin, 
      },
    });
  };

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};