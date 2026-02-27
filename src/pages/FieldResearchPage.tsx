import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Save,
  MapPin,
  User,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  CheckCircle,
  Loader2,
  BarChart3,
  RotateCcw,
} from 'lucide-react';

// Types
interface FieldResearchData {
  id?: string;
  location: string;
  age_range: string;
  gender: string;
  occupation: string;
  neighborhood: string;
  frequency_need_restroom: string;
  difficulty_finding_restroom: number;
  current_solutions: string[];
  biggest_pain_point: string;
  interest_level: number;
  would_pay: boolean | null;
  price_willing_to_pay: string;
  preferred_features: string[];
  use_case_scenario: string;
  concerns: string;
  additional_feedback: string;
  interview_quality: string;
  notes: string;
  is_complete: boolean;
}

const initialData: FieldResearchData = {
  location: '',
  age_range: '',
  gender: '',
  occupation: '',
  neighborhood: '',
  frequency_need_restroom: '',
  difficulty_finding_restroom: 3,
  current_solutions: [],
  biggest_pain_point: '',
  interest_level: 3,
  would_pay: null,
  price_willing_to_pay: '',
  preferred_features: [],
  use_case_scenario: '',
  concerns: '',
  additional_feedback: '',
  interview_quality: '',
  notes: '',
  is_complete: false,
};

// Touch-friendly button component
const TouchButton = ({
  selected,
  onClick,
  children,
  className = '',
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-[50px] px-4 py-3 rounded-xl text-base font-medium transition-all ${
      selected
        ? 'bg-[#3B5998] text-white shadow-lg'
        : 'bg-white text-[#3B5998] border-2 border-[#3B5998]/20 hover:border-[#3B5998]/50'
    } ${className}`}
  >
    {children}
  </button>
);

// Scale selector for 1-5 ratings
const ScaleSelector = ({
  value,
  onChange,
  labels,
}: {
  value: number;
  onChange: (val: number) => void;
  labels: { low: string; high: string };
}) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm text-[#3B5998]/60">
      <span>{labels.low}</span>
      <span>{labels.high}</span>
    </div>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onChange(num)}
          className={`flex-1 min-h-[50px] rounded-xl text-xl font-bold transition-all ${
            value === num
              ? 'bg-[#3B5998] text-white shadow-lg'
              : 'bg-white text-[#3B5998] border-2 border-[#3B5998]/20'
          }`}
        >
          {num}
        </button>
      ))}
    </div>
  </div>
);

// Multi-select for features/solutions
const MultiSelect = ({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}) => (
  <div className="grid grid-cols-2 gap-2">
    {options.map((opt) => (
      <TouchButton
        key={opt.value}
        selected={selected.includes(opt.value)}
        onClick={() => {
          if (selected.includes(opt.value)) {
            onChange(selected.filter((v) => v !== opt.value));
          } else {
            onChange([...selected, opt.value]);
          }
        }}
        className="text-sm"
      >
        {opt.label}
      </TouchButton>
    ))}
  </div>
);

// Section wrapper component
const Section = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <Card className="shadow-md">
    <CardHeader className="bg-[#3B5998]/5 border-b py-3">
      <CardTitle className="flex items-center gap-2 text-[#3B5998] text-lg">
        <Icon className="w-5 h-5" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 space-y-4">{children}</CardContent>
  </Card>
);

const FieldResearchPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState<FieldResearchData>(initialData);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [responseCount, setResponseCount] = useState(0);

  // Fetch response count
  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('field_research_responses')
        .select('*', { count: 'exact', head: true })
        .eq('is_complete', true);
      setResponseCount(count || 0);
    };
    fetchCount();
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (data.id || Object.values(data).some((v) => v && v !== initialData[v as keyof FieldResearchData])) {
        handleAutoSave();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [data]);

  const handleAutoSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (data.id) {
        await supabase
          .from('field_research_responses')
          .update({ ...data, draft_data: data })
          .eq('id', data.id);
      } else {
        const { data: newData } = await supabase
          .from('field_research_responses')
          .insert({
            ...data,
            interviewer_id: user.id,
            draft_data: data,
            is_complete: false,
          })
          .select()
          .single();
        if (newData) {
          setData((prev) => ({ ...prev, id: newData.id }));
        }
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setSaving(false);
    }
  }, [data, user]);

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const submitData = {
        ...data,
        interviewer_id: user.id,
        is_complete: true,
        draft_data: null,
      };

      if (data.id) {
        await supabase.from('field_research_responses').update(submitData).eq('id', data.id);
      } else {
        await supabase.from('field_research_responses').insert(submitData);
      }

      toast({
        title: 'Interview Saved!',
        description: `Response #${responseCount + 1} recorded.`,
      });

      // Reset form for next interview
      setData(initialData);
      setResponseCount((prev) => prev + 1);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setData(initialData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateField = <K extends keyof FieldResearchData>(field: K, value: FieldResearchData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] pb-32">
      {/* Header */}
      <div className="bg-[#3B5998] py-4 px-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">Field Research</h1>
            <span className="bg-white/20 text-white px-2 py-1 rounded-full text-sm">
              {responseCount}/100
            </span>
          </div>
          <div className="flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 text-white animate-spin" />}
            {lastSaved && (
              <span className="text-white/60 text-xs hidden sm:block">
                {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/research-results')}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Form */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Interview Setup */}
        <Section title="Setup" icon={MapPin}>
          <div>
            <Label className="text-base mb-2 block">Location</Label>
            <Input
              value={data.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g., SoHo - Broadway & Houston"
              className="h-12 text-base"
            />
          </div>
        </Section>

        {/* Demographics */}
        <Section title="Demographics" icon={User}>
          <div>
            <Label className="text-base mb-2 block">Age Range</Label>
            <div className="grid grid-cols-3 gap-2">
              {['18-24', '25-34', '35-44', '45-54', '55-64', '65+'].map((age) => (
                <TouchButton
                  key={age}
                  selected={data.age_range === age}
                  onClick={() => updateField('age_range', age)}
                >
                  {age}
                </TouchButton>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-base mb-2 block">Gender</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'non-binary', label: 'Non-Binary' },
                { value: 'prefer-not-to-say', label: 'Prefer Not to Say' },
              ].map((opt) => (
                <TouchButton
                  key={opt.value}
                  selected={data.gender === opt.value}
                  onClick={() => updateField('gender', opt.value)}
                >
                  {opt.label}
                </TouchButton>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-base mb-2 block">Occupation (Optional)</Label>
            <Input
              value={data.occupation}
              onChange={(e) => updateField('occupation', e.target.value)}
              placeholder="e.g., Marketing Manager"
              className="h-12 text-base"
            />
          </div>
        </Section>

        {/* Problem Validation */}
        <Section title="Problem" icon={HelpCircle}>
          <div>
            <Label className="text-base mb-2 block">How often need a restroom in NYC?</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'rarely', label: 'Rarely' },
              ].map((opt) => (
                <TouchButton
                  key={opt.value}
                  selected={data.frequency_need_restroom === opt.value}
                  onClick={() => updateField('frequency_need_restroom', opt.value)}
                >
                  {opt.label}
                </TouchButton>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-base mb-2 block">How hard to find a clean restroom?</Label>
            <ScaleSelector
              value={data.difficulty_finding_restroom}
              onChange={(val) => updateField('difficulty_finding_restroom', val)}
              labels={{ low: 'Easy', high: 'Hard' }}
            />
          </div>
          <div>
            <Label className="text-base mb-2 block">What do you currently do?</Label>
            <MultiSelect
              options={[
                { value: 'coffee_shops', label: 'Coffee Shops' },
                { value: 'hotels', label: 'Hotels' },
                { value: 'public_restrooms', label: 'Public' },
                { value: 'restaurants', label: 'Restaurants' },
                { value: 'stores', label: 'Stores' },
                { value: 'hold_it', label: 'Hold It' },
              ]}
              selected={data.current_solutions}
              onChange={(val) => updateField('current_solutions', val)}
            />
          </div>
          <div>
            <Label className="text-base mb-2 block">Biggest pain point?</Label>
            <Textarea
              value={data.biggest_pain_point}
              onChange={(e) => updateField('biggest_pain_point', e.target.value)}
              placeholder="What frustrates them most?"
              className="text-base min-h-[80px]"
            />
          </div>
        </Section>

        {/* Solution Interest */}
        <Section title="Solution Interest" icon={Lightbulb}>
          <div className="bg-[#3B5998]/10 p-4 rounded-xl text-sm text-[#3B5998] leading-relaxed">
            "Maslow is a network of private, premium personal care suites in NYC. Clean,
            climate-controlled spaces with premium amenities."
          </div>
          <div>
            <Label className="text-base mb-2 block">Interest Level</Label>
            <ScaleSelector
              value={data.interest_level}
              onChange={(val) => updateField('interest_level', val)}
              labels={{ low: 'Not Interested', high: 'Very Interested' }}
            />
          </div>
          <div>
            <Label className="text-base mb-2 block">Would you pay for this?</Label>
            <div className="grid grid-cols-2 gap-2">
              <TouchButton
                selected={data.would_pay === true}
                onClick={() => updateField('would_pay', true)}
              >
                Yes
              </TouchButton>
              <TouchButton
                selected={data.would_pay === false}
                onClick={() => updateField('would_pay', false)}
              >
                No
              </TouchButton>
            </div>
          </div>
          {data.would_pay && (
            <div>
              <Label className="text-base mb-2 block">How much per visit?</Label>
              <div className="grid grid-cols-4 gap-2">
                {['$3', '$5', '$7', '$10+'].map((price) => (
                  <TouchButton
                    key={price}
                    selected={data.price_willing_to_pay === price}
                    onClick={() => updateField('price_willing_to_pay', price)}
                  >
                    {price}
                  </TouchButton>
                ))}
              </div>
            </div>
          )}
          <div>
            <Label className="text-base mb-2 block">Most important features?</Label>
            <MultiSelect
              options={[
                { value: 'clean', label: 'Clean' },
                { value: 'private', label: 'Private' },
                { value: 'quick', label: 'Quick' },
                { value: 'premium_amenities', label: 'Amenities' },
                { value: 'climate_control', label: 'Climate' },
                { value: 'safe', label: 'Safe' },
              ]}
              selected={data.preferred_features}
              onChange={(val) => updateField('preferred_features', val)}
            />
          </div>
        </Section>

        {/* Additional Insights */}
        <Section title="Additional" icon={MessageSquare}>
          <div>
            <Label className="text-base mb-2 block">When would you use this?</Label>
            <Textarea
              value={data.use_case_scenario}
              onChange={(e) => updateField('use_case_scenario', e.target.value)}
              placeholder="Before meetings, during commute, etc."
              className="text-base min-h-[80px]"
            />
          </div>
          <div>
            <Label className="text-base mb-2 block">Any concerns?</Label>
            <Textarea
              value={data.concerns}
              onChange={(e) => updateField('concerns', e.target.value)}
              placeholder="What would hold them back?"
              className="text-base min-h-[80px]"
            />
          </div>
          <div>
            <Label className="text-base mb-2 block">Additional feedback / quotes</Label>
            <Textarea
              value={data.additional_feedback}
              onChange={(e) => updateField('additional_feedback', e.target.value)}
              placeholder="Memorable quotes or insights..."
              className="text-base min-h-[80px]"
            />
          </div>
          <div>
            <Label className="text-base mb-2 block">Interview Quality</Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'excellent', label: 'Great' },
                { value: 'good', label: 'Good' },
                { value: 'fair', label: 'Fair' },
                { value: 'poor', label: 'Poor' },
              ].map((opt) => (
                <TouchButton
                  key={opt.value}
                  selected={data.interview_quality === opt.value}
                  onClick={() => updateField('interview_quality', opt.value)}
                >
                  {opt.label}
                </TouchButton>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-base mb-2 block">Your Notes (Optional)</Label>
            <Textarea
              value={data.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Any interviewer observations..."
              className="text-base min-h-[60px]"
            />
          </div>
        </Section>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="h-14 px-4"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            onClick={handleAutoSave}
            disabled={saving}
            className="h-14 px-4"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 h-14 text-lg bg-[#C5A059] hover:bg-[#b08d4b] text-white"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Save & Next
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FieldResearchPage;
