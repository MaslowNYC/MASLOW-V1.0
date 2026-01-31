// PRICING CALCULATOR COMPONENT
// File: src/components/PricingCalculator.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Sparkles } from 'lucide-react';

const PricingCalculator = () => {
  const [selectedDuration, setSelectedDuration] = useState(10);

  // Pricing tiers with discounts
  const pricingTiers = [
    { 
      duration: 10, 
      basePrice: 5.00, 
      discount: 0, 
      finalPrice: 5.00,
      perMinute: 0.50,
      label: "Quick Session",
      description: "Touch-ups, quick calls, nursing breaks",
      popular: false
    },
    { 
      duration: 20, 
      basePrice: 10.00, 
      discount: 10, 
      finalPrice: 9.00,
      perMinute: 0.45,
      label: "Short Session",
      description: "Private calls, outfit changes",
      popular: false
    },
    { 
      duration: 30, 
      basePrice: 15.00, 
      discount: 15, 
      finalPrice: 13.00,
      perMinute: 0.43,
      label: "Standard Session",
      description: "Prayer and wudu, meetings, pumping",
      popular: true
    },
    { 
      duration: 45, 
      basePrice: 22.50, 
      discount: 20, 
      finalPrice: 18.00,
      perMinute: 0.40,
      label: "Long Session",
      description: "Therapy calls, deep rest",
      popular: false
    },
    { 
      duration: 60, 
      basePrice: 30.00, 
      discount: 25, 
      finalPrice: 22.50,
      perMinute: 0.38,
      label: "Extended Session",
      description: "Full therapy sessions, extended pumping",
      popular: false
    }
  ];

  const selectedTier = pricingTiers.find(tier => tier.duration === selectedDuration);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-[#3B5998]/10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-[#3B5998] mb-2">
          Session Pricing Calculator
        </h2>
        <p className="text-[#3B5998]/70">
          Choose your session length. Longer sessions = bigger savings.
        </p>
      </div>

      {/* Duration Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-8">
        {pricingTiers.map((tier) => (
          <button
            key={tier.duration}
            onClick={() => setSelectedDuration(tier.duration)}
            className={`relative p-4 rounded-lg border-2 transition-all ${
              selectedDuration === tier.duration
                ? 'border-[#C5A059] bg-[#C5A059]/5 shadow-md'
                : 'border-[#3B5998]/20 hover:border-[#3B5998]/40'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#C5A059] text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  POPULAR
                </span>
              </div>
            )}
            <div className="text-2xl font-bold text-[#3B5998] mb-1">
              {tier.duration}
            </div>
            <div className="text-xs text-[#3B5998]/60 uppercase tracking-wide">
              minutes
            </div>
            {tier.discount > 0 && (
              <div className="text-xs text-[#C5A059] font-bold mt-2">
                Save {tier.discount}%
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selected Session Details */}
      {selectedTier && (
        <motion.div
          key={selectedDuration}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#F5F1E8] rounded-xl p-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Session Info */}
            <div>
              <h3 className="text-xl font-bold text-[#3B5998] mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {selectedTier.label}
              </h3>
              <p className="text-[#3B5998]/70 mb-4">
                {selectedTier.description}
              </p>
              <div className="space-y-2 text-sm text-[#3B5998]/80">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold">{selectedTier.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate per minute:</span>
                  <span className="font-semibold">${selectedTier.perMinute.toFixed(2)}/min</span>
                </div>
                {selectedTier.discount > 0 && (
                  <>
                    <div className="flex justify-between text-[#3B5998]/50 line-through">
                      <span>Regular price:</span>
                      <span>${selectedTier.basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#C5A059] font-bold">
                      <span>You save:</span>
                      <span>${(selectedTier.basePrice - selectedTier.finalPrice).toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Price Display */}
            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-6 border-2 border-[#C5A059]">
              <div className="text-sm text-[#3B5998]/60 uppercase tracking-wide mb-2">
                Total Cost
              </div>
              <div className="text-5xl font-bold text-[#3B5998] mb-2 flex items-start">
                <span className="text-2xl mr-1">$</span>
                {selectedTier.finalPrice.toFixed(2)}
              </div>
              <div className="text-xs text-[#3B5998]/60 mb-4">
                for {selectedTier.duration} minutes
              </div>
              
              {selectedTier.discount > 0 && (
                <div className="bg-[#C5A059]/10 text-[#C5A059] px-4 py-2 rounded-full text-sm font-bold">
                  {selectedTier.discount}% Discount Applied
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-[#3B5998]/10">
            <p className="text-sm text-[#3B5998]/70 text-center">
              Need more time? You can extend your session from inside the Suite at the same discounted rate.
            </p>
          </div>
        </motion.div>
      )}

      {/* Membership Comparison */}
      <div className="mt-8 bg-[#3B5998]/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#3B5998] mb-4 text-center">
          💡 Save More with Membership
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 border border-[#3B5998]/10">
            <div className="font-bold text-[#3B5998] mb-2">Founding Member</div>
            <div className="text-xs text-[#3B5998]/70 mb-3">$500/year</div>
            <ul className="space-y-1 text-xs text-[#3B5998]/80">
              <li>✓ 50 sessions included</li>
              <li>✓ $4 per additional session</li>
              <li>✓ Priority booking</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-[#C5A059]">
            <div className="font-bold text-[#3B5998] mb-2">The Architect</div>
            <div className="text-xs text-[#3B5998]/70 mb-3">$10,000 lifetime</div>
            <ul className="space-y-1 text-xs text-[#3B5998]/80">
              <li>✓ Unlimited Suite access</li>
              <li>✓ No per-session fees</li>
              <li>✓ Skip the line</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#3B5998]/10">
            <div className="font-bold text-[#3B5998] mb-2">The Sovereign</div>
            <div className="text-xs text-[#3B5998]/70 mb-3">$25,000 lifetime</div>
            <ul className="space-y-1 text-xs text-[#3B5998]/80">
              <li>✓ Everything in Architect</li>
              <li>✓ Concierge booking</li>
              <li>✓ Free guest access</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Free Hull Reminder */}
      <div className="mt-6 text-center p-4 bg-[#F5F1E8] rounded-lg">
        <p className="text-sm text-[#3B5998]/80">
          <strong className="text-[#3B5998]">Not sure?</strong> Try The Hull first - our free public restroom with 15-minute sessions. 
          No payment required. Just scan your free Maslow Pass.
        </p>
      </div>
    </div>
  );
};

export default PricingCalculator;
