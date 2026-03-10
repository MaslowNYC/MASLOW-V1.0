import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

interface ProgramItem {
  title: string;
  desc: string;
}

const HullPage: React.FC = () => {
  const programItems: ProgramItem[] = [
    { title: "Cultural celebrations", desc: "Islamic Heritage Month, Lunar New Year, Juneteenth, Pride, Hanukkah, Christmas, Diwali, and more—honoring the traditions that matter to New Yorkers" },
    { title: "Local artist showcases", desc: "Rotating art installations from neighborhood creators" },
    { title: "Community conversations", desc: "Panel discussions, town halls, storytelling nights" },
    { title: "Skill shares", desc: "Free workshops on everything from resume writing to urban gardening" },
    { title: "Quiet hours", desc: "Designated times when The Hull is a silent space for reading, prayer, or rest" }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <Helmet>
        <title>The Hull | Maslow NYC</title>
        <meta name="description" content="The Hull - The gathering space at the heart of select Maslow locations." />
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
              The Hull
            </h1>
            <p
              className="text-xl md:text-2xl font-light max-w-3xl mx-auto"
              style={{ color: 'rgba(250,244,237,0.75)' }}
            >
              The gathering space at the heart of select Maslow locations—where infrastructure meets community.
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

      {/* What Is The Hull Section */}
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
              What Is The Hull
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <div className="space-y-6 text-lg leading-relaxed" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
              <p>
                Scan your Maslow Pass at the refurbished turnstile and step into The Hull—a respite from the heat, cold, noise, smells, and relentless energy of the city outside.
              </p>
              <p>
                Here, you can catch your breath. Refill your ice water. Wash your hands. Grab something you forgot—a phone charger, a water bottle, essentials you didn't know you'd need. It's the gathering space before and after you use a Maslow suite. It's where we host cultural programming, art exhibits, and community events. It's the calm before you step back into the chaos.
              </p>
              <p>
                The name comes from ship architecture—the hull is what holds everything together, the structural heart that makes the vessel work. That's what this space is meant to be: the heart of Maslow locations that have one.
              </p>
              <p className="font-medium italic" style={{ color: 'var(--moss)' }}>
                Not all Maslow locations will have a Hull. Some neighborhoods need basic bathroom access more than they need community programming. We're building what each location calls for, not imposing a single model everywhere.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Access Section */}
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
              Access
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <h3
              className="text-3xl md:text-4xl mb-6"
              style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}
            >
              How to Enter The Hull
            </h3>

            <div className="space-y-6 text-lg leading-relaxed" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
              <p>
                The Hull requires an active Maslow account, which generates your Maslow Pass—a QR code you scan at our refurbished turnstile to enter.
              </p>
              <p>
                Once inside, you can relax, refill your water, or wait for your Maslow suite session (which you can book anytime, anywhere through the app or website—even from home before your trip to NYC). When your suite is ready, scan your Maslow Pass again to access the member hallway.
              </p>
              <p>
                Maslow suites can also be accessed directly from the street entrance, so you never have to enter The Hull if you just need to use a suite quickly. The Hull is for those who want the community space—it's never mandatory.
              </p>
            </div>

            <div
              className="mt-10 p-6 rounded-xl"
              style={{ background: 'rgba(74,92,58,0.06)', border: '1px solid var(--gold)' }}
            >
              <p className="font-medium" style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)' }}>
                <strong>Hours:</strong> The Hull operates during daytime and evening hours (specific times vary by location). After The Hull closes, Maslow suites remain accessible via the street entrance 24/7.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programming Section */}
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
              Programming
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <h3
              className="text-3xl md:text-4xl mb-6"
              style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}
            >
              Cultural Programming & Events
            </h3>

            <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
              The Hull exists to make space for the communities we serve. We don't presume to know what programming matters most—we're building this with you, not dictating it from above.
            </p>

            <h4 className="text-xl font-bold mb-6" style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}>What we're exploring:</h4>

            <ul className="space-y-4 mb-10">
              {programItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: 'var(--moss)' }}></div>
                  <div style={{ fontFamily: 'var(--sans)' }}>
                    <span className="font-bold" style={{ color: 'var(--charcoal)' }}>{item.title}:</span>{" "}
                    <span style={{ color: 'rgba(42,39,36,0.7)' }}>{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="rounded-xl p-8" style={{ background: 'var(--cream)' }}>
              <p className="leading-relaxed mb-4" style={{ color: 'rgba(42,39,36,0.7)', fontFamily: 'var(--sans)' }}>
                But again—we're learning. If you have ideas for programming, artists we should feature, or community needs we're missing, reach out. This space only works if it reflects the people who use it.
              </p>
              <a
                href="mailto:hello@maslow.nyc"
                className="font-bold transition-colors hover:opacity-80"
                style={{ color: 'var(--gold)' }}
              >
                hello@maslow.nyc
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Name Section */}
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
              Why The Name
            </h2>
            <div className="w-16 h-0.5 mb-8" style={{ background: 'var(--gold)' }}></div>

            <h3
              className="text-3xl md:text-4xl mb-8"
              style={{ color: 'var(--cream)', fontFamily: 'var(--serif)' }}
            >
              The Name
            </h3>

            <div className="space-y-6 text-lg leading-relaxed" style={{ color: 'rgba(250,244,237,0.8)', fontFamily: 'var(--sans)' }}>
              <p>
                Ships are held together by their hull—the watertight body that makes everything else possible. The crew, the cargo, the journey—none of it works without a strong hull.
              </p>
              <p>
                We named this space The Hull because it's meant to hold communities together. It's the infrastructure that makes connection possible in a city where connection is hard to find.
              </p>
              <p className="font-medium text-xl" style={{ color: 'var(--cream)' }}>
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
