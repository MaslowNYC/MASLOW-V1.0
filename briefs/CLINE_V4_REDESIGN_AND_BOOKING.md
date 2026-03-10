# CLINE BRIEF: V4 Redesign + Functional Booking Flow
**Priority: HIGH | Touches: HomePage, new components, booking flow**
**Do NOT touch: api/, supabase/, legal pages, policy pages, Header auth logic, ProtectedRoute**

---

## CONTEXT

The site needs two things done in order:
1. Replace the visual design of the homepage with the new "ivy wall" design (v4)
2. Wire the booking form on the homepage to actually work (auth → session picker → Stripe → booking)

The Stripe backend (`/api/stripe/create-payment-intent.ts`) already exists and is working.
The Supabase auth context (`src/contexts/SupabaseAuthContext.tsx`) already exists and is working.
The `session_types` table in Supabase is live and populated with 4 session types.

---

## DESIGN TOKENS

Add these CSS variables to `src/index.css` (keep all existing Tailwind config, just add these):

```css
:root {
  --cream:      #FAF4ED;
  --cream-2:    #F2E8DC;
  --charcoal:   #2A2724;
  --gold:       #C49F58;
  --blue:       #2C6BC4;
  --moss:       #4A5C3A;
  --water:      #7AABCC;
  --ivy-0:      #0D1509;
  --ivy-3:      #355228;
  --ivy-4:      #4A6E38;
  --serif: 'Cormorant Garamond', Georgia, serif;
  --sans:  'Jost', sans-serif;
}
```

Add to `index.html` `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap" rel="stylesheet">
```

---

## STEP 1: Replace HomePage.tsx

Replace `src/pages/HomePage.tsx` entirely. Keep the existing imports for `useAuth` and `supabase` — we'll need them.

The new homepage has these sections in order:
1. **Hero** — full-viewport, ivy wall background (CSS only, no external assets needed), left-aligned headline, badge logo floating right
2. **Suite section** — cream background, two-column, text left / image placeholder right
3. **Sessions section** — dark background, 4-column grid of session type cards (fetched from Supabase)
4. **Hull section** — moss green background, two-column
5. **Booking section** — handles auth + session selection + payment
6. **Footer**

### Hero layout requirements:
- Background: `background: var(--ivy-0)` with 3 layers of SVG leaf shapes animating at different speeds (use CSS `@keyframes` for sway)
- Left side (bottom-aligned): eyebrow "SoHo, New York City" in gold + small caps, headline "Where the city can wait." in Cormorant Garamond 300, CTA buttons "Book a Visit" (gold filled) and "The Hull →" (ghost)
- Right side (vertically centered, `position: absolute; right: 8vw`): the badge — a 200px circle, `background: #2C6BC4`, `border: 4px solid #C49F58`, containing the letter M in Cormorant Garamond ~5.5rem, a thin rule, the word MASLOW in Jost 300 spaced caps
- The ivy SVG layers should have a natural gap/thinning around the badge position so it "peeks through"
- Mouse parallax: on `mousemove`, shift ivy layers 5-9px based on cursor offset from center
- Organic SVG wave at bottom transitioning to cream below

### IVY SVG layers (3 layers minimum):
Each layer is an SVG with `position: absolute; width: 110%; height: 110%` and individual CSS animation:
- Layer 1 (deep): `fill="#182210"` opacity 0.95, animates slow (18s)  
- Layer 2 (mid): `fill="#2E4420"` opacity 0.88, animates medium (13s)
- Layer 3 (fore): `fill="#4A6E38"` opacity 0.80, animates fast (9s), thinned in right-center zone (x: 1000-1300, y: 200-550 in a 1440×900 viewBox)

Leaf shape to use (copy this `<defs>` block in each SVG):
```svg
<defs>
  <path id="lf"  d="M0,-16 C6,-16 14,-8 14,0 C14,6 8,14 0,16 C-8,14 -14,6 -14,0 C-14,-8 -6,-16 0,-16 Z"/>
  <path id="lf2" d="M0,-14 C8,-12 16,-4 14,4 C12,12 6,16 0,16 C-6,16 -12,12 -14,4 C-16,-4 -8,-12 0,-14 Z"/>
</defs>
```
Scatter 60-80 `<use href="#lf">` and `<use href="#lf2">` elements per layer with varied `translate`, `rotate`, and `scale` transforms.

---

## STEP 2: Sessions Section — fetch from Supabase

Create `src/components/SessionsSection.tsx`:

```typescript
// Fetch session types from Supabase on mount
// Table: session_types
// Columns needed: id, display_name, duration_minutes, price_cents, sample_limit, passes_included
// Display as 4 cards, dark charcoal background
// Each card shows: duration, display_name, includes list, price
// Clicking a card calls onSelect(sessionType) prop
// Selected card gets gold top border highlight
```

The component takes a prop `onSelect: (session: SessionType) => void`.

SessionType interface:
```typescript
interface SessionType {
  id: number;
  display_name: string;
  duration_minutes: number;
  price_cents: number;
  sample_limit: number;
  passes_included: number;
}
```

---

## STEP 3: Booking Section — wire auth + Stripe

Create `src/components/BookingSection.tsx`.

This component handles the full booking flow in one section. It has 3 internal states:

### State A: No session selected
Show: "Select a visit length above to continue"

### State B: Session selected, user NOT logged in
Show a simple auth form:
- Email input
- Password input  
- "Continue" button → calls `supabase.auth.signInWithPassword()`
- "Create account" link → calls `supabase.auth.signUp()`
- Error display for auth failures
- On success → move to State C automatically

### State C: Session selected, user IS logged in
Show:
- Summary: "You're booking: [display_name] · [duration] min · $[price]"
- User's name/email
- "Pay $X" button
- On click → call `/api/stripe/create-payment-intent` with `{ amount: price_cents, session_type: display_name, user_id: user.id, location_id: 1 }`
- Mount Stripe `CardElement` (from `@stripe/react-stripe-js`) for card entry
- On payment success → create booking record in Supabase `bookings` table → redirect to `/checkout-success`

### Booking record to insert on payment success:
```typescript
await supabase.from('bookings').insert({
  user_id: user.id,
  location_id: 1,
  session_type_id: selectedSession.id,
  status: 'confirmed',
  payment_status: 'paid',
  amount_paid: selectedSession.price_cents,
})
```

Use the existing `StripeContext` (`src/contexts/StripeContext.tsx`) — don't create a new Stripe provider.

---

## STEP 4: Wire it all together in HomePage.tsx

```typescript
// State: selectedSession (SessionType | null) = null

// Render order:
// <HeroSection />           ← inline in HomePage or extracted component
// <SuiteSection />          ← simple static component
// <SessionsSection onSelect={setSelectedSession} selectedId={selectedSession?.id} />
// <HullSection />           ← simple static component  
// <BookingSection selectedSession={selectedSession} />
// <FooterSection />         ← simple static component or use existing Footer
```

---

## WHAT TO PRESERVE (do not change):
- `src/App.tsx` routing — just update what `HomePage` renders
- `src/components/Header.tsx` — keep as-is, it handles auth state in nav already
- All legal pages
- All `/api` endpoints
- All Supabase context/auth logic
- `src/components/LoginPage.tsx` — still used for direct `/login` route

---

## DEFINITION OF DONE:
1. `npm run dev` starts without TypeScript errors
2. Homepage loads with ivy wall hero visible
3. Badge visible in right third of hero
4. Scrolling down reveals: Suite → Sessions → Hull → Booking → Footer
5. Session cards load from Supabase (not hardcoded)
6. Clicking a session card scrolls to booking section and pre-selects it
7. Logged-out user sees auth form in booking section
8. Logged-in user sees payment form with correct amount
9. Test payment with card `4242 4242 4242 4242` completes and creates a booking record
10. `npm run build` completes without errors

---

## TEST CARD (Stripe test mode):
- Success: `4242 4242 4242 4242` · any future expiry · any CVC
- Declined: `4000 0000 0000 0002`
