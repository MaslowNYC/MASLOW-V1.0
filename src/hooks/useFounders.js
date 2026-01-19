
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useFounders = () => {
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const { data, error } = await supabase
          .from('memberships')
          .select('member_name, member_location, tier_name, created_at')
          .or('status.eq.active,status.eq.completed')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching founders:', error);
          return;
        }

        if (data) {
          // Transform data if necessary, or just use as is
          const formattedFounders = data.map(m => ({
            name: m.member_name || 'Anonymous Member',
            location: m.member_location || 'Global Citizen',
            tier: m.tier_name
          }));
          setFounders(formattedFounders);
        }
      } catch (err) {
        console.error('Failed to fetch founders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFounders();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('public:memberships')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'memberships' }, (payload) => {
        if (payload.new.status === 'active' || payload.new.status === 'completed') {
           setFounders(prev => [{
             name: payload.new.member_name || 'Anonymous Member',
             location: payload.new.member_location || 'Global Citizen',
             tier: payload.new.tier_name
           }, ...prev]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { founders, loading };
};
