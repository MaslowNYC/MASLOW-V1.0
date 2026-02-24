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
    <div className="min-h-screen bg-[#F5F1E8]">
      <Helmet>
        <title>Impact | Maslow NYC</title>
        <meta name="description" content="The Infrastructure of Dignity - Private Maslow suites across NYC." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#3B5998] mb-6">
              The Infrastructure of Dignity
            </h1>
            <p className="text-xl md:text-2xl text-[#1a1a1a]/80 font-light max-w-3xl mx-auto mb-8">
              Private Maslow suites across NYC where everyone—from tourists to delivery workers to new parents—can use the bathroom, change, nurse, pray, or simply breathe.
            </p>
            <p className="text-lg text-[#1a1a1a]/60 max-w-2xl mx-auto leading-relaxed">
              We're building what cities should have built decades ago: dignified, accessible, safe spaces for basic human needs. No questions asked. No judgment. Just infrastructure that treats people like people.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Model Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              The Model
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <h3 className="text-3xl md:text-4xl font-serif text-[#3B5998] mb-6">
              How Maslow Works
            </h3>

            <div className="space-y-6 text-lg text-[#1a1a1a]/70 leading-relaxed">
              <p>
                Maslow operates as a profit-for-purpose company. Revenue from sessions and memberships funds our operations and enables us to expand access to those who need it most.
              </p>
              <p>
                We're not a charity waiting for grants. We're a sustainable business built to scale citywide, with a mission woven into every decision we make.
              </p>
            </div>

            <div className="mt-12">
              <h4 className="text-xl font-bold text-[#3B5998] mb-6">The Path Forward</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-24 shrink-0">
                    <span className="text-sm font-bold uppercase tracking-widest text-[#C5A059]">Today</span>
                  </div>
                  <p className="text-[#1a1a1a]/70">
                    Launch our first location with Maslow suites available for $5 per session, while exploring partnerships with the city to accept OMNY passes for those in need
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 shrink-0">
                    <span className="text-sm font-bold uppercase tracking-widest text-[#C5A059]">Tomorrow</span>
                  </div>
                  <p className="text-[#1a1a1a]/70">
                    Prove the model works—sustainable, scalable, dignified!
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 shrink-0">
                    <span className="text-sm font-bold uppercase tracking-widest text-[#C5A059]">Future</span>
                  </div>
                  <p className="text-[#1a1a1a]/70">
                    Once profitable, expand free and subsidized access through partnerships with the city and social services
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-10 text-lg text-[#1a1a1a]/70 leading-relaxed border-l-4 border-[#C5A059] pl-6 italic">
              We believe infrastructure this essential should be built to last. That means building a business model that works, not just a good idea that depends on someone else's generosity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Universal Design Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              Universal Design
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <h3 className="text-3xl md:text-4xl font-serif text-[#3B5998] mb-6">
              Built for Everyone
            </h3>

            <p className="text-xl text-[#1a1a1a]/80 mb-8 font-medium">
              We're not experts on your needs—you are.
            </p>

            <p className="text-lg text-[#1a1a1a]/70 leading-relaxed mb-8">
              Maslow is being built with communities, not just for them. We've researched accessibility requirements, cultural practices, and dignity standards, but we know we don't have all the answers.
            </p>

            <h4 className="text-xl font-bold text-[#3B5998] mb-6">What we've considered so far:</h4>

            <ul className="space-y-4 mb-10">
              {accessibilityItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#1a1a1a]/70">
                  <div className="w-2 h-2 bg-[#C5A059] rounded-full mt-2 shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="bg-[#3B5998]/5 rounded-xl p-8 border border-[#3B5998]/10">
              <h4 className="text-xl font-bold text-[#3B5998] mb-4">But we're still learning.</h4>
              <p className="text-[#1a1a1a]/70 leading-relaxed">
                If you use Maslow and something doesn't work for you—whether it's a design choice, a missing amenity, or something we didn't think of—please tell us. This is infrastructure for 8 million people with 8 million different needs. We can't get it right without your input.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Vision Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              The Vision
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <h3 className="text-3xl md:text-4xl font-serif text-[#3B5998] mb-6">
              Where We're Headed
            </h3>

            <p className="text-xl text-[#1a1a1a]/80 mb-8 font-medium">
              We're building permanent urban infrastructure that serves everyone.
            </p>

            <div className="space-y-6 text-lg text-[#1a1a1a]/70 leading-relaxed">
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

            <div className="mt-10 p-8 bg-[#F5F1E8] rounded-xl">
              <p className="text-lg text-[#1a1a1a]/80 leading-relaxed mb-4">
                <strong className="text-[#3B5998]">The long-term vision?</strong> Maslow becomes infrastructure—like libraries, like subway stations, like parks. Every neighborhood has access within a 10-minute walk. Half our access is paid (keeping us sustainable), half is free or subsidized (keeping our mission alive).
              </p>
              <p className="text-lg text-[#3B5998] font-medium">
                This isn't charity. It's not a temporary solution. It's permanent urban infrastructure built by people who believe cities should work for everyone.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-20 px-6 bg-[#3B5998]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              Get Involved
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <h3 className="text-3xl md:text-4xl font-serif text-white mb-12">
              Help Us Build This
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-[#C5A059]">Give Feedback</h4>
                <p className="text-white/80 leading-relaxed">
                  Use Maslow and tell us what we got wrong. What's missing? What could be better? What did we overlook?
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-[#C5A059]">Partner With Us</h4>
                <p className="text-white/80 leading-relaxed">
                  Are you a city official, nonprofit leader, or community organizer? Let's talk about how Maslow can serve your constituents.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-[#C5A059]">Spread the Word</h4>
                <p className="text-white/80 leading-relaxed">
                  Tell someone who needs this. Share it with a parent struggling to find a changing table. A delivery worker with nowhere to go. A tourist who's tired of buying coffee just to use a bathroom.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Contact</p>
              <a href="mailto:hello@maslow.nyc" className="text-2xl text-[#C5A059] hover:text-white transition-colors">
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
