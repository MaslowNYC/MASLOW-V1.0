import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required');
}

// Research client without a locked schema — allows .schema('research') to work correctly.
// Do NOT use the customSupabaseClient for research schema queries; it is locked to 'public'.
const researchSupabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default researchSupabaseClient;
export { researchSupabaseClient };
