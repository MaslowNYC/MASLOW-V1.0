# ADMIN DASHBOARD REFRESH BRIEF
Date: March 15, 2026
Repo: MASLOW-V1.0
Priority: High — Carolyn Katz (SCORE mentor) has admin access and will be reviewing

## GOAL
Make the admin dashboard feel as cohesive and beautiful as the public site.
Carolyn loved the revenue model — every tab should give that same impression.
"Even the admin page is beautiful" is the standard.

---

## CHANGE 1 — Brand Colors (AdminFundingDashboard.tsx)

File: src/components/AdminFundingDashboard.tsx

The entire admin is using the OLD brand blue #3C5999.
Replace ALL instances of #3C5999 with var(--navy) equivalent: #1C2B3A
Replace ALL instances of #FAF4ED with var(--cream): #F8F7F4
Keep #C49F58 (gold) — that's correct.
Keep #2A2724 (warm charcoal) — that's correct.

This is a find-and-replace across the entire file:
- "#3C5999" → "#1C2B3A"
- "#FAF4ED" → "#F8F7F4"

---

## CHANGE 2 — Build-Out Planner: Fix Suite Count

File: src/components/AdminFundingDashboard.tsx

In the buildOutData state, find and fix these incorrect suite references:

WRONG: { label: 'Suite Pods (8 units)', amount: 80000 }
RIGHT: { label: 'Suite Pods (10 units)', amount: 100000 }

WRONG: { label: 'Plumbing (8 suites)', amount: 40000 }
RIGHT: { label: 'Plumbing (10 suites)', amount: 50000 }

Also in the Dashboard.tsx Project Status card:
WRONG: "2,000 sq ft, 8-10 suites"
RIGHT: "2,500 sq ft, 10 suites"

Also in the PDF export header/body anywhere it says "8 suites" — update to "10 suites".

---

## CHANGE 3 — Admin Dropdown: Replace Field Research Link

File: src/components/Header.tsx

Find the admin dropdown menu in the Header component.
Find any link to /admin/field-research and replace it with a link to /research
Label it "Unseen Standards Research" instead of "Field Research"

Also check if there is a link to /admin/research-results — if so, remove it entirely
(the new research lives at /research, not /admin/research-results)

---

## CHANGE 4 — Remove Old Field Research Routes from App.tsx (OPTIONAL - confirm first)

File: src/App.tsx

The routes /admin/field-research and /admin/research-results still exist.
Do NOT delete these yet — just confirm they exist and note them for Patrick to decide.
Patrick may want to keep them temporarily while transitioning.

---

## CHANGE 5 — Admin Dashboard Header Polish

File: src/components/AdminFundingDashboard.tsx

The loading screen says "VERIFYING SECURITY CLEARANCE..." in old blue.
Update the loading screen color from text-[#3C5999] to text-[#1C2B3A].

The main dashboard has no header/title at the top before the tabs.
Add a simple clean header above the tab bar:

```tsx
<div className="mb-6 pt-8">
  <div className="flex items-center gap-3 mb-1">
    <img src="/MASLOW - Square.png" alt="Maslow" className="h-8 w-8" />
    <h1 className="text-2xl font-serif font-bold tracking-widest" style={{ color: 'var(--navy, #1C2B3A)' }}>
      MASLOW
    </h1>
  </div>
  <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--gold, #C49F58)', fontFamily: 'var(--sans)' }}>
    Admin Dashboard
  </p>
</div>
```

---

## CHANGE 6 — Prototypes Page Update

File: src/pages/prototypes/PrototypesPage.tsx (or wherever the prototypes page lives)

Add the NFC Door Lock prototype to the prototype list:
- Name: NFC Door Lock
- Category: Hardware / Access Control
- Status: In Progress
- Description: ESP32 + PN532 NFC reader + electric strike lock. 
  Tap any NFC card or phone to unlock. Logs all access to Supabase.
  Workshop-scale prototype of the Maslow suite door system.
- Budget: ~$50
- This IS Prototype 3B (Door Lock + Security) at workshop scale

Also update any hardcoded suite count references in the prototypes page from "8" to "10".

---

## AFTER ALL CHANGES

```bash
git add -A
git commit -m "fix: admin brand refresh, suite count corrections, research nav update"
vercel --prod
```
