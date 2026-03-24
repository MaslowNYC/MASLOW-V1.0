# MASLOW CAPTAIN'S LOG
**Living document. Updated at the end of every Claude session.**
**Last updated: March 23, 2026 (evening)**

---

## STANDING PROMPT (paste this at the top of every new chat)

> "I'm Patrick May, founder of Maslow NYC (maslow.nyc). Read MASLOW_CAPTAINS_LOG.md in the project files for current context before responding. Be casual but direct. No cheerleader tone. Help me avoid wormholes and technical debt. MVP first."

---

## WHAT MASLOW IS

Premium private restroom suites ("personal care sanctuaries") in SoHo, NYC. 
**The principle:** "Premium is the floor, not an upgrade."
**NOT** civic tech or bathroom advocacy. This is a hospitality/luxury product.

**Flagship:** 12 suites, 6AM–4AM. The Hull (free cultural living room) 7AM–10PM. ~3,000 sq ft. Target streets: Wooster/Crosby/Greene/Grand at $150–200/sq ft/yr.

**Brand colors:** Blue #286BCD · Cream #FAF4ED · Gold #D4AF6A

---

## CURRENT BUILD STATE (as of March 23, 2026)

### ✅ Done
- Mobile app (React Native/Expo) live on Google Play Internal Testing + Apple TestFlight
- Stripe integration complete
- Session types configurable (no longer hardcoded)
- maslow.nyc/go page — live (walk-up web path for guests with no app)
- Booking flow exists in app
- Survey live with Q1/Q2 fields saving; notify-founder emails should fire on submit (needs verification)
- Apple Wallet edge function v33 working and returning valid signed .pkpass

### 🔜 Next Up: ESP32 Hardware Integration
- Supabase Realtime → ESP32 console (suite control: UV-C, lighting, door lock)
- This is the current build frontier

### 🟡 Pending / Needs Attention
- **Apple Wallet Build 77** — Cline prompt ready. In pass.tsx and profile.tsx, replace wallet handler with Linking.openURL to the Supabase edge function URL with session token as query param.
- **Revenue dashboard** — update rent from $70K to $85K, sqft to 3,700. Cline prompt ready.
- **Survey test submission** — verify notify-founder email fires.
- **Gold color update** — change #C49F58 → #D4AF6A across MASLOW-V1.0 and MASLOW-App on next push.
- **Mount Maslow illustration** — want to see style options (sharpie cartoon, navy/cream/gold, Muhammad shown as footprints only).
- **Backlash/acquisition-resistance conversation** — pending from WhatsApp thread.

### ❌ Not Started Yet
- Architectural renderings (needed before Alma outreach and city/real estate contacts)
- Covert distress signal button (Phase 2, needs Safe Horizon partnership + legal review)

---

## DESIGN PHILOSOPHY (confirmed March 23)

**One sentence:** Everything communal is NYC reclaimed and reborn. Everything inside the suite is fresh, premium, and new. The contrast is the point.

**Communal / shared spaces — reclaimed NYC**
- Terrazzo vanities: made from broken colorful NYC toilets (rainbow or Maslow blue specks), mounted on Zanzibar chests as the bathroom vanity base. Cat decides fixtures.
- Guest hallway floors: salvaged wood via Big Reuse partnership (Brooklyn, mission-aligned)
- Hull floors: reclaimed NYC brick, split to veneer/paver thickness (half weight, half material, full look). Moss joints. Masonry partner needed.
- Hull back wall: paludarium with waterfall — Patrick and Zelda build it. This is the origin story. Reference: Foxy Loxy Cafe, Savannah GA.
- Qibla direction marked quietly in every suite and the Hull for prayer

**Inside the suite — fresh, new, premium**
- Toto Neorest sets the tone
- Teak benches (Patrick builds) — beautiful, easy to clean, durable
- Everything else new and high-end — guests feel like it's theirs, not borrowed
- Suite floors: only new materials in the build (subject to change)

**Design team:** Cat, Dayna, and the GOBs. Patrick gives them fixtures + dimensions, they decide the rest. Abby especially — she'll get it immediately.

---

## TECH STACK

- **Mobile:** React Native / Expo → GitHub: MaslowNYC/MASLOW-App
- **Website:** React / Vite → GitHub: MaslowNYC/MASLOW-V1.0
- **Database/Auth/Realtime:** Supabase (project ID: hrfmphkjeqcwhsfvzfvw)
- **Payments:** Stripe (Apple Pay + Google Pay in scope)
- **Hardware:** ESP32 microcontrollers
- **Hosting:** Vercel
- **Coding tool:** Cline in Cursor (Patrick runs code here, uses Claude for strategy/architecture)

---

## FINANCIALS / REVENUE MODEL

- **OPEX:** $111K at $70K rent → break-even at 59% utilization
- **Stress test:** $85K rent (3,700 sqft on Wooster)
- **Key framing:** "Utilization gets us in the door. Ticket mix gets us to profitability. Brand placements get us to margin."

---

## UPCOMING DEADLINES

| Date | What |
|------|------|
| **Tue Mar 24, 10AM** | SCORE Zoom with Carolyn Katz |

---

## CAROLYN KATZ (SCORE) — STATUS

- Former Goldman Sachs MD, runs SCORE's funding department
- Called Patrick "the most prepared entrepreneur she'd met" on first call
- Has admin access to maslow.nyc (hasn't logged in yet as of Mar 23)
- **Last contact:** Mon Mar 16 — Patrick sent updated business plan (v4), gave her admin login, pointed her to buildout planner, session pricing, stack, guest journeys in admin dashboard
- Carolyn's last reply (Mar 16): "Oh, thanks. I now see the buildout was in there; I missed it."
- **Tomorrow's call (Mar 24, 10AM):** Second meeting. She has the full plan. Good relationship, no prep needed beyond re-reading the thread. Key topics she's been focused on: startup/buildout costs, capital requirements.

---

## KEY PEOPLE

### Inner Circle / Real Sounding Board
| Person | Who | Notes |
|--------|-----|-------|
| **Cat** | Wife, holds voting rights | Name is Cat, not Kat |
| **Dayna** | Close friend | Low drama, high signal. Thinks about Maslow unprompted. Sharp product feedback. |
| **Danny** | Lara's husband | Recommended SCORE. Honest model skeptic. Engages with details. |
| **Christina** | Business Director, Vignoly NYC | Daughters friends with Zelda. Patrick building radiator covers for them. Low-pressure genuine interest. |
| **Adam** | Works at Google | One of two people Patrick tells the full truth to. Tests Android app. Want to shoot NYC neighborhoods together (Patrick has Fuji X100V). |

### The GOBs (Cat's friend group, all on 10th St — 5 blocks away)
| Person | Who | Notes |
|--------|-----|-------|
| **Abby** | Mike's wife, Cat's best friend | Great design eye. Father is NatGeo photographer. |
| **Jeanne** | David's wife | AWS Marketing. Enterprise intro potential: UPS/DoorDash/delivery for corporate wellness. |
| **Emily** | Rowan's mom | EA to a literal billionaire. Potential Sovereign check writer ($25K without blinking). |
| **Mike** | Abby's husband | Sr. Software Dev, Capital One (formerly MTA IT). Technical sounding board. |
| **David** | Jeanne's husband | Tax attorney. Useful when structure gets complex. |

### Lil' Gobs
Ruby (Abby/Mike — Zelda's best friend), Clementine (Jeanne/David — camping), Rowan (Emily's son)

### Warm Maslow Contacts
| Person | Who | Status |
|--------|-----|--------|
| **Matthew** | Coca-Cola VP (Cat's coworker Jamie's husband) | Running World Cup campaign, on road through Aug, moving to Atlanta. Replied to blank text. Said "happy to find time to chat." Draft reply ready — needs to be sent. |
| **Carolyn Katz** | SCORE mentor | See section above. Call tomorrow 10AM. |

### Professional
| Person | Who |
|--------|-----|
| **Lenore Horton** | Attorney, Horton Legal Strategies PLLC. SEC compliance, operating agreement, trademark. |
| **Yunus Çelik / Studio BY** | Architect |
| **Archi Sami** | Fiverr renderer, $65/render |

### Family
- **Cat** — wife
- **Zelda** — daughter, age 7. Shares workshop at 7th Ave & 15th St, Park Slope.
- **Max** — son, turns 18 on 5/24. Patrick hopes he goes to SCAD for architecture; worried he'll choose UNCC to stay near his mom.

---

## CODE QUALITY STANDARD (non-negotiable)
The codebase — site, app, and database — should be elegant and intentional. Not AI slop. The kind of thing you can show a Sr. Software Dev at Instagram or Capital One without apologizing for shortcuts. This means:
- No workarounds that expose security gaps (tokens in URLs, client-trusted amounts)
- No dead code sitting in production (concierge-chat)
- No duplicate systems coexisting (two cert approaches in wallet)
- Every fix done the right way, not the fast way
- If we're going around our ass to get to our elbow, we stop and do it right

---

## PATRICK'S WORKING PRINCIPLES (enforce these)

- **MVP first, perfect later** — guardrail against scope creep
- **Honest pushback requested** — no cheerleading, real assessment
- **Learning-first** — explain the why, not just the what
- **Scope check before committing** — pause and understand before executing
- **Cline for code, Claude for strategy/architecture/docs**
- **Drafts to patrick@maslow.nyc first** before any external send

---

## OPEN DECISIONS / PARKING LOT

- Matthew text reply — draft ready, needs to be sent
- Backlash/acquisition-resistance strategy — started, not resolved
- Mount Maslow illustration styles — haven't seen options yet
- Alma outreach (real estate/city contacts) — waiting on architectural renderings
- Seth (Drunk History writer) — Hull brand voice/content, medium term
- Big Reuse partnership email — send once space is secured
- Community-first capital strategy — imams + Flatbush community leaders before Sovereign pitch. Brief Carolyn on this tomorrow.
- **Apple Wallet** — refreshSession() fix pushed (49b52c4), needs physical device test. After confirmed working: move token to Authorization header (not query param — tokens visible in logs right now).
- **Credit purchase amount** — server should look up price from session_types, not trust client-sent amount. Medium priority security gap.
- **Orphaned secrets** — APPLE_WALLET_P12_BASE64, APPLE_WALLET_P12_PASSWORD, APPLE_PASS_CERTIFICATE, APPLE_WWDR_CERT are unused. Clean up after wallet is confirmed working.
- **Concierge-chat edge function** — dead code, returns 503 immediately. Delete or document.
- **Full codebase elegance audit** — site, app, database. Bring to the standard you'd show Mike (Capital One) and Viktor (Instagram) without apologizing.

---

## END OF SESSION CHECKLIST

Before closing a chat, update:
1. "Current Build State" — what got done, what moved to next
2. "Upcoming Deadlines" — add/remove/check off
3. "Open Decisions" — add new items, remove resolved ones
4. "Last updated" date at top

---

*This document lives in the MASLOW-V1.0 repo root as MASLOW_CAPTAINS_LOG.md*
