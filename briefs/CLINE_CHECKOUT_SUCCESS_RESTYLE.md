# Cline Brief: Checkout Success Page Restyle
**File: src/pages/CheckoutSuccessPage.tsx**

## Goal
Restyle CheckoutSuccessPage to match the interior page design language (dark moss hero, cream body, design tokens). Also fix copy — this page is reached after booking a suite session, not buying physical merchandise.

## NO logic changes
- Keep clearCart() useEffect
- Keep all imports
- Keep routing (Link to "/" for Return Home)
- Only change: visual styling + copy text

---

## Design Tokens (same as HullPage, ImpactPage, MembershipPage)
```
--cream: #FAF4ED
--cream-2: #F2E8DC
--charcoal: #2A2724
--gold: #C49F58
--moss: #4A5C3A
--serif: 'Cormorant Garamond'
--sans: 'Jost'
```

---

## New Layout Structure

### Overall page
- Background: `var(--cream)`
- Remove the white card/shadow/rounded box treatment entirely
- Full-width layout like the other interior pages, not a centered floating card

### Hero area (top section)
- Dark moss gradient background: `linear-gradient(160deg, #1a2318 0%, #2d3b28 60%, #1e2d1a 100%)`
- Same dot texture overlay as Hull/Impact/Membership (SVG circles, opacity 0.04)
- Same organic wave SVG at the bottom curving into cream
- Centered content:
  - Checkmark icon: use the existing CheckCircle from lucide-react, color `var(--gold)`, size w-16 h-16
  - NO circle background behind the icon — just the icon directly
  - H1: "Your Suite is Confirmed." — font-family serif, color `var(--cream)`, text-4xl md:text-5xl font-light
  - Subtext: "You're all set. We'll see you soon." — color cream at 75% opacity, font-sans

### Body section (below wave)
- Background: `var(--cream)`
- Max width: max-w-2xl mx-auto px-6 py-16
- Section label: "WHAT HAPPENS NEXT" — gold, uppercase, tracking-widest, font-sans text-sm
- Gold divider line below label (w-16 h-0.5)

### Next steps — replace the current bullet list with this copy:
Three items, each as a simple row with a moss-colored dot bullet:
1. "Check your email — a confirmation is on its way to you."
2. "Head to any Maslow location and scan your pass to enter."  
3. "Your selected samples will be waiting in your suite."

(Note: if no samples were selected, item 3 can stay — it's aspirational copy for now)

### Buttons — replace current buttons with:
- Primary button: "Return Home" → links to "/"
  - Style: background `var(--charcoal)`, color `var(--cream)`, uppercase tracking-wider, font-sans, no rounded corners (borderRadius: 2px), py-4 px-10
  - Remove the ShoppingBag icon and "Continue Shopping" button entirely — there's no store in the demo flow

### Order reference
- Keep it but style it subtly: small text, `color: rgba(42,39,36,0.4)`, font-sans, centered below the button
- Remove the blue footer bar — just inline text: "Booking reference: XXXXX"

---

## Summary of copy changes
| Old | New |
|-----|-----|
| "Payment Successful!" | "Your Suite is Confirmed." |
| "Thank you for your contribution to Maslow. Your order has been confirmed and you are helping build the infrastructure of dignity." | "You're all set. We'll see you soon." |
| "You will receive a confirmation email shortly." | "Check your email — a confirmation is on its way to you." |
| "Your Maslow Passes (if applicable) will be sent to your digital wallet." | "Head to any Maslow location and scan your pass to enter." |
| "Physical items will be shipped within 3-5 business days." | "Your selected samples will be waiting in your suite." |
| "Continue Shopping" button | Remove entirely |
| "Return Home" button | Keep, restyled |
