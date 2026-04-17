import { useEffect, useRef, useState, FormEvent, CSSProperties, ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';

// ===== Brand tokens =====
const BLUE = '#286BCD';
const CREAM = '#FAF4ED';
const GOLD = '#D4AF6A';
const GOLD_HOVER = '#C49F58';
const DARK = '#1a1a1a';
const MUTED = '#6b6b6b';

const SERIF = "'Cormorant Garamond', Garamond, serif";
const SANS = "'DM Sans', sans-serif";

// ===== Reveal: fade-in on scroll =====
type RevealProps = {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
  id?: string;
};

const Reveal: React.FC<RevealProps> = ({ children, delay = 0, style, id }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const baseStyle: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    willChange: 'opacity, transform',
    ...style,
  };

  return (
    <div ref={ref} id={id} style={baseStyle}>
      {children}
    </div>
  );
};

// ===== Gold divider =====
const Divider: React.FC = () => (
  <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: 60, height: 1, background: GOLD }} />
  </div>
);

// ===== Render image with cream gradient overlay =====
type RenderImageProps = {
  src: string;
  alt: string;
  caption?: string;
  marginTop?: number;
};

const RenderImage: React.FC<RenderImageProps> = ({ src, alt, caption, marginTop = 0 }) => (
  <Reveal style={{ marginTop }}>
    <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', width: '100%' }}>
      <img
        src={src}
        alt={alt}
        style={{
          display: 'block',
          width: '100%',
          maxHeight: 500,
          objectFit: 'cover',
          objectPosition: 'center 60%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '40%',
          background: `linear-gradient(to bottom, rgba(250,244,237,0) 0%, ${CREAM} 100%)`,
          pointerEvents: 'none',
        }}
      />
    </div>
    {caption && (
      <p
        style={{
          fontFamily: SERIF,
          fontSize: 13,
          fontStyle: 'italic',
          color: MUTED,
          opacity: 0.7,
          textAlign: 'center',
          marginTop: 12,
        }}
      >
        {caption}
      </p>
    )}
  </Reveal>
);

// ===== Pricing card =====
type PriceCardProps = {
  duration: string;
  price: string;
  samples?: string;
  blurb: string;
};

const PriceCard: React.FC<PriceCardProps> = ({ duration, price, samples, blurb }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: '1 1 220px',
        maxWidth: 280,
        background: '#ffffff',
        border: `1px solid ${hover ? GOLD : 'rgba(212,175,106,0.2)'}`,
        borderRadius: 2,
        padding: '32px 24px',
        textAlign: 'center',
        boxShadow: hover ? '0 8px 32px rgba(212,175,106,0.15)' : 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div style={{ fontFamily: SANS, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 16 }}>
        {duration}
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 48, fontWeight: 300, color: DARK, marginBottom: 12 }}>{price}</div>
      {samples && (
        <div style={{ fontFamily: SANS, fontSize: 13, color: GOLD, marginBottom: 16, letterSpacing: '0.02em' }}>
          {samples}
        </div>
      )}
      <div style={{ fontFamily: SERIF, fontSize: 15, fontStyle: 'italic', color: MUTED, lineHeight: 1.5 }}>{blurb}</div>
    </div>
  );
};

// ===== Feature item =====
type FeatureItemProps = { title: string; desc: string };
const FeatureItem: React.FC<FeatureItemProps> = ({ title, desc }) => (
  <div>
    <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 500, color: DARK, marginBottom: 6 }}>{title}</div>
    <div style={{ fontFamily: SANS, fontSize: 14, color: MUTED, lineHeight: 1.5 }}>{desc}</div>
  </div>
);

// ===== Presale tier card =====
type PresaleTierProps = {
  label: string;
  price: string;
  sub?: string;
  blurb: string;
  buyUrl: string;
  highlight?: boolean;
};

const PresaleTier: React.FC<PresaleTierProps> = ({ label, price, sub, blurb, buyUrl, highlight }) => {
  const [cardHover, setCardHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const borderColor = highlight
    ? GOLD
    : cardHover
    ? GOLD
    : 'rgba(212,175,106,0.25)';

  return (
    <div
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => setCardHover(false)}
      style={{
        background: '#ffffff',
        border: `1px solid ${borderColor}`,
        borderRadius: 2,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: cardHover || highlight ? '0 8px 24px rgba(212,175,106,0.15)' : 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div style={{ fontFamily: SANS, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 12 }}>
        {label}
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 300, color: DARK, marginBottom: 6, lineHeight: 1.1 }}>
        {price}
      </div>
      {sub && (
        <div style={{ fontFamily: SANS, fontSize: 13, color: GOLD, marginBottom: 14, letterSpacing: '0.02em' }}>
          {sub}
        </div>
      )}
      <div style={{ fontFamily: SERIF, fontSize: 15, fontStyle: 'italic', color: MUTED, lineHeight: 1.5, marginBottom: 24, flexGrow: 1 }}>
        {blurb}
      </div>
      <a
        href={buyUrl}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
        style={{
          display: 'inline-block',
          textAlign: 'center',
          background: btnHover ? GOLD_HOVER : GOLD,
          color: '#ffffff',
          fontFamily: SANS,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.05em',
          textDecoration: 'none',
          padding: '12px 20px',
          borderRadius: 2,
          transition: 'background 0.2s ease',
        }}
      >
        Reserve
      </a>
    </div>
  );
};

// ===== Page =====
const HomePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [signupHover, setSignupHover] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setSubmitError(false);

    const { error } = await (supabase.from('waitlist') as any).insert({
      email: email.trim().toLowerCase(),
      source: 'homepage',
    });

    setSubmitting(false);

    // 23505 = unique_violation. Already on the list — confirm silently.
    if (error && error.code !== '23505') {
      setSubmitError(true);
      return;
    }

    setSubmitted(true);
  };

  const retrySubmit = () => {
    setSubmitError(false);
  };

  const sectionPad: CSSProperties = {
    maxWidth: 720,
    margin: '0 auto',
    padding: '0 24px',
    textAlign: 'center',
  };

  return (
    <>
      <Helmet>
        <title>Maslow — The bathroom New York deserves.</title>
        <meta
          name="description"
          content="Maslow is a network of premium private restroom suites in SoHo. Get early access to the flagship location opening in 2027."
        />
      </Helmet>

      <div style={{ background: CREAM, color: DARK, fontFamily: SANS, minHeight: '100vh' }}>
        {/* ===== NAV ===== */}
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 32px',
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              color: BLUE,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '0.12em',
            }}
          >
            MASLOW
          </div>
          <a
            href="#signup"
            style={{
              fontFamily: SANS,
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: DARK,
              textDecoration: 'none',
            }}
          >
            Join the waitlist
          </a>
        </nav>

        {/* ===== HERO ===== */}
        <section style={{ padding: '80px 24px 40px', textAlign: 'center' }}>
          <Reveal>
            <h1
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontSize: 'clamp(36px, 6vw, 64px)',
                lineHeight: 1.15,
                color: DARK,
                maxWidth: 900,
                margin: '0 auto 28px',
              }}
            >
              The bathroom New York deserves.
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(16px, 2vw, 19px)',
                lineHeight: 1.6,
                color: MUTED,
                maxWidth: 600,
                margin: '0 auto 40px',
              }}
            >
              Maslow is a network of premium private restroom suites in SoHo, Manhattan. Get early access to the flagship
              location, opening in 2027. Premium is the floor, not an upgrade.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            {submitted ? (
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 20,
                  color: BLUE,
                  padding: '20px 0',
                }}
              >
                You're on the list. We'll be in touch.
              </p>
            ) : (
              <>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: 'flex',
                    maxWidth: 460,
                    margin: '0 auto',
                    border: '1px solid rgba(212,175,106,0.4)',
                    borderRadius: 2,
                    background: '#fff',
                    overflow: 'hidden',
                  }}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={submitting}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      padding: '14px 18px',
                      fontFamily: SANS,
                      fontSize: 15,
                      color: DARK,
                      background: '#fff',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    onMouseEnter={() => setSignupHover(true)}
                    onMouseLeave={() => setSignupHover(false)}
                    style={{
                      background: signupHover && !submitting ? GOLD_HOVER : GOLD,
                      color: '#fff',
                      border: 'none',
                      padding: '14px 22px',
                      fontFamily: SANS,
                      fontSize: 13,
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      cursor: submitting ? 'default' : 'pointer',
                      opacity: submitting ? 0.7 : 1,
                      transition: 'background 0.3s ease, opacity 0.3s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {submitting ? 'Joining...' : 'Count me in'}
                  </button>
                </form>
                {submitError && (
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 14,
                      color: '#a33',
                      marginTop: 16,
                    }}
                  >
                    Something went wrong.{' '}
                    <button
                      type="button"
                      onClick={retrySubmit}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: BLUE,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontFamily: SANS,
                        fontSize: 14,
                      }}
                    >
                      Try again?
                    </button>
                  </p>
                )}
              </>
            )}
          </Reveal>
        </section>

        <Divider />

        {/* ===== THE PROBLEM ===== */}
        <section style={sectionPad}>
          <Reveal>
            <p
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(20px, 3vw, 28px)',
                color: DARK,
                marginBottom: 24,
                lineHeight: 1.4,
              }}
            >
              You already know there's nowhere to go.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.7, color: MUTED }}>
              Buy a coffee you don't want. Beg a hostess for a code. Hold it. You've done this. Everyone has.
              We're building the place that should have existed all along.
            </p>
          </Reveal>
        </section>

        <Divider />

        {/* ===== WHAT YOU GET ===== */}
        <section style={{ ...sectionPad, maxWidth: 900 }}>
          <Reveal>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontSize: 'clamp(28px, 4vw, 40px)',
                color: DARK,
                marginBottom: 24,
                lineHeight: 1.2,
              }}
            >
              A private room. A locked door. Your time.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.7, color: MUTED, maxWidth: 680, margin: '0 auto 48px' }}>
              Twelve private suites in SoHo. Hospital‑grade clean. A Toto Neorest in every room. Sonos audio.
              Circadian lighting that shifts with the time of day. Book 10, 20, or 30 minutes — whatever you need.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 32,
                textAlign: 'left',
                marginTop: 16,
              }}
            >
              <FeatureItem title="Toto Neorest" desc="The best toilet ever made. In every room." />
              <FeatureItem title="Sonos Audio" desc="Your music. Your podcast. Your silence." />
              <FeatureItem title="Circadian Lighting" desc="Light that changes with the time of day." />
              <FeatureItem title="Hospital-Grade Clean" desc="Sanitized between every single use." />
              <FeatureItem title="Hollywood Mirror" desc="Lit like the green room you wish you had." />
              <FeatureItem title="Complimentary Samples" desc="A small gift in every visit." />
            </div>
          </Reveal>
        </section>

        <div style={{ padding: '48px 24px 0' }}>
          <RenderImage
            src="/render-vanity.webp"
            alt="Maslow suite — vanity render"
            caption="Early rendering — final fixtures and finishes in development"
          />
        </div>

        <Divider />

        {/* ===== PRESALE ===== */}
        <section id="presale" style={{ ...sectionPad, maxWidth: 1080 }}>
          <Reveal>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontSize: 'clamp(28px, 4vw, 40px)',
                color: DARK,
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              Get early access.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: SANS, fontSize: 16, color: MUTED, marginBottom: 40, maxWidth: 680, margin: '0 auto 40px', lineHeight: 1.6 }}>
              Reserve your access to the SoHo flagship before the doors open. Every purchase is an
              advance purchase of future access and products.
            </p>
          </Reveal>

          {/* Disclosure block */}
          <Reveal delay={0.15}>
            <div
              style={{
                maxWidth: 780,
                margin: '0 auto 40px',
                padding: '20px 24px',
                border: `1px solid rgba(212,175,106,0.35)`,
                borderRadius: 2,
                background: 'rgba(212,175,106,0.06)',
                textAlign: 'left',
                fontFamily: SANS,
                fontSize: 13,
                lineHeight: 1.6,
                color: MUTED,
              }}
            >
              <p style={{ margin: '0 0 10px' }}>
                <strong style={{ color: DARK }}>Facility Status:</strong>{' '}
                Maslow's flagship location in SoHo, Manhattan is currently in development. All purchases —
                including visit passes, brick reservations, and founding memberships — are advance purchases
                of future access and products. Your passes will activate when our first location opens.
                Brick products will ship during the build-out period.
              </p>
              <p style={{ margin: '0 0 10px' }}>
                <strong style={{ color: DARK }}>Timeline:</strong>{' '}
                We are targeting a 2027 opening for our SoHo flagship. Development timelines are subject to
                change based on permitting, construction, and lease finalization. We will keep all purchasers
                updated on progress via email.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: DARK }}>Refund Policy:</strong>{' '}
                If Maslow does not open a location within 36 months of your purchase date, you are entitled
                to a full refund of your purchase price. You may also request a full refund at any time
                before our first location opens by emailing patrick@maslow.nyc. Refunds will be processed
                within 10 business days of your request.
              </p>
            </div>
          </Reveal>

          {/* Tier grid */}
          <Reveal delay={0.2}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 20,
                textAlign: 'left',
                marginBottom: 24,
              }}
            >
              <PresaleTier
                label="Single Pass"
                price="$5"
                blurb="One visit. Walk in, lock the door, take ten minutes."
                buyUrl="https://buy.stripe.com/PLACEHOLDER_SINGLE_PASS"
              />
              <PresaleTier
                label="Starter Bundle"
                price="$25"
                sub="5 visits · save $5"
                blurb="Enough to make it a habit."
                buyUrl="https://buy.stripe.com/PLACEHOLDER_STARTER_BUNDLE"
              />
              <PresaleTier
                label="Home Brick"
                price="$150"
                sub="Includes 5 visits"
                blurb="Engraved reclaimed NYC brick, sealed and shipped to your door."
                buyUrl="https://buy.stripe.com/PLACEHOLDER_HOME_BRICK"
              />
              <PresaleTier
                label="Hull Brick"
                price="$150"
                sub="Includes 5 visits · limited to 1,000"
                blurb="Your name engraved in the floor of The Hull."
                buyUrl="https://buy.stripe.com/PLACEHOLDER_HULL_BRICK"
              />
              <PresaleTier
                label="Both Bricks"
                price="$250"
                sub="10 visits · save $50"
                blurb="Home Brick shipped. Hull Brick laid in the floor. Both bricks, both stories."
                buyUrl="https://buy.stripe.com/PLACEHOLDER_BOTH_BRICKS"
                highlight
              />
              <PresaleTier
                label="Founding Member"
                price="$500 / year"
                sub="Limited to 500"
                blurb="Unlimited visits. Priority booking. Guest passes. Both bricks included."
                buyUrl="https://buy.stripe.com/PLACEHOLDER_FOUNDING_MEMBER"
              />
            </div>
          </Reveal>
        </section>

        <Divider />

        {/* ===== PRICING (POST-OPEN) ===== */}
        <section style={{ ...sectionPad, maxWidth: 980 }}>
          <Reveal>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontSize: 'clamp(28px, 4vw, 40px)',
                color: DARK,
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              What it costs when we open.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: SANS, fontSize: 16, color: MUTED, marginBottom: 48 }}>
              Walk in, book on your phone, use the room. That's it.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
              <PriceCard duration="10 Minutes" price="$5" blurb="Quick stop. In and out." />
              <PriceCard duration="20 Minutes" price="$10" samples="2 complimentary samples" blurb="The standard visit. Enough time to reset." />
              <PriceCard duration="30 Minutes" price="$18" samples="3 complimentary samples" blurb="Take your time. No one's knocking." />
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 15,
                color: MUTED,
                marginTop: 40,
              }}
            >
              Pro Suites also available — remote work, decompression, or anything else that's legal.
            </p>
          </Reveal>
        </section>

        <Divider />

        {/* ===== THE HULL ===== */}
        <section style={{ padding: '0 24px' }}>
          <Reveal>
            <div
              style={{
                background: BLUE,
                color: CREAM,
                maxWidth: 820,
                margin: '0 auto',
                padding: '64px 40px',
                textAlign: 'center',
                borderRadius: 2,
              }}
            >
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  marginBottom: 24,
                  lineHeight: 1.2,
                }}
              >
                The Hull
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.7, marginBottom: 24, opacity: 0.95 }}>
                A free communal space in the center of it all. Water, ice, phone charging, a living wall of moss
                and stone, and a seat. No purchase required. No questions asked. Just walk in.
              </p>
              <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 17, opacity: 0.85, lineHeight: 1.5 }}>
                The people who pay for suites cover free access for everyone else. That's the whole model.
              </p>
            </div>
          </Reveal>
        </section>

        <div style={{ padding: '0 24px' }}>
          <RenderImage src="/render-bench.webp" alt="Maslow suite — bench render" marginTop={48} />
        </div>

        <Divider />

        {/* ===== EMAIL CAPTURE ===== */}
        <section id="signup" style={sectionPad}>
          <Reveal>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontSize: 'clamp(28px, 4vw, 40px)',
                color: DARK,
                marginBottom: 20,
                lineHeight: 1.2,
              }}
            >
              Be the first to know.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: SANS, fontSize: 16, color: MUTED, marginBottom: 36, lineHeight: 1.6 }}>
              We're building something SoHo has never had. Drop your email — we'll tell you when it's real.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            {submitted ? (
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 20,
                  color: BLUE,
                  padding: '20px 0',
                }}
              >
                You're on the list. We'll be in touch.
              </p>
            ) : (
              <>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: 'flex',
                    maxWidth: 460,
                    margin: '0 auto',
                    border: '1px solid rgba(212,175,106,0.4)',
                    borderRadius: 2,
                    background: '#fff',
                    overflow: 'hidden',
                  }}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={submitting}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      padding: '14px 18px',
                      fontFamily: SANS,
                      fontSize: 15,
                      color: DARK,
                      background: '#fff',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    onMouseEnter={() => setSignupHover(true)}
                    onMouseLeave={() => setSignupHover(false)}
                    style={{
                      background: signupHover && !submitting ? GOLD_HOVER : GOLD,
                      color: '#fff',
                      border: 'none',
                      padding: '14px 22px',
                      fontFamily: SANS,
                      fontSize: 13,
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      cursor: submitting ? 'default' : 'pointer',
                      opacity: submitting ? 0.7 : 1,
                      transition: 'background 0.3s ease, opacity 0.3s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {submitting ? 'Joining...' : 'Count me in'}
                  </button>
                </form>
                {submitError && (
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 14,
                      color: '#a33',
                      marginTop: 16,
                    }}
                  >
                    Something went wrong.{' '}
                    <button
                      type="button"
                      onClick={retrySubmit}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: BLUE,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontFamily: SANS,
                        fontSize: 14,
                      }}
                    >
                      Try again?
                    </button>
                  </p>
                )}
              </>
            )}
          </Reveal>
        </section>

        {/* ===== FOOTER ===== */}
        <footer style={{ padding: '80px 24px 48px', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 13,
              letterSpacing: '0.1em',
              color: MUTED,
              marginBottom: 12,
            }}
          >
            MASLOW LLC
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 14,
              fontStyle: 'italic',
              color: MUTED,
              opacity: 0.7,
            }}
          >
            Premium is the floor, not an upgrade.
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
