import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required');
}

// Research client configured for the research schema.
// This sets the schema at the client level so all queries use research schema.
const researchSupabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'research' }
});

export default researchSupabaseClient;
export { researchSupabaseClient };
