import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const POLICY_URL = '/api/policy/Y25Zdk1FUjNhV1ZQYmpBM1NWRTlQUT09';

const TermsOfServicePage = () => {
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
            Terms of Service
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none text-[#286BCD]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};

export default TermsOfServicePage;
