
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let customSupabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are missing! Database features will not work.');
  // Create a dummy client so the app doesn't crash on import
  customSupabaseClient = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: 'Missing API Keys' }),
      insert: () => Promise.resolve({ data: null, error: 'Missing API Keys' }),
    }),
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    }
  };
} else {
  customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};