
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
import { featureFlags } from '@/config/featureFlags';

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

    if (!featureFlags.enablePayments) {
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
        {/* THE VELVET ROPE PRICING SECTION */}
<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
  
  {/* Tier 1: The Sovereign */}
  <div className="border border-[#C5A059] bg-[#F5F1E8] p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
    <div className="absolute top-0 right-0 bg-[#C5A059] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
      Allocated: 2/12
    </div>
    <h3 className="text-3xl font-serif font-bold text-[#3B5998] mb-2">The Sovereign</h3>
    <p className="text-xs text-[#C5A059] uppercase tracking-widest mb-6">Founding Patron Status</p>
    
    <div className="space-y-4 mb-8">
      <p className="text-[#3B5998]/80 font-light italic">"A literal key to the city."</p>
      <ul className="text-sm text-[#3B5998] space-y-2">
        <li>• Lifetime Access + 1 Guest</li>
        <li>• Permanent Name on Founding Plaque</li>
        <li>• 24/7 Private Key Access</li>
        <li>• Equity-Free Patronage</li>
      </ul>
    </div>

    <Button 
      className="w-full bg-[#3B5998] text-white hover:bg-[#2A406E] uppercase tracking-widest"
      onClick={() => window.location.href = 'mailto:patrick@maslownyc.com?subject=Sovereign%20Allocation%20Inquiry'}
    >
      Request Allocation
    </Button>
    <p className="text-[10px] text-center mt-3 text-[#3B5998]/40">
      *Strictly limited to 12 founding members.
    </p>
  </div>

  {/* Tier 2: The Founding Member */}
  <div className="border border-[#3B5998]/10 bg-white/50 p-8 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
    <h3 className="text-2xl font-serif font-bold text-[#3B5998] mb-2">Founding Member</h3>
    <p className="text-xs text-[#3B5998]/60 uppercase tracking-widest mb-6">Waitlist Access</p>
    
    <div className="space-y-4 mb-8">
      <p className="text-[#3B5998]/80 font-light">
        Secure your position for the 2026 launch. Pre-purchased credit bundles for early adopters.
      </p>
    </div>

    <Button variant="outline" className="w-full border-[#3B5998]/20 text-[#3B5998]" disabled>
      Coming Soon
    </Button>
  </div>

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
