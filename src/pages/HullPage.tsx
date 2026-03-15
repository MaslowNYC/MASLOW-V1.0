import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const HULL_QUEUE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hull-queue`;

interface HullStatus {
  occupancy: number;
  max_capacity: number;
  available: number;
  queue_length: number;
  upcoming_reservations: number;
}

interface QueueEntry {
  id: string;
  queue_type: 'walk_up' | 'reservation';
  status: string;
  position: number | null;
  reserved_for: string | null;
  checked_in_at: string | null;
}

interface ProgramItem {
  title: string;
  desc: string;
}

const HullPage: React.FC = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<HullStatus | null>(null);
  const [activeEntry, setActiveEntry] = useState<QueueEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'now' | 'later'>('now');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Hull status (public, no auth)
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${HULL_QUEUE_URL}?action=status`);
      const data = await res.json();
      if (res.ok) {
        setStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch Hull status:', err);
    }
  }, []);

  // Fetch user's active queue entry
  const fetchActiveEntry = useCallback(async () => {
    if (!user) {
      setActiveEntry(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('queue')
        .select('*')
        .eq('user_id', user.id)
        .is('checked_out_at', null)
        .in('status', ['waiting', 'called', 'checked_in'])
        .order('joined_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setActiveEntry(data as QueueEntry);
      } else {
        setActiveEntry(null);
      }
    } catch (err) {
      setActiveEntry(null);
    }
  }, [user]);

  // Poll status every 30 seconds
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Fetch active entry when user changes
  useEffect(() => {
    fetchActiveEntry();
  }, [fetchActiveEntry]);

  // Get auth token for authenticated requests
  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    };
  };

  // Join walk-up queue
  const handleJoinQueue = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${HULL_QUEUE_URL}?action=join`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ queue_type: 'walk_up', location_id: 1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to join queue');
      } else {
        await fetchActiveEntry();
        await fetchStatus();
      }
    } catch (err) {
      setError('Failed to join queue');
    } finally {
      setLoading(false);
    }
  };

  // Make reservation
  const handleReservation = async () => {
    if (!user || !selectedTime) return;
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${HULL_QUEUE_URL}?action=join`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          queue_type: 'reservation',
          reserved_for: selectedTime,
          location_id: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to make reservation');
      } else {
        await fetchActiveEntry();
        await fetchStatus();
      }
    } catch (err) {
      setError('Failed to make reservation');
    } finally {
      setLoading(false);
    }
  };

  // Check in
  const handleCheckin = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${HULL_QUEUE_URL}?action=checkin`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ location_id: 1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to check in');
      } else {
        await fetchActiveEntry();
        await fetchStatus();
      }
    } catch (err) {
      setError('Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  // Check out
  const handleCheckout = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${HULL_QUEUE_URL}?action=checkout`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ location_id: 1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to check out');
      } else {
        await fetchActiveEntry();
        await fetchStatus();
      }
    } catch (err) {
      setError('Failed to check out');
    } finally {
      setLoading(false);
    }
  };

  // Cancel reservation/queue
  const handleCancel = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${HULL_QUEUE_URL}?action=cancel`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ location_id: 1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to cancel');
      } else {
        setActiveEntry(null);
        await fetchStatus();
      }
    } catch (err) {
      setError('Failed to cancel');
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots (7AM - 10PM, 30-min intervals)
  const generateTimeSlots = () => {
    const slots: { value: string; label: string }[] = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let hour = 7; hour <= 21; hour++) {
      for (const minute of [0, 30]) {
        const slotTime = new Date(today);
        slotTime.setHours(hour, minute, 0, 0);

        // Only show future slots
        if (slotTime > now) {
          slots.push({
            value: slotTime.toISOString(),
            label: slotTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          });
        }
      }
    }
    return slots;
  };

  // Status bar color based on occupancy
  const getStatusColor = () => {
    if (!status) return 'var(--moss)';
    const percentage = status.occupancy / status.max_capacity;
    if (percentage >= 1) return '#dc2626'; // red
    if (percentage >= 0.75) return '#d97706'; // amber
    return '#16a34a'; // green
  };

  const programItems: ProgramItem[] = [
    { title: "Cultural celebrations", desc: "Islamic Heritage Month, Lunar New Year, Juneteenth, Pride, Hanukkah, Christmas, Diwali, and more—honoring the traditions that matter to New Yorkers" },
    { title: "Local artist showcases", desc: "Rotating art installations from neighborhood creators" },
    { title: "Community conversations", desc: "Panel discussions, town halls, storytelling nights" },
    { title: "Skill shares", desc: "Free workshops on everything from resume writing to urban gardening" },
    { title: "Quiet hours", desc: "Designated times when The Hull is a silent space for reading, prayer, or rest" }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <Helmet>
        <title>The Hull | Maslow NYC</title>
        <meta name="description" content="The Hull - The gathering space at the heart of select Maslow locations." />
      </Helmet>

      {/* Hero Section */}
      <section
        className="relative pt-32 pb-24 px-6"
        style={{ background: 'linear-gradient(160deg, #1a2318 0%, #2d3b28 60%, #1e2d1a 100%)' }}
      >
        {/* Subtle leaf texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,10 C60,10 70,20 70,30 C70,40 60,50 50,50 C40,50 30,40 30,30 C30,20 40,10 50,10' fill='%23ffffff' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="text-5xl md:text-7xl font-bold mb-6"
              style={{ color: 'var(--cream)', fontFamily: 'var(--serif)' }}
            >
              The Hull
            </h1>
            <p
              className="text-xl md:text-2xl font-light max-w-3xl mx-auto"
              style={{ color: 'rgba(250,244,237,0.75)' }}
            >
              The gathering space at the heart of select Maslow locations—where infrastructure meets community.
            </p>
          </motion.div>
        </div>
        {/* Bottom wave transition */}
        <svg
          className="absolute bottom-0 left-0 w-full h-16"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          style={{ fill: 'var(--cream-2)' }}
        >
          <path d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,40 1440,32 L1440,64 L0,64 Z" />
        </svg>
      </section>

      {/* Reserve Your Spot Section */}
      <section className="py-20 px-6" style={{ background: 'var(--cream-2)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
            >
              Reserve Your Spot
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            {/* A. Hull Status Bar - Always visible, no auth */}
            {status && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium" style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)' }}>
                    {status.occupancy} of {status.max_capacity} spots taken
                  </span>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full"
                    style={{
                      background: getStatusColor(),
                      color: 'white',
                    }}
                  >
                    {status.available > 0 ? `${status.available} available` : 'Full'}
                  </span>
                </div>
                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{ background: 'rgba(42,39,36,0.1)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(status.occupancy / status.max_capacity) * 100}%`,
                      background: getStatusColor(),
                    }}
                  />
                </div>
                {status.queue_length > 0 && (
                  <p className="mt-2 text-sm" style={{ color: 'rgba(42,39,36,0.6)', fontFamily: 'var(--sans)' }}>
                    {status.queue_length} {status.queue_length === 1 ? 'person' : 'people'} waiting in queue
                  </p>
                )}
              </div>
            )}

            {/* C. Confirmation Card - When user has active entry */}
            {activeEntry && (
              <div
                className="p-6 rounded-xl mb-8"
                style={{
                  background: 'var(--cream)',
                  border: '2px solid var(--gold)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                {activeEntry.status === 'checked_in' ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: '#16a34a' }}
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>
                        You're In
                      </h3>
                    </div>
                    <p className="text-lg mb-4" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
                      Enjoy The Hull! Tap below when you're ready to leave.
                    </p>
                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full py-3 px-6 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: 'var(--charcoal)', color: 'var(--cream)', fontFamily: 'var(--sans)' }}
                    >
                      {loading ? 'Processing...' : 'Check Out'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--gold)' }}
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>
                        {activeEntry.queue_type === 'reservation' ? 'Reservation Confirmed' : "You're in Line"}
                      </h3>
                    </div>

                    {activeEntry.queue_type === 'reservation' && activeEntry.reserved_for && (
                      <p className="text-xl font-medium mb-2" style={{ color: 'var(--moss)', fontFamily: 'var(--sans)' }}>
                        {new Date(activeEntry.reserved_for).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
                    )}

                    {activeEntry.queue_type === 'walk_up' && activeEntry.position && (
                      <p className="text-xl font-medium mb-2" style={{ color: 'var(--moss)', fontFamily: 'var(--sans)' }}>
                        Position #{activeEntry.position} in queue
                        {activeEntry.status === 'called' && (
                          <span className="ml-2 text-sm px-2 py-1 rounded-full" style={{ background: '#16a34a', color: 'white' }}>
                            You're up!
                          </span>
                        )}
                      </p>
                    )}

                    <p className="text-sm mb-6" style={{ color: 'rgba(42,39,36,0.6)', fontFamily: 'var(--sans)' }}>
                      When you arrive, tap Check In or scan the QR code at The Hull entrance.
                    </p>

                    <div className="flex gap-3">
                      {(activeEntry.queue_type === 'reservation' || activeEntry.status === 'called') && (
                        <button
                          onClick={handleCheckin}
                          disabled={loading}
                          className="flex-1 py-3 px-6 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50"
                          style={{ background: 'var(--moss)', color: 'var(--cream)', fontFamily: 'var(--sans)' }}
                        >
                          {loading ? 'Processing...' : 'Check In'}
                        </button>
                      )}
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 py-3 px-6 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ background: 'transparent', color: 'var(--charcoal)', border: '1px solid var(--charcoal)', fontFamily: 'var(--sans)' }}
                      >
                        {loading ? 'Processing...' : 'Cancel'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* B. Reserve a Spot - Tabbed interface (only show if no active entry) */}
            {!activeEntry && user && (
              <div
                className="p-6 rounded-xl"
                style={{ background: 'var(--cream)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              >
                {/* Tab buttons */}
                <div className="flex mb-6 rounded-lg overflow-hidden" style={{ background: 'rgba(42,39,36,0.06)' }}>
                  <button
                    onClick={() => setActiveTab('now')}
                    className="flex-1 py-3 px-6 font-bold transition-all"
                    style={{
                      background: activeTab === 'now' ? 'var(--moss)' : 'transparent',
                      color: activeTab === 'now' ? 'var(--cream)' : 'var(--charcoal)',
                      fontFamily: 'var(--sans)',
                    }}
                  >
                    Now
                  </button>
                  <button
                    onClick={() => setActiveTab('later')}
                    className="flex-1 py-3 px-6 font-bold transition-all"
                    style={{
                      background: activeTab === 'later' ? 'var(--moss)' : 'transparent',
                      color: activeTab === 'later' ? 'var(--cream)' : 'var(--charcoal)',
                      fontFamily: 'var(--sans)',
                    }}
                  >
                    Later
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg" style={{ background: '#fef2f2', color: '#dc2626', fontFamily: 'var(--sans)' }}>
                    {error}
                  </div>
                )}

                {/* Now tab - Walk-up queue */}
                {activeTab === 'now' && (
                  <div>
                    <p className="mb-4" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
                      {status && status.available > 0
                        ? 'Spots are available! Join the queue to secure your place.'
                        : 'The Hull is currently full. Join the queue and we\'ll notify you when a spot opens.'}
                    </p>
                    <button
                      onClick={handleJoinQueue}
                      disabled={loading}
                      className="w-full py-4 px-6 rounded-lg font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: 'var(--moss)', color: 'var(--cream)', fontFamily: 'var(--sans)' }}
                    >
                      {loading ? 'Joining...' : 'Get in Line'}
                    </button>
                  </div>
                )}

                {/* Later tab - Time picker for reservations */}
                {activeTab === 'later' && (
                  <div>
                    <p className="mb-4" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
                      Reserve a spot for later today. Reservations skip the walk-up queue.
                    </p>
                    <div className="mb-4">
                      <label
                        className="block mb-2 font-medium"
                        style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)' }}
                      >
                        Select a time
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full p-3 rounded-lg border"
                        style={{
                          borderColor: 'rgba(42,39,36,0.2)',
                          fontFamily: 'var(--sans)',
                          color: 'var(--charcoal)',
                        }}
                      >
                        <option value="">Choose a time slot...</option>
                        {generateTimeSlots().map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleReservation}
                      disabled={loading || !selectedTime}
                      className="w-full py-4 px-6 rounded-lg font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: 'var(--gold)', color: 'var(--charcoal)', fontFamily: 'var(--sans)' }}
                    >
                      {loading ? 'Reserving...' : 'Reserve This Time'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Not logged in prompt */}
            {!activeEntry && !user && (
              <div
                className="p-6 rounded-xl text-center"
                style={{ background: 'var(--cream)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              >
                <p className="mb-4 text-lg" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
                  Sign in to reserve a spot or join the walk-up queue.
                </p>
                <a
                  href="/login"
                  className="inline-block py-3 px-8 rounded-lg font-bold transition-all hover:opacity-90"
                  style={{ background: 'var(--moss)', color: 'var(--cream)', fontFamily: 'var(--sans)' }}
                >
                  Sign In
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* What Is The Hull Section */}
      <section className="py-20 px-6" style={{ background: 'var(--cream)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
            >
              What Is The Hull
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <div className="space-y-6 text-lg leading-relaxed" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
              <p>
                Scan your Maslow Pass at the refurbished turnstile and step into The Hull—a respite from the heat, cold, noise, smells, and relentless energy of the city outside.
              </p>
              <p>
                Here, you can catch your breath. Refill your ice water. Wash your hands. Grab something you forgot—a phone charger, a water bottle, essentials you didn't know you'd need. It's the gathering space before and after you use a Maslow suite. It's where we host cultural programming, art exhibits, and community events. It's the calm before you step back into the chaos.
              </p>
              <p>
                The name comes from ship architecture—the hull is what holds everything together, the structural heart that makes the vessel work. That's what this space is meant to be: the heart of Maslow locations that have one.
              </p>
              <p className="font-medium italic" style={{ color: 'var(--moss)' }}>
                Not all Maslow locations will have a Hull. Some neighborhoods need basic bathroom access more than they need community programming. We're building what each location calls for, not imposing a single model everywhere.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Access Section */}
      <section className="py-20 px-6" style={{ background: 'var(--cream-2)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
            >
              Access
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <h3
              className="text-3xl md:text-4xl mb-6"
              style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}
            >
              How to Enter The Hull
            </h3>

            <div className="space-y-6 text-lg leading-relaxed" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
              <p>
                The Hull requires an active Maslow account, which generates your Maslow Pass—a QR code you scan at our refurbished turnstile to enter.
              </p>
              <p>
                Once inside, you can relax, refill your water, or wait for your Maslow suite session (which you can book anytime, anywhere through the app or website—even from home before your trip to NYC). When your suite is ready, scan your Maslow Pass again to access the member hallway.
              </p>
              <p>
                Maslow suites can also be accessed directly from the street entrance, so you never have to enter The Hull if you just need to use a suite quickly. The Hull is for those who want the community space—it's never mandatory.
              </p>
            </div>

            <div
              className="mt-10 p-6 rounded-xl"
              style={{ background: 'rgba(74,92,58,0.06)', border: '1px solid var(--gold)' }}
            >
              <p className="font-medium" style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)' }}>
                <strong>Hours:</strong> The Hull operates during daytime and evening hours (specific times vary by location). After The Hull closes, Maslow suites remain accessible via the street entrance 24/7.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programming Section */}
      <section className="py-20 px-6" style={{ background: 'var(--cream)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
            >
              Programming
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <h3
              className="text-3xl md:text-4xl mb-6"
              style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}
            >
              Cultural Programming & Events
            </h3>

            <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
              The Hull exists to make space for the communities we serve. We don't presume to know what programming matters most—we're building this with you, not dictating it from above.
            </p>

            <h4 className="text-xl font-bold mb-6" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>What we're exploring:</h4>

            <ul className="space-y-4 mb-10">
              {programItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: 'var(--moss)' }}></div>
                  <div style={{ fontFamily: 'var(--sans)' }}>
                    <span className="font-bold" style={{ color: 'var(--charcoal)' }}>{item.title}:</span>{" "}
                    <span style={{ color: 'rgba(42,39,36,0.7)' }}>{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="rounded-xl p-8" style={{ background: 'var(--cream)' }}>
              <p className="leading-relaxed mb-4" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
                But again—we're learning. If you have ideas for programming, artists we should feature, or community needs we're missing, reach out. This space only works if it reflects the people who use it.
              </p>
              <a
                href="mailto:hello@maslow.nyc"
                className="font-bold transition-colors hover:opacity-80"
                style={{ color: 'var(--gold)' }}
              >
                hello@maslow.nyc
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Name Section */}
      <section
        className="py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #1a2318 0%, #2d3b28 100%)' }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
            >
              Why The Name
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <h3
              className="text-3xl md:text-4xl mb-8"
              style={{ color: 'var(--cream)', fontFamily: 'var(--serif)' }}
            >
              The Name
            </h3>

            <div className="space-y-6 text-lg leading-relaxed" style={{ color: 'rgba(250,244,237,0.8)', fontFamily: 'var(--sans)' }}>
              <p>
                Ships are held together by their hull—the watertight body that makes everything else possible. The crew, the cargo, the journey—none of it works without a strong hull.
              </p>
              <p>
                We named this space The Hull because it's meant to hold communities together. It's the infrastructure that makes connection possible in a city where connection is hard to find.
              </p>
              <p className="font-medium text-xl" style={{ color: 'var(--cream)' }}>
                Bathrooms are essential. Privacy is essential. But so is community. The Hull is where those things meet.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HullPage;
