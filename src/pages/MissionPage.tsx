import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Building2, Smartphone, Accessibility } from 'lucide-react';

const MissionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F0E6]">
      <Helmet>
        <title>Our Mission | Maslow — The Infrastructure of Dignity</title>
        <meta
          name="description"
          content="New York City has 8 million people and fewer than 1,100 public restrooms. Maslow is building clean, private, accessible restroom suites in SoHo and beyond — because dignity is not a luxury."
        />
      </Helmet>

      {/* SECTION 1 — HERO */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-[#3C5999] to-[#2D4575]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F5F0E6] mb-6">
            New York Has a Restroom Problem.
          </h1>
          <p className="text-xl text-[#F5F0E6]/90 mb-8 max-w-2xl mx-auto">
            8 million residents. Millions more visitors. Fewer than 1,100 public restrooms.
            We are building the infrastructure that was never built.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#C49F58] text-[#1a1a1a] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#B8935C] transition-colors"
          >
            Join the Waitlist
          </Link>
        </div>
      </section>

      {/* SECTION 2 — THE PROBLEM */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#3C5999] mb-6">The Crisis No One Talks About</h2>
          <div className="space-y-6">
            <p className="text-lg text-gray-700">
              New York City has one of the lowest ratios of public restrooms per capita of any major city
              in the world. For the 4.3 million daily subway riders, the thousands of delivery workers,
              street vendors, tourists, and unhoused New Yorkers who move through this city every day —
              finding a clean, safe, accessible restroom is not a minor inconvenience. It is a daily indignity.
            </p>
            <p className="text-lg text-gray-700">
              The existing options are inadequate. Fast food bathrooms require a purchase. Hotel lobbies
              are gatekept. Coffee shops enforce a one-in, one-out policy. And for the elderly, disabled,
              pregnant, or anyone with a medical condition — the lack of infrastructure isn't just
              uncomfortable. It's a barrier to participating in public life.
            </p>
            <p className="text-lg text-[#3C5999] font-semibold">
              This is not a new problem. It is a neglected one. And neglected problems are opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — THE SOLUTION */}
      <section className="py-16 px-4 bg-[#F5F0E6]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#3C5999] mb-8 text-center">What We're Building</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Building2 className="w-12 h-12 text-[#C49F58] mb-4" />
              <h3 className="text-xl font-bold text-[#3C5999] mb-3">Private Suites, Not Stalls</h3>
              <p className="text-gray-700">
                Each Maslow location features 10 individual, fully enclosed suites — not shared
                multi-stall rooms. Floor-to-ceiling privacy. Hospital-grade cleanliness. Every time.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Smartphone className="w-12 h-12 text-[#C49F58] mb-4" />
              <h3 className="text-xl font-bold text-[#3C5999] mb-3">Pay-Per-Use, No Account Required</h3>
              <p className="text-gray-700">
                Scan to enter. $5 for a private session. No membership required, no app needed.
                Clean, fast, and dignified for anyone who needs it.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Accessibility className="w-12 h-12 text-[#C49F58] mb-4" />
              <h3 className="text-xl font-bold text-[#3C5999] mb-3">ADA-First Design</h3>
              <p className="text-gray-700">
                Every Maslow location includes a dedicated ADA-compliant suite designed to meet
                and exceed accessibility standards — because accessibility is not an afterthought.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — THE STATS */}
      <section className="py-16 px-4 bg-[#3C5999]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">The Numbers Don't Lie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C49F58] mb-2">1,100</div>
              <div className="text-white/80 text-sm">Public restrooms in NYC</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C49F58] mb-2">8M+</div>
              <div className="text-white/80 text-sm">NYC residents who need them</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C49F58] mb-2">$5</div>
              <div className="text-white/80 text-sm">Per private session at Maslow</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C49F58] mb-2">10</div>
              <div className="text-white/80 text-sm">Suites per location</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — THE MODEL */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#3C5999] mb-6">Public Utility. Private Business.</h2>
          <div className="space-y-6">
            <p className="text-lg text-gray-700">
              Maslow is structured as a for-profit LLC with a nonprofit arm. The business model is
              simple: pay-per-use sessions at $5, premium memberships for frequent users, and brand
              partnerships that put quality products in front of a captive and grateful audience.
              Revenue from premium locations subsidizes reduced-cost or free access programs through
              our nonprofit.
            </p>
            <p className="text-lg text-[#3C5999] font-semibold">
              We are not asking New York City to solve this problem. We are solving it ourselves —
              and building a business that proves dignity and profitability are not opposites.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — THE VISION */}
      <section className="py-16 px-4 bg-[#F5F0E6]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#3C5999] mb-6">Starting in SoHo. Built for Every Borough.</h2>
          <p className="text-lg text-gray-700 mb-12">
            Our flagship location opens in SoHo in 2026. The model is designed to scale — to Midtown,
            to the Bronx, to transit hubs, to cities beyond New York. Every location uses the same
            technology platform, the same design standards, and the same commitment: when you walk
            through a Maslow door, you feel like a human being.
          </p>

          {/* CTA Section */}
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <h3 className="text-2xl font-bold text-[#3C5999] mb-4">Be Part of What We're Building</h3>
            <p className="text-lg text-gray-700 mb-6">
              Join the waitlist to be among the first through the door — and the first to know when we open.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#C49F58] text-[#1a1a1a] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#B8935C] transition-colors"
            >
              Secure Your Spot
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="py-8 px-4 bg-[#F5F0E6] border-t-2 border-[#3C5999]/10">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-600">
          <p>
            Maslow LLC is a Brooklyn-based company building private restroom infrastructure in
            New York City. We are MWBE-eligible and committed to equitable access across all neighborhoods.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MissionPage;
