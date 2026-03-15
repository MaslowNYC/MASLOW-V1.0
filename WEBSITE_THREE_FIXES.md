# WEBSITE THREE FIXES
**Date:** March 13, 2026  
**Repo:** MASLOW-V1.0  
**Deploy after:** `vercel --prod`

---

## FIX 1 — Meta tags on HomePage.tsx
**File:** `src/pages/HomePage.tsx`

Find this block (lines ~17-21):
```
<title>Maslow NYC — Private Suites in SoHo, NYC</title>
<meta name="description" content="Premium private restroom suites in SoHo. Book a session from $5. Walk up, scan the QR, or reserve in advance." />
<meta property="og:title" content="Maslow NYC — Private Suites in SoHo, NYC" />
<meta property="og:description" content="Premium private restroom suites in SoHo. Book a session from $5. Walk up, scan the QR, or reserve in advance." />
```

Replace with:
```
<title>New York's First Real Restroom — Maslow NYC</title>
<meta name="description" content="Not a stall. Not a hotel lobby. Private restroom suites in SoHo, NYC. From $5." />
<meta property="og:title" content="New York's First Real Restroom — Maslow NYC" />
<meta property="og:description" content="Not a stall. Not a hotel lobby. Private restroom suites in SoHo, NYC. From $5." />
```

---

## FIX 2 — SoHo label color on HomePage.tsx
**File:** `src/pages/HomePage.tsx`

Find this (the "SoHo, New York City" label, ~line 36):
```
style={{ color: 'var(--gold)', fontFamily: 'var(--sans)' }}
>
  SoHo, New York City
```

The `--gold` color is hard to read on the hero image. Change to `--cream`:
```
style={{ color: 'var(--cream)', fontFamily: 'var(--sans)' }}
>
  SoHo, New York City
```

NOTE: Only change this ONE instance (the SoHo label). Do NOT change other gold text on the page.

---

## FIX 3 — Sovereign button email on MembershipPage.tsx
**File:** `src/pages/MembershipPage.tsx`

Find (~line 183):
```
onClick={() => window.location.href = 'mailto:patrick@maslow.nyc?subject=Sovereign%20Allocation%20Inquiry'}
```

Replace with:
```
onClick={() => window.location.href = 'mailto:hello@maslow.nyc?subject=Sovereign%20Allocation%20Inquiry'}
```

---

## FIX 4 — Back to Top button in Footer.tsx
**File:** `src/components/Footer.tsx`

Find the Bottom Bar section:
```
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © 2026 Maslow NYC. {t('footer.allRightsReserved')}
          </p>
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <ShieldCheck className="w-3 h-3" />
            <span>{t('footer.secureInfrastructure')}</span>
          </div>
        </div>
```

Replace with:
```
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © 2026 Maslow NYC. {t('footer.allRightsReserved')}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-white/40 hover:text-white/80 text-xs uppercase tracking-widest transition-colors"
            style={{ fontFamily: 'var(--sans)' }}
          >
            ↑ Back to Top
          </button>
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <ShieldCheck className="w-3 h-3" />
            <span>{t('footer.secureInfrastructure')}</span>
          </div>
        </div>
```

---

## AFTER ALL FIXES
From your terminal, in the MASLOW-V1.0 directory:

```bash
git add -A
git commit -m "fix: update meta tags, email, SoHo color, add back to top"
vercel --prod
```
