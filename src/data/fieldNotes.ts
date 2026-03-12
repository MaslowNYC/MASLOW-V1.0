export interface FieldNote {
  slug: string;
  title: string;
  date: string; // ISO format: "2026-03-11"
  excerpt: string;
  content: string;
  tags: string[];
}

export const fieldNotes: FieldNote[] = [
  {
    slug: "why-we-built-maslow",
    title: "Why We Built Maslow",
    date: "2026-03-11",
    excerpt: "Eight and a half million people. Eleven hundred public restrooms. The math has never made sense.",
    content: `Eight and a half million people live in New York City. There are fewer than 1,100 public restrooms.

That gap is not inconvenience. It is daily indignity — imposed on workers, tourists, parents, people with medical needs, and anyone who doesn't have $7 to justify using a Starbucks.

Maslow exists because we believe the floor should be higher. Not as a charity. As a business. Premium is not an upgrade — it's the starting point.

We're building in SoHo first. Ten suites. Automated sanitization. Walk-up access. No membership required.

This is Field Notes — where we think out loud about what we're building, why restrooms matter, and what the city could be.`,
    tags: ["origin", "mission"],
  },
  {
    slug: "japan-and-the-dignity-of-the-restroom",
    title: "Japan and the Dignity of the Restroom",
    date: "2026-03-11",
    excerpt: "In Japan, the restroom is not something to apologize for. It is something to be proud of.",
    content: `Coming soon.`,
    tags: ["culture", "japan"],
  },
];

export function getFieldNoteBySlug(slug: string): FieldNote | undefined {
  return fieldNotes.find(note => note.slug === slug);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
