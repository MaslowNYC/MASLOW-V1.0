# CLINE BRIEF: Research Statement Page — maslow.nyc/research

## What You're Building

A single, simple public page at `maslow.nyc/research`. Its only job: establish that Maslow's field research is legitimate, intentional, and community-driven. When Patrick shows this to a city agency, a partner, or a journalist, it communicates credibility.

---

## Route & Files

- Route: `/research` — public, no auth guard
- Create: `src/pages/ResearchPage.tsx`
- Modify: `src/App.tsx` — add `/research` route

---

## Design

Use existing Maslow tokens. Same design language as maslow.nyc.
- Background: `var(--color-ivory)`
- Headings: Cormorant Garamond, navy
- Body: Jost, navy
- Gold for dividers or emphasis
- Minimal. Should feel like a printed research prospectus, not a landing page.

---

## Page Content (use this text exactly)

**Browser tab title:** `Unseen Standards | Maslow NYC Research`

### Hero
```
Unseen Standards
A community research initiative by Maslow NYC
```

### Research Statement
```
Maslow NYC is conducting anonymous community research into the cultural,
religious, and personal hygiene practices of New Yorkers — with the goal of
designing restroom spaces that work for everyone who lives, works, and moves
through this city.

Our research is guided by a simple belief: the people who will use a space
should shape how it's built. We're not studying communities from a distance.
We're listening, in person, in every neighborhood.
```

### What We're Researching

Display as a clean list (no bullets — use subtle gold left-border or spacing):

```
Water use and hygiene methods
Religious and ritual washing practices
Privacy needs and expectations
Time and duration requirements
Product and ingredient preferences
Signage and language accessibility
```

### How We Collect Data

```
All responses are completely anonymous. We collect no names, email addresses,
or identifying information. Responses are stored separately from any Maslow
guest account data and cannot be linked to an individual.

Research is collected in two ways:

In-person conversations — Maslow's founder conducts brief, voluntary
conversations in public spaces across New York City.

Online survey — Available at maslow.nyc/survey, open to anyone.

By participating, you consent to your anonymous response being used to inform
the design of Maslow NYC restroom facilities and future public restroom
initiatives in New York City.
```

### What We Do With the Data

```
Research findings directly inform how we design every Maslow suite — from
fixture placement and product selection to signage and water access. As our
dataset grows, we intend to share aggregated, anonymized findings with New
York City agencies and community organizations working on public restroom
access and infrastructure.

This data is never sold. It is never used for advertising. It belongs to the
community that helped build it.
```

### CTA Section

```
Want to contribute?
[Take the survey →]   ← links to /survey

Questions about the research?
patrick@maslow.nyc    ← mailto: link
```

### Footer note (small, muted)

```
Maslow NYC · SoHo, New York · maslow.nyc
```

---

## Do NOT Build

- No data visualizations or charts (no data yet)
- No findings section
- No partner logos
- No email signup form
- No social share buttons

---

## Acceptance Criteria

- [ ] Loads at /research with no auth
- [ ] Clean on mobile (375px) and desktop
- [ ] "Take the survey" links to /survey
- [ ] patrick@maslow.nyc is a mailto: link
- [ ] Matches Maslow design system
