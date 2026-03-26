import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { fieldNotes, formatDate } from '@/data/fieldNotes';

const FieldNotesIndex: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF4ED]">
      <Helmet>
        <title>Field Notes — Maslow</title>
        <meta
          name="description"
          content="Writing on restroom culture, city infrastructure, human dignity, and the spaces between."
        />
        <meta property="og:title" content="Field Notes — Maslow" />
        <meta property="og:description" content="Writing on restroom culture, city infrastructure, human dignity, and the spaces between." />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Page Header */}
        <div className="mb-16">
          <span
            className="text-xs tracking-[0.2em] uppercase text-[#C49F58] mb-4 block"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            FIELD NOTES
          </span>
          <h1
            className="text-3xl md:text-4xl text-[#2A2724] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Writing on restroom culture, city infrastructure, and human dignity.
          </h1>
        </div>

        {/* Posts List */}
        <div className="space-y-8">
          {fieldNotes.map((note) => (
            <Link
              key={note.slug}
              to={`/field-notes/${note.slug}`}
              className="block group"
            >
              <article
                className="p-6 bg-white border-l-4 border-transparent group-hover:border-[#C49F58] group-hover:bg-[#FAF4ED]/50 transition-all duration-200"
              >
                <h2
                  className="text-xl md:text-2xl text-[#2A2724] mb-2 group-hover:text-[#C49F58] transition-colors"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {note.title}
                </h2>
                <p
                  className="text-sm text-[#2A2724]/50 mb-3"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {formatDate(note.date)}
                </p>
                <p
                  className="text-[#2A2724]/70 mb-4"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {note.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-[10px] uppercase tracking-wider bg-[#5A7247]/10 text-[#5A7247]"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldNotesIndex;
