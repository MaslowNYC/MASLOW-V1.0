# CLINE BRIEF: Unseen Standards Survey — maslow.nyc/survey

## What You're Building

A standalone, mobile-first survey page at `maslow.nyc/survey`. This is Maslow's anonymous cultural practice research tool powering the Unseen Standards initiative — field research into global hygiene, religious, and cultural practices that inform suite design.

**Two audiences:**
1. Someone Patrick hands a QR code to on the street
2. Someone who clicks a link in the app after a session

**Design constraint:** Must work for someone who barely speaks English, on a cracked phone screen, standing outside in Brooklyn.

---

## Critical Rules

- NO auth required — fully anonymous, no login, no account
- NO PII collected — no name, no email, no phone
- NO linking to user accounts — ever
- All data goes to `research` schema in Supabase, NOT `public`
- Generate `session_token` = `crypto.randomUUID()` on page load, store in component state only
- After submission: show unique promo code
- After promo code: optional offer to create free Maslow account — separate flow, separate DB record, never linked

---

## Route & Files

- Route: `/survey` — public, no auth guard
- Create: `src/pages/SurveyPage.tsx`
- Modify: `src/App.tsx` — add `/survey` route

---

## Design System

Existing Maslow tokens from `src/index.css`:
- Background: `var(--color-ivory)` (#F8F7F4)
- Text: `var(--color-navy)` (#1C2B3A)
- Accent: `var(--color-gold)` (#C49F58)
- Fonts: Cormorant Garamond (headings) + Jost (body)
- Border radius: 0.75rem
- Mobile-first, max width 480px centered
- Min 48px tap targets on all inputs — NO sliders, NO hover-only interactions

---

## Page Header

```
[Maslow logo — small, centered]
Unseen Standards
Help us build a restroom that actually works for you.
Takes about 2 minutes. Completely anonymous.
```

Progress bar: "Section X of 7" — updates as sections complete.

---

## Section 1: Water & Hygiene

Heading: "How do you prefer to clean up?"

| Field | Type | Question |
|---|---|---|
| `uses_water_not_just_soap` | Yes/No toggle | Do you use water (not just soap) as part of your routine? |
| `carries_own_vessel` | Yes/No toggle | Do you carry your own water vessel when away from home? |
| `would_use_bidet_sprayer` | Yes/No toggle | Would you use a built-in sprayer if one was available? |
| `prefers_toilet_paper` | Checkbox | Toilet paper |
| `prefers_water_only` | Checkbox | Water only |
| `prefers_both` | Checkbox | Both |

Last three are multi-select.

---

## Section 2: Faith & Ritual

Heading: "Does your faith or background include a washing routine?"

| Field | Type | Question |
|---|---|---|
| `has_faith_based_washing` | Yes/No toggle | Does your faith or background include ritual washing? |
| `needs_running_water_for_prayer` | Yes/No toggle (conditional) | Do you need running water specifically for prayer? |
| `daily_washing_frequency` | Radio | 1 / 2 / 3 / 4 / 5+ times per day |
| `faith_background_broad` | Radio | Islam / Hindu / Jewish / Sikh / Christian / Other / Prefer not to say |
| `specific_practice_notes` | Textarea | Anything most NYC restrooms don't have that your background requires? (optional) |

Conditional: show `needs_running_water_for_prayer` only if `has_faith_based_washing = true`.

---

## Section 3: Privacy

Heading: "What makes a restroom feel private to you?"

| Field | Type | Question |
|---|---|---|
| `sound_privacy_importance` | 1–5 scale (large tappable circles) | How important is sound privacy? |
| `visual_privacy_importance` | 1–5 scale (large tappable circles) | How important is visual privacy? |
| `brings_child_or_family` | Yes/No toggle | Do you typically bring a child or family member who needs assistance? |
| `needs_gender_neutral` | Yes/No toggle | Is gender-neutral access important to you? |
| `other_privacy_notes` | Textarea | Anything else? (optional) |

---

## Section 4: Time

Heading: "How long do you typically need?"

| Field | Type | Question |
|---|---|---|
| `typical_duration` | Radio | Under 5 min / 5–15 min / 15–30 min / 30 min+ |
| `has_practice_needing_more_time` | Yes/No toggle | Is there something your routine requires that takes longer than most public restrooms allow? |
| `more_time_reason` | Textarea (conditional) | What requires the extra time? (optional) |

---

## Section 5: Products & Scent

Heading: "Any preferences on what's in the products you use?"

| Field | Type | Question |
|---|---|---|
| `avoids_alcohol` | Checkbox | Alcohol |
| `avoids_pork_derivatives` | Checkbox | Pork-derived ingredients |
| `avoids_fragrance` | Checkbox | Fragrance / synthetic scent |
| `avoids_none` | Checkbox | No restrictions |
| `avoids_other` | Text input | Other (optional) |
| `prefers_own_products` | Radio | I prefer to bring my own |
| `prefers_provided_products` | Radio | I'm happy to use what's provided if quality is good |
| `scent_preference` | Radio | No scent / Light natural / Moderate / Strong / No preference |

`avoids_none` must deselect other avoidance checkboxes when tapped.

---

## Section 6: Signage & Language

Heading: "Can you find your way around easily?"

| Field | Type | Question |
|---|---|---|
| `preferred_language` | Text input | What language do you prefer for reading instructions? |
| `prefers_icons_over_text` | Yes/No toggle | Do you prefer icons/symbols over written text? |
| `has_struggled_with_signage` | Yes/No toggle | Have you ever had trouble using a public restroom because of unclear signage? |
| `signage_notes` | Textarea | Anything else? (optional) |

---

## Section 7: Background (All Optional)

Heading: "A little about you — completely optional."
Subtext: "This helps us understand which communities we're reaching. You don't have to answer any of these."

| Field | Type | Options |
|---|---|---|
| `region_broad` | Radio | South Asia / East Asia / Southeast Asia / Middle East & MENA / Sub-Saharan Africa / Latin America / Eastern Europe / Western Europe / North America / Other / Prefer not to say |
| `years_in_nyc` | Radio | Less than 1 year / 1–5 years / 5–10 years / 10+ years / Born here |
| `neighborhood_zip` | Text input | What neighborhood are you usually in during the day? (zip code is fine) |
| `one_thing_wrong` | Textarea | What's one thing NYC restrooms always get wrong for people from your background? |
| `one_thing_right` | Textarea | What would make a restroom feel like it was designed for you? |

---

## Submit

Label: "Submit — Get Your Free Pass"
Style: full-width, gold bg (#C49F58), navy text (#1C2B3A), 0.75rem radius, 56px height.

Only required field: Section 1 first question. Everything else optional.

On submit:
1. Generate promo code (see below)
2. Insert `research.survey_responses` → capture `id`
3. Insert all section tables with `response_id`
4. Insert `research.promo_codes`
5. Show thank-you state on success
6. Show friendly error on failure — do NOT lose form data

---

## Promo Code Generation

```typescript
function generatePromoCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'MASLOW-' + Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map(b => chars[b % chars.length])
    .join('');
}
```

Store in `research.promo_codes.stripe_promo_code`. NOT yet wired to Stripe — codes are stored for future activation.

---

## Thank You Screen

```
✓
Thank you.
You're helping build something the city actually needs.

Your free pass code:
MASLOW-XXXXXXXX

[Copy Code]

Valid for one free Quick Stop (10 min) when Maslow opens in SoHo.
Follow us: @MaslowNYC

─────────────────────
Want to be first through the door?
[Create a free Maslow account →]
```

"Create account" → `/signup`. NO survey data passed. Completely separate.

---

## Supabase

Project ID: `hrfmphkjeqcwhsfvzfvw`
Schema: `research` (not `public`)
Use Supabase client from `src/lib/supabase.ts`

RLS insert policies for anon role were applied on March 13, 2026. All 9 research tables accept anonymous inserts.

---

## Do NOT Build

- No Stripe API calls
- No analytics dashboard
- No admin view
- No email capture
- No social sharing
- No multi-language UI

---

## Acceptance Criteria

- [ ] Loads at /survey with no auth
- [ ] Works on 375px mobile viewport
- [ ] Section 2 conditional logic works
- [ ] `avoids_none` deselects other checkboxes
- [ ] Submits to all 9 research tables
- [ ] Promo code shows on thank-you screen
- [ ] Copy button works
- [ ] Create account → /signup with no survey data
- [ ] No console errors on submit
