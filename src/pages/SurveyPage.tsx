import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { researchSupabaseClient as supabase } from '@/lib/researchSupabaseClient';

// Generate promo code client-side
function generatePromoCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'MASLOW-' + Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map(b => chars[b % chars.length])
    .join('');
}

// Types for form data
interface SurveyData {
  // Section 1: Water & Hygiene
  public_restroom_feeling: string;
  uses_water_for_cleaning: string;
  would_try_sprayer: string;
  carries_own_vessel: string | null;
  would_use_bidet_sprayer: string | null;
  prefers_toilet_paper: boolean;
  prefers_water_only: boolean;
  prefers_both: boolean;
  // Section 2: Faith & Ritual
  has_faith_based_washing: string | null;
  needs_running_water_for_prayer: string | null;
  daily_washing_frequency: string;
  faith_background_broad: string;
  specific_practice_notes: string;
  // Section 3: Privacy
  sound_privacy_importance: number | null;
  visual_privacy_importance: number | null;
  brings_child_or_family: string | null;
  needs_gender_neutral: string | null;
  other_privacy_notes: string;
  // Section 4: Time
  typical_duration: string;
  has_practice_needing_more_time: string | null;
  more_time_reason: string;
  // Section 5: Products & Scent
  avoids_alcohol: boolean;
  avoids_pork_derivatives: boolean;
  avoids_fragrance: boolean;
  avoids_none: boolean;
  avoids_other: string;
  product_source_preference: string;
  scent_preference: string;
  // Section 6: Signage & Language
  preferred_language: string;
  prefers_icons_over_text: string | null;
  has_struggled_with_signage: string | null;
  signage_notes: string;
  // Section 7: Cultural Background
  region_broad: string;
  years_in_nyc: string;
  neighborhood_zip: string;
  one_thing_wrong: string;
  one_thing_right: string;
  willingness_to_pay: string;
  discovery_channel: string;
  discovery_channel_other: string;
  faith_background_other: string;
  // Section 8: Accessibility Needs
  needs_wheelchair_access: boolean;
  needs_mobility_support: boolean;
  needs_visual_assistance: boolean;
  needs_hearing_assistance: boolean;
  needs_sensory_friendly: boolean;
  has_service_animal: boolean;
  other_accessibility_notes: string;
}

const initialData: SurveyData = {
  public_restroom_feeling: '',
  uses_water_for_cleaning: '',
  would_try_sprayer: '',
  carries_own_vessel: null,
  would_use_bidet_sprayer: null,
  prefers_toilet_paper: false,
  prefers_water_only: false,
  prefers_both: false,
  has_faith_based_washing: null,
  needs_running_water_for_prayer: null,
  daily_washing_frequency: '',
  faith_background_broad: '',
  specific_practice_notes: '',
  sound_privacy_importance: null,
  visual_privacy_importance: null,
  brings_child_or_family: null,
  needs_gender_neutral: null,
  other_privacy_notes: '',
  typical_duration: '',
  has_practice_needing_more_time: null,
  more_time_reason: '',
  avoids_alcohol: false,
  avoids_pork_derivatives: false,
  avoids_fragrance: false,
  avoids_none: false,
  avoids_other: '',
  product_source_preference: '',
  scent_preference: '',
  preferred_language: '',
  prefers_icons_over_text: null,
  has_struggled_with_signage: null,
  signage_notes: '',
  region_broad: '',
  years_in_nyc: '',
  neighborhood_zip: '',
  one_thing_wrong: '',
  one_thing_right: '',
  willingness_to_pay: '',
  discovery_channel: '',
  discovery_channel_other: '',
  faith_background_other: '',
  needs_wheelchair_access: false,
  needs_mobility_support: false,
  needs_visual_assistance: false,
  needs_hearing_assistance: false,
  needs_sensory_friendly: false,
  has_service_animal: false,
  other_accessibility_notes: '',
};

export default function SurveyPage() {
  const [currentSection, setCurrentSection] = useState(1);
  const [data, setData] = useState<SurveyData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate session token once on mount
  const sessionToken = useMemo(() => crypto.randomUUID(), []);

  const totalSections = 8;

  const updateField = <K extends keyof SurveyData>(field: K, value: SurveyData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Handle "avoids_none" deselecting other avoidances
  const handleAvoidsNone = (checked: boolean) => {
    if (checked) {
      setData(prev => ({
        ...prev,
        avoids_none: true,
        avoids_alcohol: false,
        avoids_pork_derivatives: false,
        avoids_fragrance: false,
      }));
    } else {
      updateField('avoids_none', false);
    }
  };

  const handleAvoidanceChange = (field: 'avoids_alcohol' | 'avoids_pork_derivatives' | 'avoids_fragrance', checked: boolean) => {
    setData(prev => ({
      ...prev,
      [field]: checked,
      avoids_none: false,
    }));
  };

  const canProceed = () => {
    // Section 1 requires first two questions answered
    if (currentSection === 1) {
      return data.public_restroom_feeling !== '' && data.uses_water_for_cleaning !== '';
    }
    return true;
  };

  // Check if user is on the water path (deeper questions)
  const isWaterUser = data.uses_water_for_cleaning === 'Yes, always' || data.uses_water_for_cleaning === 'Sometimes';

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Check if this device already submitted (one-per-device enforcement)
      const alreadySubmitted = localStorage.getItem('maslow_survey_submitted') === 'true';

      // Check promo code cap (max 500)
      let promoCapReached = false;
      if (!alreadySubmitted) {
        const { count, error: countError } = await supabase
          .from('promo_codes')
          .select('*', { count: 'exact', head: true });
        if (!countError && count !== null && count >= 500) {
          promoCapReached = true;
        }
      }

      // Only generate promo code if eligible
      const shouldGeneratePromo = !alreadySubmitted && !promoCapReached;
      const code = shouldGeneratePromo ? generatePromoCode() : null;

      // 1. Insert main survey response
      const discoveryValue = data.discovery_channel === 'Other'
        ? (data.discovery_channel_other?.trim() ? `Other: ${data.discovery_channel_other.trim()}` : 'Other')
        : data.discovery_channel || null;

      const { data: responseData, error: responseError } = await supabase
        .from('survey_responses')
        .insert({
          session_token: sessionToken,
          input_method: 'web',
          public_restroom_feeling: data.public_restroom_feeling || null,
          uses_water_for_cleaning: data.uses_water_for_cleaning || null,
          would_try_sprayer: data.would_try_sprayer || null,
          willingness_to_pay: data.willingness_to_pay || null,
          discovery_channel: discoveryValue,
        })
        .select('id')
        .single();

      if (responseError) throw responseError;
      const responseId = responseData.id;

      // 2. Insert section data in parallel (with error logging per table)
      await Promise.all([
        // Water & Hygiene
        supabase.from('water_hygiene').insert({
          response_id: responseId,
          public_restroom_feeling: data.public_restroom_feeling || null,
          uses_water_for_cleaning: data.uses_water_for_cleaning || null,
          would_try_sprayer: data.would_try_sprayer || null,
          carries_own_vessel: data.carries_own_vessel || null,
          would_use_bidet_sprayer: data.would_use_bidet_sprayer || null,
          prefers_toilet_paper: data.prefers_toilet_paper,
          prefers_water_only: data.prefers_water_only,
          prefers_both: data.prefers_both,
        }).then(({ error }) => {
          if (error) console.error('water_hygiene insert failed:', error);
        }),
        // Ritual Practice
        supabase.from('ritual_practice').insert({
          response_id: responseId,
          has_faith_based_washing: data.has_faith_based_washing || null,
          needs_running_water_for_prayer: (data.has_faith_based_washing === 'Yes' || data.has_faith_based_washing === 'Sometimes') ? data.needs_running_water_for_prayer : null,
          daily_washing_frequency: data.daily_washing_frequency || null,
          faith_background_broad: data.faith_background_broad === 'Other'
            ? (data.faith_background_other?.trim() ? `Other: ${data.faith_background_other.trim()}` : 'Other')
            : (data.faith_background_broad || null),
          specific_practice_notes: data.specific_practice_notes || null,
        }).then(({ error }) => {
          if (error) console.error('ritual_practice insert failed:', error);
        }),
        // Privacy Needs
        supabase.from('privacy_needs').insert({
          response_id: responseId,
          sound_privacy_importance: data.sound_privacy_importance,
          visual_privacy_importance: data.visual_privacy_importance,
          brings_child_or_family: data.brings_child_or_family,
          needs_gender_neutral: data.needs_gender_neutral,
          other_privacy_notes: data.other_privacy_notes || null,
        }).then(({ error }) => {
          if (error) console.error('privacy_needs insert failed:', error);
        }),
        // Time Duration
        supabase.from('time_duration').insert({
          response_id: responseId,
          typical_duration: data.typical_duration || null,
          has_practice_needing_more_time: data.has_practice_needing_more_time || null,
          more_time_reason: (data.has_practice_needing_more_time === 'Yes' || data.has_practice_needing_more_time === 'Sometimes') ? (data.more_time_reason || null) : null,
        }).then(({ error }) => {
          if (error) console.error('time_duration insert failed:', error);
        }),
        // Product Preferences
        supabase.from('product_preferences').insert({
          response_id: responseId,
          avoids_alcohol: data.avoids_alcohol,
          avoids_pork_derivatives: data.avoids_pork_derivatives,
          avoids_fragrance: data.avoids_fragrance,
          avoids_none: data.avoids_none,
          avoids_other: data.avoids_other || null,
          prefers_own_products: data.product_source_preference === 'own',
          prefers_provided_products: data.product_source_preference === 'provided',
          scent_preference: data.scent_preference || null,
        }).then(({ error }) => {
          if (error) console.error('product_preferences insert failed:', error);
        }),
        // Signage & Language
        supabase.from('signage_language').insert({
          response_id: responseId,
          preferred_language: (data.preferred_language || '').trim() || null,
          prefers_icons_over_text: data.prefers_icons_over_text,
          has_struggled_with_signage: data.has_struggled_with_signage,
          signage_notes: data.signage_notes || null,
        }).then(({ error }) => {
          if (error) console.error('signage_language insert failed:', error);
        }),
        // Cultural Background
        supabase.from('cultural_background').insert({
          response_id: responseId,
          region_broad: data.region_broad || null,
          years_in_nyc: ({ 'Less than 1 year': '<1', '1-5 years': '1-5', '5-10 years': '5-10', '10+ years': '10+', 'Born here': 'born here' } as Record<string, string>)[data.years_in_nyc] || null,
          one_thing_wrong: data.one_thing_wrong || null,
          one_thing_right: data.one_thing_right || null,
        }).then(({ error }) => {
          if (error) console.error('cultural_background insert failed:', error);
        }),
        // Accessibility Needs
        supabase.from('accessibility_needs').insert({
          response_id: responseId,
          needs_wheelchair_access: data.needs_wheelchair_access,
          needs_mobility_support: data.needs_mobility_support,
          needs_visual_assistance: data.needs_visual_assistance,
          needs_hearing_assistance: data.needs_hearing_assistance,
          needs_sensory_friendly: data.needs_sensory_friendly,
          has_service_animal: data.has_service_animal,
          other_accessibility_notes: data.other_accessibility_notes || null,
        }).then(({ error }) => {
          if (error) console.error('accessibility_needs insert failed:', error);
        }),
      ]);

      // Insert promo code only if eligible
      if (code) {
        await supabase.from('promo_codes').insert({
          response_id: responseId,
          stripe_promo_code: code,
          source: 'survey',
        });
        // Mark device as having submitted
        localStorage.setItem('maslow_survey_submitted', 'true');
        setPromoCode(code);
      }

      // Notify founder of new survey submission
      console.log('[Survey] About to call notify-founder...');
      try {
        const notifyResult = await supabase.functions.invoke('notify-founder', {
          body: {
            type: 'survey_response',
            message: 'New Unseen Standards survey response submitted',
            data: { location: data.neighborhood_zip || 'unknown' }
          }
        });
        console.log('[Survey] notify-founder completed:', notifyResult);
      } catch (notifyErr) {
        console.error('[Survey] notify-founder failed:', notifyErr);
      }

      setIsComplete(true);
    } catch (err: any) {
      console.error('Survey submit error:', err);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = promoCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Thank you screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#D4AF6A]/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#D4AF6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-serif text-[#1C2B3A] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Thank you.
          </h1>
          <p className="text-[#1C2B3A]/70 mb-8" style={{ fontFamily: "'Jost', sans-serif" }}>
            You're helping build something the city actually needs.
          </p>

          {promoCode ? (
            <>
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-[#1C2B3A]/10">
                <p className="text-sm text-[#1C2B3A]/60 mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>
                  Your free pass code:
                </p>
                <p className="text-2xl font-mono tracking-wider text-[#1C2B3A] mb-4">
                  {promoCode}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="w-full py-3 px-4 rounded-lg border-2 border-[#D4AF6A] text-[#D4AF6A] font-medium transition-all hover:bg-[#D4AF6A] hover:text-white"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <p className="text-sm text-[#1C2B3A]/60 mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>
                Valid for one free Quick Stop (10 min) when Maslow opens in SoHo.
              </p>
            </>
          ) : null}

          <p className="text-sm text-[#1C2B3A]/60 mb-8" style={{ fontFamily: "'Jost', sans-serif" }}>
            Follow us for opening updates: <a href="https://www.instagram.com/maslow.nyc" target="_blank" rel="noopener noreferrer" className="text-[#D4AF6A] hover:underline">@maslow.nyc</a>
          </p>

          <div className="border-t border-[#1C2B3A]/10 pt-8">
            <p className="text-sm text-[#1C2B3A]/60 mb-4" style={{ fontFamily: "'Jost', sans-serif" }}>
              Want to be first through the door?
            </p>
            <Link
              to="/signup"
              className="inline-block py-3 px-6 rounded-lg bg-[#1C2B3A] text-white font-medium transition-all hover:bg-[#1C2B3A]/90"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Create a free Maslow account &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] overflow-x-hidden w-full max-w-full">
      {/* Header - full on Section 1, minimal on 2-7 */}
      {currentSection === 1 && (
        <header className="pt-4 pb-3 px-4 text-center border-b border-[#1C2B3A]/10 overflow-hidden">
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 'bold', letterSpacing: '5px', color: '#1B3A6B' }}>
            MASLOW
          </div>
          <h1 className="text-xl font-serif text-[#1C2B3A] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Unseen Standards
          </h1>
          <p className="text-[#1C2B3A]/70 text-xs max-w-xs mx-auto" style={{ fontFamily: "'Jost', sans-serif" }}>
            Help us build a restroom that actually works for you. ~2 min, anonymous.
          </p>
          <p className="text-[#1C2B3A]/50 text-xs max-w-xs mx-auto mt-1" style={{ fontFamily: "'Jost', sans-serif" }}>
            There are no wrong answers. Faith, ritual, body, practice — all of it is welcome here.
          </p>
        </header>
      )}

      {/* Progress Bar */}
      <div className={`px-4 bg-white border-b border-[#1C2B3A]/10 ${currentSection === 1 ? 'py-1.5' : 'py-2'}`}>
        <div className="max-w-md mx-auto flex items-center gap-3">
          <span className="text-xs text-[#1C2B3A]/60 whitespace-nowrap" style={{ fontFamily: "'Jost', sans-serif" }}>
            {currentSection} / {totalSections}
          </span>
          <div className="flex-1 h-1.5 bg-[#1C2B3A]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D4AF6A] transition-all duration-300"
              style={{ width: `${(currentSection / totalSections) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <main className="max-w-md mx-auto px-5 py-6 overflow-x-hidden">
        {/* Section 1: Water & Hygiene */}
        {currentSection === 1 && (
          <section>
            <h2 className="text-2xl font-serif text-[#1C2B3A] mb-4 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              How do you prefer to clean up?
            </h2>

            <div className="space-y-5">
              {/* Q1: Public restroom feeling */}
              <RadioGroup
                label="How do you feel about NYC public restrooms? *"
                options={[
                  'I avoid them if I can',
                  "I use them but they're never good enough",
                  "They're fine, I don't think about it",
                  'I hold it until I get home'
                ]}
                value={data.public_restroom_feeling}
                onChange={(v) => updateField('public_restroom_feeling', v)}
                grid
              />

              {/* Q2: Water use */}
              <RadioGroup
                label="Do you use water to clean up, not just to wash your hands? *"
                options={[
                  'Yes, always',
                  'Sometimes',
                  'No, just toilet paper',
                  'Prefer not to say'
                ]}
                value={data.uses_water_for_cleaning}
                onChange={(v) => updateField('uses_water_for_cleaning', v)}
                grid
              />

              {/* Water user path: deeper questions */}
              {isWaterUser && (
                <>
                  <YesNoSometimesToggle
                    label="Do you carry your own water vessel when away from home?"
                    value={data.carries_own_vessel}
                    onChange={(v) => updateField('carries_own_vessel', v)}
                  />
                  <YesNoSometimesToggle
                    label="Would you use a water sprayer (bidet) if one was available?"
                    value={data.would_use_bidet_sprayer}
                    onChange={(v) => updateField('would_use_bidet_sprayer', v)}
                  />

                  <div>
                    <p className="text-sm text-[#1C2B3A] underline mb-3" style={{ fontFamily: "'Jost', sans-serif" }}>
                      What do you prefer to use? (select all that apply)
                    </p>
                    <div className="flex gap-2">
                      <Checkbox
                        label="Toilet paper"
                        checked={data.prefers_toilet_paper}
                        onChange={(v) => updateField('prefers_toilet_paper', v)}
                      />
                      <Checkbox
                        label="Water only"
                        checked={data.prefers_water_only}
                        onChange={(v) => updateField('prefers_water_only', v)}
                      />
                      <Checkbox
                        label="Both"
                        checked={data.prefers_both}
                        onChange={(v) => updateField('prefers_both', v)}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Non-water user path: simpler sprayer question */}
              {(data.uses_water_for_cleaning === 'No, just toilet paper' || data.uses_water_for_cleaning === 'Prefer not to say') && (
                <RadioGroup
                  label="If a private restroom had a hand-held water sprayer (like a bidet) available next to the toilet — would you try it?"
                  options={[
                    "Yes, I'm curious",
                    'Maybe, if it was clean and easy to use',
                    'Probably not',
                    'No'
                  ]}
                  value={data.would_try_sprayer}
                  onChange={(v) => updateField('would_try_sprayer', v)}
                  grid
                />
              )}
            </div>
          </section>
        )}

        {/* Section 2: Faith & Ritual */}
        {currentSection === 2 && (
          <section>
            <h2 className="text-2xl font-serif text-[#1C2B3A] mb-4 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Faith & Ritual
            </h2>

            <div className="space-y-5">
              <YesNoSometimesToggle
                label="Does your faith or background include ritual washing?"
                value={data.has_faith_based_washing}
                onChange={(v) => updateField('has_faith_based_washing', v)}
              />

              {(data.has_faith_based_washing === 'Yes' || data.has_faith_based_washing === 'Sometimes') && (
                <YesNoSometimesToggle
                  label="Do you need running water specifically for prayer?"
                  value={data.needs_running_water_for_prayer}
                  onChange={(v) => updateField('needs_running_water_for_prayer', v)}
                />
              )}

              <RadioGroup
                label="How many times per day?"
                options={['1', '2', '3', '4', '5+']}
                value={data.daily_washing_frequency}
                onChange={(v) => updateField('daily_washing_frequency', v)}
              />

              <SelectDropdown
                label="Faith background (optional)"
                options={['Islam', 'Christianity', 'Judaism', 'Hinduism', 'Sikhism', 'Buddhism', 'None', 'Prefer not to say', 'Other']}
                value={data.faith_background_broad}
                onChange={(v) => { updateField('faith_background_broad', v); if (v !== 'Other') updateField('faith_background_other', ''); }}
                placeholder="Select if you'd like to share"
              />

              {data.faith_background_broad === 'Other' && (
                <TextInput
                  label="Please specify (optional)"
                  value={data.faith_background_other}
                  onChange={(v) => updateField('faith_background_other', v)}
                  placeholder="e.g., Zoroastrianism, Bahá'í, etc."
                />
              )}

              <Textarea
                label="Anything most NYC restrooms don't have that your background requires? (optional)"
                placeholder="e.g., a lota shelf, left-side placement for toilet paper, running water for wudhu, an adult-sized changing surface..."
                value={data.specific_practice_notes}
                onChange={(v) => updateField('specific_practice_notes', v)}
              />
            </div>
          </section>
        )}

        {/* Section 3: Privacy */}
        {currentSection === 3 && (
          <section>
            <h2 className="text-2xl font-serif text-[#1C2B3A] mb-4 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Privacy
            </h2>

            <div className="space-y-5">
              <ScaleInput
                label="How important is sound privacy?"
                sublabel="1 = not important, 5 = essential"
                value={data.sound_privacy_importance}
                onChange={(v) => updateField('sound_privacy_importance', v)}
              />

              <ScaleInput
                label="How important is visual privacy?"
                sublabel="1 = not important, 5 = essential"
                value={data.visual_privacy_importance}
                onChange={(v) => updateField('visual_privacy_importance', v)}
              />

              <YesNoSometimesToggle
                label="Do you typically bring a child or family member who needs assistance?"
                value={data.brings_child_or_family}
                onChange={(v) => updateField('brings_child_or_family', v)}
              />

              <YesNoSometimesToggle
                label="Is gender-neutral access important to you?"
                value={data.needs_gender_neutral}
                onChange={(v) => updateField('needs_gender_neutral', v)}
              />

              <Textarea
                label="Anything else? (optional)"
                value={data.other_privacy_notes}
                onChange={(v) => updateField('other_privacy_notes', v)}
              />
            </div>
          </section>
        )}

        {/* Section 4: Time */}
        {currentSection === 4 && (
          <section>
            <h2 className="text-2xl font-serif text-[#1C2B3A] mb-4 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Time
            </h2>

            <div className="space-y-5">
              <RadioGroup
                label="Typical duration"
                options={['Under 5 min', '5-15 min', '15-30 min', '30 min+']}
                value={data.typical_duration}
                onChange={(v) => updateField('typical_duration', v)}
                vertical
              />

              <YesNoSometimesToggle
                label="Does your routine take longer than most restrooms allow?"
                value={data.has_practice_needing_more_time}
                onChange={(v) => updateField('has_practice_needing_more_time', v)}
              />

              {(data.has_practice_needing_more_time === 'Yes' || data.has_practice_needing_more_time === 'Sometimes') && (
                <Textarea
                  label="What requires the extra time? (optional)"
                  placeholder="e.g., full wudhu, ostomy care, gender-affirming prep, post-intimacy cleanup, a ritual that requires stillness..."
                  value={data.more_time_reason}
                  onChange={(v) => updateField('more_time_reason', v)}
                />
              )}
            </div>
          </section>
        )}

        {/* Section 5: Products & Scent */}
        {currentSection === 5 && (
          <section>
            <h2 className="text-2xl font-serif text-[#1C2B3A] mb-4 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Products & Scent
            </h2>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-[#1C2B3A] underline mb-3" style={{ fontFamily: "'Jost', sans-serif" }}>
                  I avoid products containing: (select all that apply)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Checkbox
                    label="Alcohol"
                    checked={data.avoids_alcohol}
                    onChange={(v) => handleAvoidanceChange('avoids_alcohol', v)}
                  />
                  <Checkbox
                    label="Pork-derived ingredients"
                    checked={data.avoids_pork_derivatives}
                    onChange={(v) => handleAvoidanceChange('avoids_pork_derivatives', v)}
                  />
                  <Checkbox
                    label="Fragrance or artificial scent"
                    checked={data.avoids_fragrance}
                    onChange={(v) => handleAvoidanceChange('avoids_fragrance', v)}
                  />
                  <Checkbox
                    label="No restrictions"
                    checked={data.avoids_none}
                    onChange={handleAvoidsNone}
                  />
                </div>
              </div>

              <TextInput
                label="Other (optional)"
                value={data.avoids_other}
                onChange={(v) => updateField('avoids_other', v)}
                placeholder="Any other ingredients you avoid"
              />

              <RadioGroup
                label="Product preference"
                options={['I prefer to bring my own', "I'll use what's provided if quality is good"]}
                value={data.product_source_preference}
                onChange={(v) => updateField('product_source_preference', v)}
              />

              <RadioGroup
                label="Scent preference"
                options={['No scent', 'Light natural', 'Moderate', 'Strong', 'No preference']}
                value={data.scent_preference}
                onChange={(v) => updateField('scent_preference', v)}
                grid
              />
            </div>
          </section>
        )}

        {/* Section 6: Signage & Language */}
        {currentSection === 6 && (
          <section>
            <h2 className="text-2xl font-serif text-[#1C2B3A] mb-4 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Signage & Language
            </h2>

            <div className="space-y-5">
              <SelectDropdown
                label="Preferred language for instructions?"
                options={[
                  'English',
                  'Spanish',
                  'Mandarin Chinese',
                  'Cantonese',
                  'Bengali',
                  'Hindi',
                  'Urdu',
                  'Arabic',
                  'Russian',
                  'Korean',
                  'Haitian Creole',
                  'French',
                  'Yiddish',
                  'Polish',
                  'Tagalog',
                  'Other'
                ]}
                value={data.preferred_language}
                onChange={(v) => updateField('preferred_language', v)}
                placeholder="Select language"
              />

              <YesNoSometimesToggle
                label="Do you prefer icons instead of written text?"
                value={data.prefers_icons_over_text}
                onChange={(v) => updateField('prefers_icons_over_text', v)}
              />

              <YesNoSometimesToggle
                label="Have you had trouble with unclear restroom signs?"
                value={data.has_struggled_with_signage}
                onChange={(v) => updateField('has_struggled_with_signage', v)}
              />

              <Textarea
                label="Anything else? (optional)"
                value={data.signage_notes}
                onChange={(v) => updateField('signage_notes', v)}
              />
            </div>
          </section>
        )}

        {/* Section 7: Background */}
        {currentSection === 7 && (
          <section>
            <h2 className="text-2xl font-serif text-[#1C2B3A] mb-4 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              A little about you
            </h2>

            <div className="space-y-5">
              <SelectDropdown
                label="Region of origin or heritage"
                options={[
                  'South Asia',
                  'East Asia',
                  'Southeast Asia',
                  'Middle East / MENA',
                  'Sub-Saharan Africa',
                  'Latin America',
                  'Eastern Europe',
                  'Western Europe',
                  'North America',
                  'Other',
                  'Prefer not to say'
                ]}
                value={data.region_broad}
                onChange={(v) => updateField('region_broad', v)}
                placeholder="Select region"
              />

              <SelectDropdown
                label="How long have you been in NYC?"
                options={['Less than 1 year', '1-5 years', '5-10 years', '10+ years', 'Born here']}
                value={data.years_in_nyc}
                onChange={(v) => updateField('years_in_nyc', v)}
                placeholder="Select duration"
              />

              <TextInput
                label="What neighborhood are you usually in during the day? (zip code is fine)"
                value={data.neighborhood_zip}
                onChange={(v) => updateField('neighborhood_zip', v)}
                placeholder="e.g., 10012 or SoHo"
              />

              <RadioGroup
                label="What would you pay for a clean, private restroom when you need one?"
                options={['Free only', '$1-3', '$3-5', '$5-10', '$10+', 'Depends on quality']}
                value={data.willingness_to_pay}
                onChange={(v) => updateField('willingness_to_pay', v)}
                grid
              />

              <SelectDropdown
                label="How would you most likely find a place like this?"
                options={['Word of mouth', 'Google Maps', 'Social media', 'Walked past it', 'Community center / place of worship', 'Other']}
                value={data.discovery_channel}
                onChange={(v) => { updateField('discovery_channel', v); if (v !== 'Other') updateField('discovery_channel_other', ''); }}
                placeholder="Select one"
              />

              {data.discovery_channel === 'Other' && (
                <TextInput
                  label="Please specify (optional)"
                  value={data.discovery_channel_other}
                  onChange={(v) => updateField('discovery_channel_other', v)}
                  placeholder="How would you find us?"
                />
              )}

              <Textarea
                label="What's one thing NYC restrooms always get wrong for people from your background? (optional)"
                value={data.one_thing_wrong}
                onChange={(v) => updateField('one_thing_wrong', v)}
                placeholder="Anything we should know?"
              />

              <Textarea
                label="What would make a restroom feel like it was designed for you? (optional)"
                value={data.one_thing_right}
                onChange={(v) => updateField('one_thing_right', v)}
                placeholder="Anything we should know?"
              />
            </div>
          </section>
        )}

        {/* Section 8: Accessibility Needs */}
        {currentSection === 8 && (
          <section>
            <h2 className="text-2xl font-serif text-[#1C2B3A] mb-4 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Accessibility
            </h2>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-[#1C2B3A] underline mb-3" style={{ fontFamily: "'Jost', sans-serif" }}>
                  Do you have any accessibility needs we should design for? (select all that apply)
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <Checkbox
                    label="Wheelchair access"
                    checked={data.needs_wheelchair_access}
                    onChange={(v) => updateField('needs_wheelchair_access', v)}
                  />
                  <Checkbox
                    label="Mobility support (grab bars, wider doors)"
                    checked={data.needs_mobility_support}
                    onChange={(v) => updateField('needs_mobility_support', v)}
                  />
                  <Checkbox
                    label="Visual assistance (braille, high contrast)"
                    checked={data.needs_visual_assistance}
                    onChange={(v) => updateField('needs_visual_assistance', v)}
                  />
                  <Checkbox
                    label="Hearing assistance"
                    checked={data.needs_hearing_assistance}
                    onChange={(v) => updateField('needs_hearing_assistance', v)}
                  />
                  <Checkbox
                    label="Sensory-friendly (low stimulation)"
                    checked={data.needs_sensory_friendly}
                    onChange={(v) => updateField('needs_sensory_friendly', v)}
                  />
                  <Checkbox
                    label="I have a service animal"
                    checked={data.has_service_animal}
                    onChange={(v) => updateField('has_service_animal', v)}
                  />
                </div>
              </div>

              <Textarea
                label="Anything else? (optional)"
                value={data.other_accessibility_notes}
                onChange={(v) => updateField('other_accessibility_notes', v)}
                placeholder="Any other accessibility needs we should know about"
              />
            </div>
          </section>
        )}

        {/* Error message */}
        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {submitError}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex gap-3">
          {currentSection > 1 && (
            <button
              onClick={() => setCurrentSection(prev => prev - 1)}
              className="flex-1 py-3 px-4 rounded-lg border-2 border-[#1C2B3A]/20 text-[#1C2B3A] text-base font-medium hover:border-[#1C2B3A]/40 transition-all"
              style={{ fontFamily: "'Jost', sans-serif", minHeight: '48px' }}
            >
              Back
            </button>
          )}

          {currentSection < totalSections ? (
            <button
              onClick={() => setCurrentSection(prev => prev + 1)}
              disabled={!canProceed()}
              className={`flex-1 py-3 px-4 rounded-lg text-base font-medium transition-all ${
                canProceed()
                  ? 'bg-[#1C2B3A] text-white hover:bg-[#1C2B3A]/90'
                  : 'bg-[#1C2B3A]/30 text-white cursor-not-allowed'
              }`}
              style={{ fontFamily: "'Jost', sans-serif", minHeight: '48px' }}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 rounded-lg text-base font-medium transition-all ${
                isSubmitting
                  ? 'bg-[#D4AF6A]/50 text-[#1C2B3A]/50 cursor-not-allowed'
                  : 'bg-[#D4AF6A] text-[#1C2B3A] hover:bg-[#D4AF6A]/90'
              }`}
              style={{ fontFamily: "'Jost', sans-serif", minHeight: '48px' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit — Get Free Pass'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

// ==================
// Reusable Components
// ==================

interface YesNoToggleProps {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  required?: boolean;
}

function YesNoToggle({ label, value, onChange, required }: YesNoToggleProps) {
  return (
    <div>
      <p className="text-sm text-[#1C2B3A] mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>
        {label} {required && <span className="text-[#D4AF6A]">*</span>}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 py-3 px-3 rounded-lg border-2 text-base font-medium transition-all ${
            value === true
              ? 'border-[#D4AF6A] bg-[#D4AF6A]/10 text-[#1C2B3A]'
              : 'border-[#1C2B3A]/20 text-[#1C2B3A]/70 hover:border-[#1C2B3A]/40'
          }`}
          style={{ fontFamily: "'Jost', sans-serif", minHeight: '48px' }}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 py-3 px-3 rounded-lg border-2 text-base font-medium transition-all ${
            value === false
              ? 'border-[#D4AF6A] bg-[#D4AF6A]/10 text-[#1C2B3A]'
              : 'border-[#1C2B3A]/20 text-[#1C2B3A]/70 hover:border-[#1C2B3A]/40'
          }`}
          style={{ fontFamily: "'Jost', sans-serif", minHeight: '48px' }}
        >
          No
        </button>
      </div>
    </div>
  );
}

interface YesNoSometimesToggleProps {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
}

function YesNoSometimesToggle({ label, value, onChange }: YesNoSometimesToggleProps) {
  return (
    <div>
      <p className="text-sm text-[#1C2B3A] underline mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>
        {label}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange('Yes')}
          className={`flex-1 py-3 px-3 rounded-lg border-2 text-base font-medium transition-all ${
            value === 'Yes'
              ? 'border-[#D4AF6A] bg-[#D4AF6A]/10 text-[#1C2B3A]'
              : 'border-[#1C2B3A]/20 text-[#1C2B3A]/70 hover:border-[#1C2B3A]/40'
          }`}
          style={{ fontFamily: "'Jost', sans-serif", minHeight: '48px' }}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange('Sometimes')}
          className={`flex-1 py-3 px-3 rounded-lg border-2 text-base font-medium transition-all ${
            value === 'Sometimes'
              ? 'border-[#D4AF6A] bg-[#D4AF6A]/10 text-[#1C2B3A]'
              : 'border-[#1C2B3A]/20 text-[#1C2B3A]/70 hover:border-[#1C2B3A]/40'
          }`}
          style={{ fontFamily: "'Jost', sans-serif", minHeight: '48px' }}
        >
          Sometimes
        </button>
        <button
          type="button"
          onClick={() => onChange('No')}
          className={`flex-1 py-3 px-3 rounded-lg border-2 text-base font-medium transition-all ${
            value === 'No'
              ? 'border-[#D4AF6A] bg-[#D4AF6A]/10 text-[#1C2B3A]'
              : 'border-[#1C2B3A]/20 text-[#1C2B3A]/70 hover:border-[#1C2B3A]/40'
          }`}
          style={{ fontFamily: "'Jost', sans-serif", minHeight: '48px' }}
        >
          No
        </button>
      </div>
    </div>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className={`flex-1 flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
      checked
        ? 'border-[#D4AF6A] bg-[#D4AF6A]/10'
        : 'border-[#1C2B3A]/20 hover:border-[#1C2B3A]/40'
    }`} style={{ minHeight: '48px' }}>
      <div
        className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-all ${
          checked
            ? 'border-[#D4AF6A] bg-[#D4AF6A]'
            : 'border-2 border-[#1C2B3A]/30'
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-[#1C2B3A]" style={{ fontFamily: "'Jost', sans-serif" }}>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  vertical?: boolean;
  grid?: boolean;
  cols?: 2 | 3;
}

function RadioGroup({ label, options, value, onChange, vertical, grid, cols }: RadioGroupProps) {
  const containerClass = cols === 3
    ? 'grid grid-cols-3 gap-2'
    : cols === 2 || grid
    ? 'grid grid-cols-2 gap-2'
    : vertical
    ? 'space-y-2'
    : 'flex flex-wrap gap-2';

  return (
    <div>
      <p className="text-sm text-[#1C2B3A] underline mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>
        {label}
      </p>
      <div className={containerClass}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`${vertical || grid || cols ? 'w-full text-left' : ''} py-3 px-3 rounded-lg border-2 text-sm transition-all ${
              value === option
                ? 'border-[#D4AF6A] bg-[#D4AF6A]/10 text-[#1C2B3A] font-medium'
                : 'border-[#1C2B3A]/20 text-[#1C2B3A]/70 hover:border-[#1C2B3A]/40'
            }`}
            style={{ fontFamily: "'Jost', sans-serif", minHeight: '48px' }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ScaleInputProps {
  label: string;
  sublabel?: string;
  value: number | null;
  onChange: (value: number) => void;
}

function ScaleInput({ label, sublabel, value, onChange }: ScaleInputProps) {
  return (
    <div>
      <p className="text-sm text-[#1C2B3A] underline mb-1" style={{ fontFamily: "'Jost', sans-serif" }}>
        {label}
      </p>
      {sublabel && (
        <p className="text-xs text-[#1C2B3A]/50 mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>
          {sublabel}
        </p>
      )}
      <div className="flex gap-2 justify-between">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-12 h-12 rounded-full border-2 text-base font-medium transition-all ${
              value === n
                ? 'border-[#D4AF6A] bg-[#D4AF6A] text-white'
                : 'border-[#1C2B3A]/20 text-[#1C2B3A]/70 hover:border-[#1C2B3A]/40'
            }`}
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function TextInput({ label, value, onChange, placeholder }: TextInputProps) {
  return (
    <div>
      <label className="text-sm text-[#1C2B3A] underline block mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-3 px-3 rounded-lg border border-[#1C2B3A]/20 focus:border-[#D4AF6A] outline-none text-base text-[#1C2B3A] placeholder-[#1C2B3A]/40 transition-all"
        style={{ fontFamily: "'Jost', sans-serif", minHeight: '48px' }}
      />
    </div>
  );
}

interface TextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function Textarea({ label, value, onChange, placeholder }: TextareaProps) {
  return (
    <div>
      <label className="text-sm text-[#1C2B3A] underline block mb-1.5" style={{ fontFamily: "'Jost', sans-serif" }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full py-2.5 px-3 rounded-lg border border-[#1C2B3A]/20 focus:border-[#D4AF6A] outline-none text-base text-[#1C2B3A] placeholder-[#1C2B3A]/40 resize-y transition-all"
        style={{ fontFamily: "'Jost', sans-serif", minHeight: '80px' }}
      />
    </div>
  );
}

interface SelectDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SelectDropdown({ label, options, value, onChange, placeholder }: SelectDropdownProps) {
  return (
    <div>
      <label className="text-sm text-[#1C2B3A] underline block mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full py-3 px-3 rounded-lg border border-[#1C2B3A]/20 focus:border-[#D4AF6A] outline-none text-base transition-all appearance-none bg-white bg-no-repeat ${
          value ? 'text-[#1C2B3A]' : 'text-[#1C2B3A]/40'
        }`}
        style={{
          fontFamily: "'Jost', sans-serif",
          minHeight: '48px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231C2B3A' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 12px center',
          backgroundSize: '20px',
          paddingRight: '40px'
        }}
      >
        <option value="" disabled>{placeholder || 'Select an option'}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
