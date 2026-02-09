import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

type CustomSupabaseClient = SupabaseClient<Database> | {
  from: (table: string) => {
    select: () => Promise<{ data: never[]; error: string }>;
    insert: () => Promise<{ data: null; error: string }>;
  };
  auth: {
    onAuthStateChange: () => { data: { subscription: { unsubscribe: () => void } } };
    getSession: () => Promise<{ data: { session: null }; error: null }>;
  };
};

let customSupabaseClient: CustomSupabaseClient;

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
  customSupabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export default customSupabaseClient;

export {
  customSupabaseClient,
  customSupabaseClient as supabase,
};
