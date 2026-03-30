import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getFieldNoteBySlug, formatDate } from '@/data/fieldNotes';

const FieldNotePost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const note = slug ? getFieldNoteBySlug(slug) : undefined;

  if (!note) {
    return <Navigate to="/field-notes" replace />;
  }

  // Convert content newlines to paragraphs
  const paragraphs = note.content.split('\n\n').filter(p => p.trim());

  return (
    <div className="min-h-screen bg-[#FAF4ED]">
      <Helmet>
        <title>{note.title} — Maslow</title>
        <meta name="description" content={note.excerpt} />
        <meta property="og:title" content={`${note.title} — Maslow`} />
        <meta property="og:description" content={note.excerpt} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="max-w-[680px] mx-auto px-4 py-16">
        {/* Back Link */}
        <Link
          to="/field-notes"
          className="inline-block text-sm text-[#2A2724]/50 hover:text-[#2A2724] transition-colors mb-12"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          ← Field Notes
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <h1
            className="text-3xl md:text-[40px] text-[#2A2724] mb-4 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {note.title}
          </h1>
          <div
            className="flex flex-wrap items-center gap-3 text-sm text-[#2A2724]/50"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            <span>{formatDate(note.date)}</span>
            <span className="text-[#2A2724]/30">·</span>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-[#5A7247]/10 text-[#5A7247]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-lg text-[#2A2724] mb-6 leading-relaxed"
              style={{
                fontFamily: "'Jost', sans-serif",
                lineHeight: '1.8'
              }}
            >
              {paragraph}
            </p>
          ))}
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#2A2724]/10">
          <Link
            to="/field-notes"
            className="inline-block text-sm text-[#D4AF6A] hover:text-[#2A2724] transition-colors"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            ← Back to Field Notes
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default FieldNotePost;
