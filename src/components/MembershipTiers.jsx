
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Crown, Star, Hammer, Landmark, AlertTriangle, QrCode, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import PaymentModal from '@/components/PaymentModal';
import PaymentOptionsModal from '@/components/PaymentOptionsModal';
import MaslowPassMockup from '@/components/MaslowPassMockup';
import ContactFormModal from '@/components/ContactFormModal';
import BetaSignupModal from '@/components/BetaSignupModal';
import { formatNumber } from '@/utils/formatting';
import { PAYMENT_DISABLED } from '@/config/featureFlags';

// Updated tiers based on user request
const tiers = [
  {
    name: 'SINGLE SESSION',
    price: 5,
    icon: Clock, 
    benefits: [
      '10-Minute Private Suite Access',
      'Secure Hallway Entry',
      'Extend time at check-in',
    ],
    description: 'Immediate access. Pure utility. Pay per session.',
    highlight: false,
    action: 'pay'
  },
  {
    name: 'THE BUILDER',
    // ... (Leave the rest of the file exactly as it is!)
  {
    name: 'THE BUILDER', 
    price: 100,
    icon: Hammer, 
    benefits: [
      '40 Maslow Suite Credits (valued at $200) in your phone wallet',
      'Credits never expire',
      'Name on Digital Wall',
    ],
    description: 'Support the physical buildout. Your pledge buys the bricks and plumbing.',
    highlight: false
  },
  {
    name: 'THE FOUNDING MEMBER', 
    price: 500,
    icon: Star, 
    benefits: [
      '200 Maslow Suite Credits (valued at $1000) in your phone wallet',
      '6-Month Priority Status at Flagship',
      'Credits never expire',
    ],
    description: 'Become a cornerstone of the movement with priority access status.',
    highlight: false
  },
  {
    name: 'THE ARCHITECT',
    price: 10000,
    icon: Landmark,
    benefits: [
      'Unlimited Suite Access in your phone wallet for 2 years',
      'Black Key Status at Flagship Location',
      'Only 25 Spots Available',
    ],
    description: 'Structure the future. Unlimited access for enduring support.',
    note: 'Includes physical Black Key for lifetime access to this flagship location.',
    limited: true,
    highlight: false
  },
  {
    name: 'THE SOVEREIGN', 
    price: 25000,
    icon: Crown,
    benefits: [
      'Lifetime Access for You & Family',
      'Black Key Status at All Future Locations',
      'Design Council Invitation',
      'Limited to 10 Spots',
    ],
    description: "The ultimate commitment. Secure Lifetime Access for you and your family. Your pledge directly funds the excavation and plumbing of our flagship location. You aren't just a member; you're the reason we exist.",
    note: 'Includes physical Black Key for lifetime access to ALL Maslow locations globally.',
    limited: true,
    highlight: true,
    action: 'inquiry' 
  }
];

const MembershipTiers = () => {
  const [selectedTier, setSelectedTier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectTier = (tier) => {
    // Check auth before action
    if (!user) {
      toast({
        title: "Member Access Required",
        description: "Join the community to access membership options.",
        className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]",
      });
      navigate('/login');
      return;
    }

    if (PAYMENT_DISABLED && tier.action !== 'inquiry') {
      toast({
        title: "Payments Unavailable",
        description: "Payment processing is currently disabled. Please check back later.",
        variant: "destructive"
      });
      return;
    }

    setSelectedTier(tier);
    
    if (tier.action === 'inquiry') {
      setIsContactModalOpen(true);
    } else if (tier.name === 'THE ARCHITECT') {
      setIsOptionsModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTier(null), 300);
  };

  const handleCloseOptionsModal = () => {
    setIsOptionsModalOpen(false);
    setTimeout(() => setSelectedTier(null), 300);
  };
  
  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
    setTimeout(() => setSelectedTier(null), 300);
  };

  const handleSwitchToCardPayment = () => {
    setIsOptionsModalOpen(false);
    setTimeout(() => setIsModalOpen(true), 150);
  };

  return (
    <section id="membership-tiers" className="bg-[#F5F1E8] py-24 w-full overflow-hidden scroll-mt-20">
      <span id="membership" className="absolute -top-20 invisible"></span>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-serif text-[#3B5998] mb-6">
            Founding Memberships
          </h3>
          <p className="text-xl text-[#3B5998]/80 max-w-2xl mx-auto font-medium">
            Pre-purchase credits for The Maslow Suite. Help us break ground in SoHo.
          </p>
        </motion.div>

        <div id="membership-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            const blackKeyBenefitIndex = tier.benefits.findIndex(benefit => benefit.includes('Black Key Status at Flagship Location') || benefit.includes('Lifetime Access'));
            const isPaymentRequired = tier.action !== 'inquiry';
            
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgba(59, 89, 152, 0.25)' }}
                className={`bg-[#F5F1E8] rounded-xl p-6 shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden ${
                  tier.highlight ? 'border-4 border-[#C5A059] ring-4 ring-[#C5A059]/20' : 
                  tier.limited ? 'border-2 border-[#C5A059]' : 'border border-[#3B5998]/10'
                }`}
              >
                {tier.highlight && (
                   <div className="absolute top-0 right-0 bg-[#C5A059] text-[#3B5998] text-xs font-bold px-3 py-1 rounded-bl-lg uppercase">
                     Most Impactful
                   </div>
                )}

                <div className="flex items-center justify-between mb-4 mt-2">
                  <Icon className={`w-10 h-10 text-[#C5A059]`} />
                  {tier.limited && !tier.highlight && (
                    <span className="text-xs text-[#3B5998] font-bold bg-[#C5A059] px-3 py-1 rounded-full uppercase">
                      LIMITED
                    </span>
                  )}
                </div>

                <h4 className="text-xl font-bold text-[#3B5998] mb-1 uppercase tracking-wide min-h-[3.5rem] flex items-center">
                  {tier.name}
                </h4>
                
                <div className="text-4xl font-bold text-[#3B5998] mb-4">
                  {formatNumber(tier.price, { type: 'currency', maximumFractionDigits: 0 })}
                </div>

                <p className="text-[#3B5998]/70 mb-6 text-sm min-h-[3rem]">
                  {tier.description}
                </p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.benefits.map((benefit, i) => (
                    <React.Fragment key={i}>
                      <li className="flex items-start gap-3 text-[#3B5998]">
                        <Check className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-1" />
                        <span className="text-sm font-medium">{benefit}</span>
                      </li>
                      {i === blackKeyBenefitIndex && tier.note && (
                        <li className="ml-7 mt-2 mb-2">
                          <div className="bg-[#3B5998]/5 border border-[#C5A059]/30 rounded px-2 py-1">
                            <p className="text-[#C5A059] text-xs italic leading-tight">
                              <span className="font-bold">Note:</span> {tier.note}
                            </p>
                          </div>
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>

                {PAYMENT_DISABLED && isPaymentRequired ? (
                  <div className="w-full py-4 text-center bg-gray-100 rounded-lg border border-gray-200 cursor-not-allowed">
                    <p className="text-[#3B5998] font-bold text-sm">Payment Unavailable</p>
                    <p className="text-[#3B5998]/60 text-xs">Please check back soon</p>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleSelectTier(tier)}
                    className="w-full font-bold py-6 uppercase tracking-wider transition-all duration-300 bg-[#3B5998] text-[#F5F1E8] hover:bg-[#C5A059] hover:text-[#3B5998]"
                  >
                    {tier.action === 'inquiry' ? 'Request Membership' : 'Join Now'}
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Hull Pass Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 md:p-12 rounded-xl shadow-xl mt-16 max-w-4xl mx-auto relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center gap-8 border border-[#3B5998]/10"
        >
          <div className="flex-1">
             <h4 className="text-3xl font-black text-[#3B5998] mb-2 uppercase">The Hull Pass</h4>
             <p className="text-[#C5A059] font-bold text-lg mb-4">Digital Access to The Hull is currently in Beta.</p>
             <p className="text-[#3B5998]/80 mb-6">Join the waitlist to receive your free digital pass, granting access to our safe, clean sanctuary spaces.</p>
             <Button 
                onClick={() => setIsBetaModalOpen(true)}
                className="bg-[#3B5998] text-[#F5F1E8] hover:bg-[#2d4475] font-bold py-6 px-8 rounded-full shadow-lg w-full sm:w-auto flex items-center justify-center gap-2 uppercase tracking-wide"
             >
                <QrCode className="w-5 h-5" />
                Claim Your Hull Pass
             </Button>
             <p className="text-[#3B5998]/40 text-xs mt-3 italic">Reserve your spot.</p>
          </div>
          <div className="flex-shrink-0 w-64 md:w-80">
              <MaslowPassMockup showOnlyCard={true} />
          </div>
        </motion.div>

        {/* Risk Disclosure Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mt-20 mb-20"
        >
          <div className="bg-[#3B5998]/5 border border-[#3B5998]/10 rounded-lg p-6 flex items-start gap-4 text-left">
            <AlertTriangle className="w-6 h-6 text-[#C5A059] shrink-0 mt-1" />
            <div className="space-y-2">
              <h5 className="text-[#3B5998] font-bold text-sm uppercase tracking-wide">
                Project Development & Risk Disclosure
              </h5>
              <p className="text-[#3B5998]/70 text-xs leading-relaxed">
                The Maslow Project is currently in the development, planning, and pre-construction phase. Membership pledges are used to fund operations, design, permitting, legal frameworks, and initial development costs. While our team is fully committed to realizing this vision, all real estate development projects carry inherent risks regarding timelines, municipal approvals, and final execution. Pledges are non-refundable contributions to the cause and do not constitute an equity investment, security, or guarantee of project completion.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {selectedTier && (
        <>
          <PaymentModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            tierName={selectedTier.name}
            price={selectedTier.price}
          />
          <PaymentOptionsModal 
             isOpen={isOptionsModalOpen}
             onClose={handleCloseOptionsModal}
             tierName={selectedTier.name}
             price={selectedTier.price}
             onPayWithCard={handleSwitchToCardPayment}
          />
          <ContactFormModal
            isOpen={isContactModalOpen}
            onClose={handleCloseContactModal}
            defaultInquiryType="Sovereign Inquiry"
          />
        </>
      )}
      
      <BetaSignupModal 
        isOpen={isBetaModalOpen} 
        onClose={() => setIsBetaModalOpen(false)} 
      />
    </section>
  );
};

export default MembershipTiers;
