import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import SessionsSection, { SessionType } from '@/components/SessionsSection';
import BookingSection from '@/components/BookingSection';
import HeroCarousel from '@/components/HeroCarousel';

const HomePage = () => {
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);

  const scrollToSessions = () => {
    document.getElementById('sessions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Maslow NYC — New York's First Real Restroom</title>
        <meta name="description" content="New York's first real restroom. Private suites in SoHo — not a stall, not a hotel lobby. Yours, for as long as you need. From $5." />
        <meta property="og:title" content="Maslow NYC — New York's First Real Restroom" />
        <meta property="og:description" content="New York's first real restroom. Private suites in SoHo — not a stall, not a hotel lobby. Yours, for as long as you need. From $5." />
      </Helmet>

      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Hero Carousel — add images to /public/hero-carousel/ */}
        <HeroCarousel />

        {/* Hero Content - Left side */}
        <div className="absolute bottom-24 left-8 md:left-16 lg:left-24 z-10 max-w-xl">
          <p
            className="text-sm uppercase tracking-[0.4em] mb-6"
            style={{ color: 'var(--cream)', fontFamily: 'var(--sans)' }}
          >
            SoHo, New York City
          </p>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-8"
            style={{ color: 'var(--cream)', fontFamily: 'var(--serif)' }}
          >
            Where the city<br />can wait.
          </h1>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={scrollToSessions}
              className="px-8 py-4 text-sm uppercase tracking-wider transition-opacity hover:opacity-90"
              style={{
                background: 'var(--gold)',
                color: 'var(--charcoal)',
                fontFamily: 'var(--sans)',
                fontWeight: 400,
              }}
            >
              Book a Visit
            </button>
            <Link
              to="/hull"
              className="px-8 py-4 text-sm uppercase tracking-wider border transition-colors hover:bg-white/10"
              style={{
                borderColor: 'var(--cream)',
                color: 'var(--cream)',
                fontFamily: 'var(--sans)',
                fontWeight: 300,
              }}
            >
              The Hull &rarr;
            </Link>
          </div>
        </div>


      </section>

      {/* ===== SUITE SECTION ===== */}
      <section className="py-24" style={{ background: 'var(--cream)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-sm uppercase tracking-[0.3em] mb-4"
                style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
              >
                Private Sanctuary
              </p>
              <h2
                className="text-4xl md:text-5xl font-light mb-6"
                style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}
              >
                The Suite
              </h2>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)', opacity: 0.8 }}
              >
                Every Maslow suite is a private, fully-enclosed sanctuary. Hospital-grade sanitation meets
                boutique hospitality in spaces designed for complete peace of mind. Premium amenities,
                accessibility features, and absolute privacy - because some moments should be yours alone.
              </p>
              <ul className="space-y-3" style={{ fontFamily: 'var(--sans)' }}>
                {['Private, fully-enclosed suite', 'Hospital-grade sanitation', 'Premium amenities included', 'Full ADA accessibility'].map((item) => (
                  <li key={item} className="flex items-center gap-3" style={{ color: 'var(--charcoal)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-[4/3] rounded-sm overflow-hidden">
              <img
                src="/hero-carousel/japanese-garden.jpg"
                alt="A private sanctuary"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SESSIONS SECTION ===== */}
      <SessionsSection
        onSelect={setSelectedSession}
        selectedId={selectedSession?.id}
      />

      {/* ===== HULL SECTION ===== */}
      <section className="py-24" style={{ background: 'var(--moss)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/3] rounded-sm overflow-hidden order-2 md:order-1">
              <img
                src="/hero-carousel/angola-gathering.jpg"
                alt="Community gathering at The Hull"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <p
                className="text-sm uppercase tracking-[0.3em] mb-4"
                style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
              >
                Free & Open to All
              </p>
              <h2
                className="text-4xl md:text-5xl font-light mb-6"
                style={{ color: 'var(--cream)', fontFamily: 'var(--serif)' }}
              >
                The Hull
              </h2>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: 'var(--cream)', fontFamily: 'var(--sans)', opacity: 0.85 }}
              >
                Beyond the suites lies The Hull — a free communal space open to everyone. No purchase required. Water, ice, seating, phone charging, and a place to simply exist in the middle of the city. Walk in. Stay as long as you need.
              </p>
              <Link
                to="/hull"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-wider transition-opacity hover:opacity-90"
                style={{
                  background: 'var(--gold)',
                  color: 'var(--charcoal)',
                  fontFamily: 'var(--sans)',
                }}
              >
                Explore The Hull
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOOKING SECTION ===== */}
      <BookingSection selectedSession={selectedSession} />
    </>
  );
};

export default HomePage;
