import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hrfmphkjeqcwhsfvzfvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZm1waGtqZXFjd2hzZnZ6ZnZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNDY3MjQsImV4cCI6MjA4MzgyMjcyNH0.pD3g14-T2IKTjHr5kIiyWqloDnknxrq2w_Lk5Dq2b1Y';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
