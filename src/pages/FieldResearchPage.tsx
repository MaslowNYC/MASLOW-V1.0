import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Send,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  CheckCircle,
  Loader2,
  BarChart3,
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
    className={`min-h-[60px] px-6 py-4 rounded-xl text-lg font-medium transition-all ${
      selected
        ? 'bg-[#3B5998] text-white shadow-lg scale-105'
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
  <div className="space-y-3">
    <div className="flex justify-between text-sm text-[#3B5998]/60">
      <span>{labels.low}</span>
      <span>{labels.high}</span>
    </div>
    <div className="flex gap-3">
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onChange(num)}
          className={`flex-1 min-h-[70px] rounded-xl text-2xl font-bold transition-all ${
            value === num
              ? 'bg-[#3B5998] text-white shadow-lg scale-110'
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
  <div className="grid grid-cols-2 gap-3">
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
        className="text-base"
      >
        {opt.label}
      </TouchButton>
    ))}
  </div>
);

const FieldResearchPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
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
        description: `Response #${responseCount + 1} recorded successfully.`,
      });

      // Reset form for next interview
      setData(initialData);
      setCurrentStep(0);
      setResponseCount((prev) => prev + 1);
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save interview. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = <K extends keyof FieldResearchData>(field: K, value: FieldResearchData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Form sections
  const sections = [
    {
      title: 'Interview Setup',
      icon: MapPin,
      content: (
        <div className="space-y-6">
          <div>
            <Label className="text-lg mb-3 block">Location</Label>
            <Input
              value={data.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g., SoHo - Broadway & Houston"
              className="h-14 text-lg"
            />
          </div>
          <div>
            <Label className="text-lg mb-3 block">Interviewer Notes (Optional)</Label>
            <Input
              value={data.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Quick context about this interview..."
              className="h-14 text-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Demographics',
      icon: User,
      content: (
        <div className="space-y-8">
          <div>
            <Label className="text-lg mb-4 block">Age Range</Label>
            <div className="grid grid-cols-3 gap-3">
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
            <Label className="text-lg mb-4 block">Gender</Label>
            <div className="grid grid-cols-2 gap-3">
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
            <Label className="text-lg mb-3 block">Occupation (Optional)</Label>
            <Input
              value={data.occupation}
              onChange={(e) => updateField('occupation', e.target.value)}
              placeholder="e.g., Marketing Manager"
              className="h-14 text-lg"
            />
          </div>
          <div>
            <Label className="text-lg mb-3 block">Neighborhood (Optional)</Label>
            <Input
              value={data.neighborhood}
              onChange={(e) => updateField('neighborhood', e.target.value)}
              placeholder="Where do they live/work?"
              className="h-14 text-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Problem Validation',
      icon: HelpCircle,
      content: (
        <div className="space-y-8">
          <div>
            <Label className="text-lg mb-4 block">How often do you need a restroom in NYC?</Label>
            <div className="grid grid-cols-2 gap-3">
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
            <Label className="text-lg mb-4 block">
              How hard is it to find a clean restroom in NYC?
            </Label>
            <ScaleSelector
              value={data.difficulty_finding_restroom}
              onChange={(val) => updateField('difficulty_finding_restroom', val)}
              labels={{ low: 'Very Easy', high: 'Very Hard' }}
            />
          </div>
          <div>
            <Label className="text-lg mb-4 block">What do you currently do?</Label>
            <MultiSelect
              options={[
                { value: 'coffee_shops', label: 'Coffee Shops' },
                { value: 'hotels', label: 'Hotel Lobbies' },
                { value: 'public_restrooms', label: 'Public Restrooms' },
                { value: 'restaurants', label: 'Restaurants' },
                { value: 'stores', label: 'Retail Stores' },
                { value: 'hold_it', label: 'Hold It / Wait' },
              ]}
              selected={data.current_solutions}
              onChange={(val) => updateField('current_solutions', val)}
            />
          </div>
          <div>
            <Label className="text-lg mb-3 block">Biggest pain point?</Label>
            <Textarea
              value={data.biggest_pain_point}
              onChange={(e) => updateField('biggest_pain_point', e.target.value)}
              placeholder="What frustrates them most?"
              className="text-lg min-h-[100px]"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Solution Interest',
      icon: Lightbulb,
      content: (
        <div className="space-y-8">
          <div className="bg-[#3B5998]/10 p-6 rounded-xl mb-6">
            <p className="text-[#3B5998] text-lg leading-relaxed">
              "Maslow is a network of private, premium personal care suites in NYC. Each suite
              offers a clean, climate-controlled space with premium amenities for personal
              care needs."
            </p>
          </div>
          <div>
            <Label className="text-lg mb-4 block">Interest Level</Label>
            <ScaleSelector
              value={data.interest_level}
              onChange={(val) => updateField('interest_level', val)}
              labels={{ low: 'Not Interested', high: 'Very Interested' }}
            />
          </div>
          <div>
            <Label className="text-lg mb-4 block">Would you pay for this?</Label>
            <div className="grid grid-cols-2 gap-3">
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
              <Label className="text-lg mb-4 block">How much per visit?</Label>
              <div className="grid grid-cols-4 gap-3">
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
            <Label className="text-lg mb-4 block">Most important features?</Label>
            <MultiSelect
              options={[
                { value: 'clean', label: 'Cleanliness' },
                { value: 'private', label: 'Privacy' },
                { value: 'quick', label: 'Quick Access' },
                { value: 'premium_amenities', label: 'Premium Amenities' },
                { value: 'climate_control', label: 'Climate Control' },
                { value: 'safe', label: 'Safety' },
              ]}
              selected={data.preferred_features}
              onChange={(val) => updateField('preferred_features', val)}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Additional Insights',
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <div>
            <Label className="text-lg mb-3 block">When would you use this most?</Label>
            <Textarea
              value={data.use_case_scenario}
              onChange={(e) => updateField('use_case_scenario', e.target.value)}
              placeholder="What scenario? Before meetings, during commute, etc."
              className="text-lg min-h-[100px]"
            />
          </div>
          <div>
            <Label className="text-lg mb-3 block">Any concerns about this concept?</Label>
            <Textarea
              value={data.concerns}
              onChange={(e) => updateField('concerns', e.target.value)}
              placeholder="What would hold them back?"
              className="text-lg min-h-[100px]"
            />
          </div>
          <div>
            <Label className="text-lg mb-3 block">Additional feedback or quotes</Label>
            <Textarea
              value={data.additional_feedback}
              onChange={(e) => updateField('additional_feedback', e.target.value)}
              placeholder="Any memorable quotes or insights..."
              className="text-lg min-h-[100px]"
            />
          </div>
          <div>
            <Label className="text-lg mb-4 block">Interview Quality</Label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: 'excellent', label: 'Excellent' },
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
        </div>
      ),
    },
  ];

  const currentSection = sections[currentStep];
  const Icon = currentSection.icon;

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <div className="bg-[#3B5998] py-6 px-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Field Research</h1>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
              {responseCount}/100 Interviews
            </span>
          </div>
          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="text-white/60 text-sm">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {saving && <Loader2 className="w-5 h-5 text-white animate-spin" />}
            <Button
              variant="outline"
              onClick={() => navigate('/admin/research-results')}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Results
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-2">
            {sections.map((section, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'bg-[#C5A059]'
                    : idx < currentStep
                    ? 'bg-[#3B5998]'
                    : 'bg-[#3B5998]/20'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-[#3B5998]/60">
            <span>
              Step {currentStep + 1} of {sections.length}
            </span>
            <span>{currentSection.title}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="bg-[#3B5998]/5 border-b">
              <CardTitle className="flex items-center gap-3 text-[#3B5998]">
                <Icon className="w-6 h-6" />
                {currentSection.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">{currentSection.content}</CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 0}
            className="h-14 px-8 text-lg"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <Button
            variant="outline"
            onClick={handleAutoSave}
            disabled={saving}
            className="h-14 px-6"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span className="ml-2">Save Draft</span>
          </Button>

          {currentStep < sections.length - 1 ? (
            <Button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="h-14 px-8 text-lg bg-[#3B5998] hover:bg-[#2d4a7c]"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="h-14 px-8 text-lg bg-[#C5A059] hover:bg-[#b08d4b] text-white"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Interview
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldResearchPage;
