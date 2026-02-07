import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const SanctuarySuitesPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <Helmet>
        <title>Sanctuary Suites | Maslow NYC</title>
        <meta name="description" content="Private, safe, thoughtfully designed spaces for bathroom access, nursing, prayer, changing—whatever you need." />
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
              Sanctuary Suites
            </h1>
            <p className="text-xl md:text-2xl text-[#1a1a1a]/80 font-light max-w-3xl mx-auto">
              Private, safe, thoughtfully designed spaces for bathroom access, nursing, prayer, changing—whatever you need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Experience Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              The Experience
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <p className="text-xl text-[#3B5998] font-medium mb-6">
              Every Maslow sanctuary suite is designed with one goal: give you back your dignity.
            </p>

            <p className="text-lg text-[#1a1a1a]/70 leading-relaxed mb-6">
              No broken locks. No overflowing trash. No feeling unsafe. No wondering if you're allowed to be there.
            </p>

            <p className="text-lg text-[#1a1a1a]/70 leading-relaxed">
              Just a private, clean, thoughtfully designed space where you can do what you came to do—use the bathroom, change your baby, nurse, pump, pray, take a breath—without anxiety, judgment, or compromise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              What's Inside
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <h3 className="text-3xl md:text-4xl font-serif text-[#3B5998] mb-12">
              Thoughtful Design, Every Detail
            </h3>

            <div className="space-y-12">
              {/* Bidet */}
              <div className="border-b border-[#3B5998]/10 pb-12">
                <h4 className="text-xl font-bold text-[#3B5998] mb-4">Luxury Bidet with Heated Seat</h4>
                <p className="text-lg text-[#1a1a1a]/70 leading-relaxed mb-4">
                  Every suite includes a luxury bidet with adjustable water pressure, temperature control, and a heated seat. An optional hand bidet is also available for those who prefer it.
                </p>
                <p className="text-[#1a1a1a]/60 italic">
                  We designed this for everyone—whether you're performing wudu before prayer, prefer bidet hygiene, or just want a more comfortable experience.
                </p>
              </div>

              {/* Layered Amenities */}
              <div className="border-b border-[#3B5998]/10 pb-12">
                <h4 className="text-xl font-bold text-[#3B5998] mb-4">Layered Amenities for Your Needs</h4>
                <p className="text-lg text-[#1a1a1a]/70 leading-relaxed mb-6">
                  Every suite starts with the essentials—a clean bathroom, bidet access, sink, and a bench. From there, we layer in what you need for your specific session.
                </p>
                <p className="text-[#3B5998] font-medium mb-4">When you book, tell us what you're coming for:</p>
                <ul className="space-y-4">
                  {[
                    { title: "Nursing/Pumping", desc: "Walk into a suite prepared with a sterilized breast pump, pumping bags, wipes, and hands-free accessories" },
                    { title: "Prayer", desc: "Find a prayer mat waiting for you, with foot-washing basin for wudu and directional indicators for qibla" },
                    { title: "Baby Care", desc: "Diapers in multiple sizes, wipes, changing pad, and disposal bags ready to use" },
                    { title: "Just the Bathroom", desc: "Nothing extra—just a spotless, private space when you need it quickly" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C5A059] rounded-full mt-2 shrink-0"></div>
                      <div>
                        <span className="font-bold text-[#3B5998]">{item.title}:</span>{" "}
                        <span className="text-[#1a1a1a]/70">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[#1a1a1a]/60 italic">
                  This approach means every session is curated to what you actually need, rather than cluttering every suite with amenities you won't use. Your $5 quick bathroom break doesn't come with stuff you don't need. Your $10 nursing session is set up and ready when you walk in.
                </p>
              </div>

              {/* ADA Doors */}
              <div className="border-b border-[#3B5998]/10 pb-12">
                <h4 className="text-xl font-bold text-[#3B5998] mb-4">ADA-Compliant Automatic Doors</h4>
                <p className="text-lg text-[#1a1a1a]/70 leading-relaxed">
                  Wide, sensor-activated doors ensure accessibility for wheelchair users, parents with strollers, and anyone who needs hands-free entry. Every suite meets or exceeds ADA requirements.
                </p>
              </div>

              {/* Skylight */}
              <div className="border-b border-[#3B5998]/10 pb-12">
                <h4 className="text-xl font-bold text-[#3B5998] mb-4">Artificial Skylight System</h4>
                <p className="text-lg text-[#1a1a1a]/70 leading-relaxed">
                  No harsh fluorescent lights. Each suite features a custom-built skylight system using LED strips and diffusion materials to create natural, calming light—even in windowless interior spaces.
                </p>
              </div>

              {/* Music */}
              <div className="border-b border-[#3B5998]/10 pb-12">
                <h4 className="text-xl font-bold text-[#3B5998] mb-4">Curated Music Integration</h4>
                <p className="text-lg text-[#1a1a1a]/70 leading-relaxed">
                  Your session, your soundtrack. Door-triggered music systems (built with ESP32 microcontrollers and magnetic sensors) start playing calming ambient music when you enter. Or bring your own device and use the Bluetooth connection.
                </p>
              </div>

              {/* Cleaning */}
              <div className="border-b border-[#3B5998]/10 pb-12">
                <h4 className="text-xl font-bold text-[#3B5998] mb-4">Hospital-Grade Cleaning</h4>
                <p className="text-lg text-[#1a1a1a]/70 leading-relaxed mb-4">
                  After every session, we follow a rigorous four-step process:
                </p>
                <ol className="space-y-3">
                  {[
                    { num: "1", title: "Hospital-grade cleaning protocols", desc: "Thorough sanitization of all surfaces" },
                    { num: "2", title: "Fresh linens and restocked supplies", desc: "Clean towels, restocked amenities" },
                    { num: "3", title: "Verified cleanliness inspection", desc: "Staff confirmation before next booking" },
                    { num: "4", title: "UV-C sanitization", desc: "Automated ultraviolet disinfection for final sterilization" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="text-[#C5A059] font-bold">{item.num}.</span>
                      <div>
                        <span className="font-medium text-[#3B5998]">{item.title}</span>
                        <span className="text-[#1a1a1a]/70"> – {item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Timer */}
              <div>
                <h4 className="text-xl font-bold text-[#3B5998] mb-4">Timer Display</h4>
                <p className="text-lg text-[#1a1a1a]/70 leading-relaxed">
                  A clear digital timer shows how much time you have left in your session. No anxiety about overstaying. No surprise lock-outs. Just transparency.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Privacy & Safety Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              Privacy & Safety
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <h3 className="text-3xl md:text-4xl font-serif text-[#3B5998] mb-12">
              Built for Safety
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Cameras outside, never inside",
                  desc: "External cameras monitor entry points for safety. Zero cameras inside suites. Your privacy is absolute."
                },
                {
                  title: "Fall detection and wellness checks",
                  desc: "While we don't have cameras in suites, we do have fall detection sensors. For longer sessions, our staff conducts wellness checks every 10 minutes. Our team is trained in CPR, first aid, and emergency response protocols."
                },
                {
                  title: "QR code accountability",
                  desc: "Every suite booking is linked to your Maslow account. We know who's in each suite and when. This deters misuse while protecting your privacy."
                },
                {
                  title: "Emergency communication",
                  desc: "Every suite has a call button that connects directly to on-site staff or emergency services. Help is always available if you need it."
                },
                {
                  title: "Automatic unlock after session time",
                  desc: "If your session ends, the door unlocks automatically (you can always leave earlier). This is a safety feature—no one gets locked in."
                }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-[#F5F1E8] rounded-xl">
                  <h4 className="font-bold text-[#3B5998] mb-2">{item.title}</h4>
                  <p className="text-[#1a1a1a]/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking & Access Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              Booking & Access
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <h3 className="text-3xl md:text-4xl font-serif text-[#3B5998] mb-12">
              How It Works
            </h3>

            <div className="space-y-6">
              {[
                { num: "1", text: "Open the Maslow app or visit maslownyc.com" },
                { num: "2", text: "Find a Maslow location (map shows availability in real-time)" },
                { num: "3", text: "Book a session (15 or 30 minutes, $5-10 depending on location)" },
                { num: "4", text: "Get your QR code (displays on your phone)" },
                { num: "5", text: "Scan at the door (opens guest hallway; proximity sensors unlock your suite door automatically when you arrive)" },
                { num: "6", text: "Use the suite (do what you came to do)" },
                { num: "7", text: "Leave when ready (door locks automatically behind you)" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-[#3B5998] rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-bold">{item.num}</span>
                  </div>
                  <p className="text-lg text-[#1a1a1a]/70 pt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Design Philosophy Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              Design Philosophy
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <h3 className="text-3xl md:text-4xl font-serif text-[#3B5998] mb-8">
              Why We Built It This Way
            </h3>

            <div className="space-y-6 text-lg text-[#1a1a1a]/70 leading-relaxed">
              <p>
                Most public bathrooms are designed to deter use. Uncomfortable seats. Harsh lighting. No privacy. Minimal amenities. The message is clear: Get in, get out, don't stay.
              </p>
              <p>
                We designed sanctuary suites with the opposite philosophy: <strong className="text-[#3B5998]">Stay as long as you need. Be comfortable. Feel safe.</strong>
              </p>
              <p>
                Because needing a bathroom isn't something to be ashamed of. Needing to nurse your baby isn't an inconvenience. Needing to pray isn't a disruption. These are basic human needs, and infrastructure should treat them that way.
              </p>
              <p className="text-xl text-[#3B5998] font-medium border-l-4 border-[#C5A059] pl-6 my-8">
                That's why we call them sanctuary suites, not bathrooms. Because they're more than a toilet and a sink. They're a moment of peace in a city that doesn't give you many.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 px-6 bg-[#3B5998]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              Feedback
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <h3 className="text-3xl md:text-4xl font-serif text-white mb-8">
              We're Still Learning
            </h3>

            <div className="space-y-6 text-lg text-white/80 leading-relaxed">
              <p>
                We researched. We planned. We prototyped. But we won't know if we got it right until you use it.
              </p>
              <p>
                If something doesn't work—if we missed an amenity, overlooked a need, or designed something poorly—please tell us. This is infrastructure for everyone, and we can't build it right without your input.
              </p>
            </div>

            <div className="mt-10 text-center">
              <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Contact</p>
              <a href="mailto:hello@maslownyc.com" className="text-2xl text-[#C5A059] hover:text-white transition-colors">
                hello@maslownyc.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SanctuarySuitesPage;
