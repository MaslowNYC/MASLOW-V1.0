# Cline Brief: Sample Picker in Booking Flow
**File: src/components/BookingSection.tsx**
**New file: src/components/SamplePicker.tsx**

## Goal
Add a sample selection step between session selection and payment in the booking flow.
The guest can add up to N samples (based on their session type's sample_limit), each costing $2 extra.
This is a demo-quality feature — it needs to look premium and work end to end.

## Database
Samples already exist in Supabase `samples` table. Schema:
```
id: number
brand: string          (e.g. "Ursa Major", "Aesop", "Cora")
product_name: string   (e.g. "Face Wipes", "Hand Soap Sample")
category: string       (e.g. "skincare", "hygiene", "beverage")
price_per_extra: string (always "2.00" — treat as 200 cents)
is_available: boolean
```

Current data (7 items):
1. Ursa Major — Face Wipes (skincare)
2. Cora — Organic Tampons (hygiene)
3. Aesop — Hand Soap Sample (skincare)
4. Native — Deodorant (hygiene)
5. Pukka — Tea Bags (beverage)
6. Maslow — Compressed Towel (hygiene)
7. Maslow — Phone Cleaning Wipe (hygiene)

## SessionType already has sample_limit
```typescript
interface SessionType {
  id: number
  name: string
  duration_minutes: number
  price_cents: number      // base price in cents
  passes_included: number
  sample_limit: number     // max samples allowed: 1, 3, 5, or 5
  is_active: boolean
  sort_order: number
}
```

---

## New Flow in BookingSection.tsx

Current states:
- State A: no session selected
- State B: session selected, not logged in → auth form  
- State C: logged in → payment

New states:
- State A: no session selected (unchanged)
- State B: session selected, not logged in → auth form (unchanged)
- State C: logged in, no samples chosen yet → **SamplePicker** ← NEW
- State D: samples chosen (or skipped) → payment form ← was State C

Add state:
```typescript
const [selectedSamples, setSelectedSamples] = useState<number[]>([]) // array of sample IDs
const [samplesConfirmed, setSamplesConfirmed] = useState(false)
```

When `user` is set and `!samplesConfirmed` → show SamplePicker
When `samplesConfirmed` → show payment form (existing State C code)

### Passing data to payment
Calculate total:
```typescript
const sampleTotal = selectedSamples.length * 200 // 200 cents per sample
const totalCents = selectedSession.price_cents + sampleTotal
```

Pass `totalCents` to the Stripe payment intent instead of `selectedSession.price_cents`.

In the booking insert, add:
```typescript
notes: selectedSamples.length > 0 
  ? `Samples: ${selectedSamples.join(',')}` 
  : null
```

---

## New Component: SamplePicker.tsx
Create `src/components/SamplePicker.tsx`

### Props
```typescript
interface SamplePickerProps {
  sessionType: SessionType
  onConfirm: (selectedIds: number[]) => void  // called when guest clicks Continue
}
```

### Data fetching
Fetch samples from Supabase on mount:
```typescript
const { data } = await supabase
  .from('samples')
  .select('*')
  .eq('is_available', true)
  .order('category')
```

### Visual design — IMPORTANT: match the booking section style
The SamplePicker sits inside the booking section (cream-2 background).
Style it to feel like a curated menu, not a checkbox list.

Layout:
- Small gold label at top: "ENHANCE YOUR VISIT" (uppercase, tracking-widest, var(--gold), font-sans)
- Subtext: "Add up to {sample_limit} samples to your suite. Each $2." — charcoal at 60% opacity
- Show remaining slots: "2 of 3 selected" — subtle, small text
- Grid of sample cards: 2 columns on mobile, can stay 2 on desktop too

### Sample card design
Each card:
- Border: 1px solid rgba(42,39,36,0.15) when unselected
- Border: 2px solid var(--gold) when selected
- Background: white when unselected, rgba(196,159,88,0.06) when selected
- Padding: p-4
- borderRadius: 2px (not rounded — matches the site's square aesthetic)
- Cursor: pointer
- On hover (unselected): border color rgba(42,39,36,0.3)

Card content:
- Top row: brand name in gold (font-sans, text-xs, uppercase, tracking-wider) + "$2" right-aligned in charcoal at 50%
- Product name: font-serif, text-lg, charcoal
- Category pill: tiny, moss-colored background (rgba(74,92,58,0.1)), moss text, rounded-full, px-2 py-0.5, text-xs

Selected state indicator:
- Small checkmark in top-right corner of card (use Check from lucide-react, w-4 h-4, gold color)
- Only visible when selected

### Selection logic
- Clicking an unselected card: add to selection IF selectedIds.length < sample_limit
- If at limit: show a subtle shake animation or just don't add (no error toast needed for demo)
- Clicking a selected card: remove from selection (deselect)

### Bottom of picker
Two buttons side by side:
- "Skip" (text button, charcoal at 50%, no border) — calls onConfirm([])  
- "Continue →" (primary button) — calls onConfirm(selectedIds), disabled if 0 selected... actually enable it always so they can continue with 0 after seeing the options. Label: "Continue with {count} sample{s}" or just "Continue" if 0.
  - Style: background var(--gold), color var(--charcoal), uppercase tracking-wider, borderRadius 2px, py-3 px-8

### No image needed
Don't try to load product images — there are none in the DB. The brand name + product name is enough for a demo. If you want a visual accent, use a small category icon from lucide-react:
- skincare → Sparkles
- hygiene → Droplets  
- beverage → Coffee

---

## Update payment section header
When showing the payment form (State D), update the summary to show:
- Session name + duration
- "2 samples added" (or "No samples") in smaller text below
- Total price (session + samples)

Example:
```
Standard Visit
15 min · 2 samples
─────────────────
Total: $14
```

---

## Build check
Run `npm run build` after changes to verify no TypeScript errors.
