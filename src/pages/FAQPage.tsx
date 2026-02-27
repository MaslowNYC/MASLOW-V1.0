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
        answer: 'Maslow is a network of premium personal care sanctuaries in New York City. Our private suites provide a clean, comfortable, and luxurious space for personal care, offering amenities like premium toiletries, climate control, and a peaceful environment away from the chaos of city life.',
      },
      {
        question: 'Where are Maslow locations?',
        answer: 'Maslow is currently launching in Manhattan, with our flagship location in SoHo. We are expanding to additional neighborhoods throughout NYC. Check the app for the most up-to-date location information.',
      },
      {
        question: 'How do I create an account?',
        answer: 'Download the Maslow app or visit our website and tap "Sign Up." You can register using your email address. Once registered, you can purchase credits and start booking sanctuary visits.',
      },
    ],
  },
  {
    title: 'Credits & Payments',
    items: [
      {
        question: 'How do credits work?',
        answer: '1 credit equals 10 minutes of sanctuary time. You can purchase credits in various packages, with larger packages offering better value. Credits are deducted when you check in to a sanctuary suite.',
      },
      {
        question: 'Do credits expire?',
        answer: 'Credits expire 1 year after purchase. We recommend purchasing packages that match your expected usage to maximize value.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, Apple Pay, and Google Pay. All payments are securely processed through Stripe.',
      },
      {
        question: 'Can I get a refund for unused credits?',
        answer: 'Credits are non-refundable once purchased. However, you can transfer credits to another Maslow member by contacting support at hello@maslow.nyc.',
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
        answer: 'Standard visits are 10-30 minutes, but you can extend your stay as long as you have available credits. The suite will notify you when your initial time is ending.',
      },
      {
        question: 'What if I need to cancel my booking?',
        answer: 'You can cancel a booking up to 15 minutes before your scheduled time without penalty. Late cancellations or no-shows may result in a 1-credit charge.',
      },
      {
        question: 'Can I book for someone else?',
        answer: 'Currently, bookings are tied to individual accounts. Each user must have their own Maslow account to access our sanctuaries.',
      },
    ],
  },
  {
    title: 'The Sanctuary Experience',
    items: [
      {
        question: 'What amenities are included?',
        answer: 'Every suite includes premium toiletries, fresh towels, climate control, ambient lighting, a full-length mirror, and complimentary amenities like mouthwash, hand lotion, and personal care items.',
      },
      {
        question: 'Are the suites accessible?',
        answer: 'Yes, all Maslow locations feature ADA-compliant accessible suites. When booking, you can specify accessibility requirements to ensure an appropriate suite is reserved.',
      },
      {
        question: 'How are the suites cleaned?',
        answer: 'Every suite is thoroughly cleaned and sanitized between each use with hospital-grade disinfectants. Fresh linens and amenities are provided for each guest.',
      },
      {
        question: 'Is there somewhere to store my belongings?',
        answer: 'Each suite includes secure storage hooks and a shelf for personal items. For larger items, speak with our concierge about temporary storage options.',
      },
    ],
  },
  {
    title: 'Membership',
    items: [
      {
        question: 'What are the membership tiers?',
        answer: 'We offer several sponsorship tiers for early supporters: Sanctuary Seeker, Wellness Patron, Founding Member, and Visionary Circle. Each tier includes exclusive benefits and recognition on our Digital Wall.',
      },
      {
        question: 'What benefits do members receive?',
        answer: 'Members enjoy priority booking, exclusive events, special discounts on credit packages, and early access to new locations and features.',
      },
      {
        question: 'How do I upgrade my membership?',
        answer: 'Contact our support team at hello@maslow.nyc to discuss upgrading your membership tier. We\'ll apply any previous contributions toward your upgrade.',
      },
    ],
  },
  {
    title: 'Account & Settings',
    items: [
      {
        question: 'How do I change my email or password?',
        answer: 'Go to Settings in the app, then tap on your profile. You can update your email address and reset your password from there.',
      },
      {
        question: 'What is the AI Concierge?',
        answer: 'Our AI Concierge is a smart assistant that helps you find nearby Maslow locations, answers questions, and provides personalized recommendations. You can enable or disable it in Settings.',
      },
      {
        question: 'How do I delete my account?',
        answer: 'To delete your account and all associated data, email hello@maslow.nyc with "Account Deletion Request" in the subject line. We\'ll process your request within 30 days.',
      },
      {
        question: 'Can I use Maslow in multiple cities?',
        answer: 'Yes! Your Maslow account and credits work at all Maslow locations. As we expand to new cities, you\'ll automatically have access.',
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
