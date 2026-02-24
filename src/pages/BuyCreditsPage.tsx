import { BuyCreditsButton } from '@/components/BuyCreditsButton';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export default function BuyCreditsPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || null);
      
      // Get current credits
      const { data: profile } = await (supabase
        .from('profiles') as any)
        .select('credits')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setCredits(profile.credits || 0);
      }
    }
  };

  const packages = [
    { 
      credits: 1, 
      price: 5, 
      name: 'Single Visit', 
      badge: null,
      description: 'Try Maslow once'
    },
    { 
      credits: 10, 
      price: 45, 
      name: 'Starter Pack', 
      badge: '10% off',
      description: 'Perfect for occasional use'
    },
    { 
      credits: 10, 
      price: 42, 
      name: 'Weekly Pass', 
      badge: 'For commuters',
      description: 'Best for daily commuters'
    },
    { 
      credits: 40, 
      price: 140, 
      name: 'Monthly Pass', 
      badge: 'BEST VALUE',
      description: 'Most popular choice'
    },
    { 
      credits: 60, 
      price: 180, 
      name: 'Unlimited Month', 
      badge: '40% off',
      description: 'For power users'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1E8] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1F36] mb-4">
            Buy Credits
          </h1>
          <p className="text-lg text-[#4A5568] mb-4 max-w-2xl mx-auto">
            Purchase credits for your Maslow account. 1 credit = 10 minutes of sanctuary.
          </p>
          {userEmail && (
            <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-sm border border-[#E5E0D8]">
              <p className="text-sm text-[#6B7280]">Logged in as <span className="font-semibold text-[#1A1F36]">{userEmail}</span></p>
              <p className="text-sm text-[#6B7280] mt-1">Current balance: <span className="font-bold text-[#C5A059]">{credits} credits</span></p>
            </div>
          )}
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`bg-white rounded-lg p-6 shadow-md border-2 transition-all ${
                pkg.badge === 'BEST VALUE' 
                  ? 'border-[#C5A059] transform scale-105' 
                  : 'border-[#E5E0D8] hover:border-[#C5A059]'
              }`}
            >
              {pkg.badge && (
                <div className={`text-xs font-semibold mb-2 uppercase ${
                  pkg.badge === 'BEST VALUE' ? 'text-[#C5A059]' : 'text-[#6B7280]'
                }`}>
                  {pkg.badge}
                </div>
              )}
              
              <h3 className="text-xl font-bold text-[#1A1F36] mb-2">
                {pkg.name}
              </h3>
              
              <div className="text-3xl font-bold text-[#1A1F36] mb-1">
                ${pkg.price}
              </div>
              
              <div className="text-sm text-[#6B7280] mb-4">
                {pkg.credits} credits • ${(pkg.price / pkg.credits).toFixed(2)}/credit
              </div>
              
              <p className="text-xs text-[#6B7280] mb-6">
                {pkg.description}
              </p>
              
              <BuyCreditsButton
                credits={pkg.credits}
                amount={pkg.price}
                packageName={pkg.name}
                className="w-full bg-[#C5A059] text-white py-3 rounded-lg font-semibold"
              >
                Purchase
              </BuyCreditsButton>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg p-8 shadow-md border border-[#E5E0D8] max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1A1F36] mb-4">How It Works</h2>
          
          <div className="space-y-4 text-[#4A5568]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#C5A059] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#C5A059] font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1F36]">Choose Your Package</h3>
                <p className="text-sm">Select the credit bundle that fits your needs</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#C5A059] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#C5A059] font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1F36]">Complete Payment</h3>
                <p className="text-sm">Secure checkout powered by Stripe</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#C5A059] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#C5A059] font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1F36]">Credits Added Instantly</h3>
                <p className="text-sm">Use credits immediately to book your sanctuary</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E0D8]">
            <h3 className="font-semibold text-[#1A1F36] mb-3">Important Information</h3>
            <ul className="text-sm text-[#6B7280] space-y-2">
              <li>• Credits expire 1 year after purchase</li>
              <li>• 1 credit = 10 minutes in a Maslow suite</li>
              <li>• Credits are non-refundable</li>
              <li>• Credits can be used at any Maslow location</li>
              <li>• Currently in TEST MODE - use card 4242 4242 4242 4242</li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#6B7280] mb-4">
            Questions about purchasing credits?
          </p>
          <a 
            href="mailto:support@maslow.nyc" 
            className="text-[#C5A059] hover:text-[#B39149] font-semibold"
          >
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  );
}
