import { BuyCreditsButton } from '@/components/BuyCreditsButton';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price_cents: number;
  is_active: boolean;
}

const BASE_PRICE_CENTS = 500; // $5 per credit — used to compute discount %

export default function BuyCreditsPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    loadUserData();
    fetchPackages();
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

  const fetchPackages = async () => {
    const { data, error } = await (supabase
      .from('credit_packages') as any)
      .select('id, name, credits, price_cents, is_active')
      .eq('is_active', true)
      .order('credits');

    if (data) setPackages(data);
    if (error) console.error('Error fetching packages:', error);
    setLoadingPackages(false);
  };

  const getDiscount = (pkg: CreditPackage) => {
    if (pkg.credits <= 1) return 0;
    return Math.round((1 - (pkg.price_cents / pkg.credits) / BASE_PRICE_CENTS) * 100);
  };

  const getBadge = (pkg: CreditPackage, allPkgs: CreditPackage[]) => {
    const discount = getDiscount(pkg);
    if (discount <= 0) return null;
    // Largest pack gets "BEST VALUE"
    const maxCredits = Math.max(...allPkgs.map(p => p.credits));
    if (pkg.credits === maxCredits) return 'BEST VALUE';
    return `${discount}% off`;
  };

  return (
    <div className="min-h-screen bg-[#FAF4ED] py-12">
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
              <p className="text-sm text-[#6B7280] mt-1">Current balance: <span className="font-bold text-[#D4AF6A]">{credits} credits</span></p>
            </div>
          )}
        </div>

        {/* Pricing Grid */}
        {loadingPackages ? (
          <div className="text-center py-12 text-[#6B7280]">Loading packages…</div>
        ) : (
        <div className={`grid gap-6 mb-12 ${packages.length <= 3 ? 'md:grid-cols-3' : packages.length <= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3 lg:grid-cols-5'}`}>
          {packages.map((pkg) => {
            const badge = getBadge(pkg, packages);
            const price = pkg.price_cents / 100;
            const perCredit = (pkg.price_cents / pkg.credits / 100).toFixed(2);

            return (
            <div
              key={pkg.id}
              className={`bg-white rounded-lg p-6 shadow-md border-2 transition-all ${
                badge === 'BEST VALUE'
                  ? 'border-[#D4AF6A] transform scale-105'
                  : 'border-[#E5E0D8] hover:border-[#D4AF6A]'
              }`}
            >
              {badge && (
                <div className={`text-xs font-semibold mb-2 uppercase ${
                  badge === 'BEST VALUE' ? 'text-[#D4AF6A]' : 'text-[#6B7280]'
                }`}>
                  {badge}
                </div>
              )}

              <h3 className="text-xl font-bold text-[#1A1F36] mb-2">
                {pkg.name}
              </h3>

              <div className="text-3xl font-bold text-[#1A1F36] mb-1">
                ${price}
              </div>

              <div className="text-sm text-[#6B7280] mb-4">
                {pkg.credits} credit{pkg.credits > 1 ? 's' : ''} • ${perCredit}/credit
              </div>

              <BuyCreditsButton
                credits={pkg.credits}
                amount={price}
                packageName={pkg.name}
                className="w-full bg-[#D4AF6A] text-white py-3 rounded-lg font-semibold"
              >
                Purchase
              </BuyCreditsButton>
            </div>
            );
          })}
        </div>
        )}

        {/* Info Section */}
        <div className="bg-white rounded-lg p-8 shadow-md border border-[#E5E0D8] max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1A1F36] mb-4">How It Works</h2>
          
          <div className="space-y-4 text-[#4A5568]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#D4AF6A] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#D4AF6A] font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1F36]">Choose Your Package</h3>
                <p className="text-sm">Select the credit bundle that fits your needs</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#D4AF6A] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#D4AF6A] font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1F36]">Complete Payment</h3>
                <p className="text-sm">Secure checkout powered by Stripe</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#D4AF6A] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#D4AF6A] font-bold">3</span>
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
            className="text-[#D4AF6A] hover:text-[#B39149] font-semibold"
          >
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  );
}
