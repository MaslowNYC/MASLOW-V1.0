
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Hammer, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentModal from '@/components/PaymentModal';
import PaymentOptionsModal from '@/components/PaymentOptionsModal';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { PAYMENT_DISABLED } from '@/config/featureFlags';

const MembershipPage = () => {
  const [selectedTier, setSelectedTier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [advisoryTermsAccepted, setAdvisoryTermsAccepted] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const builderMember = { 
    name: 'The Founding Member', 
    price: 500,
    benefits: [
      '1 Year Unlimited Access to All Locations',
      'Digital Founder Badge on Profile',
      'Priority Access to New Features',
      'Community Governance Voting Rights'
    ],
    description: 'Become a cornerstone of the movement. Your support builds the foundation.'
  };

  const advisoryCircle = {
    name: 'The Advisory Circle',
    price: 25000,
    benefits: [
      'Lifetime Access to All Current & Future Locations',
      'Name Etched on Bronze Founder Plaque at SoHo Flagship',
      'Quarterly Founder Dinners & Strategy Sessions',
      'Direct Access to Design Council',
      'Strict Limit: 10 Seats'
    ],
    description: 'A legacy membership for those who shape the future of urban dignity.',
    isLuxury: true
  };

  // Check auth before proceeding to payment
  const handleSelectTier = (tier) => {
    if (!user) {
        toast({
            title: "Join the Community",
            description: "Please log in or create an account to start your membership.",
            className: "bg-[#3B5998] text-[#F5F1E8]"
        });
        navigate('/login');
        return;
    }

    if (PAYMENT_DISABLED) {
      toast({
        title: "Payments Unavailable",
        description: "Payment processing is currently disabled. Please check back later.",
        variant: "destructive"
      });
      return;
    }

    setSelectedTier(tier);
    if (tier.isLuxury) {
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

  const handleSwitchToCardPayment = () => {
    setIsOptionsModalOpen(false);
    setTimeout(() => setIsModalOpen(true), 150);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] pt-12 pb-24">
      <Helmet>
        <title>Membership | Maslow NYC</title>
        <meta name="description" content="Join the Maslow movement. Become a Builder or join The Advisory Circle." />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif text-[#3B5998] mb-6">
            Join the Club
          </h1>
          <p className="text-xl text-[#3B5998]/80 max-w-2xl mx-auto font-light font-sans">
            Pre-buy your access. Help us build the sanctuary NYC deserves.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Tier 1: The Founding Member */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#3B5998]/10 flex flex-col h-full"
          >
            <div className="bg-[#3B5998]/5 p-8 border-b border-[#3B5998]/10">
              <div className="flex justify-between items-start mb-4">
                <Hammer className="w-8 h-8 text-[#3B5998]" />
              </div>
              <h3 className="text-3xl font-serif text-[#3B5998] mb-2">{builderMember.name}</h3>
              <div className="text-4xl font-bold text-[#C5A059] mb-4 font-sans">
                ${builderMember.price.toLocaleString()}
              </div>
              <p className="text-[#3B5998]/70 font-sans italic">
                {builderMember.description}
              </p>
            </div>
            
            <div className="p-8 flex-grow flex flex-col justify-between">
              <ul className="space-y-4 mb-8">
                {builderMember.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#C5A059] mt-0.5 flex-shrink-0" />
                    <span className="text-[#3B5998] font-sans">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              {PAYMENT_DISABLED ? (
                <div className="w-full py-6 text-center bg-gray-100 rounded border border-gray-200 cursor-not-allowed">
                  <p className="text-[#3B5998] font-bold">Payment Unavailable</p>
                  <p className="text-[#3B5998]/60 text-sm">Please check back soon</p>
                </div>
              ) : (
                <Button 
                  onClick={() => handleSelectTier(builderMember)}
                  className="w-full py-6 text-lg bg-[#3B5998] hover:bg-[#2d4474] text-[#F5F1E8] font-bold tracking-wider uppercase"
                >
                  Join Now
                </Button>
              )}
            </div>
          </motion.div>

          {/* Tier 2: The Advisory Circle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden border-2 border-[#C5A059] relative flex flex-col h-full group"
          >
            {/* Gritty Texture Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
            
            <div className="p-8 border-b border-[#C5A059]/30 relative z-10">
              <div className="flex justify-between items-start mb-4">
                <Crown className="w-10 h-10 text-[#C5A059]" />
                <span className="bg-[#C5A059] text-[#1a1a1a] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Strict Limit: 10 Seats
                </span>
              </div>
              <h3 className="text-3xl font-serif text-[#F5F1E8] mb-2">{advisoryCircle.name}</h3>
              <div className="text-4xl font-bold text-[#C5A059] mb-4 font-sans">
                ${advisoryCircle.price.toLocaleString()}
              </div>
              <p className="text-[#F5F1E8]/70 font-sans italic border-l-2 border-[#C5A059] pl-4">
                {advisoryCircle.description}
              </p>
            </div>
            
            <div className="p-8 relative z-10 flex-grow flex flex-col justify-between">
              <ul className="space-y-5 mb-8">
                {advisoryCircle.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="bg-[#C5A059]/20 p-1 rounded-full">
                      <Check className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                    </div>
                    <span className="text-[#F5F1E8] font-sans font-light tracking-wide">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-6">
                <div className="flex items-start gap-3 bg-[#C5A059]/5 p-4 rounded border border-[#C5A059]/20">
                  <input 
                    type="checkbox" 
                    id="advisory-terms" 
                    className="mt-1 w-5 h-5 rounded border-[#C5A059] text-[#C5A059] focus:ring-[#C5A059] bg-transparent cursor-pointer accent-[#C5A059]"
                    checked={advisoryTermsAccepted}
                    onChange={(e) => setAdvisoryTermsAccepted(e.target.checked)}
                  />
                  <label htmlFor="advisory-terms" className="text-xs text-[#F5F1E8]/60 cursor-pointer select-none leading-relaxed">
                    I acknowledge that this is a purchase of a <span className="text-[#C5A059]">Lifetime Membership</span> and does not convey equity or voting rights in Maslow LLC.
                  </label>
                </div>
                
                {PAYMENT_DISABLED ? (
                   <div className="w-full py-6 text-center bg-gray-800 rounded border border-gray-700 cursor-not-allowed text-[#F5F1E8]">
                    <p className="font-bold">Payment Unavailable</p>
                    <p className="text-[#F5F1E8]/60 text-sm">Please check back soon</p>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleSelectTier(advisoryCircle)}
                    disabled={!advisoryTermsAccepted}
                    className={`w-full py-6 text-lg font-bold tracking-wider uppercase transition-all duration-500
                      ${advisoryTermsAccepted 
                        ? 'bg-[#C5A059] text-[#1a1a1a] hover:bg-[#d4b06a] shadow-[0_0_20px_rgba(197,160,89,0.4)]' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {advisoryTermsAccepted ? 'Secure Your Legacy' : 'Accept Terms to Join'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

        </div>

        <div className="mt-16 text-center">
            <p className="text-[#3B5998]/60 text-sm max-w-2xl mx-auto flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                All memberships support the construction and maintenance of Maslow public rest stops.
            </p>
        </div>
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
        </>
      )}
    </div>
  );
};

export default MembershipPage;
