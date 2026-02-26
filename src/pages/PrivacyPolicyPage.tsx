import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
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
            Privacy Policy
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
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">1. Who We Are</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              Maslow LLC ("Maslow," "we," "us") operates premium restroom and personal care suites in New York City. This policy explains how we collect, use, and protect your information.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">2. Information We Collect</h2>
            <ul className="space-y-3 text-[#3B5998]/80 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span><strong>Account information:</strong> name, email address, phone number, and date of birth</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span><strong>Location data:</strong> which Maslow location(s) you visit and when</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span><strong>Usage preferences:</strong> personal care preferences you provide to customize your experience, such as amenity preferences, accessibility needs, and suite setup preferences</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span><strong>Payment information:</strong> processed securely through Stripe; we do not store card details</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059] font-bold">•</span>
                <span><strong>Device information:</strong> standard app and browser data for functionality and security</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">3. How We Use Your Information</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              We use your information to provide and personalize our services, process payments, communicate with you about your account and bookings, and improve our offerings. We do not sell your data to third parties.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">4. Your Preferences and Sensitive Information</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              Some preferences you provide (such as accessibility needs or personal care routines) are sensitive. We store this information solely to customize your experience. It is never shared with third parties or used for advertising.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">5. Data Retention</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us at{' '}
              <a href="mailto:hello@maslow.nyc" className="text-[#C5A059] hover:underline">hello@maslow.nyc</a>.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">6. Security</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              We use industry-standard security practices including encrypted connections, secure authentication, and access controls to protect your data.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">7. Third-Party Services</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              We use the following third-party services: Stripe (payments), Supabase (data storage), and Vercel (web hosting). Each operates under their own privacy policy.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">8. Your Rights</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              You may access, correct, or request deletion of your personal data at any time. Contact us at{' '}
              <a href="mailto:hello@maslow.nyc" className="text-[#C5A059] hover:underline">hello@maslow.nyc</a>.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">9. Children</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              Our services are not directed at children under 13. We do not knowingly collect data from minors.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">10. Changes to This Policy</h2>
            <p className="text-[#3B5998]/80 leading-relaxed">
              We may update this policy periodically. We will notify you of significant changes via email or in-app notice.
            </p>
          </section>

          {/* Section 11 */}
          <section className="border-t border-[#3B5998]/20 pt-8">
            <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-4">11. Contact</h2>
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

export default PrivacyPolicyPage;
