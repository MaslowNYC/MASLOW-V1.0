import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const ImpactPage: React.FC = () => {
  const accessibilityItems: string[] = [
    "ADA-compliant automatic doors and spacious layouts",
    "Bidet options for Islamic wudu and personal hygiene preferences",
    "Manual door controls and concierge assistance for Sabbath observers",
    "Private spaces for nursing mothers and pumping",
    "Changing tables and family-friendly accommodations",
    "Quiet, calming environments for prayer or meditation of all faiths",
    "Hospital-grade cleaning between every session"
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <Helmet>
        <title>Impact | Maslow</title>
        <meta name="description" content="The Infrastructure of Dignity - Private Maslow suites across NYC." />
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
              The Infrastructure of Dignity
            </h1>
            <p
              className="text-xl md:text-2xl font-light max-w-3xl mx-auto mb-8"
              style={{ color: 'rgba(250,244,237,0.75)' }}
            >
              Private Maslow suites across NYC where everyone—from tourists to delivery workers to new parents—can use the bathroom, change, nurse, pray, or simply breathe.
            </p>
            <p
              className="text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'rgba(250,244,237,0.6)' }}
            >
              We're building what cities should have built decades ago: dignified, accessible, safe spaces for basic human needs. No questions asked. No judgment. Just infrastructure that treats people like people.
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

      {/* The Model Section */}
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
              The Model
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <h3
              className="text-3xl md:text-4xl mb-6"
              style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}
            >
              How Maslow Works
            </h3>

            <div className="space-y-6 text-lg leading-relaxed" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
              <p>
                Maslow operates as a profit-for-purpose company. Revenue from sessions and memberships funds our operations and enables us to expand access to those who need it most.
              </p>
              <p>
                We're not a charity waiting for grants. We're a sustainable business built to scale citywide, with a mission woven into every decision we make.
              </p>
            </div>

            <div className="mt-12">
              <h4 className="text-xl font-bold mb-6" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>The Path Forward</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-24 shrink-0">
                    <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}>Today</span>
                  </div>
                  <p style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
                    Launch our first location with Maslow suites available for $5 per session, while exploring partnerships with the city to accept OMNY passes for those in need
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 shrink-0">
                    <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}>Tomorrow</span>
                  </div>
                  <p style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
                    Prove the model works—sustainable, scalable, dignified!
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 shrink-0">
                    <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}>Future</span>
                  </div>
                  <p style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
                    Once profitable, expand free and subsidized access through partnerships with the city and social services
                  </p>
                </div>
              </div>
            </div>

            <p
              className="mt-10 text-lg leading-relaxed pl-6 italic border-l-4"
              style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)', borderColor: 'var(--moss)' }}
            >
              We believe infrastructure this essential should be built to last. That means building a business model that works, not just a good idea that depends on someone else's generosity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Universal Design Section */}
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
              Universal Design
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <h3
              className="text-3xl md:text-4xl mb-6"
              style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}
            >
              Built for Everyone
            </h3>

            <p className="text-xl mb-8 font-medium" style={{ color: 'rgba(42,39,36,0.8)', fontFamily: 'var(--sans)' }}>
              We're not experts on your needs—you are.
            </p>

            <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
              Maslow is being built with communities, not just for them. We've researched accessibility requirements, cultural practices, and dignity standards, but we know we don't have all the answers.
            </p>

            <h4 className="text-xl font-bold mb-6" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>What we've considered so far:</h4>

            <ul className="space-y-4 mb-10">
              {accessibilityItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: 'var(--moss)' }}></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div
              className="rounded-xl p-8"
              style={{ background: 'rgba(74,92,58,0.06)', border: '1px solid var(--gold)' }}
            >
              <h4 className="text-xl font-bold mb-4" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>But we're still learning.</h4>
              <p className="leading-relaxed" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
                If you use Maslow and something doesn't work for you—whether it's a design choice, a missing amenity, or something we didn't think of—please tell us. This is infrastructure for 8 million people with 8 million different needs. We can't get it right without your input.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Vision Section */}
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
              The Vision
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <h3
              className="text-3xl md:text-4xl mb-6"
              style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}
            >
              Where We're Headed
            </h3>

            <p className="text-xl mb-8 font-medium" style={{ color: 'rgba(42,39,36,0.8)', fontFamily: 'var(--sans)' }}>
              We're building permanent urban infrastructure that serves everyone.
            </p>

            <div className="space-y-6 text-lg leading-relaxed" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
              <p>
                First, we prove the model works in SoHo—sustainable, dignified, reliable.
              </p>
              <p>
                Then, we expand across neighborhoods, establishing Maslow as infrastructure New Yorkers count on.
              </p>
              <p>
                Eventually, we partner with the city to provide free access for those who need it most, integrating with social services and community organizations.
              </p>
            </div>

            <div className="mt-10 p-8 rounded-xl" style={{ background: 'var(--cream)' }}>
              <p className="text-lg leading-relaxed mb-4" style={{ color: 'rgba(42,39,36,0.8)', fontFamily: 'var(--sans)' }}>
                <strong style={{ color: 'var(--charcoal)' }}>The long-term vision?</strong> Maslow becomes infrastructure—like libraries, like subway stations, like parks. Every neighborhood has access within a 10-minute walk. Half our access is paid (keeping us sustainable), half is free or subsidized (keeping our mission alive).
              </p>
              <p className="text-lg font-medium" style={{ color: 'var(--moss)', fontFamily: 'var(--sans)' }}>
                This isn't charity. It's not a temporary solution. It's permanent urban infrastructure built by people who believe cities should work for everyone.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Get Involved Section */}
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
              Get Involved
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <h3
              className="text-3xl md:text-4xl mb-12"
              style={{ color: 'var(--cream)', fontFamily: 'var(--serif)' }}
            >
              Help Us Build This
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-bold" style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}>Give Feedback</h4>
                <p className="leading-relaxed" style={{ color: 'rgba(250,244,237,0.8)', fontFamily: 'var(--sans)' }}>
                  Use Maslow and tell us what we got wrong. What's missing? What could be better? What did we overlook?
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold" style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}>Partner With Us</h4>
                <p className="leading-relaxed" style={{ color: 'rgba(250,244,237,0.8)', fontFamily: 'var(--sans)' }}>
                  Are you a city official, nonprofit leader, or community organizer? Let's talk about how Maslow can serve your constituents.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold" style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}>Spread the Word</h4>
                <p className="leading-relaxed" style={{ color: 'rgba(250,244,237,0.8)', fontFamily: 'var(--sans)' }}>
                  Tell someone who needs this. Share it with a parent struggling to find a changing table. A delivery worker with nowhere to go. A tourist who's tired of buying coffee just to use a bathroom.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm uppercase tracking-widest mb-2" style={{ color: 'rgba(250,244,237,0.6)', fontFamily: 'var(--sans)' }}>Contact</p>
              <a
                href="mailto:hello@maslow.nyc"
                className="text-2xl transition-colors hover:opacity-80"
                style={{ color: 'var(--gold)' }}
              >
                hello@maslow.nyc
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ImpactPage;
