import React, { useState } from 'react';
import { Mail, Building2, Users, TrendingUp, MapPin, CheckCircle2, Package, Sparkles } from 'lucide-react';

type TabType = 'city' | 'vendor';

const Partnerships: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('city');

  return (
    <div className="min-h-screen bg-[#F5F0E6]">

      {/* Tab Navigation */}
      <div className="bg-white border-b-2 border-[#3C5999]/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('city')}
              className={`py-4 px-6 font-semibold text-lg transition-colors relative ${
                activeTab === 'city'
                  ? 'text-[#3C5999]'
                  : 'text-gray-500 hover:text-[#3C5999]'
              }`}
            >
              Partnering with NYC
              {activeTab === 'city' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C49F58]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('vendor')}
              className={`py-4 px-6 font-semibold text-lg transition-colors relative ${
                activeTab === 'vendor'
                  ? 'text-[#3C5999]'
                  : 'text-gray-500 hover:text-[#3C5999]'
              }`}
            >
              Vendor Partners
              {activeTab === 'vendor' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C49F58]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* City Partnerships Content */}
      {activeTab === 'city' && (
        <div>
          {/* Hero Section */}
          <section className="relative py-20 px-4 bg-gradient-to-b from-[#3C5999] to-[#2D4575]">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[#F5F0E6] mb-6">
                Working with NYC to Expand Bathroom Access
              </h1>
              <p className="text-xl text-[#F5F0E6]/90 mb-8 max-w-2xl mx-auto">
                A private-sector solution that complements the city's public restroom initiative.
              </p>
              <a
                href="#contact"
                className="inline-block bg-[#C49F58] text-[#1a1a1a] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#B8935C] transition-colors"
              >
                Contact Our Team
              </a>
            </div>
          </section>

          {/* The Problem */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#3C5999] mb-6">New York Has a Bathroom Crisis</h2>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <p className="text-5xl font-bold text-[#3C5999] mb-4">8.5M people. 1,100 restrooms.</p>
                <p className="text-lg text-gray-700 mb-6">
                  That's one toilet for every 7,700 New Yorkers—before we even count tourists.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Speaker Julie Menin's <strong>$4 million pilot program</strong> is a critical step forward,
                  adding 46 new public restrooms across the city. But even with this investment, the gap remains vast.
                </p>
                <p className="text-lg text-[#3C5999] font-semibold">
                  Maslow isn't here to replace the city's work. We're here to expand capacity through private infrastructure.
                </p>
              </div>
            </div>
          </section>

          {/* Our Solution */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#3C5999] mb-6">How Maslow Complements City Efforts</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#F5F0E6] rounded-lg p-6">
                  <Building2 className="w-12 h-12 text-[#3C5999] mb-4" />
                  <h3 className="text-xl font-bold text-[#3C5999] mb-3">City Restrooms</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Free, 24/7 access</li>
                    <li>✓ Outdoor-accessible</li>
                    <li>✓ Public infrastructure</li>
                  </ul>
                </div>
                <div className="bg-[#F5F0E6] rounded-lg p-6">
                  <Users className="w-12 h-12 text-[#C49F58] mb-4" />
                  <h3 className="text-xl font-bold text-[#3C5999] mb-3">Maslow Suites</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Pay-per-use ($5)</li>
                    <li>✓ Indoor facilities</li>
                    <li>✓ Premium amenities</li>
                  </ul>
                </div>
              </div>
              <p className="text-center text-lg text-gray-700 mt-8 font-semibold">
                Different use cases. Different users. One shared goal: dignity for everyone.
              </p>
            </div>
          </section>

          {/* OMNY Integration */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#3C5999] mb-6">OMNY Integration Proposal</h2>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <p className="text-2xl font-bold text-[#3C5999] mb-6">
                  The city shouldn't pay upfront. Pay only for what's used.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  We propose integrating with the OMNY system—the same contactless payment infrastructure
                  New Yorkers already use for transit.
                </p>

                <h3 className="text-xl font-bold text-[#3C5999] mb-4">How It Works:</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#C49F58] text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <p className="text-gray-700">City purchases session vouchers (bulk pricing, scalable)</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#C49F58] text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <p className="text-gray-700">Issues OMNY cards or digital passes (via MYmta app)</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#C49F58] text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <p className="text-gray-700">Users tap OMNY at Maslow locations (just like entering the subway)</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#C49F58] text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <p className="text-gray-700">System validates voucher (Supabase checks NYC database in real-time)</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#C49F58] text-white flex items-center justify-center font-bold flex-shrink-0">5</div>
                    <p className="text-gray-700">Door unlocks, session logged (city gets usage data)</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#C49F58] text-white flex items-center justify-center font-bold flex-shrink-0">6</div>
                    <p className="text-gray-700">City pays monthly (per-use billing, not capital expenditure)</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-[#3C5999] mb-3">Benefits for NYC:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#C49F58] flex-shrink-0 mt-0.5" />
                        <span>No upfront infrastructure costs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#C49F58] flex-shrink-0 mt-0.5" />
                        <span>No maintenance burden</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#C49F58] flex-shrink-0 mt-0.5" />
                        <span>Faster deployment (no RFP delays)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#C49F58] flex-shrink-0 mt-0.5" />
                        <span>Real-time usage data</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3C5999] mb-3">Benefits for Maslow:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#C49F58] flex-shrink-0 mt-0.5" />
                        <span>Stable revenue (city contract)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#C49F58] flex-shrink-0 mt-0.5" />
                        <span>Mission alignment (serve underserved)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#C49F58] flex-shrink-0 mt-0.5" />
                        <span>Brand credibility (city partnership)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cost Comparison */}
          <section className="py-16 px-4 bg-[#3C5999] text-white">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Public Investment, Private Efficiency</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">City Pilot Program</h3>
                  <div className="text-4xl font-bold text-[#C49F58] mb-2">$87,000</div>
                  <div className="text-sm mb-4">per restroom</div>
                  <ul className="space-y-2 text-sm">
                    <li>• $4M total budget</li>
                    <li>• 46 new restrooms</li>
                    <li>• Outdoor installations</li>
                  </ul>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Maslow Model</h3>
                  <div className="text-4xl font-bold text-[#C49F58] mb-2">$15,000</div>
                  <div className="text-sm mb-4">per suite</div>
                  <ul className="space-y-2 text-sm">
                    <li>• 10 locations × 8 suites = 80 facilities</li>
                    <li>• $150K buildout per location</li>
                    <li>• Indoor, climate-controlled</li>
                  </ul>
                </div>
              </div>
              <p className="text-center text-lg mt-8 font-semibold">
                Both approaches are needed. Public restrooms provide free outdoor access.
                Maslow provides indoor capacity with amenities. Together, we significantly expand NYC's bathroom infrastructure.
              </p>
            </div>
          </section>

          {/* Locations */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#3C5999] mb-6 flex items-center gap-3">
                <MapPin className="w-8 h-8" />
                Where We're Building
              </h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-bold text-[#3C5999] mb-3">Phase 1 (2026)</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• SoHo (flagship location)</li>
                    <li>• Financial District</li>
                    <li>• Times Square</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-bold text-[#3C5999] mb-3">Phase 2 (2027)</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Underserved neighborhoods (nonprofit arm)</li>
                    <li>• Transit hubs (Penn Station, Grand Central)</li>
                    <li>• Outer boroughs</li>
                  </ul>
                </div>
              </div>
              <p className="text-center text-lg text-[#3C5999] font-semibold mt-8">
                City partnerships can accelerate Phase 2. We're ready to bring Maslow suites to the communities that need them most.
              </p>
            </div>
          </section>

          {/* Pilot Proposal */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#3C5999] mb-6">Let's Start Small</h2>
              <div className="bg-gradient-to-br from-[#F5F0E6] to-white rounded-lg p-8 shadow-md border-2 border-[#C49F58]">
                <h3 className="text-2xl font-bold text-[#3C5999] mb-6">6-Month Pilot Program</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">Location:</p>
                    <p className="text-gray-600">1 Maslow site (SoHo or similar)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">Capacity:</p>
                    <p className="text-gray-600">500 sessions/month for voucher holders</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">Cost to city:</p>
                    <p className="text-2xl font-bold text-[#C49F58]">$2,500/month</p>
                    <p className="text-sm text-gray-600">($5 per session)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">After 6 months:</p>
                    <p className="text-gray-600">Evaluate results and decide on expansion</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <p className="font-semibold text-gray-700 mb-3">Metrics tracked:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#C49F58]" />
                      Total voucher sessions used
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#C49F58]" />
                      Average session duration
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#C49F58]" />
                      Peak usage times
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#C49F58]" />
                      User satisfaction (optional survey)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-16 px-4 bg-[#3C5999]">
            <div className="max-w-4xl mx-auto text-center">
              <Mail className="w-16 h-16 text-[#C49F58] mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">Start the Conversation</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                We're not asking for a blank check. We're asking for a conversation about how private infrastructure can serve public good.
              </p>
              <div className="bg-white/10 rounded-lg p-8 max-w-md mx-auto mb-8">
                <p className="text-white font-semibold mb-2">Patrick May</p>
                <p className="text-white/80 mb-4">Founder, Maslow NYC</p>
                <a
                  href="mailto:partners@maslownyc.com"
                  className="inline-block bg-[#C49F58] text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold hover:bg-[#B8935C] transition-colors"
                >
                  partners@maslownyc.com
                </a>
              </div>
              <p className="text-white/80 text-sm">
                Or reach out to your City Council representative and ask them about partnering with Maslow NYC.
              </p>
            </div>
          </section>

          {/* Footer Note */}
          <section className="py-8 px-4 bg-[#F5F0E6] border-t-2 border-[#3C5999]/10">
            <div className="max-w-4xl mx-auto text-center text-sm text-gray-600">
              <p>
                Maslow NYC is a private company with a nonprofit arm at{' '}
                <a href="https://maslownyc.org" className="text-[#3C5999] hover:text-[#C49F58] font-semibold">
                  maslownyc.org
                </a>
                . We're MWBE-eligible (64% women-owned) and committed to bringing Maslow suites to
                every neighborhood—not just the profitable ones.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* Vendor Partnerships Content */}
      {activeTab === 'vendor' && (
        <div>
          {/* Hero Section */}
          <section className="relative py-20 px-4 bg-gradient-to-b from-[#3C5999] to-[#2D4575]">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[#F5F0E6] mb-6">
                Partner with Maslow
              </h1>
              <p className="text-xl text-[#F5F0E6]/90 mb-8 max-w-2xl mx-auto">
                Bring your products to our Maslow suites. Reach discerning New Yorkers where they need you most.
              </p>
              <a
                href="#vendor-contact"
                className="inline-block bg-[#C49F58] text-[#1a1a1a] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#B8935C] transition-colors"
              >
                Become a Partner
              </a>
            </div>
          </section>

          {/* Why Partner */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#3C5999] mb-6">Why Partner with Maslow?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <Users className="w-10 h-10 text-[#C49F58] mb-4" />
                  <h3 className="text-lg font-bold text-[#3C5999] mb-2">Captive Audience</h3>
                  <p className="text-gray-700">Your products where people have time to appreciate them</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <Sparkles className="w-10 h-10 text-[#C49F58] mb-4" />
                  <h3 className="text-lg font-bold text-[#3C5999] mb-2">Premium Context</h3>
                  <p className="text-gray-700">Associate your brand with care, dignity, and thoughtful design</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <TrendingUp className="w-10 h-10 text-[#C49F58] mb-4" />
                  <h3 className="text-lg font-bold text-[#3C5999] mb-2">Measurable Impact</h3>
                  <p className="text-gray-700">Track usage, gather feedback, build lasting relationships</p>
                </div>
              </div>
            </div>
          </section>

          {/* Product Categories */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#3C5999] mb-6">What We're Looking For</h2>
              <div className="space-y-4">
                <div className="bg-[#F5F0E6] rounded-lg p-6">
                  <Package className="w-8 h-8 text-[#3C5999] mb-3" />
                  <h3 className="text-xl font-bold text-[#3C5999] mb-2">Personal Care</h3>
                  <p className="text-gray-700 mb-3">Premium skincare, sustainable hygiene products, wellness brands</p>
                  <p className="text-sm text-gray-600">Examples: Ursa Major, Aesop, Cora, Native, Necessaire</p>
                </div>
                <div className="bg-[#F5F0E6] rounded-lg p-6">
                  <Sparkles className="w-8 h-8 text-[#3C5999] mb-3" />
                  <h3 className="text-xl font-bold text-[#3C5999] mb-2">Comfort & Wellness</h3>
                  <p className="text-gray-700 mb-3">Aromatherapy, tea, snacks, magazines, mindfulness tools</p>
                  <p className="text-sm text-gray-600">Examples: Pukka Tea, Vitruvi, Headspace, The New Yorker</p>
                </div>
                <div className="bg-[#F5F0E6] rounded-lg p-6">
                  <Building2 className="w-8 h-8 text-[#3C5999] mb-3" />
                  <h3 className="text-xl font-bold text-[#3C5999] mb-2">Infrastructure & Tech</h3>
                  <p className="text-gray-700 mb-3">Smart fixtures, accessibility tech, sustainable materials</p>
                  <p className="text-sm text-gray-600">Examples: Toto, Kohler, Ursa Major, Sonos</p>
                </div>
              </div>
            </div>
          </section>

          {/* Partnership Models */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#3C5999] mb-6">Partnership Models</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-bold text-[#3C5999] mb-4">Product Placement</h3>
                  <p className="text-gray-700 mb-4">Your products stocked in our suites. Members try, love, buy.</p>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>✓ Premium shelf space</li>
                    <li>✓ QR code for instant purchase</li>
                    <li>✓ Usage data & feedback</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-bold text-[#3C5999] mb-4">Brand Sponsorship</h3>
                  <p className="text-gray-700 mb-4">Co-brand a suite. "Powered by [Your Brand]"</p>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>✓ Exclusive branding</li>
                    <li>✓ Custom amenities</li>
                    <li>✓ Social media collaboration</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="vendor-contact" className="py-16 px-4 bg-[#3C5999]">
            <div className="max-w-4xl mx-auto text-center">
              <Mail className="w-16 h-16 text-[#C49F58] mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">Let's Build Together</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                We're curating a collection of brands that share our values: quality, sustainability, and human dignity.
              </p>
              <div className="bg-white/10 rounded-lg p-8 max-w-md mx-auto mb-8">
                <p className="text-white font-semibold mb-2">Dayna Johnson</p>
                <p className="text-white/80 mb-4">Partnerships Lead, Maslow NYC</p>
                <a
                  href="mailto:partners@maslownyc.com"
                  className="inline-block bg-[#C49F58] text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold hover:bg-[#B8935C] transition-colors"
                >
                  partners@maslownyc.com
                </a>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <section className="py-8 px-4 bg-[#F5F0E6] border-t-2 border-[#3C5999]/10">
            <div className="max-w-4xl mx-auto text-center text-sm text-gray-600">
              <p>
                Interested in product partnerships? Send us your pitch deck and product samples to get started.
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Partnerships;
