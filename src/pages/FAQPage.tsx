import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const faqData: FAQSection[] = [
  {
    title: 'Getting Started',
    items: [
      {
        question: 'What is Maslow?',
        answer: 'Maslow is NYC\'s first network of premium personal care sanctuaries. Our private suites provide a clean, comfortable, and luxurious space for personal care, offering amenities like premium toiletries, climate control, and a peaceful environment within the heart of the city.',
      },
      {
        question: 'Where are Maslow locations?',
        answer: 'Maslow is launching in SoHo, Manhattan, with plans to expand to Times Square, FiDi, Chelsea, Williamsburg, and other high-traffic areas throughout NYC. Check the app for the most up-to-date location information.',
      },
      {
        question: 'How do I create an account?',
        answer: 'Download the Maslow app or visit our website and tap "Sign Up." You can register using your email address. Once registered, you can purchase credits and start booking sanctuary visits.',
      },
      {
        question: 'What languages does Maslow support?',
        answer: 'Maslow is available in 13 languages including English, Spanish, Chinese, French, German, Italian, Japanese, Korean, Portuguese, Russian, Arabic, Hindi, and Hebrew. The app automatically detects your device language, or you can change it in Settings.',
      },
    ],
  },
  {
    title: 'Credits & Payments',
    items: [
      {
        question: 'How do credits work?',
        answer: '1 credit = $5 = 10 minutes of sanctuary time + 2 premium samples. You can purchase credits in various packages, with larger packages offering better value per credit. Credits are deducted when you check in to a sanctuary suite.',
      },
      {
        question: 'Do credits expire?',
        answer: 'Credits expire 18 months after purchase. We recommend purchasing packages that match your expected usage to maximize value.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, Apple Pay, and Google Pay. All payments are securely processed through Stripe.',
      },
      {
        question: 'Can I get a refund for unused credits?',
        answer: 'Credits are non-refundable once purchased. However, you can transfer credits to another Maslow member instantly through the app.',
      },
      {
        question: 'Can I transfer credits to someone else?',
        answer: 'Yes! You can transfer credits to any Maslow member directly in the app. Transfers are instant. The recipient must have their own Maslow account to use the credits.',
      },
    ],
  },
  {
    title: 'Bookings & Reservations',
    items: [
      {
        question: 'Do I need to book in advance?',
        answer: 'While walk-ins are welcome based on availability, we recommend booking ahead through the app to guarantee your preferred time slot, especially during peak hours.',
      },
      {
        question: 'How long can I stay?',
        answer: 'Standard visits are 10-30 minutes (1-3 credits), but you can extend your stay as long as you have available credits. The suite will notify you when your initial time is ending.',
      },
      {
        question: 'What if I need to cancel my booking?',
        answer: 'You can cancel a booking up to 15 minutes before your scheduled time without penalty. Late cancellations or no-shows will result in a 1-credit charge.',
      },
      {
        question: 'Can I book for someone else?',
        answer: 'Each person using a Maslow suite needs their own account for safety and personalization. However, you can transfer credits to their account instantly through the app. If your child is old enough to use the suite independently, they can download the free app and you can send them credits.',
      },
    ],
  },
  {
    title: 'The Sanctuary Experience',
    items: [
      {
        question: 'What amenities are included?',
        answer: 'Every suite includes premium toiletries, fresh towels, climate control, ambient lighting, a full-length mirror, and complimentary amenities like mouthwash, hand lotion, and personal care items. Each visit includes 2 premium samples to try.',
      },
      {
        question: 'Are the suites accessible?',
        answer: 'Yes, all Maslow locations feature ADA-compliant accessible suites. When booking, you can specify accessibility requirements to ensure an appropriate suite is reserved.',
      },
      {
        question: 'How are the suites cleaned?',
        answer: 'Every suite is thoroughly cleaned and sanitized between each use with hospital-grade disinfectants. Additionally, each suite is bathed in UV light for final sterilization before the next guest enters, ensuring the highest standards of cleanliness.',
      },
      {
        question: 'Is there somewhere to store my belongings?',
        answer: 'Each suite includes secure storage hooks and a shelf for personal items. For larger items, speak with our concierge about temporary storage options.',
      },
    ],
  },
  {
    title: 'Membership & Early Supporters',
    items: [
      {
        question: 'How can I support Maslow\'s launch?',
        answer: 'We\'re currently seeking early supporters and founding members to help bring Maslow to life. Contact us at hello@maslow.nyc to learn about exclusive founding member benefits and recognition opportunities.',
      },
      {
        question: 'What is the Digital Wall?',
        answer: 'Early supporters and founding members will be recognized on our digital wall of backers - a special feature on our website and in our first location celebrating those who believed in Maslow\'s mission from the beginning.',
      },
      {
        question: 'What benefits do early supporters receive?',
        answer: 'Early supporters enjoy priority access to new locations, exclusive events, special discounts on credit packages, and permanent recognition as founding members of the Maslow community.',
      },
    ],
  },
  /* PHASE 2: Re-enable AI Concierge section when feature is live
  {
    title: 'AI Concierge',
    items: [
      {
        question: 'What is the AI Concierge?',
        answer: 'Our AI Concierge is a smart assistant powered by Claude AI that helps you find nearby Maslow locations, answers questions about NYC, and provides personalized recommendations. You can access it anytime through the app.',
      },
      {
        question: 'How many times can I use the AI Concierge?',
        answer: 'You receive up to 10 AI Concierge conversations per day. This limit resets at midnight EST. The concierge is designed to help you make the most of your NYC experience.',
      },
      {
        question: 'Can I turn off the AI Concierge?',
        answer: 'Yes! You can enable or disable the AI Concierge in your Settings at any time.',
      },
    ],
  },
  */
  {
    title: 'Account & Settings',
    items: [
      {
        question: 'How do I change my email or password?',
        answer: 'Go to Settings in the app, then tap on your profile. You can update your email address and reset your password from there.',
      },
      {
        question: 'How do I delete my account?',
        answer: 'To delete your account and all associated data, email hello@maslow.nyc with "Account Deletion Request" in the subject line. We\'ll process your request within 30 days.',
      },
      {
        question: 'Can I use Maslow in multiple cities?',
        answer: 'Yes! Your Maslow account and credits work at all Maslow locations. As we expand to new cities, you\'ll automatically have access.',
      },
      {
        question: 'How is my data protected?',
        answer: 'All personal data is encrypted and stored securely using industry-standard practices. We never share your information with third parties. See our Privacy Policy for complete details.',
      },
    ],
  },
];

const FAQItem: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
  item,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="border-b border-[#3B5998]/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left hover:bg-[#3B5998]/5 transition-colors rounded-lg px-2 -mx-2"
      >
        <span className="text-[#3B5998] font-medium pr-4">{item.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#C5A059] flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-[#3B5998]/70 pb-4 leading-relaxed pl-2">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (sectionIndex: number, itemIndex: number) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-center mt-4 max-w-xl mx-auto"
          >
            Find answers to common questions about Maslow sanctuaries, credits, bookings, and more.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {faqData.map((section, sectionIndex) => (
            <section key={section.title} className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-serif font-bold text-[#3B5998] mb-4 pb-2 border-b border-[#C5A059]/30">
                {section.title}
              </h2>
              <div>
                {section.items.map((item, itemIndex) => (
                  <FAQItem
                    key={itemIndex}
                    item={item}
                    isOpen={openItems[`${sectionIndex}-${itemIndex}`] || false}
                    onToggle={() => toggleItem(sectionIndex, itemIndex)}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* Contact Section */}
          <section className="bg-[#3B5998] rounded-xl p-8 text-center">
            <h2 className="text-2xl font-serif font-bold text-white mb-3">
              Still have questions?
            </h2>
            <p className="text-white/70 mb-6">
              Our support team is here to help you with anything not covered above.
            </p>
            <a
              href="mailto:hello@maslow.nyc?subject=Support Question"
              className="inline-flex items-center gap-2 bg-[#C5A059] text-[#3B5998] font-bold px-6 py-3 rounded-lg hover:bg-[#d4af69] transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </a>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
