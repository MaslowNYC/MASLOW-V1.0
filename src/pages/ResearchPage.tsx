import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const researchTopics = [
  'Water use and hygiene methods',
  'Religious and ritual washing practices',
  'Privacy needs and expectations',
  'Time and duration requirements',
  'Product and ingredient preferences',
  'Signage and language accessibility',
];

export default function ResearchPage() {
  return (
    <>
      <Helmet>
        <title>Unseen Standards | Maslow NYC Research</title>
        <meta name="description" content="Maslow NYC's community research initiative into cultural, religious, and personal hygiene practices to design restroom spaces that work for everyone." />
      </Helmet>

      <div className="min-h-screen bg-[var(--color-ivory)]">
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
          {/* Hero */}
          <header className="text-center mb-16">
            <h1
              className="text-4xl md:text-5xl text-[var(--color-navy)] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Unseen Standards
            </h1>
            <p
              className="text-lg text-[var(--color-navy)]/70"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              A community research initiative by Maslow NYC
            </p>
          </header>

          {/* Research Statement */}
          <section className="mb-16">
            <p
              className="text-[var(--color-navy)]/90 leading-relaxed mb-6"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Maslow NYC is conducting anonymous community research into the cultural,
              religious, and personal hygiene practices of New Yorkers — with the goal of
              designing restroom spaces that work for everyone who lives, works, and moves
              through this city.
            </p>
            <p
              className="text-[var(--color-navy)]/90 leading-relaxed"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Our research is guided by a simple belief: the people who will use a space
              should shape how it's built. We're not studying communities from a distance.
              We're listening, in person, in every neighborhood.
            </p>
          </section>

          {/* What We're Researching */}
          <section className="mb-16">
            <h2
              className="text-2xl text-[var(--color-navy)] mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              What We're Researching
            </h2>
            <div className="space-y-4">
              {researchTopics.map((topic) => (
                <div
                  key={topic}
                  className="pl-4 border-l-2 border-[var(--color-gold)]/40"
                >
                  <p
                    className="text-[var(--color-navy)]/90"
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  >
                    {topic}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* How We Collect Data */}
          <section className="mb-16">
            <h2
              className="text-2xl text-[var(--color-navy)] mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              How We Collect Data
            </h2>
            <p
              className="text-[var(--color-navy)]/90 leading-relaxed mb-6"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              All responses are completely anonymous. We collect no names, email addresses,
              or identifying information. Responses are stored separately from any Maslow
              guest account data and cannot be linked to an individual.
            </p>
            <p
              className="text-[var(--color-navy)]/90 leading-relaxed mb-4"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Research is collected in two ways:
            </p>
            <div className="space-y-4 mb-6">
              <div className="pl-4 border-l-2 border-[var(--color-gold)]/40">
                <p
                  className="text-[var(--color-navy)]/90"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  <strong>In-person conversations</strong> — Maslow's founder conducts brief, voluntary
                  conversations in public spaces across New York City.
                </p>
              </div>
              <div className="pl-4 border-l-2 border-[var(--color-gold)]/40">
                <p
                  className="text-[var(--color-navy)]/90"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  <strong>Online survey</strong> — Available at maslow.nyc/survey, open to anyone.
                </p>
              </div>
            </div>
            <p
              className="text-[var(--color-navy)]/70 text-sm leading-relaxed"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              By participating, you consent to your anonymous response being used to inform
              the design of Maslow NYC restroom facilities and future public restroom
              initiatives in New York City.
            </p>
          </section>

          {/* What We Do With the Data */}
          <section className="mb-16">
            <h2
              className="text-2xl text-[var(--color-navy)] mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              What We Do With the Data
            </h2>
            <p
              className="text-[var(--color-navy)]/90 leading-relaxed mb-6"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Research findings directly inform how we design every Maslow suite — from
              fixture placement and product selection to signage and water access. As our
              dataset grows, we intend to share aggregated, anonymized findings with New
              York City agencies and community organizations working on public restroom
              access and infrastructure.
            </p>
            <p
              className="text-[var(--color-navy)]/90 leading-relaxed font-medium"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              This data is never sold. It is never used for advertising. It belongs to the
              community that helped build it.
            </p>
          </section>

          {/* CTA Section */}
          <section className="mb-16 py-12 border-t border-b border-[var(--color-navy)]/10">
            <div className="text-center space-y-8">
              <div>
                <p
                  className="text-xl text-[var(--color-navy)] mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Want to contribute?
                </p>
                <Link
                  to="/survey"
                  className="inline-block px-8 py-3 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-lg font-medium hover:bg-[var(--color-gold)]/90 transition-colors"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Take the survey &rarr;
                </Link>
              </div>
              <div>
                <p
                  className="text-[var(--color-navy)]/70 mb-2"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Questions about the research?
                </p>
                <a
                  href="mailto:patrick@maslow.nyc"
                  className="text-[var(--color-gold)] hover:underline"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  patrick@maslow.nyc
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center">
            <p
              className="text-sm text-[var(--color-navy)]/50"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Maslow NYC · SoHo, New York · maslow.nyc
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
