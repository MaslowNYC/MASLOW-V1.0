import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentModal from '@/components/PaymentModal';
import PaymentOptionsModal from '@/components/PaymentOptionsModal';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { featureFlags } from '@/config/featureFlags';

interface MembershipTier {
  name: string;
  price: number;
  benefits: string[];
  description: string;
  isLuxury?: boolean;
}

const MembershipPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState<boolean>(false);
  const [advisoryTermsAccepted, setAdvisoryTermsAccepted] = useState<boolean>(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const builderMember: MembershipTier = {
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

  const advisoryCircle: MembershipTier = {
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
  const handleSelectTier = (tier: MembershipTier): void => {
    if (!user) {
        toast({
            title: "Join the Community",
            description: "Please log in or create an account to start your membership.",
            className: "bg-[#3C5999] text-[#FAF4ED]"
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

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTier(null), 300);
  };

  const handleCloseOptionsModal = (): void => {
    setIsOptionsModalOpen(false);
    setTimeout(() => setSelectedTier(null), 300);
  };

  const handleSwitchToCardPayment = (): void => {
    setIsOptionsModalOpen(false);
    setTimeout(() => setIsModalOpen(true), 150);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <Helmet>
        <title>Membership | Maslow</title>
        <meta name="description" content="Get your Maslow Pass. Everyone deserves access. Start free at The Hull; upgrade anytime for private suite access." />
      </Helmet>

      {/* Hero Section */}
      <section
        className="relative pt-32 pb-24 px-6"
        style={{ background: 'linear-gradient(160deg, #1a2318 0%, #2d3b28 60%, #1e2d1a 100%)' }}
      >
        {/* Subtle leaf texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,10 C60,10 70,20 70,30 C70,40 60,50 50,50 C40,50 30,40 30,30 C30,20 40,10 50,10' fill='%23ffffff' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ color: 'var(--cream)', fontFamily: 'var(--serif)' }}
            >
              Get Your Maslow Pass
            </h1>
            <p
              className="text-xl max-w-2xl mx-auto font-light mb-4"
              style={{ color: 'rgba(250,244,237,0.8)', fontFamily: 'var(--sans)' }}
            >
              Everyone deserves access. Start with a free Maslow Pass to use The Hull — refill water, recharge your phone, wash your hands. Upgrade anytime for private suite access.
            </p>
            <p
              className="text-lg max-w-2xl mx-auto font-light"
              style={{ color: 'rgba(250,244,237,0.7)', fontFamily: 'var(--sans)' }}
            >
              Pre-buy your access. Help us build the sanctuary NYC deserves.
            </p>
          </motion.div>
        </div>
        {/* Bottom wave transition */}
        <svg
          className="absolute bottom-0 left-0 w-full h-16"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          style={{ fill: 'var(--cream)' }}
        >
          <path d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,40 1440,32 L1440,64 L0,64 Z" />
        </svg>
      </section>

      {/* Membership Cards Section */}
      <div className="pb-24 pt-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* THE VELVET ROPE PRICING SECTION */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Tier 1: The Sovereign */}
            <div
              className="p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
              style={{ background: 'var(--cream)', border: '1px solid var(--gold)' }}
            >
              <div
                className="absolute top-0 right-0 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest"
                style={{ background: 'var(--gold)', fontFamily: 'var(--sans)' }}
              >
                Allocated: 2/12
              </div>
              <h3
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}
              >
                The Sovereign
              </h3>
              <p
                className="text-xs uppercase tracking-widest mb-6"
                style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
              >
                Founding Patron Status
              </p>

              <div className="space-y-4 mb-8">
                <p className="font-light italic" style={{ color: 'rgba(42,39,36,0.8)', fontFamily: 'var(--sans)' }}>"A literal key to the city."</p>
                <ul className="text-sm space-y-2" style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)' }}>
                  <li>- Unlimited Maslow Suite Access + 1 Guest</li>
                  <li>- Permanent Name on Founding Plaque</li>
                  <li>- 24/7 Private Key Access</li>
                  <li>- Equity-Free Patronage</li>
                </ul>
              </div>

              <Button
                className="w-full uppercase tracking-widest"
                style={{ background: 'var(--charcoal)', color: 'var(--cream)' }}
                onClick={() => window.location.href = 'mailto:hello@maslow.nyc?subject=Sovereign%20Allocation%20Inquiry'}
              >
                Request Allocation
              </Button>
              <p
                className="text-[10px] text-center mt-3"
                style={{ color: 'rgba(42,39,36,0.4)', fontFamily: 'var(--sans)' }}
              >
                *Strictly limited to 12 founding members.
              </p>
            </div>

            {/* Tier 2: The Founding Member */}
            <div
              className="p-8 opacity-75 grayscale hover:grayscale-0 transition-all duration-500"
              style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(42,39,36,0.1)' }}
            >
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}
              >
                Founding Member
              </h3>
              <p
                className="text-xs uppercase tracking-widest mb-6"
                style={{ color: 'rgba(42,39,36,0.6)', fontFamily: 'var(--sans)' }}
              >
                Waitlist Access
              </p>

              <div className="space-y-4 mb-8">
                <p className="font-light" style={{ color: 'rgba(42,39,36,0.8)', fontFamily: 'var(--sans)' }}>
                  Secure your position for the 2026 launch. Pre-purchased suite session credits for early adopters.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                style={{ borderColor: 'rgba(42,39,36,0.2)', color: 'var(--charcoal)' }}
                disabled
              >
                Coming Soon
              </Button>
            </div>

          </div>

          <div className="mt-16 text-center">
            <p
              className="text-sm max-w-2xl mx-auto flex items-center justify-center gap-2"
              style={{ color: 'rgba(42,39,36,0.5)', fontFamily: 'var(--sans)' }}
            >
              <ShieldCheck className="w-4 h-4" />
              All memberships support the construction and maintenance of Maslow public rest stops.
            </p>
          </div>
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
