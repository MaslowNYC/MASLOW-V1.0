import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import SessionsSection, { SessionType } from '@/components/SessionsSection';
import BookingSection from '@/components/BookingSection';

// Generate random leaf positions for SVG layers
const generateLeaves = (count: number, excludeZone?: { x1: number; x2: number; y1: number; y2: number }) => {
  const leaves: { x: number; y: number; rotation: number; scale: number; type: 1 | 2 }[] = [];
  for (let i = 0; i < count; i++) {
    let x = Math.random() * 1440;
    let y = Math.random() * 900;

    // If in exclude zone, thin out (skip 70% of leaves)
    if (excludeZone && x > excludeZone.x1 && x < excludeZone.x2 && y > excludeZone.y1 && y < excludeZone.y2) {
      if (Math.random() < 0.7) continue;
    }

    leaves.push({
      x,
      y,
      rotation: Math.random() * 360,
      scale: 0.6 + Math.random() * 0.8,
      type: Math.random() > 0.5 ? 1 : 2,
    });
  }
  return leaves;
};

// Pre-generate leaf positions for each layer
const layer1Leaves = generateLeaves(80);
const layer2Leaves = generateLeaves(70);
const layer3Leaves = generateLeaves(60, { x1: 1000, x2: 1350, y1: 150, y2: 600 });

const IvyLayer = ({
  leaves,
  fill,
  opacity,
  animationDuration,
  offset,
}: {
  leaves: typeof layer1Leaves;
  fill: string;
  opacity: number;
  animationDuration: number;
  offset: { x: number; y: number };
}) => (
  <svg
    className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]"
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
    style={{
      transform: `translate(${offset.x}px, ${offset.y}px)`,
      transition: 'transform 0.1s ease-out',
    }}
  >
    <defs>
      <path id="lf" d="M0,-16 C6,-16 14,-8 14,0 C14,6 8,14 0,16 C-8,14 -14,6 -14,0 C-14,-8 -6,-16 0,-16 Z" />
      <path id="lf2" d="M0,-14 C8,-12 16,-4 14,4 C12,12 6,16 0,16 C-6,16 -12,12 -14,4 C-16,-4 -8,-12 0,-14 Z" />
    </defs>
    <g fill={fill} opacity={opacity}>
      <style>{`
        @keyframes sway-${animationDuration} {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(8px) rotate(2deg); }
        }
        .sway-${animationDuration} {
          animation: sway-${animationDuration} ${animationDuration}s ease-in-out infinite;
        }
      `}</style>
      <g className={`sway-${animationDuration}`}>
        {leaves.map((leaf, i) => (
          <use
            key={i}
            href={leaf.type === 1 ? '#lf' : '#lf2'}
            transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rotation}) scale(${leaf.scale})`}
          />
        ))}
      </g>
    </g>
  </svg>
);

const HomePage = () => {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const x = (e.clientX - rect.left - centerX) / centerX;
      const y = (e.clientY - rect.top - centerY) / centerY;
      setMouseOffset({ x: x * 8, y: y * 6 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSessions = () => {
    document.getElementById('sessions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Maslow NYC — Private Suites in SoHo, NYC</title>
        <meta name="description" content="Premium private restroom suites in SoHo. Book a session from $5. Walk up, scan the QR, or reserve in advance." />
        <meta property="og:title" content="Maslow NYC — Private Suites in SoHo, NYC" />
        <meta property="og:description" content="Premium private restroom suites in SoHo. Book a session from $5. Walk up, scan the QR, or reserve in advance." />
      </Helmet>

      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
        style={{ background: 'var(--ivy-0)' }}
      >
        {/* Ivy SVG Layers */}
        <div className="absolute inset-0 pointer-events-none">
          <IvyLayer
            leaves={layer1Leaves}
            fill="#182210"
            opacity={0.95}
            animationDuration={18}
            offset={{ x: mouseOffset.x * 0.5, y: mouseOffset.y * 0.5 }}
          />
          <IvyLayer
            leaves={layer2Leaves}
            fill="#2E4420"
            opacity={0.88}
            animationDuration={13}
            offset={{ x: mouseOffset.x * 0.7, y: mouseOffset.y * 0.7 }}
          />
          <IvyLayer
            leaves={layer3Leaves}
            fill="#4A6E38"
            opacity={0.80}
            animationDuration={9}
            offset={{ x: mouseOffset.x, y: mouseOffset.y }}
          />
        </div>

        {/* Hero Content - Left side */}
        <div className="absolute bottom-24 left-8 md:left-16 lg:left-24 z-10 max-w-xl">
          <p
            className="text-sm uppercase tracking-[0.4em] mb-6"
            style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
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

        {/* Badge - Right side */}
        <div className="absolute right-8 md:right-[8vw] top-1/2 -translate-y-1/2 z-10 hidden md:block">
          <img
            src="/MASLOW - Square.png"
            alt="Maslow"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Bottom wave transition */}
        <svg
          className="absolute bottom-0 left-0 w-full h-24"
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
          fill="var(--cream)"
        >
          <path d="M0,64 C240,32 480,96 720,64 C960,32 1200,80 1440,48 L1440,96 L0,96 Z" />
        </svg>
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
            <div
              className="aspect-[4/3] rounded-sm"
              style={{
                background: 'linear-gradient(135deg, var(--cream-2) 0%, var(--moss) 100%)',
                opacity: 0.3,
              }}
            >
              {/* Image placeholder */}
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
            <div
              className="aspect-[4/3] rounded-sm order-2 md:order-1"
              style={{
                background: 'linear-gradient(135deg, var(--ivy-3) 0%, var(--ivy-4) 100%)',
                opacity: 0.4,
              }}
            >
              {/* Image placeholder */}
            </div>
            <div className="order-1 md:order-2">
              <p
                className="text-sm uppercase tracking-[0.3em] mb-4"
                style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
              >
                Member Space
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
                Beyond the suites lies The Hull - a members-only lounge where time moves differently.
                Comfortable seating, complimentary refreshments, and the company of like-minded New Yorkers
                who understand that some spaces are worth protecting.
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
