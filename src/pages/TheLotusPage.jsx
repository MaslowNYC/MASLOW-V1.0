import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Lock, Sparkles, Music, Sun, Smartphone, Baby, Briefcase, Heart,
  Phone, Droplet, Wind, Shield, Camera, Clock, CheckCircle, AlertCircle,
  DoorOpen, Accessibility
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TheLotusPage = () => {
  const navigate = useNavigate();
  const [activeUseCase, setActiveUseCase] = useState(null);

  const features = [
    {
      icon: Lock,
      title: "Your Space, Secured",
      description: "QR code access from your mobile app unlocks the electromagnetic door lock. Once inside, the suite is yours alone. No one can enter while your session is active. No coins, no timers, no interruptions. The lock disengages automatically when your session ends or you choose to exit early."
    },
    {
      icon: Sparkles,
      title: "Hospital-Grade Hygiene",
      description: "Between every session, our turnover protocol includes manual cleaning with medical-grade disinfectants followed by UV-C sanitation. The UV-C system only activates when the door is locked and the suite is vacant - a safety interlock prevents any exposure. Every surface, every time."
    },
    {
      icon: Music,
      title: "Your Music, Your Mood",
      description: "Connect your Spotify account in the app and select a playlist before you enter. The moment the door closes, your music begins through premium Sonos speakers. Choose calming sounds for a moment of peace, upbeat music to energize before a meeting, or white noise for privacy. Your session, your soundtrack."
    },
    {
      icon: Sun,
      title: "Circadian Skylight",
      description: "Our artificial skylight mimics natural daylight with smooth color temperature shifts. During your session, the light adjusts to a warm, calming tone (2700K) that reduces stress and creates a sanctuary feeling. After you leave, the system shifts to bright, cool light (6000K) to support cleaning staff visibility and alertness."
    },
    {
      icon: Smartphone,
      title: "Your Suite, Your Settings",
      description: "Adjust lighting brightness, select music, extend your session time, or request specific amenities - all from the Maslow app. Your preferences save for next time."
    }
  ];

  const useCases = [
    {
      icon: Baby,
      title: "Nursing & Pumping",
      description: "Private, comfortable space with seating, changing table, and optional privacy screen. Set calming music, adjust lighting to soft warm tones, and take all the time you need. Your session won't end until you're ready."
    },
    {
      icon: Droplet,
      title: "Prayer & Wudu",
      description: "Request a portable wudu basin (elevated for accessibility) and prayer mat via the app. The suite includes a Qibla direction indicator. Adjust lighting and music (or silence) to create the environment you need."
    },
    {
      icon: Briefcase,
      title: "Pre-Meeting Prep",
      description: "Full-height mirror, excellent lighting, seating to change shoes or clothing. Access to stain remover, lint roller, deodorant, and breath mints. Play energizing music while you prepare."
    },
    {
      icon: Heart,
      title: "Anxiety & Panic Relief",
      description: "Lock the door, adjust lighting to calm warm tones, play soothing sounds or guided meditation. Sit, breathe, take all the time you need. No one will disturb you. The emergency call button is there if you need support."
    },
    {
      icon: Camera,
      title: "Quick Touch-Up",
      description: "Makeup mirror lighting, premium skincare products, hair care items. Whether it's a first date or a last-minute interview, refresh and restore."
    },
    {
      icon: Phone,
      title: "Private Call",
      description: "Need to take a difficult phone call? Have a therapy session? Conduct a sensitive business conversation? The Suite is soundproofed, private, and secure."
    }
  ];

  const standardItems = [
    "Universal height toilet with bidet (Toto Washlet)",
    "Wall-mounted sink with touchless faucet",
    "Full-height anti-fog mirror (floor to 72\")",
    "Fold-down changing table (ADA compliant)",
    "Cushioned seating bench",
    "Coat hooks and bag shelf",
    "Touchless hand dryer (Dyson Airblade)",
    "Premium hand soap and lotion (Aesop)",
    "USB charging ports + wireless charging pad",
    "Adjustable LED lighting (warm to cool spectrum)",
    "Emergency call button",
    "Sonos wireless speaker system"
  ];

  const onRequestItems = [
    "Nursing privacy screen",
    "Wudu foot basin (portable, elevated)",
    "Prayer mat and compass (Qibla direction)",
    "Changing supplies (adult or infant)",
    "First aid kit",
    "Menstrual products (pads, tampons, cups)",
    "Personal care samples",
    "Hairbrush and hair ties",
    "Deodorant and dry shampoo",
    "Stain remover wipes",
    "Breath mints and mouthwash",
    "Phone sanitizer",
    "Lint roller",
    "Safety pins and sewing kit"
  ];

  const accessibilityFeatures = [
    "64\" × 64\" clear turning radius (exceeds 60\" requirement)",
    "Grab bars on toilet and sink (all suites, not just some)",
    "36\" automated pocket door (no heavy swinging doors)",
    "Wall-mounted sink at 32\" height",
    "Toilet at 18\" seat height (Universal Height standard)",
    "Fold-down changing table rated for adults and children",
    "Touchless faucets and hand dryers",
    "Controls at 42\" height (within 15-48\" ADA range)",
    "High-contrast visual indicators",
    "Audio cues for vision impairments",
    "Braille signage integrated into design",
    "Emergency call button within reach of all positions"
  ];

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <Helmet>
        <title>Maslow Suites | Maslow NYC</title>
        <meta name="description" content="Premium private restroom suites in NYC. More than a bathroom - your sanctuary for nursing, prayer, meetings, anxiety relief, and whatever you need. Smart locks, custom music, UV cleaning, and complete privacy." />
      </Helmet>

      {/* HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-[#F5F1E8] to-white px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-serif font-bold text-[#3B5998] mb-6"
          >
            The Maslow Suites
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-[#3B5998]/80 font-light"
          >
            More than a restroom. Whatever you need it to be.
          </motion.p>
        </div>
      </section>

      {/* SECTION 1: THE CORE CONCEPT */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3B5998] mb-6">
            A Room with a Toilet. And So Much More.
          </h2>
          <div className="space-y-4 text-lg text-[#3B5998]/90 leading-relaxed">
            <p>
              The Maslow Suites are premium, private spaces designed for whatever your moment requires. Need to nurse your baby in peace? Prepare for prayer? Change for a meeting? Take a breath after a panic attack? Recharge between appointments? The Suite adapts to you.
            </p>
            <p>
              Every Suite features a universal design toilet, sink, full-height mirror, seating, and a suite of technologies and amenities that transform a basic need into a dignified experience.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: TECHNOLOGY & FEATURES */}
      <section className="py-20 px-4 bg-[#F5F1E8]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3B5998] mb-12 text-center">
            Technology & Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg border border-[#3B5998]/10 hover:border-[#C5A059] hover:shadow-lg transition-all"
              >
                <feature.icon className="w-10 h-10 text-[#C5A059] mb-4" />
                <h3 className="text-xl font-bold text-[#3B5998] mb-3">{feature.title}</h3>
                <p className="text-[#3B5998]/80 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT'S INSIDE */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3B5998] mb-12 text-center">
            What's Inside
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Standard in Every Suite */}
            <div>
              <h3 className="text-2xl font-serif font-bold text-[#3B5998] mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#C5A059]" />
                Standard in Every Suite
              </h3>
              <ul className="space-y-3">
                {standardItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#C5A059] mt-1">•</span>
                    <span className="text-[#3B5998]/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Available on Request */}
            <div>
              <h3 className="text-2xl font-serif font-bold text-[#3B5998] mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-[#C5A059]" />
                Available on Request
              </h3>
              <p className="text-sm text-[#3B5998]/70 mb-4 italic">Request via the Maslow app</p>
              <ul className="space-y-3">
                {onRequestItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#C5A059] mt-1">•</span>
                    <span className="text-[#3B5998]/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-center text-lg font-bold text-[#3B5998] mt-12">
            All products are available at no additional cost. Take what you need.
          </p>
        </div>
      </section>

      {/* SECTION 5: USE CASES */}
      <section className="py-20 px-4 bg-[#F5F1E8]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3B5998] mb-12 text-center">
            However You Need It
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-lg border border-[#3B5998]/10 hover:border-[#C5A059] hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setActiveUseCase(activeUseCase === index ? null : index)}
              >
                <useCase.icon className="w-8 h-8 text-[#C5A059] mb-3" />
                <h3 className="text-lg font-bold text-[#3B5998] mb-2">{useCase.title}</h3>
                <p className="text-[#3B5998]/80 text-sm leading-relaxed">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: ACCESSIBILITY */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Accessibility className="w-12 h-12 text-[#C5A059]" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3B5998]">
              Designed for Everyone
            </h2>
          </div>
          <p className="text-lg text-[#3B5998]/90 mb-8 leading-relaxed">
            Every Maslow Suite exceeds ADA requirements. We don't have "accessible" suites and "regular" suites. We have suites that work for everyone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {accessibilityFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-[#F5F1E8] rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#C5A059] mt-0.5 flex-shrink-0" />
                <span className="text-[#3B5998]/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: PRICING & ACCESS */}
      <section className="py-20 px-4 bg-[#3B5998] text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">
            How It Works
          </h2>
          <div className="space-y-6 text-lg mb-12">
            <p className="font-bold text-xl text-[#C5A059]">For Suite Access:</p>
            <p>Maslow Suites are included with all paid Maslow memberships:</p>
            <ul className="space-y-3 pl-6">
              <li>• <strong>Founding Member ($500/year):</strong> 50 suite sessions</li>
              <li>• <strong>The Sovereign ($25,000 lifetime):</strong> Unlimited suite access + priority booking</li>
            </ul>
            <p className="pt-4">
              <strong>Day passes for suite access:</strong> $10 per session (available in app)
            </p>
            <p className="text-white/80 italic mt-8">
              The Hull (our free public restroom) is always available to anyone with a free Maslow Pass. No payment required.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: CALL TO ACTION */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#F5F1E8] to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3B5998] mb-6">
            Ready to Experience the Sanctuary?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button
              onClick={() => navigate('/membership')}
              className="bg-[#3B5998] hover:bg-[#2A406E] text-white px-8 py-6 text-lg"
            >
              <DoorOpen className="w-5 h-5 mr-2" />
              Join Maslow
            </Button>
            <Button
              onClick={() => navigate('/hull')}
              variant="outline"
              className="border-[#3B5998] text-[#3B5998] hover:bg-[#3B5998] hover:text-white px-8 py-6 text-lg"
            >
              See The Hull
            </Button>
          </div>
          <p className="text-[#3B5998]/70">
            Not sure yet? Visit The Hull first - our free public restroom with water refill, phone charging, and basic amenities. No membership required.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TheLotusPage;
