import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Check, Sparkles, Droplets, Coffee } from 'lucide-react';
import type { SessionType } from './SessionsSection';

interface Sample {
  id: number;
  brand: string;
  product_name: string;
  category: string;
  price_per_extra: string;
  is_available: boolean;
}

interface SamplePickerProps {
  sessionType: SessionType;
  onConfirm: (selectedIds: number[]) => void;
}

const categoryIcons: Record<string, typeof Sparkles> = {
  skincare: Sparkles,
  hygiene: Droplets,
  beverage: Coffee,
};

const SamplePicker = ({ sessionType, onConfirm }: SamplePickerProps) => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const { data, error } = await (supabase
          .from('samples') as any)
          .select('*')
          .eq('is_available', true)
          .order('category');

        if (error) throw error;
        setSamples(data || []);
      } catch (err) {
        console.error('Error fetching samples:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  const toggleSample = (id: number) => {
    if (selectedIds.includes(id)) {
      // Deselect
      setSelectedIds(selectedIds.filter(s => s !== id));
    } else {
      // Select if under limit
      if (selectedIds.length < sessionType.sample_limit) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleContinue = () => {
    onConfirm(selectedIds);
  };

  const handleSkip = () => {
    onConfirm([]);
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 mx-auto rounded" style={{ background: 'rgba(42,39,36,0.1)' }} />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 rounded" style={{ background: 'rgba(42,39,36,0.05)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <p
          className="text-sm uppercase tracking-[0.3em] mb-2"
          style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
        >
          Enhance Your Visit
        </p>
        <p
          className="text-sm"
          style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)', opacity: 0.6 }}
        >
          Add up to {sessionType.sample_limit} samples to your suite. Each $2.
        </p>
        <p
          className="text-xs mt-2"
          style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)', opacity: 0.4 }}
        >
          {selectedIds.length} of {sessionType.sample_limit} selected
        </p>
      </div>

      {/* Sample grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {samples.map(sample => {
          const isSelected = selectedIds.includes(sample.id);
          const CategoryIcon = categoryIcons[sample.category] || Droplets;

          return (
            <button
              key={sample.id}
              onClick={() => toggleSample(sample.id)}
              className="relative p-4 text-left transition-all duration-200"
              style={{
                background: isSelected ? 'rgba(196,159,88,0.06)' : 'white',
                border: isSelected ? '2px solid var(--gold)' : '1px solid rgba(42,39,36,0.15)',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(42,39,36,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(42,39,36,0.15)';
                }
              }}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                </div>
              )}

              {/* Brand + price row */}
              <div className="flex justify-between items-start mb-1">
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
                >
                  {sample.brand}
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--charcoal)', fontFamily: 'var(--sans)', opacity: 0.5 }}
                >
                  $2
                </span>
              </div>

              {/* Product name */}
              <p
                className="text-lg mb-2"
                style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}
              >
                {sample.product_name}
              </p>

              {/* Category pill */}
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full"
                  style={{
                    background: 'rgba(74,92,58,0.1)',
                    color: 'var(--moss)',
                    fontFamily: 'var(--sans)',
                  }}
                >
                  <CategoryIcon className="w-3 h-3" />
                  {sample.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleSkip}
          className="py-3 px-6 transition-opacity hover:opacity-70"
          style={{
            color: 'var(--charcoal)',
            fontFamily: 'var(--sans)',
            opacity: 0.5,
            background: 'transparent',
            border: 'none',
          }}
        >
          Skip
        </button>
        <button
          onClick={handleContinue}
          className="py-3 px-8 uppercase tracking-wider transition-opacity hover:opacity-90"
          style={{
            background: 'var(--gold)',
            color: 'var(--charcoal)',
            fontFamily: 'var(--sans)',
            borderRadius: '2px',
          }}
        >
          {selectedIds.length > 0
            ? `Continue with ${selectedIds.length} sample${selectedIds.length > 1 ? 's' : ''}`
            : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default SamplePicker;
