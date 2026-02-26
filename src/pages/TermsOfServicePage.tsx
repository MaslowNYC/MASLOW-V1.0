import { motion } from 'framer-motion';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <div className="bg-[#3B5998] py-16">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white text-center"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-center mt-4"
          >
            Maslow LLC
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#C5A059] text-center mt-2 font-medium"
          >
            Effective Date: March 1, 2026
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-8"
        >
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              By creating an account or using Maslow's services, you agree to these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">2. About Maslow</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              Maslow LLC operates premium personal care suites in New York City. Our services are available to registered members through our mobile app and website.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">3. Account Registration</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              To use Maslow services, you must create an account with your real name, email address, and a verified phone number. Phone verification is required for security purposes and to allow us to contact you if needed — for example, if you leave an item behind. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">4. Credits and Passes</h2>
            <ul className="space-y-3 text-[#3B5998]/80 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>Credits are purchased through the Maslow app or website and are used to book time in our suites</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>Credits expire 18 months after purchase</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>Credits are non-transferable except where explicitly permitted within the app</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>Refund requests for unused credits may be submitted to{' '}
                  <a href="mailto:hello@maslow.nyc" className="text-[#C5A059] hover:underline">hello@maslow.nyc</a>
                  {' '}and are reviewed on a case-by-case basis
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>Maslow does not intend to forfeit your credits — if you have an exceptional circumstance, please reach out</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">5. Membership</h2>
            <ul className="space-y-3 text-[#3B5998]/80 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>Memberships may be cancelled or downgraded at any time with no fees or penalties</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>Changes take effect at the end of the current billing period</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>We will never charge you a cancellation fee or penalize you for leaving</span>
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">6. Bookings and Queue</h2>
            <ul className="space-y-3 text-[#3B5998]/80 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>Suite time is reserved through the app on a first-come, first-served basis</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>Please arrive promptly for your reservation; excessive no-shows may affect your ability to book in the future</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span>Maslow reserves the right to cancel bookings in cases of maintenance, safety concerns, or circumstances beyond our control</span>
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">7. Personal Preferences</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              Providing personal care preferences is entirely optional. These preferences exist solely to improve your experience. You may update or delete your preferences at any time through your account settings.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">8. Conduct</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              You agree to use Maslow facilities respectfully and in accordance with any posted rules at our locations. Maslow reserves the right to suspend accounts that violate our community standards.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">9. Limitation of Liability</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              Maslow is not responsible for lost, stolen, or damaged personal property. Our liability for any claim arising from use of our services is limited to the value of credits in your account at the time of the claim.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">10. Changes to These Terms</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              We may update these terms periodically. We will notify you of significant changes via email or in-app notice. Continued use of our services after changes constitutes acceptance.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">11. Governing Law</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              These terms are governed by the laws of the State of New York.
            </p>
          </section>

          {/* Section 12 */}
          <section className="border-t border-[#3B5998]/20 pt-8">
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">12. Contact</h2>
            <div className="text-[#3B5998]/80 leading-relaxed">
              <p className="font-semibold text-[#3B5998]">Maslow LLC</p>
              <p>
                <a href="mailto:hello@maslow.nyc" className="text-[#C5A059] hover:underline">hello@maslow.nyc</a>
              </p>
              <p>New York, NY</p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
