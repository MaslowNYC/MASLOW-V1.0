import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const POLICY_URL = '/api/policy/Y1dvcldESmlSalk0VG01dFkxRTlQUT09';

const PrivacyPolicyPage = () => {
  const [html, setHtml] = useState('<p>Loading policy...</p>');

  useEffect(() => {
    fetch(POLICY_URL)
      .then(res => res.text())
      .then(text => setHtml(text))
      .catch(() => setHtml('<p>Unable to load policy. Please try again later.</p>'));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF4ED]">
      {/* Header */}
      <div className="bg-[#286BCD] py-16">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white text-center"
          >
            Privacy Policy
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <style>{`
          .policy-content, .policy-content * {
            color: #286BCD !important;
          }
          .policy-content a {
            color: #C49F58 !important;
            text-decoration: underline;
          }
          .policy-content h2, .policy-content h3, .policy-content h4 {
            font-weight: bold;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
          }
          .policy-content p {
            margin-bottom: 1em;
            line-height: 1.7;
          }
          .policy-content ul, .policy-content ol {
            margin-left: 1.5em;
            margin-bottom: 1em;
          }
          .policy-content li {
            margin-bottom: 0.5em;
          }
        `}</style>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="policy-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
