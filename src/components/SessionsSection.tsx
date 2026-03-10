import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export interface SessionType {
  id: number;
  name: string;
  duration_minutes: number;
  price_cents: number;       // stored as integer cents (e.g. 500 = $5.00) — Stripe standard
  passes_included: number;   // how many guest passes come with this session
  sample_limit: number;      // max product samples guest can select
  is_active: boolean;
  sort_order: number;
}

interface SessionsSectionProps {
  onSelect: (session: SessionType) => void;
  selectedId?: number;
}

const SessionsSection = ({ onSelect, selectedId }: SessionsSectionProps) => {
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data, error } = await (supabase
          .from('session_types') as any)
          .select('id, name, duration_minutes, price_cents, passes_included, sample_limit, is_active, sort_order')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setSessions(data || []);
      } catch (err: any) {
        console.error('Error fetching sessions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleSelect = (session: SessionType) => {
    onSelect(session);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  // price_cents → display string: 500 → "$5"
  const formatPrice = (cents: number) => `$${Math.round(cents / 100)}`;


  if (loading) {
    return (
      <section id="sessions" className="py-24" style={{ background: 'var(--charcoal)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32">
            {[1,2,3,4].map(i => (
              <div key={i} className="p-8 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', borderTop: '3px solid transparent', borderRadius: '4px', height: '280px' }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sessions" className="py-24" style={{ background: 'var(--charcoal)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}>
            Choose Your Visit
          </p>
          <h2 className="text-4xl md:text-5xl font-light" style={{ color: 'var(--cream)', fontFamily: 'var(--serif)' }}>
            Sessions
          </h2>
          {error && (
            <p className="mt-4 text-sm" style={{ color: 'rgba(250,244,237,0.5)', fontFamily: 'var(--sans)' }}>
              Unable to load sessions. Please refresh.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sessions.map((session) => {
            const isSelected = selectedId === session.id;
            return (
              <button
                key={session.id}
                onClick={() => handleSelect(session)}
                className="relative p-8 text-left transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderTop: isSelected ? '3px solid var(--gold)' : '3px solid transparent',
                  borderRadius: '4px',
                  outline: isSelected ? '1px solid rgba(196,159,88,0.4)' : 'none',
                  transform: isSelected ? 'translateY(-4px)' : undefined,
                }}
              >
                <div className="text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}>
                  {session.duration_minutes} min
                </div>
                <h3 className="text-2xl mb-6 font-light" style={{ color: 'var(--cream)', fontFamily: 'var(--serif)' }}>
                  {session.name}
                </h3>
                <ul className="space-y-2 mb-8" style={{ color: 'rgba(250,244,237,0.7)', fontFamily: 'var(--sans)' }}>
                  <li className="flex items-center gap-2 text-sm">
                    <span style={{ color: 'var(--gold)' }}>—</span> Private suite access
                  </li>
                  {session.sample_limit > 0 && (
                    <li className="flex items-center gap-2 text-sm">
                      <span style={{ color: 'var(--gold)' }}>—</span> {session.sample_limit} product {session.sample_limit === 1 ? 'sample' : 'samples'}
                    </li>
                  )}
                  {session.passes_included > 0 && (
                    <li className="flex items-center gap-2 text-sm">
                      <span style={{ color: 'var(--gold)' }}>—</span> {session.passes_included} guest {session.passes_included === 1 ? 'pass' : 'passes'}
                    </li>
                  )}
                </ul>
                <div className="text-3xl font-light" style={{ color: 'var(--cream)', fontFamily: 'var(--serif)' }}>
                  {formatPrice(session.price_cents)}
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4 w-3 h-3 rounded-full" style={{ background: 'var(--gold)' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SessionsSection;
