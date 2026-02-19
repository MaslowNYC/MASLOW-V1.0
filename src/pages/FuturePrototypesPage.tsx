import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bike, Package, Sofa, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FutureFeature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  imageUrl: string;
  status: 'In Development' | 'Coming 2026' | 'Prototype Phase';
  category: string;
}

const futureFeatures: FutureFeature[] = [
  {
    id: 'smart-bike-rack',
    title: 'Smart Bike Rack',
    subtitle: 'Brass Heritage Collection',
    description: 'A precision-engineered, app-controlled bike storage solution that seamlessly integrates with The Hull experience. Five secured slots with RFID authentication and real-time availability.',
    details: [
      'Hand-finished brass construction',
      'App-controlled RFID locking mechanism',
      '5 secure bike slots per unit',
      'Real-time availability in Maslow app',
      'Integrated charging for e-bikes',
      'Climate-controlled storage option',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop',
    status: 'In Development',
    category: 'Infrastructure',
  },
  {
    id: 'sample-dispenser',
    title: 'Sample Dispenser System',
    subtitle: 'Luxury Brand Partnerships',
    description: 'An automated, temperature-controlled dispensing system for premium beauty and wellness samples. Members select products via the app before arrival; samples await in their suite.',
    details: [
      'Temperature-controlled compartments',
      'Partnerships with Aesop, Le Labo, Byredo',
      'App-based pre-selection',
      'Freshness-sealed individual portions',
      'Usage analytics for brand partners',
      'Refill notifications for staff',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2070&auto=format&fit=crop',
    status: 'Coming 2026',
    category: 'Amenities',
  },
  {
    id: 'suite-upgrades',
    title: 'Next-Gen Suite Modules',
    subtitle: 'The Sovereign Collection',
    description: 'Expanded suite configurations featuring dedicated meditation alcoves, extended vanity stations, and premium sound isolation. Designed for members who require the ultimate in privacy and personalization.',
    details: [
      'Extended 45-minute session capacity',
      'Dedicated meditation alcove',
      'Premium sound isolation panels',
      'Heated stone floors',
      'Personalized aromatherapy diffusion',
      'Biometric health monitoring (opt-in)',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop',
    status: 'Prototype Phase',
    category: 'Suites',
  },
  {
    id: 'concierge-ai',
    title: 'AI Concierge',
    subtitle: 'Predictive Personalization',
    description: 'Machine learning-powered preference engine that anticipates member needs based on historical patterns, time of day, and external factors like weather and calendar events.',
    details: [
      'Learns individual preferences over time',
      'Pre-configures suite settings on arrival',
      'Suggests optimal visit times',
      'Integrates with calendar apps',
      'Weather-aware recommendations',
      'Privacy-first architecture',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop',
    status: 'In Development',
    category: 'Technology',
  },
];

const FuturePrototypesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
            alt="Future Vision"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#3B5998]/80 via-[#3B5998]/60 to-[#F5F1E8]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span className="text-sm font-semibold text-white uppercase tracking-widest">Sovereign Preview</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
              The Future of<br />
              <span className="text-[#C5A059]">Urban Sanctuary</span>
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              An exclusive preview of innovations in development. As a visionary supporter,
              you're helping shape the next chapter of Maslow.
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowRight className="w-6 h-6 text-white/60 rotate-90" />
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3B5998] mb-6">
              Building Tomorrow, Today
            </h2>
            <p className="text-lg text-[#3B5998]/70 leading-relaxed">
              Every Maslow location represents our commitment to continuous innovation.
              The features below are actively in development, informed by member feedback
              and our relentless pursuit of the perfect urban retreat. Your investment
              as a Sovereign member directly accelerates this roadmap.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {futureFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="mb-16 last:mb-0"
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}>
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="inline-flex items-center gap-2 bg-[#C5A059] text-white px-4 py-2 rounded-full shadow-lg">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">{feature.status}</span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-6 left-6">
                      <span className="text-white/80 text-sm font-medium uppercase tracking-widest">
                        {feature.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <div className="max-w-lg">
                    <p className="text-[#C5A059] font-semibold uppercase tracking-widest text-sm mb-2">
                      {feature.subtitle}
                    </p>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#3B5998] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-[#3B5998]/70 text-lg leading-relaxed mb-8">
                      {feature.description}
                    </p>

                    {/* Details List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {feature.details.map((detail, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#C5A059] mt-2 flex-shrink-0" />
                          <span className="text-[#3B5998]/80 text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#3B5998] py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Shape the Future
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Sovereign members receive exclusive access to prototype testing,
              priority feedback channels, and naming rights for select features.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/membership"
                className="inline-flex items-center justify-center gap-2 bg-[#C5A059] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#B39149] transition-colors shadow-lg"
              >
                Become a Sovereign
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                Return Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 px-4 bg-[#F5F1E8]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-[#3B5998]/50">
            Features shown are in active development. Final specifications, availability,
            and timelines may vary. Sovereign members will receive priority updates as
            features progress toward deployment.
          </p>
        </div>
      </section>
    </div>
  );
};

export default FuturePrototypesPage;
