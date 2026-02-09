import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FinalCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-[#0F172A] text-white text-center px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-3xl md:text-5xl font-serif">
          Join the Infrastructure.
        </h2>
        <p className="text-[#94A3B8] text-lg font-light">
          Secure your spot on the waitlist for Phase 1 access.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => navigate('/login?mode=signup')}
            className="bg-[#C5A059] hover:bg-[#b08d4b] text-[#0F172A] font-bold py-6 px-10 text-lg rounded-none"
          >
            Get Access <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
