/**
 * Event Email Segmentation Utilities
 *
 * These functions help query users based on their event interests
 * for targeted email campaigns about new events.
 */

import { supabase } from '@/lib/customSupabaseClient';

export type EventCategory = 'cultural' | 'childrens' | 'dancing' | 'learning' | 'wellness' | 'social' | 'nightlife';

export interface UserContact {
  email: string;
  first_name: string | null;
}

/**
 * Get all users interested in a specific event category
 *
 * @example
 * // Email all users interested in 'dancing' about new dance event
 * const users = await getUsersInterestedIn('dancing');
 * // Returns: [{ email: 'user@example.com', first_name: 'John' }, ...]
 */
export const getUsersInterestedIn = async (category: EventCategory): Promise<UserContact[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, first_name')
    .contains('interested_categories', [category]);

  if (error) {
    console.error('Error fetching users by interest:', error);
    return [];
  }

  return (data as UserContact[]) || [];
};

/**
 * Get all users interested in any of the specified categories
 *
 * @example
 * // Email users interested in wellness OR learning
 * const users = await getUsersInterestedInAny(['wellness', 'learning']);
 */
export const getUsersInterestedInAny = async (categories: EventCategory[]): Promise<UserContact[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, first_name')
    .overlaps('interested_categories', categories);

  if (error) {
    console.error('Error fetching users by interests:', error);
    return [];
  }

  return (data as UserContact[]) || [];
};

/**
 * Get all users who have RSVP'd to events in a specific category
 * Useful for targeting engaged users
 *
 * @example
 * const engagedDanceUsers = await getUsersWhoAttendedCategory('dancing');
 */
export const getUsersWhoAttendedCategory = async (category: EventCategory): Promise<UserContact[]> => {
  const { data, error } = await supabase
    .from('event_attendees')
    .select(`
      profiles:user_id (
        email,
        first_name
      ),
      events:event_id (
        category
      )
    `)
    .eq('rsvp_status', 'confirmed');

  if (error) {
    console.error('Error fetching attendees by category:', error);
    return [];
  }

  // Filter by category and extract unique users
  const users = new Map<string, UserContact>();

  (data || []).forEach((row: any) => {
    if (row.events?.category === category && row.profiles?.email) {
      users.set(row.profiles.email, {
        email: row.profiles.email,
        first_name: row.profiles.first_name,
      });
    }
  });

  return Array.from(users.values());
};

/**
 * Get users who have RSVP'd to a specific event
 *
 * @example
 * const eventAttendees = await getEventAttendees('event-uuid-here');
 */
export const getEventAttendees = async (eventId: string): Promise<UserContact[]> => {
  const { data, error } = await supabase
    .from('event_attendees')
    .select(`
      profiles:user_id (
        email,
        first_name
      )
    `)
    .eq('event_id', eventId)
    .eq('rsvp_status', 'confirmed');

  if (error) {
    console.error('Error fetching event attendees:', error);
    return [];
  }

  return (data || [])
    .map((row: any) => row.profiles)
    .filter((profile: any) => profile?.email) as UserContact[];
};

/**
 * Get all users with any event interests set (for general event announcements)
 */
export const getUsersWithEventInterests = async (): Promise<UserContact[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, first_name')
    .not('interested_categories', 'is', null)
    .neq('interested_categories', '{}');

  if (error) {
    console.error('Error fetching users with interests:', error);
    return [];
  }

  return (data as UserContact[]) || [];
};

/**
 * Example usage for Customer.io or similar email service:
 *
 * ```typescript
 * import { getUsersInterestedIn } from '@/utils/eventSegmentation';
 *
 * // When a new dance event is created:
 * async function notifyDanceEnthusiasts(eventTitle: string, eventDate: string) {
 *   const users = await getUsersInterestedIn('dancing');
 *
 *   // Send via Customer.io
 *   for (const user of users) {
 *     await cio.track(user.email, 'new_event_notification', {
 *       event_title: eventTitle,
 *       event_date: eventDate,
 *       category: 'dancing',
 *       first_name: user.first_name || 'Friend',
 *     });
 *   }
 * }
 * ```
 */
