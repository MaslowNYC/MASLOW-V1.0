import { supabase } from '@/lib/customSupabaseClient';

/**
 * Resets the entire database including all user data and auth accounts.
 * WARNING: This is a destructive action.
 */
export const resetDatabase = async (): Promise<unknown> => {
  try {
    const { data, error } = await supabase.functions.invoke('reset-database', {
      body: { confirmation: 'DELETE_EVERYTHING_CONFIRMED' }
    });

    if (error) {
      console.error('Database reset failed:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Database reset exception:', error);
    throw error;
  }
};
