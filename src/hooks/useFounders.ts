
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

export interface Founder {
  name: string;
  location: string;
  tier: string;
}

interface MembershipRecord {
  member_name: string | null;
  member_location: string | null;
  tier_name: string;
  created_at: string;
  status?: string;
}

interface UseFoundersResult {
  founders: Founder[];
  loading: boolean;
}

export const useFounders = (): UseFoundersResult => {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFounders = async (): Promise<void> => {
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
          const formattedFounders: Founder[] = (data as MembershipRecord[]).map(m => ({
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
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'memberships' },
        (payload: RealtimePostgresInsertPayload<MembershipRecord>) => {
          if (payload.new.status === 'active' || payload.new.status === 'completed') {
            setFounders(prev => [{
              name: payload.new.member_name || 'Anonymous Member',
              location: payload.new.member_location || 'Global Citizen',
              tier: payload.new.tier_name
            }, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { founders, loading };
};
