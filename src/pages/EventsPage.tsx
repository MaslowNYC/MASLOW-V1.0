import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Share2,
  Check,
  Loader2,
  X,
  User,
} from 'lucide-react';

// Types
type EventCategory = 'cultural' | 'childrens' | 'dancing' | 'learning' | 'wellness' | 'social' | 'nightlife';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  category: EventCategory;
  tags: string[] | null;
  max_attendees: number | null;
  current_attendees: number;
  price_credits: number;
  host_name: string | null;
  status: string;
  image_url: string | null;
}

// Category configuration with colors and icons
const CATEGORIES: { key: EventCategory | 'all'; label: string; color: string }[] = [
  { key: 'all', label: 'All Events', color: '#3B5998' },
  { key: 'cultural', label: 'Cultural', color: '#8B5CF6' },
  { key: 'childrens', label: "Children's", color: '#F59E0B' },
  { key: 'dancing', label: 'Dancing', color: '#EC4899' },
  { key: 'learning', label: 'Learning', color: '#3B82F6' },
  { key: 'wellness', label: 'Wellness', color: '#10B981' },
  { key: 'social', label: 'Social', color: '#F97316' },
  { key: 'nightlife', label: 'Nightlife', color: '#6366F1' },
];

const getCategoryColor = (category: EventCategory): string => {
  const found = CATEGORIES.find(c => c.key === category);
  return found?.color || '#C5A059';
};

const getCategoryLabel = (category: EventCategory): string => {
  const found = CATEGORIES.find(c => c.key === category);
  return found?.label || category;
};

// Date formatting helpers
const formatEventDate = (dateString: string): { date: string; time: string; fullDate: string } => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    fullDate: date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  };
};

// Email segmentation utility (for future use)
export const getUsersInterestedIn = async (category: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, first_name')
    .contains('interested_categories', [category]);

  if (error) {
    console.error('Error fetching users by interest:', error);
    return [];
  }
  return data;
};

// Main component
const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [userRSVPs, setUserRSVPs] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>(
    (searchParams.get('category') as EventCategory) || 'all'
  );
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);

  // Fetch events from Supabase
  const fetchEvents = useCallback(async () => {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .in('status', ['upcoming', 'happening_now'])
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      setEvents((data as Event[]) || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [selectedCategory]);

  // Fetch user's RSVPs
  const fetchUserRSVPs = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('event_attendees')
        .select('event_id')
        .eq('user_id', user.id)
        .eq('rsvp_status', 'confirmed');

      if (error) {
        console.error('Error fetching RSVPs:', error);
        return;
      }

      setUserRSVPs(new Set((data as { event_id: string }[])?.map(r => r.event_id) || []));
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    }
  }, [user]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchUserRSVPs()]);
      setLoading(false);
    };
    loadData();
  }, [fetchEvents, fetchUserRSVPs]);

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', selectedCategory);
    }
    setSearchParams(searchParams, { replace: true });
  }, [selectedCategory, searchParams, setSearchParams]);

  // Handle category selection
  const handleCategoryChange = (category: EventCategory | 'all') => {
    setSelectedCategory(category);
  };

  // Handle RSVP
  const handleRSVP = async (event: Event) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to RSVP to events.',
        variant: 'destructive',
      });
      return;
    }

    setRsvpLoading(event.id);

    try {
      const isAlreadyRSVPd = userRSVPs.has(event.id);

      if (isAlreadyRSVPd) {
        // Cancel RSVP
        const { error } = await supabase
          .from('event_attendees')
          .delete()
          .eq('event_id', event.id)
          .eq('user_id', user.id);

        if (error) throw error;

        setUserRSVPs(prev => {
          const next = new Set(prev);
          next.delete(event.id);
          return next;
        });

        setEvents(prev =>
          prev.map(e =>
            e.id === event.id
              ? { ...e, current_attendees: Math.max(0, e.current_attendees - 1) }
              : e
          )
        );

        toast({
          title: 'RSVP cancelled',
          description: `You've cancelled your RSVP for "${event.title}"`,
        });
      } else {
        // Check if event is full
        if (event.max_attendees && event.current_attendees >= event.max_attendees) {
          toast({
            title: 'Event is full',
            description: 'This event has reached capacity.',
            variant: 'destructive',
          });
          setRsvpLoading(null);
          return;
        }

        // Create RSVP
        const { error } = await supabase
          .from('event_attendees')
          .insert({
            event_id: event.id,
            user_id: user.id,
            rsvp_status: 'confirmed',
          });

        if (error) throw error;

        setUserRSVPs(prev => new Set(prev).add(event.id));

        setEvents(prev =>
          prev.map(e =>
            e.id === event.id
              ? { ...e, current_attendees: e.current_attendees + 1 }
              : e
          )
        );

        toast({
          title: "You're going!",
          description: `You've RSVP'd for "${event.title}"`,
        });
      }
    } catch (error) {
      console.error('Error handling RSVP:', error);
      toast({
        title: 'Error',
        description: 'Failed to update RSVP. Please try again.',
        variant: 'destructive',
      });
    }

    setRsvpLoading(null);
  };

  // Share event
  const handleShare = async (event: Event) => {
    const shareData = {
      title: event.title,
      text: `Check out this event at Maslow: ${event.title}`,
      url: `${window.location.origin}/events?event=${event.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: 'Link copied!',
          description: 'Event link copied to clipboard.',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Render event card
  const renderEventCard = (event: Event) => {
    const { date, time } = formatEventDate(event.event_date);
    const categoryColor = getCategoryColor(event.category);
    const isRSVPd = userRSVPs.has(event.id);
    const isFull = event.max_attendees !== null && event.current_attendees >= event.max_attendees;

    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="group cursor-pointer"
        onClick={() => setSelectedEvent(event)}
      >
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#3B5998]/10 h-full flex flex-col">
          {/* Image placeholder */}
          {event.image_url ? (
            <div className="aspect-video bg-[#3B5998]/5 overflow-hidden">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div
              className="aspect-video flex items-center justify-center"
              style={{ backgroundColor: `${categoryColor}10` }}
            >
              <Calendar className="w-12 h-12" style={{ color: categoryColor }} />
            </div>
          )}

          <div className="p-5 flex flex-col flex-grow">
            {/* Category badge and date */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded"
                style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
              >
                {getCategoryLabel(event.category)}
              </span>
              <span className="text-sm text-[#1a1a1a]/60">{date}</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-[#3B5998] mb-2 group-hover:text-[#C5A059] transition-colors line-clamp-2">
              {event.title}
            </h3>

            {/* Time */}
            <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60 mb-2">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Attendees and price */}
            <div className="flex items-center justify-between mb-4 pt-3 border-t border-[#3B5998]/10">
              <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60">
                <Users className="w-4 h-4" />
                <span>
                  {event.current_attendees}
                  {event.max_attendees ? `/${event.max_attendees}` : ''} attending
                </span>
              </div>
              <span className="text-sm font-semibold text-[#C5A059]">
                {event.price_credits === 0 ? 'Free for members' : `${event.price_credits} credits`}
              </span>
            </div>

            {/* RSVP button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleRSVP(event);
              }}
              disabled={rsvpLoading === event.id || (isFull && !isRSVPd)}
              className={`w-full ${
                isRSVPd
                  ? 'bg-[#10B981] hover:bg-[#10B981]/90 text-white'
                  : isFull
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#3B5998] hover:bg-[#3B5998]/90 text-white'
              }`}
            >
              {rsvpLoading === event.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isRSVPd ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Going
                </>
              ) : isFull ? (
                'Event Full'
              ) : (
                'RSVP'
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render event detail modal
  const renderEventModal = () => {
    if (!selectedEvent) return null;

    const { fullDate, time } = formatEventDate(selectedEvent.event_date);
    const categoryColor = getCategoryColor(selectedEvent.category);
    const isRSVPd = userRSVPs.has(selectedEvent.id);
    const isFull =
      selectedEvent.max_attendees !== null &&
      selectedEvent.current_attendees >= selectedEvent.max_attendees;

    return (
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F5F1E8]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded"
                style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
              >
                {getCategoryLabel(selectedEvent.category)}
              </span>
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-serif text-[#3B5998]">
              {selectedEvent.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Event details for {selectedEvent.title}
            </DialogDescription>
          </DialogHeader>

          {/* Event image */}
          {selectedEvent.image_url && (
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <img
                src={selectedEvent.image_url}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Event details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <Calendar className="w-5 h-5 text-[#C5A059] mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#1a1a1a]/50 mb-1">Date</p>
                  <p className="text-[#3B5998] font-medium">{fullDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <Clock className="w-5 h-5 text-[#C5A059] mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#1a1a1a]/50 mb-1">Time</p>
                  <p className="text-[#3B5998] font-medium">{time}</p>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <MapPin className="w-5 h-5 text-[#C5A059] mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#1a1a1a]/50 mb-1">Location</p>
                    <p className="text-[#3B5998] font-medium">{selectedEvent.location}</p>
                  </div>
                </div>
              )}

              {selectedEvent.host_name && (
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <User className="w-5 h-5 text-[#C5A059] mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#1a1a1a]/50 mb-1">Hosted by</p>
                    <p className="text-[#3B5998] font-medium">{selectedEvent.host_name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <Users className="w-5 h-5 text-[#C5A059] mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#1a1a1a]/50 mb-1">Attendees</p>
                  <p className="text-[#3B5998] font-medium">
                    {selectedEvent.current_attendees}
                    {selectedEvent.max_attendees ? ` of ${selectedEvent.max_attendees}` : ''} registered
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <Ticket className="w-5 h-5 text-[#C5A059] mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#1a1a1a]/50 mb-1">Price</p>
                  <p className="text-[#3B5998] font-medium">
                    {selectedEvent.price_credits === 0
                      ? 'Free for members'
                      : `${selectedEvent.price_credits} credits`}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedEvent.description && (
              <div className="p-4 bg-white rounded-lg">
                <h4 className="text-sm uppercase tracking-wider text-[#1a1a1a]/50 mb-2">About This Event</h4>
                <p className="text-[#1a1a1a]/70 leading-relaxed whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {selectedEvent.tags && selectedEvent.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedEvent.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1 bg-white rounded-full text-[#1a1a1a]/60 border border-[#3B5998]/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#3B5998]/10">
              <Button
                onClick={() => handleRSVP(selectedEvent)}
                disabled={rsvpLoading === selectedEvent.id || (isFull && !isRSVPd)}
                className={`flex-1 ${
                  isRSVPd
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : isFull
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[#3B5998] hover:bg-[#3B5998]/90 text-white'
                }`}
              >
                {rsvpLoading === selectedEvent.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isRSVPd ? (
                  'Cancel RSVP'
                ) : isFull ? (
                  'Event Full'
                ) : (
                  'RSVP Now'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare(selectedEvent)}
                className="border-[#3B5998]/20 text-[#3B5998] hover:bg-[#3B5998]/5"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <Helmet>
        <title>Events | Maslow NYC</title>
        <meta name="description" content="Upcoming events at Maslow - Connect, learn, and grow with our community." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 bg-[#FAF4ED]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#3B5998] mb-4">
              Upcoming Events at Maslow
            </h1>
            <p className="text-xl text-[#1a1a1a]/70 max-w-2xl mx-auto">
              Connect, learn, and grow with our community
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-20 z-40 bg-[#F5F1E8]/95 backdrop-blur-sm border-b border-[#3B5998]/10 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.key;
              return (
                <button
                  key={category.key}
                  onClick={() => handleCategoryChange(category.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? 'text-white shadow-md'
                      : 'bg-white text-[#3B5998] border border-[#3B5998]/20 hover:border-[#3B5998]/40'
                  }`}
                  style={isSelected ? { backgroundColor: category.color } : undefined}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#C5A059] mb-4" />
              <p className="text-[#1a1a1a]/60">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Calendar className="w-16 h-16 text-[#3B5998]/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#3B5998] mb-2">No Events Found</h3>
              <p className="text-[#1a1a1a]/60 mb-6">
                {selectedCategory === 'all'
                  ? 'No upcoming events scheduled at this time.'
                  : `No ${getCategoryLabel(selectedCategory as EventCategory)} events scheduled.`}
              </p>
              {selectedCategory !== 'all' && (
                <Button
                  onClick={() => setSelectedCategory('all')}
                  variant="outline"
                  className="border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059]/10"
                >
                  Show All Events
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <p className="text-sm text-[#1a1a1a]/60 mb-6">
                {events.length} {events.length === 1 ? 'event' : 'events'} found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {events.map(renderEventCard)}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>

      {/* My RSVPs Link (if logged in) */}
      {user && userRSVPs.size > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link
            to="/profile#events"
            className="flex items-center gap-2 px-4 py-3 bg-[#3B5998] text-white rounded-full shadow-lg hover:bg-[#3B5998]/90 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span className="font-medium">My Events ({userRSVPs.size})</span>
          </Link>
        </div>
      )}

      {/* Event Detail Modal */}
      {renderEventModal()}
    </div>
  );
};

export default EventsPage;
