# Maslow Flow Script

Companion to the digital-footprint inventory. Inventory answers *what exists*; this answers *what's the step-by-step path through it*. Every step below is cited to actual source. Use this as a checklist when walking through each flow on a phone, and as a shot list for what's worth filming.

**Domain correction:** the live domain is **maslow.nyc** (not maslownyc.com — the bundle ID is `com.maslownyc.app` because it can't be changed post-submission).

---

## Status legend

| Tag | Meaning |
|-----|---------|
| ✅ confirmed | Wired end-to-end; will render and work on real device today. |
| ⚠️ gated | Built and working, but feature-flagged off or behind founder auth. |
| 🟡 partial | UI complete; one or more backend steps stubbed, randomized, or unreliable. |
| 🚧 aspirational | UI renders; backend not wired (state only, no persistence/effect). |

---

## Global gating you'll hit while testing

- **`PRESALE_VISIBLE = false`** in `src/config/stripe.ts:5`. Hides the entire presale tier grid on the homepage. Flip this to test Flow 2.
- **Founder gating** at `src/App.tsx:91`: `showFounderRoutes = authLoading || isFounder` wraps almost every non-homepage route at `src/App.tsx:130-174`. Non-founders hitting `/go`, `/hull`, `/events`, etc. are silently bounced to `/` by the catch-all at `src/App.tsx:176`. Log in as a founder email before testing any web flow other than #1.
- **App signup is in DEV MODE** — the 6-digit verification code is shown inside the Alert dialog at `app/(auth)/login.tsx:389,508`. No SMS is sent. Do NOT ship a build with this still in.

---

## FLOW 1 — Web: new email signup ✅ confirmed

The only public-today flow. The homepage waitlist.

| # | Step | Source |
|---|------|--------|
| 1 | Land on `/` — homepage mounts | `src/App.tsx:117` |
| 2 | Hero logo (`/Maslow_Round.png`) fades in via `Reveal` IntersectionObserver | `src/pages/HomePage.tsx:336-346` |
| 3 | H1 "The bathroom New York deserves." renders | `src/pages/HomePage.tsx:348-360` |
| 4 | Scroll, or tap "Join the waitlist" top-nav anchor (`#signup`) | `src/pages/HomePage.tsx:318-330` |
| 5 | Type email into hero form (`type="email"`, required) | `src/pages/HomePage.tsx:404-421` |
| 6 | Tap "Count me in" gold button | `src/pages/HomePage.tsx:422-444` |
| 7 | `handleSubmit` inserts `{ email, source: 'homepage' }` into `waitlist` table | `src/pages/HomePage.tsx:251-272` |
| 8 | Form replaced with blue serif italic "You're on the list. We'll be in touch." | `src/pages/HomePage.tsx:378-389` |

**Watch-outs:** Duplicate emails are silently treated as success (PG `23505` at line 266). No bot protection. Needs `waitlist` table with `(email unique, source)`.

**Shoot:** step 2 (logo fade), step 3 (large serif H1), step 8 (gold → blue italic success transition).

---

## FLOW 2 — Web: presale purchase ⚠️ gated / 🚧 aspirational if flipped

`PRESALE_VISIBLE = false` today. Even if flipped on, the hookup is broken — tier IDs don't match the edge function, and Stripe URLs are placeholders. See production blockers at end.

| # | Step | Source |
|---|------|--------|
| 1 | On `/`, scroll past hero | `src/pages/HomePage.tsx:490` (gating expression) |
| 2 | "Get early access." H2 + 36-month refund disclosure block render | `src/pages/HomePage.tsx:493-552` |
| 3 | Six `PresaleTier` cards render: Single Pass, Starter Bundle, Home Brick, Hull Brick, Both Bricks, Founding Member | `src/pages/HomePage.tsx:565-606` |
| 4 | Tap "Reserve" on any tier — currently goes to `https://buy.stripe.com/PLACEHOLDER_*` | `src/pages/HomePage.tsx:218-238,569-605` |
| 5 | *(If wired to modal instead)* `PresalePurchaseModal` opens | `src/components/PresalePurchaseModal.tsx` |
| 6 | Modal calls `create-presale-intent` edge function → returns clientSecret | `supabase/functions/create-presale-intent/index.ts:8-12` |
| 7 | Apple Pay / Google Pay sheet appears if available | `src/components/PresalePurchaseModal.tsx:140-187` |
| 8 | On success, "Pass #X" reveal | `src/components/PresalePurchaseModal.tsx:180-183` |

**Watch-outs:** Edge function only knows tiers `single | five_pack | twelve_pack | founding`. Homepage uses different tier IDs ("Home Brick" etc.). No mapping = errors on any non-single/founding purchase.

**Shoot:** step 3 (tier grid materializing), step 7 (Apple Pay sheet — premium moment), step 8 ("Pass #X" reveal).

---

## FLOW 3 — Web: walk-up via `/go` ⚠️ gated / 🟡 partial

Founder-only today. Payment endpoint missing in production (see blockers).

| # | Step | Source |
|---|------|--------|
| 1 | Visit `/go` (founder logged in) | `src/App.tsx:132` |
| 2 | `HeroCarousel` plays full-screen background images | `src/pages/GoPage.tsx:27` |
| 3 | Overlay: "Where the city can wait." + gold "Book a Visit" + outlined "The Hull →" | `src/pages/GoPage.tsx:30-69` |
| 4 | Tap "Book a Visit" smooth-scrolls to `#sessions` | `src/pages/GoPage.tsx:11-13,45` |
| 5 | `SessionsSection` renders; pick a session type | `src/pages/GoPage.tsx:120-123` |
| 6 | Page continues through Suite and Hull sections | `src/pages/GoPage.tsx:75-169` |
| 7 | `BookingSection` mounts at bottom with selected session | `src/pages/GoPage.tsx:172` |
| 8 | If not logged in, email/password sign-in or sign-up shown | `src/components/BookingSection.tsx:42-59` |
| 9 | `SamplePicker` renders for sample selection at $2 each | `src/components/BookingSection.tsx:29-30,37` |
| 10 | Submit → POST `/api/stripe/create-payment-intent` | `src/components/BookingSection.tsx:66-82` |
| 11 | Stripe `confirmCardPayment` with CardElement → insert into `bookings` | `src/components/BookingSection.tsx:87-100` |

**Watch-outs:** `/api/stripe/create-payment-intent` does not exist in `api/` — only `api/stripe/webhook.ts`. Step 10 will 404 in production. `location_id: 1` hardcoded as integer at `BookingSection.tsx:79`.

**Shoot:** step 2 (full-screen carousel), step 3 (gold CTA over moving images), step 9 (sample tray visual).

---

## FLOW 4 — App: first install & onboarding ✅ confirmed (dev-mode SMS)

The full new-user flow. ~20 discrete steps if you count every micro-transition.

| # | Step | Source |
|---|------|--------|
| 1 | App boots → fonts load via `useFonts` | `app/_layout.tsx:22-27` |
| 2 | `getSafeSession()` resolves null → stays unauthenticated | `app/_layout.tsx:42-45` |
| 3 | `SplashScreen` overlays full-screen wordmark, fades | `app/_layout.tsx:218-227`, `src/components/SplashScreen.tsx:24-55` |
| 4 | Routing effect → `router.replace('/welcome')` | `app/_layout.tsx:170-173` |
| 5 | `WelcomeScreen`: dark moss gradient, scale-spring logo, "Where the city can wait." | `app/welcome.tsx:62-95` |
| 6 | Tap gold "CREATE ACCOUNT" | `app/welcome.tsx:114-120` → `/(auth)/login?mode=signup` |
| 7 | Login screen mounts in signup mode; 3-dot step indicator | `app/(auth)/login.tsx:68-72,696-700` |
| 8 | **Step 1 / credentials:** firstName, email, password; "You'll be member #00XXX" teaser | `app/(auth)/login.tsx:702-756` |
| 9 | **Step 2 / phone:** enter phone with 🇺🇸 +1 prefix → "Send Code" | `app/(auth)/login.tsx:760-799` |
| 10 | `supabase.auth.signUp` → `profiles` upsert with `verification_code` + `code_expires_at` | `app/(auth)/login.tsx:338-379` |
| 11 | **DEV MODE:** Alert "Code Sent ... [DEV MODE: Code is 123456]" | `app/(auth)/login.tsx:386-390` |
| 12 | **Step 3 / verification:** 6 digit boxes auto-advance | `app/(auth)/login.tsx:803-825,401-419` |
| 13 | Tap "Verify & Enter" → compares to stored code, sets `phone_verified: true` | `app/(auth)/login.tsx:438-484` |
| 14 | Alert "Welcome to Maslow!" | `app/(auth)/login.tsx:483` |
| 15 | Session listener fires → `router.replace('/(tabs)')` | `app/_layout.tsx:166-169` |
| 16 | `accessibility_onboarded === false` → `AccessibilityQuestionnaire` mounts | `app/_layout.tsx:118-159` |
| 17 | 5 toggles: reduce_animations, no_haptics, high_contrast, larger_text, screen_reader | `src/components/AccessibilityQuestionnaire.tsx:32-63` |
| 18 | "Continue" → `completeOnboarding()` writes flag to profile | `src/components/AccessibilityQuestionnaire.tsx:80-84` |
| 19 | `PreferencesModal` mounts unless `skip_preferences_modal` set | `app/_layout.tsx:204-210` |
| 20 | Home tab: "Good morning, {firstName}.", 5s carousel of 7 suites, BOOK A VISIT / MY PASS buttons | `app/(tabs)/index.tsx:182-234` |

**Watch-outs:** Verification code is `Math.random()` and is **shown in the Alert** — production leak. Must integrate Twilio (which the website already has at `LoginPage.tsx:446-454`).

**Shoot:** step 3 (splash fade), step 5 (moss gradient + scale-spring logo), step 7 (step-dot indicator advancing), step 8 (member-number teaser), step 17 (toggles with haptics), step 20 (home tab greeting + carousel crossfade — **money shot**).

---

## FLOW 5 — App: returning login ✅ confirmed

Three sub-flows: email/password, Apple Sign-In, forgot password.

### 5a — Email/password

| # | Step | Source |
|---|------|--------|
| 1-5 | Same as Flow 4 steps 1-5 (splash → welcome) | — |
| 6 | Tap outlined cream "LOG IN" → `/(auth)/login?mode=signin` | `app/welcome.tsx:105-111` |
| 7 | Logo + "MASLOW" wordmark + "The Infrastructure of Dignity" stagger in (150ms) | `app/(auth)/login.tsx:108-141,564-582` |
| 8 | Gold vertical divider fades in | `app/(auth)/login.tsx:584-585` |
| 9 | Frosted-glass `BlurView` card slides in | `app/(auth)/login.tsx:587-597` |
| 10 | Enter email + password → tap "Enter" | `app/(auth)/login.tsx:622-657` |
| 11 | `supabase.auth.signInWithPassword` | `app/(auth)/login.tsx:232-235` |
| 12 | Listener fires `SIGNED_IN` → `router.replace('/(tabs)')` | `app/_layout.tsx:69-74,166-169` |
| 13 | If `!skip_preferences_modal`, `PreferencesModal` opens | `app/_layout.tsx:143-149` |

### 5b — Apple Sign-In (iOS only)

| # | Step | Source |
|---|------|--------|
| 1-9 | Same as 5a steps 1-9 | — |
| 10 | iOS + `appleAuthAvailable` → Apple button renders (black SIGN_IN style) | `app/(auth)/login.tsx:158-160,671-679` |
| 11 | Tap → `handleAppleSignIn` → `signInWithApple()` | `app/(auth)/login.tsx:276-292`, `lib/socialAuth.ts` |
| 12 | Native Apple sheet (Face ID / Touch ID) | OS-native |
| 13 | Session created → `_layout.tsx:69-74` routes to `/(tabs)` | — |

### 5c — Forgot password

| # | Step | Source |
|---|------|--------|
| 1 | Tap "Forgot password?" | `app/(auth)/login.tsx:658-660` |
| 2 | `resetPasswordForEmail(email, { redirectTo: 'maslow://reset-password' })` | `app/(auth)/login.tsx:253-256` |
| 3 | Alert "Check Your Email" | `app/(auth)/login.tsx:264-268` |
| 4 | Email link → deep link → `_layout.tsx:85-104` extracts tokens, sets session, routes to `/(auth)/reset-password` | — |

**Shoot:** step 7 (staggered title/tagline reveal), step 9 (frosted-glass card emerging), 5b step 12 (native Face ID — high-trust visual).

---

## FLOW 6 — App: booking a suite 🟡 partial

The flagship app flow. Real Stripe path; queue counts are randomized; webhook has a bug.

| # | Step | Source |
|---|------|--------|
| 1 | Tap "BOOK A VISIT" on Home, or BOOK tab | `app/(tabs)/index.tsx:213-222`, `app/(tabs)/_layout.tsx:13,21` |
| 2 | `BookScreen`: "Use It Now" gold + "Schedule a Visit" outlined | `app/(tabs)/locations.tsx:233-285` |
| 3 | Tap "Schedule a Visit" → `view='schedule'` | `app/(tabs)/locations.tsx:107-110` |
| 4 | Location cards fetched from `locations` table; show "X suites available" green dot or red "Fully booked" | `app/(tabs)/locations.tsx:70-88` |
| 5 | Tap a location → `router.push('/book/${location.id}')` | `app/(tabs)/locations.tsx:97-100` |
| 6 | `BookingFlowScreen` loads; fetches location, suites, profile, passes, session_types | `app/(tabs)/book/[locationId].tsx:488-585` |
| 7 | Auto-selects first available suite (skips suite-pick step) | `app/(tabs)/book/[locationId].tsx:568-571` |
| 8 | Progress bar + "Reserve Your Visit" header | `app/(tabs)/book/[locationId].tsx:735-762` |
| 9 | **Step `time`:** duration grid (10/15/30/60min from `session_types`); "Passes/Cash" toggle if user has passes | `app/(tabs)/book/[locationId].tsx:799-899` |
| 10 | Time-window selector: Morning / Afternoon / Evening / Late Night (counts are `Math.random()`!) | `app/(tabs)/book/[locationId].tsx:122-154,164-173` |
| 11 | **Step `environment`:** lighting slider, music vinyl-disc, temperature 68-76°F, bidet temp, heated seat | `app/(tabs)/book/[locationId].tsx` (env step) |
| 12 | **Step `samples`:** pick up to N from `session_types.sample_limit`; auto-trims if duration shrinks | `app/(tabs)/book/[locationId].tsx:454-475` |
| 13 | **Step `review`** | — |
| 14 | "Confirm" → `supabase.functions.invoke('create-payment-intent', { body: { session_type_id } })` | `app/(tabs)/book/[locationId].tsx:652-657` |
| 15 | `initPaymentSheet({ paymentIntentClientSecret, merchantDisplayName: 'Maslow' })` | `app/(tabs)/book/[locationId].tsx:666-670` |
| 16 | `presentPaymentSheet()` — native Stripe sheet slides up | `app/(tabs)/book/[locationId].tsx:675` |
| 17 | Success → `awaitingBooking=true`; subscribes to Supabase realtime on `sessions` table | `app/(tabs)/book/[locationId].tsx:694-714` |
| 18 | INSERT event from webhook → `router.replace('/(tabs)/pass')` (30s timeout fallback) | `app/(tabs)/book/[locationId].tsx:711,717-724` |

**Watch-outs:** Step 10 queue counts are random. Webhook (`api/stripe/webhook.ts`) has a duplicate `export const config` (lines 21 + 39) — may fail to deploy. 30s fallback advances to Pass tab even if webhook didn't fire (no real session row). `addToCalendar()` helper exists at `book/[locationId].tsx:28-59` but I found no call site after success — calendar add is not automatic.

**Shoot:** step 8 (progress bar + step header crossfade), step 11 (vinyl-disc audio selector — unique and distinctive), step 12 (sample selector with brand logos — Aesop, Le Labo, Drunk Elephant), step 16 (Stripe payment sheet sliding up — classic shot), step 18 ("Your Sanctuary Awaits!" → QR pass transition).

---

## FLOW 7 — App: buying credits ✅ confirmed (with caveat)

| # | Step | Source |
|---|------|--------|
| 1 | Entry from Profile, or auto from booking "Insufficient Passes", or from Quick Visit | `app/(tabs)/book/[locationId].tsx:863`, `quick-visit.tsx:182` |
| 2 | `BuyCreditsScreen` mounts; fetch `profiles.credits` | `app/(tabs)/buy-credits.tsx:45,56-75` |
| 3 | Fetch packages from `credit_packages` table | `app/(tabs)/buy-credits.tsx:77-113` |
| 4 | Bundle cards render; largest gets featured "BEST VALUE"; others get "SAVE $X" | `app/(tabs)/buy-credits.tsx:91-105` |
| 5 | Tap a bundle → highlight | `app/(tabs)/buy-credits.tsx:131-138` |
| 6 | Tap purchase → `refreshSession()` for fresh token | `app/(tabs)/buy-credits.tsx:151-159` |
| 7 | POST `${SUPABASE_URL}/functions/v1/create-payment-intent` with `{ credits, packageName }` | `app/(tabs)/buy-credits.tsx:162-176` |
| 8 | `initPaymentSheet` + `presentPaymentSheet` | `app/(tabs)/buy-credits.tsx:185-194` |
| 9 | On success → **client-side** `update profiles.credits = currentBalance + credits` | `app/(tabs)/buy-credits.tsx:202-206` |
| 10 | Insert into `credit_transactions` (try/catch) | `app/(tabs)/buy-credits.tsx:211-222` |
| 11 | Alert "✓ Purchase Complete — N credits added. New balance: M credits" | `app/(tabs)/buy-credits.tsx:227-230` |

**Watch-outs:** Crediting happens **client-side** after Stripe confirms. If user kills the app between confirm and DB update, money is taken but credits never apply — no server-side reconciliation webhook for credit purchases. This is a real-money risk and should be fixed before launch.

**Shoot:** step 4 (BEST VALUE / SAVE $X badges), step 8 (Stripe sheet), step 11 (success alert with balance update).

---

## FLOW 8 — App: transferring credits 🟡 partial

UI complete; gracefully degrades to "Coming Soon" if table missing; balance reconciliation broken.

| # | Step | Source |
|---|------|--------|
| 1 | `TransferCreditsScreen` mounts; fetch balance | `app/(tabs)/transfer-credits.tsx:32,55-78` |
| 2 | Form: recipient (email or `#member_number`), amount (numeric only), optional message | `app/(tabs)/transfer-credits.tsx:243-350` |
| 3 | Tap "Transfer" → validate inputs | `app/(tabs)/transfer-credits.tsx:106-141` |
| 4 | `findRecipient(input)` — searches `profiles` by email first, then by `member_number` | `app/(tabs)/transfer-credits.tsx:80-104` |
| 5 | Confirmation alert: "Transfer N credits to FirstName LastName? This action cannot be undone." | `app/(tabs)/transfer-credits.tsx:167-182` |
| 6 | Tap "Transfer" in alert → `executeTransfer` → insert into `credit_transfers` | `app/(tabs)/transfer-credits.tsx:197-205` |
| 7 | **Fallback:** If table missing (PG `42P01`) → "Coming Soon" alert + back | `app/(tabs)/transfer-credits.tsx:208-217` |
| 8 | Local `setUserBalance(prev - amount)` | `app/(tabs)/transfer-credits.tsx:222` |
| 9 | Alert "Transfer Complete! N credits sent to ..." | `app/(tabs)/transfer-credits.tsx:224-229` |

**Watch-outs:** Sender's balance is updated **locally only** — no DB write decrements `profiles.credits`. Recipient gets no profile increment. Source-of-truth balance is wrong after a transfer unless a DB trigger on `credit_transfers` handles it. No recipient notification.

**Shoot:** step 2 (clean form), step 5 (confirmation with full-name lookup), step 9 (success).

---

## FLOW 9 — App: Pass / Apple Wallet add ✅ confirmed UI / 🟡 partial backend

| # | Step | Source |
|---|------|--------|
| 1 | Tap PASS tab → `PassScreen` mounts | `app/(tabs)/_layout.tsx:22`, `app/(tabs)/pass.tsx:41` |
| 2 | Fetch profile (first/last name, tier, member_number, credits); re-fetches on focus | `app/(tabs)/pass.tsx:46-87` |
| 3 | Small centered logo | `app/(tabs)/pass.tsx:140-146` |
| 4 | Large QR (220x220, generous whitespace) — **note: static asset, same for every user** | `app/(tabs)/pass.tsx:148-155` |
| 5 | Tier label + gold "SCAN TO ENTER" | `app/(tabs)/pass.tsx:157-161` |
| 6 | Charcoal credits badge: large serif "{credits}" + gold "PASSES" | `app/(tabs)/pass.tsx:163-167` |
| 7 | Member number "#00XXX" | `app/(tabs)/pass.tsx:169` |
| 8 | Two wallet badges side-by-side: Apple + Google | `app/(tabs)/pass.tsx:173-197` |
| 9 | Tap Apple → `refreshSession()` for fresh token | `app/(tabs)/pass.tsx:100-105` |
| 10 | `Linking.openURL('https://maslow.nyc/api/generate-wallet-pass?token=...')` — leaves app for Safari | `app/(tabs)/pass.tsx:107-108` |
| 11 | Endpoint validates token via Supabase `v2` schema | `api/generate-wallet-pass.ts:25-36` |
| 12 | Builds `.pkpass` via passkit-generator with Apple certs | `api/generate-wallet-pass.ts:60-72` |
| 13 | Returns `application/vnd.apple.pkpass` blob | `api/generate-wallet-pass.ts:101-102` |
| 14 | iOS Safari prompts "Add to Apple Wallet" | iOS-native |
| 15 | Tap Google Wallet → "Coming Soon" alert | `app/(tabs)/pass.tsx:115-121` |

**Watch-outs:** Requires three cert env vars (`APPLE_PASS_CERT_PEM`, `APPLE_PASS_KEY_PEM`, `APPLE_WWDR_CERT_PEM`). The on-screen QR is a static image — currently every member shows the same QR. `maslow.nyc` URL is hardcoded — preview/staging builds still hit prod.

**Shoot:** step 4 (large clean QR), step 6 (charcoal credit badge), step 8 (Apple + Google badges side-by-side — iconic), step 14 (native iOS Wallet sheet — **the premium moment, hero shot**).

---

## FLOW 10 — App: in-suite Control 🚧 aspirational

UI is complete and feels alive. Nothing actually controls anything.

| # | Step | Source |
|---|------|--------|
| 1 | Entry: from `locations.tsx:117` after UseItNowFlow → `router.push('/control')` | `app/(tabs)/locations.tsx:116-117` |
| 2 | `ControlScreen` mounts with fadeAnim | `app/(tabs)/control.tsx:13,32-41` |
| 3 | Session timer starts incrementing (`setInterval(1s)`) | `app/(tabs)/control.tsx:44-49` |
| 4 | Header: "Restroom Controls" + "Customize your experience" | `app/(tabs)/control.tsx:123-126` |
| 5 | Timer card: large MM:SS + "End Session" button (only shows an alert — no actual unlock) | `app/(tabs)/control.tsx:128-143` |
| 6 | **Lighting:** brightness slider, temperature slider (2200K-6500K with 🔥/☀️/❄️ labels), 4 presets (Relaxing/Energizing/Mirror/Night) | `app/(tabs)/control.tsx:145-220,71-92` |
| 7 | **Audio:** volume slider + soundscape picker | `app/(tabs)/control.tsx:101-105` |
| 8 | **Air:** fan speed buttons + UV cycle (30s countdown, completion alert) | `app/(tabs)/control.tsx:107-111,51-63` |
| 9 | Every control fires `Haptics.impactAsync` — no backend writes | — |

**Watch-outs:** Nothing persists. Closing the screen loses settings. "End Session" doesn't end anything. UV cycle is purely visual. Session timer starts at 0 every mount — not tied to real booking duration.

**Shoot:** step 5 (large session timer ticking up), step 6 (temperature slider with emoji icons), step 6 (2x2 preset grid), step 8 ("✨ Air sanitization finished!" alert).

---

## FLOW 11 — App: Quick Visit walk-up 🟡 partial

Route appears orphaned. The "Use It Now" button on the BOOK tab actually opens an in-page modal, not this route.

| # | Step | Source |
|---|------|--------|
| 1 | "Use It Now" on BOOK tab opens `UseItNowFlow` overlay — NOT `/quick-visit` | `app/(tabs)/locations.tsx:102-105,245-257` |
| 2 | `/quick-visit` is hidden from tab bar | `app/(tabs)/_layout.tsx:171` |
| 3 | If reached directly: `QuickVisitScreen` mounts | `app/(tabs)/quick-visit.tsx:27` |
| 4 | Fetch locations + active credits (status='active', expires_at future) | `app/(tabs)/quick-visit.tsx:35-78` |
| 5 | Header: "Quick Visit" with X close | — |
| 6 | Price card with lightning icon + Credits/Cash toggle + "1 credit / $5" + "10 minutes • No reservation needed" | `app/(tabs)/quick-visit.tsx:105-189` |
| 7 | If credits < 1: inline "Buy more" → `/buy-credits` | `app/(tabs)/quick-visit.tsx:179-187` |
| 8 | "Available Now" lists locations | `app/(tabs)/quick-visit.tsx:192-` |
| 9 | Tap location → `router.push('/book/${location.id}?quick=true')` — delegates to Flow 6 | `app/(tabs)/quick-visit.tsx:85-88` |

**Watch-outs:** The `?quick=true` query is passed but **never read** in `book/[locationId].tsx`. So Quick Visit behaves identically to a normal booking. Credit balance shown here (`credits` table) can drift from balance on Pass tab (`profiles.credits`).

**Shoot:** step 6 (gold lightning bolt circle, payment toggle pill).

---

## FLOW 12 — App: Events → add to native calendar ✅ confirmed

| # | Step | Source |
|---|------|--------|
| 1 | `/events` route not in tab bar — reached from Profile/nav | `app/(tabs)/_layout.tsx:166` |
| 2 | `EventsScreen` mounts | `app/(tabs)/events.tsx:106` |
| 3 | Fetch upcoming events (`status='upcoming'`, `starts_at >= now`, asc) | `app/(tabs)/events.tsx:127-148` |
| 4 | Fetch user RSVPs joined on `rsvp_status='going'` | `app/(tabs)/events.tsx:163` |
| 5 | Header: "Events / Discover Experiences" | `app/(tabs)/events.tsx:572-576` |
| 6 | Category chips: All / My Events / Cultural / Children's / Dancing / Learning / Wellness / Social / Nightlife (each distinct color) | `app/(tabs)/events.tsx:47-57` |
| 7 | Event cards: color stripe, date/time, title, attendee count | `app/(tabs)/events.tsx:312-` |
| 8 | Tap card → modal opens | `app/(tabs)/events.tsx:289-292` |
| 9 | Modal: full details, tags, "About this Event" | `app/(tabs)/events.tsx:513-531` |
| 10 | Tap "RSVP now" → insert with `rsvp_status='going'` | `app/(tabs)/events.tsx:201-282` |
| 11 | After RSVP: "Add to Calendar" button appears | `app/(tabs)/events.tsx:534-563` |
| 12 | Tap → `formatEventForCalendar` + `addEventToCalendar` (uses `expo-calendar`) | `app/(tabs)/events.tsx:296-309`, `src/utils/calendar` |
| 13 | Native iOS calendar permission prompt (first time) → success haptic + Alert | OS-native |

**Watch-outs:** Past events disappear from "My Events" — no attendance history view. Can't add to calendar without RSVPing first.

**Shoot:** step 6 (color-coded category chips — visual rhythm), step 8 (modal slide-up with image), step 13 (native calendar permission prompt — high-trust moment).

---

## Production blockers surfaced during this audit

These are real bugs / leaks that the research surfaced. Address before any public-launch ramp:

1. **`api/stripe/webhook.ts` has duplicate `export const config`** at lines 21 and 39. One silently shadows the other; may fail TS strict compile or Vercel deploy.
2. **App signup verification code is leaked in Alert dialog** at `app/(auth)/login.tsx:389,508` ("[DEV MODE: Code is 123456]"). Must integrate Twilio Verify (which the website already uses at `LoginPage.tsx:446-454`).
3. **`/api/stripe/create-payment-intent` does not exist** in the website's `api/` directory. Referenced by `src/components/BookingSection.tsx:71` for `/go` walk-up checkout. Will 404 in production.
4. **Presale placeholder Stripe URLs** at `src/pages/HomePage.tsx:569,576,583,590,597,605` are literally `https://buy.stripe.com/PLACEHOLDER_*`. Flipping `PRESALE_VISIBLE` to `true` without fixing these = every Reserve button 404s.
5. **Presale modal tier IDs don't match edge function enum.** Modal supports tier names like "Home Brick" / "Hull Brick" / "Both Bricks" / "Starter Bundle"; `supabase/functions/create-presale-intent/index.ts:8-12` only accepts `single | five_pack | twelve_pack | founding`. If the homepage is rewired to use the modal, most tiers error.
6. **Credit transfer doesn't update profile balances.** `app/(tabs)/transfer-credits.tsx:191-241` inserts into `credit_transfers` but never decrements sender's `profiles.credits` or increments recipient's. Needs a DB trigger on insert.
7. **Credit purchase is client-side.** `app/(tabs)/buy-credits.tsx:202-206` updates the balance in the app after Stripe confirms. If user kills the app between Stripe confirm and DB write, money is taken but credits never apply. No webhook reconciliation.
8. **App Pass QR is a static image** (`assets/qr-code.png`) — every member shows the same QR on screen. Only the Apple Wallet pass contains member-specific data.
9. **Booking queue counts are randomized** at `app/(tabs)/book/[locationId].tsx:164-173`. Looks alive but isn't real data.
10. **Booking 30s timeout** at `app/(tabs)/book/[locationId].tsx:717-724` silently advances to Pass tab even if Stripe webhook didn't fire. User reaches the success state without a real `sessions` row.

---

## How to use this document

1. **Walk through each flow on a real device** — phone for the app, mobile Safari for the web. Tick off each step. Anything that doesn't render or behaves differently = update the status tag here.
2. **Shot list** — every "Shoot:" line is a candidate reel beat. Most distinctive moments are noted; favor native OS prompts (Stripe sheet, Apple Wallet sheet, calendar permission) for trust-signal shots and brand-specific moments (vinyl-disc audio, sample tray, member-number teaser) for product-distinctive shots.
3. **Avoid filming aspirational/partial flows** without flagging — the Control screen (Flow 10) will look great in a clip but doesn't actually control anything. Either film it knowing that's the case or wait until backend is wired.
