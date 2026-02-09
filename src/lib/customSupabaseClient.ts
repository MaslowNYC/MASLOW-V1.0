import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let customSupabaseClient: SupabaseClient<Database>;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are missing! Database features will not work.');
  // Create a minimal dummy client for development without env vars
  // In production, env vars should always be present
  customSupabaseClient = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      upsert: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    functions: {
      invoke: () => Promise.resolve({ data: null, error: null }),
    },
  } as unknown as SupabaseClient<Database>;
} else {
  customSupabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export default customSupabaseClient;

export {
  customSupabaseClient,
  customSupabaseClient as supabase,
};
