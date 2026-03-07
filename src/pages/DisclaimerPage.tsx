import { useEffect } from 'react';
import { motion } from 'framer-motion';

const DisclaimerPage = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://policies.termageddon.com/api/embed/YkZJMFpFRjJSblU0TDNBelJuYzlQUT09.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
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
            Disclaimer
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <div
            id="YkZJMFpFRjJSblU0TDNBelJuYzlQUT09"
            className="policy_embed_div text-[#286BCD]"
          >
            Please wait while the policy is loaded. If it does not load, please{' '}
            <a
              rel="nofollow"
              href="https://policies.termageddon.com/api/policy/YkZJMFpFRjJSblU0TDNBelJuYzlQUT09"
              target="_blank"
              className="text-[#C49F58] hover:underline"
            >
              click here
            </a>{' '}
            to view the policy.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
