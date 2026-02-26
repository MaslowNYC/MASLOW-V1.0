import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required');
}

const customSupabaseClient: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export {
  customSupabaseClient,
  customSupabaseClient as supabase,
};
