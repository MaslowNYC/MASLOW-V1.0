import { useEffect } from 'react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    UC_UI?: {
      showSecondLayer: () => void;
    };
  }
}

const CookiePolicyPage = () => {
  useEffect(() => {
    // Usercentrics renders the cookie policy inline via the consent tool
    // The UC_UI.showSecondLayer() can be called to show the full cookie settings
    const checkUC = setInterval(() => {
      if (window.UC_UI) {
        clearInterval(checkUC);
      }
    }, 100);

    return () => clearInterval(checkUC);
  }, []);

  const openCookieSettings = () => {
    if (window.UC_UI) {
      window.UC_UI.showSecondLayer();
    }
  };

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
            Cookie Policy
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
        >
          <p className="text-lg leading-relaxed mb-6">
            We use cookies and similar technologies to enhance your experience on our website.
            You can manage your cookie preferences at any time using our cookie consent tool.
          </p>

          <button
            onClick={openCookieSettings}
            className="bg-[#286BCD] text-white px-6 py-3 rounded-lg hover:bg-[#1e5ab0] transition-colors font-medium"
          >
            Manage Cookie Settings
          </button>

          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#286BCD]">What are cookies?</h2>
            <p className="leading-relaxed">
              Cookies are small text files that are stored on your device when you visit a website.
              They help websites remember your preferences and improve your browsing experience.
            </p>

            <h2 className="text-2xl font-serif font-bold text-[#286BCD] mt-6">Types of cookies we use</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
            </ul>

            <p className="leading-relaxed mt-6">
              For more detailed information about cookies and your rights, please review our{' '}
              <a href="/privacy-policy" className="text-[#C49F58] hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
