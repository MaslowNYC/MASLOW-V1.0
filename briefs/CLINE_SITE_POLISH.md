# Cline Brief: Site Polish — 3 Fixes
Three surgical fixes. Do them in order. No new features.

---

## Fix 1: Remove the duplicate footer in HomePage.tsx

**Problem:** `HomePage.tsx` has a mini footer section baked in at the bottom (dark moss background, "Maslow NYC", Mission/FAQ/Privacy/Terms links, copyright line). The app also renders a global `<Footer />` component after every page via `App.tsx`. This creates two footers stacked on the homepage.

**Fix:** In `src/pages/HomePage.tsx`, find and DELETE the entire footer section. It starts with a `<section>` or `<div>` that has a dark background and contains "Maslow NYC", "The Infrastructure of Dignity", and links to Mission, FAQ, Privacy, Terms. Remove the entire block including its wrapping element.

The global `<Footer />` in App.tsx handles footer for all pages — the homepage doesn't need its own.

---

## Fix 2: Replace the Footer component styling

**Problem:** `src/components/Footer.tsx` uses `bg-[#1D5DA0]` (bright blue) which is off-brand. The design system uses charcoal and cream, not blue.

**Fix:** In `src/components/Footer.tsx`, replace the entire footer background and text color scheme:

- `bg-[#1D5DA0]` → `bg-[#2A2724]` (charcoal)
- `text-white` → keep as-is (white on charcoal reads fine)
- `border-white/10` → keep as-is
- `text-white/60`, `text-white/70`, `text-white/30` → keep as-is
- The gold section headers (`text-[#C49F58]`) → keep, already correct

That's it — one color swap on the outer footer element background.

---

## Fix 3: Replace the hero logo in HomePage.tsx

**Problem:** The hero section of `HomePage.tsx` is showing the wrong logo — it's displaying the blue subway-sign style logo. The correct file for the hero is `MASLOW - Square.png` which is already in `/public/`.

**Fix:** In `src/pages/HomePage.tsx`, find the hero section image (likely an `<img>` tag or background image). Replace whatever logo source it currently has with `/MASLOW - Square.png`.

If the hero logo is rendered as an `<img>` tag, update the `src` attribute.
If it's a CSS background-image, update the url().

Note: The navbar logo in `Header.tsx` already correctly uses `/MASLOW - Round.png` — do NOT touch Header.tsx.

---

## After all three fixes:
Run `npm run build` and confirm clean build output before finishing.
