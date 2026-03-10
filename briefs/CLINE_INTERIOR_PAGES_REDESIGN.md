# Cline Brief: Interior Pages Visual Consistency
**Files to edit: HullPage.tsx, ImpactPage.tsx, MembershipPage.tsx**

## Goal
Make the three main guest-facing interior pages feel visually consistent with the homepage (v4 design). 
The homepage uses organic/botanical design tokens. These pages currently use hardcoded hex values and look flat.
NO content changes. NO structural rewrites. Visual polish only.

---

## Design Tokens (use these everywhere, replace all hardcoded hex)
These are already defined globally in the app CSS. Reference them as CSS custom properties:

```
--cream: #FAF4ED        (main background)
--cream-2: #F2E8DC      (alternate section background)
--charcoal: #2A2724     (primary text / headings)
--gold: #C49F58         (labels, accents, dividers)
--blue: #2C6BC4         (links, secondary accents)
--moss: #4A5C3A         (new organic accent — use for hero elements)
--water: #7AABCC        (optional subtle accent)
--serif: 'Cormorant Garamond'
--sans: 'Jost'
```

Use inline `style={{ color: 'var(--charcoal)' }}` syntax since these are TSX files.

---

## Shared Treatment (apply to ALL THREE pages)

### Hero sections
- Background: dark organic — use `background: 'linear-gradient(160deg, #1a2318 0%, #2d3b28 60%, #1e2d1a 100%)'`
- This is a deep moss/forest dark, NOT black
- Add a very subtle SVG leaf texture overlay (low opacity ~0.04) — copy the leaf SVG pattern approach from HomePage.tsx hero if it exists, or create simple organic shapes
- H1 heading: `color: 'var(--cream)'`, font-family: `'var(--serif)'`, keep existing font size
- Subtitle/description text: `color: 'rgba(250,244,237,0.75)'`
- Bottom of hero: add a gentle organic wave curve into the next section (same SVG wave approach as homepage)

### Section label pattern (the small uppercase gold labels like "WHAT IS THE HULL")
- Replace hardcoded `text-[#C49F58]` → `style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}`
- Keep the gold divider line below them

### Section headings (h2, h3)
- Replace hardcoded `text-[#3C5999]` → `style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}`
- These should be warm dark, not bright blue

### Body text
- Replace `text-[#1a1a1a]/70` → `style={{ color: 'rgba(42,39,36,0.7)' }}` (charcoal at 70%)

### Section alternation
- Replace `bg-white` sections → `style={{ background: 'white' }}` is fine to keep, OR use `var(--cream-2)` for warmth
- Replace `bg-[#FAF4ED]` → `style={{ background: 'var(--cream)' }}`
- The dark CTA sections (currently `bg-[#3C5999]`) → change to `background: 'linear-gradient(135deg, #1a2318 0%, #2d3b28 100%)'` (the same moss dark as hero)

### Bullet/list accents
- Replace `bg-[#C49F58]` dots → `style={{ background: 'var(--moss)' }}` for a botanical feel

### Border/card accents  
- Replace `border-[#3C5999]` → `style={{ borderColor: 'var(--gold)' }}`
- Replace `bg-[#3C5999]/5` background tints → `style={{ background: 'rgba(74,92,58,0.06)' }}` (moss tint)

---

## Page-Specific Notes

### HullPage.tsx
- The "The Name" section at bottom is currently `bg-[#3C5999]` flat blue → change to moss dark gradient (see above)
- White text in that section stays white/cream: `color: 'var(--cream)'`
- The gold email link `hello@maslow.nyc` stays gold

### ImpactPage.tsx  
- "Get Involved" section at bottom is currently `bg-[#3C5999]` → change to moss dark gradient
- The three-column cards in Get Involved: headings stay gold, body text → cream at 80% opacity
- The blockquote/border-left accent: change `border-[#C49F58]` to `style={{ borderColor: 'var(--moss)' }}`

### MembershipPage.tsx
- The Sovereign card: keep its `border-[#C49F58]` gold border — this is intentional premium feel
- The "Coming Soon" Founding Member card: keep grayscale treatment, it's intentionally muted
- H1 "Get Your Maslow Pass": change from `text-[#3C5999]` → `style={{ color: 'var(--charcoal)', fontFamily: 'var(--serif)' }}`
- This page has NO hero section currently — add one: same dark moss gradient hero as the others, with the H1 and subtitle inside it (light text on dark background)
- The ShieldCheck footer note: `color: 'rgba(42,39,36,0.5)'`

---

## What NOT to change
- Do NOT change any component logic, state, handlers, or Stripe/auth code
- Do NOT change any text content
- Do NOT add new sections or remove existing sections
- Do NOT change the PaymentModal or PaymentOptionsModal components
- Do NOT change routing or navigation
- Keep all motion/framer-motion animations as-is
- Keep all className Tailwind utilities that handle layout (flex, grid, max-w, px, py, etc.) — only change color/typography classes

---

## Test
After changes, visually check:
1. Hero on each page has dark moss gradient background with cream text
2. Section headings are warm charcoal (not bright blue)
3. Gold accents (labels, dividers) are consistent across all three
4. Bottom CTA sections are dark moss (not flat blue)
5. Overall feel matches the homepage warmth/botanical tone
