import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { supabase } from "@/lib/customSupabaseClient";

// ─── Brand colors ───────────────────────────────────
const C = {
  blue: "#286BCD",
  gold: "#D4AF6A",
  goldHover: "#C49F58",
  cream: "#FAF4ED",
  dark: "#1A1A1A",
  soft: "#2A2A2A",
  gray: "#8A8578",
  divider: "#E8E2D9",
};

// ─── Toast component ────────────────────────────────
// This is a small notification that slides up from the bottom
// when someone clicks a tier. It shows for 4 seconds, then fades out.
// No external library needed — just useState + setTimeout.
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: visible ? 32 : -100,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: C.dark,
        color: C.cream,
        padding: "16px 28px",
        borderRadius: 8,
        fontFamily: "Arial, sans-serif",
        fontSize: 14,
        lineHeight: 1.5,
        zIndex: 9999,
        transition: "bottom 0.3s ease",
        maxWidth: 400,
        textAlign: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {message}
    </div>
  );
}

// ─── Main page ──────────────────────────────────────
export default function BuildPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [brickChoice, setBrickChoice] = useState<string | null>(null);
  const [toast, setToast] = useState({ visible: false, message: "" });

  // ─── Intent click handler ───────────────────────
  // When someone clicks a tier card, we:
  // 1. Log it to Supabase (anonymous — no email attached)
  // 2. Show a toast nudging them to the email signup
  //
  // The .insert() call fires and we don't await it — 
  // we don't want the UI to freeze if Supabase is slow.
  // This is called "fire and forget." Fine for analytics.
  const logIntent = (tierId: string) => {
    // Fire and forget — don't block the UI
    (supabase
      .from("presale_intent_clicks") as any)
      .insert({ tier_id: tierId })
      .then(({ error }) => {
        if (error) console.error("Intent tracking error:", error);
      });

    setToast({
      visible: true,
      message: "Presale coming soon — drop your email below to be first in.",
    });
  };

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
    return () => clearTimeout(timer);
  }, [toast.visible]);

  // ─── Email submit handler ─────────────────────────
  // Basic email validation, then insert to waitlist table.
  // The UNIQUE index on email means duplicates get a Postgres
  // error (code 23505). We catch that and show a friendly message.
  const handleSubmit = async () => {
    if (!email) return;

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("That doesn't look like a valid email.");
      return;
    }

    setSubmitting(true);
    setEmailError("");

    const { error } = await (supabase
      .from("waitlist") as any)
      .insert({ email: email.toLowerCase().trim() });

    setSubmitting(false);

    if (error) {
      // Postgres unique violation = they already signed up
      if (error.code === "23505") {
        setSubmitted(true); // Still show success — no need to embarrass them
      } else {
        console.error("Waitlist error:", error);
        setEmailError("Something went wrong. Try again?");
      }
      return;
    }

    setSubmitted(true);
  };

  // ─── Reusable UI pieces ───────────────────────────
  const sectionLabel = (text: string) => (
    <p
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        letterSpacing: 4,
        textTransform: "uppercase",
        color: C.gray,
        marginBottom: 24,
      }}
    >
      {text}
    </p>
  );

  // tierCard now takes a tierId and fires logIntent on click.
  // The "highlight" prop uses gold borders (for bricks).
  const tierCard = ({
    tierId,
    title,
    price,
    sub,
    desc,
    highlight,
    selected,
  }: {
    tierId: string;
    title: string;
    price: string;
    sub?: string;
    desc: string;
    highlight?: boolean;
    selected?: boolean;
  }) => (
    <div
      onClick={() => {
        logIntent(tierId);
        if (highlight) setBrickChoice(tierId);
      }}
      style={{
        border: selected
          ? `2px solid ${highlight ? C.gold : C.blue}`
          : `1px solid ${C.divider}`,
        borderRadius: 8,
        padding: 24,
        cursor: "pointer",
        backgroundColor: selected
          ? `${highlight ? C.gold : C.blue}08`
          : "white",
        transition: "all 0.2s ease",
      }}
    >
      <p
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 12,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: C.gray,
          marginBottom: 8,
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: 36,
          fontWeight: 600,
          color: C.dark,
          marginBottom: 4,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}
      >
        {price}
      </p>
      {sub && (
        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 12,
            color: C.blue,
            marginBottom: 12,
          }}
        >
          {sub}
        </p>
      )}
      <p
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 14,
          color: C.gray,
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
    </div>
  );

  // ─── Page layout ──────────────────────────────────
  return (
    <>
      <Helmet>
        <title>Build Maslow — Community-Funded Restroom Suites in SoHo</title>
        <meta
          name="description"
          content="Help build New York's first premium private restroom network. No investors. Community-funded. Pre-sale passes and Maslow Bricks coming soon."
        />
      </Helmet>

      <div
        style={{
          backgroundColor: C.cream,
          color: C.dark,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          minHeight: "100vh",
        }}
      >
        {/* ===== HERO ===== */}
        <section
          style={{
            minHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 24px 60px",
            maxWidth: 780,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 12,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: C.gray,
              marginBottom: 40,
            }}
          >
            MASLOW NYC
          </p>
          <h1
            style={{
              fontSize: "clamp(34px, 7vw, 60px)",
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: 32,
            }}
          >
            Help us build the bathroom{" "}
            <span style={{ color: C.blue }}>New York deserves.</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(17px, 3vw, 21px)",
              lineHeight: 1.65,
              color: C.soft,
              maxWidth: 580,
              marginBottom: 48,
            }}
          >
            Maslow is a community-funded network of premium private restroom
            suites in SoHo. No investors. No venture capital. Just people who
            think New York can do better.
          </p>
          <div
            style={{
              padding: "18px 22px",
              backgroundColor: `${C.blue}0A`,
              borderLeft: `3px solid ${C.blue}`,
              maxWidth: 500,
              marginBottom: 48,
            }}
          >
            <p
              style={{
                fontSize: 15,
                fontFamily: "Arial, sans-serif",
                lineHeight: 1.65,
                color: C.soft,
                margin: 0,
              }}
            >
              Last month,{" "}
              <strong style={{ color: C.blue }}>489 people</strong> searched
              Google for a public restroom in SoHo. They found us. We're
              building what they're looking for.
            </p>
          </div>
          <div
            style={{
              width: 1,
              height: 60,
              backgroundColor: C.divider,
              margin: "0 auto",
            }}
          />
        </section>

        {/* ===== THE PROBLEM ===== */}
        <section
          style={{
            padding: "60px 24px 80px",
            maxWidth: 680,
            margin: "0 auto",
          }}
        >
          {sectionLabel("The Problem")}
          <p style={{ fontSize: 21, lineHeight: 1.7, marginBottom: 24 }}>
            New York City has 8.5 million people and fewer than 1,100 public
            restrooms. Paris has 400 for a quarter that population.
          </p>
          <p style={{ fontSize: 21, lineHeight: 1.7, color: C.soft }}>
            You know the drill. Buy a coffee you don't want. Beg a hostess for a
            code. Hold it. That's not a city problem — it's a dignity problem.
          </p>
        </section>

        {/* ===== WHAT WE'RE BUILDING ===== */}
        <section
          style={{
            backgroundColor: C.dark,
            color: C.cream,
            padding: "80px 24px",
          }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {sectionLabel("What We're Building")}
            <p
              style={{
                fontSize: 21,
                lineHeight: 1.7,
                marginBottom: 24,
                color: C.cream,
              }}
            >
              Twelve private suites in SoHo. Hospital-grade clean. Circadian
              lighting that shifts with the time of day. A Toto Neorest in every
              room. Sonos audio. A locked door and ten minutes of peace.
            </p>
            <p
              style={{
                fontSize: 21,
                lineHeight: 1.7,
                marginBottom: 32,
                color: `${C.cream}BB`,
              }}
            >
              And The Hull — a free communal space in the center of it all.
              Water, ice, phone charging, a living wall, and a seat. No purchase
              required. No questions asked.
            </p>
            <p
              style={{
                fontSize: 22,
                lineHeight: 1.6,
                fontStyle: "italic",
                color: C.gold,
              }}
            >
              The people who pay for suites fund free access for everyone else.
              That's the whole model.
            </p>
          </div>
        </section>

        {/* ===== PASSES ===== */}
        <section
          style={{ padding: "80px 24px", maxWidth: 860, margin: "0 auto" }}
        >
          {sectionLabel("How You Can Help Build It")}
          <h2
            style={{
              fontSize: "clamp(26px, 5vw, 38px)",
              fontWeight: 400,
              marginBottom: 12,
            }}
          >
            Passes
          </h2>
          <p
            style={{
              fontSize: 17,
              color: C.soft,
              marginBottom: 36,
              maxWidth: 480,
            }}
          >
            Pre-purchase visits. Use them when we open.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 60,
            }}
          >
            {tierCard({
              tierId: "single_pass",
              title: "Single Pass",
              price: "$5",
              desc: "One visit. Walk in, lock the door, take ten minutes.",
            })}
            {tierCard({
              tierId: "starter_bundle",
              title: "Starter Bundle",
              price: "$25",
              sub: "5 visits — save $5",
              desc: "Enough to make it a habit. Your reset ritual, locked in.",
            })}
          </div>

          {/* ===== BRICKS ===== */}
          <div
            style={{
              borderTop: `1px solid ${C.divider}`,
              paddingTop: 60,
              marginBottom: 60,
            }}
          >
            <h2
              style={{
                fontSize: "clamp(26px, 5vw, 38px)",
                fontWeight: 400,
                marginBottom: 12,
              }}
            >
              Maslow Bricks
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: C.soft,
                marginBottom: 16,
                maxWidth: 560,
              }}
            >
              The Hull is the free heart of every Maslow. Built from reclaimed
              NYC brick with moss pressed into the joints. Now you can be part of
              it.
            </p>
            <p
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 14,
                color: C.gray,
                marginBottom: 36,
              }}
            >
              Hull placements limited to 1,000.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {tierCard({
                tierId: "home_brick",
                title: "Home Brick",
                price: "$150",
                sub: "Includes 5 visits",
                desc: "Engraved reclaimed NYC brick, sealed and shipped to your door. A piece of the building on your shelf.",
                highlight: true,
                selected: brickChoice === "home_brick",
              })}
              {tierCard({
                tierId: "hull_brick",
                title: "Hull Brick",
                price: "$150",
                sub: "Includes 5 visits",
                desc: "Your name engraved in the floor of The Hull. People walk into the space you helped build.",
                highlight: true,
                selected: brickChoice === "hull_brick",
              })}
              {tierCard({
                tierId: "both_bricks",
                title: "Both Bricks",
                price: "$250",
                sub: "Includes 10 visits — save $50",
                desc: "One for home, one in the Hull. The full thing. You built this place and you have the proof.",
                highlight: true,
                selected: brickChoice === "both_bricks",
              })}
            </div>
          </div>

          {/* ===== FOUNDING MEMBER ===== */}
          <div style={{ borderTop: `1px solid ${C.divider}`, paddingTop: 60 }}>
            <h2
              style={{
                fontSize: "clamp(26px, 5vw, 38px)",
                fontWeight: 400,
                marginBottom: 12,
              }}
            >
              Founding Member
            </h2>
            <div
              onClick={() => logIntent("founding_member")}
              style={{
                border: `1px solid ${C.blue}`,
                borderRadius: 8,
                padding: 32,
                backgroundColor: `${C.blue}06`,
                maxWidth: 480,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <p
                style={{
                  fontSize: 42,
                  fontWeight: 600,
                  color: C.blue,
                  marginBottom: 8,
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                $500
                <span
                  style={{ fontSize: 18, fontWeight: 400, color: C.gray }}
                >
                  /year
                </span>
              </p>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: C.soft,
                  marginBottom: 16,
                }}
              >
                Unlimited visits for a year. Priority booking. Guest passes.
                Both bricks included — one for home, your name in the Hull.
                You're not buying a membership. You're buying into the proof
                that this can work.
              </p>
              <p
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: 12,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: C.gold,
                }}
              >
                Limited to 500
              </p>
            </div>
          </div>
        </section>

        {/* ===== THE MATH ===== */}
        <section
          style={{
            backgroundColor: C.dark,
            color: C.cream,
            padding: "80px 24px",
          }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 12,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: 24,
              }}
            >
              The Math
            </p>
            <p
              style={{ fontSize: 22, lineHeight: 1.7, marginBottom: 32 }}
            >
              We need $1,000,000 in community pre-sales to sign a lease and
              start building.
            </p>
            <p
              style={{
                fontSize: 19,
                lineHeight: 2,
                color: `${C.cream}AA`,
                marginBottom: 32,
              }}
            >
              5,000 singles + 4,000 starter bundles + 3,500 bricks + 400
              Founding Members
              <br />= 12,900 people
              <br />= 0.15% of New York City
            </p>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.7,
                color: `${C.cream}77`,
                marginBottom: 40,
              }}
            >
              SoHo sees 50,000 people walk through it every day. We need less
              than 1% of them to care.
            </p>
            <p
              style={{
                fontSize: 21,
                lineHeight: 1.7,
                fontStyle: "italic",
                color: C.gold,
              }}
            >
              No investors. No venture capital. No one who can show up in three
              years and say "cut the free part." This is community-funded
              infrastructure. You build it, you own it, it stays.
            </p>
          </div>
        </section>

        {/* ===== WHY NOT INVESTORS ===== */}
        <section
          style={{
            padding: "80px 24px",
            maxWidth: 680,
            margin: "0 auto",
          }}
        >
          {sectionLabel("Why Not Investors?")}
          <p style={{ fontSize: 21, lineHeight: 1.7, marginBottom: 24 }}>
            Because investors want returns. Returns require growth. Growth
            requires cutting the parts that don't make money. The Hull doesn't
            make money — it makes Maslow what it is.
          </p>
          <p style={{ fontSize: 21, lineHeight: 1.7 }}>
            We'd rather have 10,000 people who each put in $40 than one person
            who puts in $400,000 and gets a seat at the table. The community is
            the table.
          </p>
        </section>

        {/* ===== CTA ===== */}
        <section
          style={{
            backgroundColor: C.blue,
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(26px, 5vw, 38px)",
                fontWeight: 400,
                color: "white",
                marginBottom: 16,
              }}
            >
              Be first in.
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.65,
                marginBottom: 36,
              }}
            >
              We're building the list. Drop your email and be the first to know
              when passes and bricks go live.
            </p>
            {!submitted ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: 0,
                    maxWidth: 400,
                    margin: "0 auto",
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="you@email.com"
                    style={{
                      flex: 1,
                      padding: "14px 16px",
                      fontSize: 15,
                      fontFamily: "Arial, sans-serif",
                      border: "none",
                      borderRadius: "6px 0 0 6px",
                      outline: "none",
                      backgroundColor: "white",
                      color: C.dark,
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                      padding: "14px 20px",
                      fontSize: 13,
                      fontFamily: "Arial, sans-serif",
                      fontWeight: 600,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      backgroundColor: submitting ? C.goldHover : C.gold,
                      color: "white",
                      border: "none",
                      borderRadius: "0 6px 6px 0",
                      cursor: submitting ? "not-allowed" : "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    {submitting ? "..." : "Count me in"}
                  </button>
                </div>
                {emailError && (
                  <p
                    style={{
                      color: "#FFB4B4",
                      fontSize: 13,
                      fontFamily: "Arial, sans-serif",
                      marginTop: 8,
                    }}
                  >
                    {emailError}
                  </p>
                )}
              </div>
            ) : (
              <p
                style={{
                  fontSize: 20,
                  color: "white",
                  fontStyle: "italic",
                }}
              >
                You're on the list. We'll be in touch.
              </p>
            )}
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer
          style={{
            padding: "36px 24px",
            textAlign: "center",
            backgroundColor: C.cream,
          }}
        >
          <p
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 12,
              color: C.gray,
              marginBottom: 6,
            }}
          >
            Maslow LLC · patrick@maslow.nyc · maslow.nyc
          </p>
          <p style={{ fontSize: 15, fontStyle: "italic", color: C.gray }}>
            Premium is the floor, not an upgrade.
          </p>
        </footer>

        {/* Toast notification */}
        <Toast message={toast.message} visible={toast.visible} />
      </div>
    </>
  );
}
