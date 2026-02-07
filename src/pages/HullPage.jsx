import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const HullPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <Helmet>
        <title>The Hull | Maslow NYC</title>
        <meta name="description" content="The Hull - The gathering space at the heart of select Maslow locations." />
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
              The Hull
            </h1>
            <p className="text-xl md:text-2xl text-[#1a1a1a]/80 font-light max-w-3xl mx-auto">
              The gathering space at the heart of select Maslow locations—where infrastructure meets community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Is The Hull Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              What Is The Hull
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <div className="space-y-6 text-lg text-[#1a1a1a]/70 leading-relaxed">
              <p>
                Scan your Maslow Pass at the refurbished turnstile and step into The Hull—a respite from the heat, cold, noise, smells, and relentless energy of the city outside.
              </p>
              <p>
                Here, you can catch your breath. Refill your ice water. Wash your hands. Grab something you forgot—a phone charger, a water bottle, essentials you didn't know you'd need. It's the gathering space before and after you use a sanctuary suite. It's where we host cultural programming, art exhibits, and community events. It's the calm before you step back into the chaos.
              </p>
              <p>
                The name comes from ship architecture—the hull is what holds everything together, the structural heart that makes the vessel work. That's what this space is meant to be: the heart of Maslow locations that have one.
              </p>
              <p className="text-[#3B5998] font-medium italic">
                Not all Maslow locations will have a Hull. Some neighborhoods need basic bathroom access more than they need community programming. We're building what each location calls for, not imposing a single model everywhere.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Access Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              Access
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <h3 className="text-3xl md:text-4xl font-serif text-[#3B5998] mb-6">
              How to Enter The Hull
            </h3>

            <div className="space-y-6 text-lg text-[#1a1a1a]/70 leading-relaxed">
              <p>
                The Hull requires an active Maslow account, which generates your Maslow Pass—a QR code you scan at our refurbished turnstile to enter.
              </p>
              <p>
                Once inside, you can relax, refill your water, or wait for your sanctuary suite session (which you can book anytime, anywhere through the app or website—even from home before your trip to NYC). When your suite is ready, scan your Maslow Pass again to access the guest hallway.
              </p>
              <p>
                Sanctuary suites can also be accessed directly from the street entrance, so you never have to enter The Hull if you just need to use a suite quickly. The Hull is for those who want the community space—it's never mandatory.
              </p>
            </div>

            <div className="mt-10 p-6 bg-[#3B5998]/5 rounded-xl border border-[#3B5998]/10">
              <p className="text-[#3B5998] font-medium">
                <strong>Hours:</strong> The Hull operates during daytime and evening hours (specific times vary by location). After The Hull closes, sanctuary suites remain accessible via the street entrance 24/7.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programming Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              Programming
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <h3 className="text-3xl md:text-4xl font-serif text-[#3B5998] mb-6">
              Cultural Programming & Events
            </h3>

            <p className="text-lg text-[#1a1a1a]/70 leading-relaxed mb-8">
              The Hull exists to make space for the communities we serve. We don't presume to know what programming matters most—we're building this with you, not dictating it from above.
            </p>

            <h4 className="text-xl font-bold text-[#3B5998] mb-6">What we're exploring:</h4>

            <ul className="space-y-4 mb-10">
              {[
                { title: "Cultural celebrations", desc: "Islamic Heritage Month, Lunar New Year, Juneteenth, Pride, Hanukkah, Christmas, Diwali, and more—honoring the traditions that matter to New Yorkers" },
                { title: "Local artist showcases", desc: "Rotating art installations from neighborhood creators" },
                { title: "Community conversations", desc: "Panel discussions, town halls, storytelling nights" },
                { title: "Skill shares", desc: "Free workshops on everything from resume writing to urban gardening" },
                { title: "Quiet hours", desc: "Designated times when The Hull is a silent space for reading, prayer, or rest" }
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

            <div className="bg-[#F5F1E8] rounded-xl p-8">
              <p className="text-[#1a1a1a]/70 leading-relaxed mb-4">
                But again—we're learning. If you have ideas for programming, artists we should feature, or community needs we're missing, reach out. This space only works if it reflects the people who use it.
              </p>
              <a href="mailto:hello@maslownyc.com" className="text-[#C5A059] font-bold hover:text-[#3B5998] transition-colors">
                hello@maslownyc.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Name Section */}
      <section className="py-20 px-6 bg-[#3B5998]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              Why The Name
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mb-8"></div>

            <h3 className="text-3xl md:text-4xl font-serif text-white mb-8">
              The Name
            </h3>

            <div className="space-y-6 text-lg text-white/80 leading-relaxed">
              <p>
                Ships are held together by their hull—the watertight body that makes everything else possible. The crew, the cargo, the journey—none of it works without a strong hull.
              </p>
              <p>
                We named this space The Hull because it's meant to hold communities together. It's the infrastructure that makes connection possible in a city where connection is hard to find.
              </p>
              <p className="text-white font-medium text-xl">
                Bathrooms are essential. Privacy is essential. But so is community. The Hull is where those things meet.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HullPage;
