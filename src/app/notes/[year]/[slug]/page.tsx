import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllNotes, getNoteBySlug, getAdjacentNotes, formatNoteDate } from '@/lib/notes';
import ProseContent from '@/components/ProseContent';
import { siteUrl, fullName } from '@/data/profile';

type Props = {
  params: Promise<{ year: string; slug: string }>;
};

export async function generateStaticParams() {
  return getAllNotes().map((note) => ({
    year: note.year,
    slug: note.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, slug } = await params;
  const note = await getNoteBySlug(year, slug);
  const url = `${siteUrl}/notes/${year}/${slug}`;
  return {
    title: note.title,
    description: note.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: `${note.title} — Kevin Wei`,
      description: note.excerpt,
      url,
      publishedTime: note.date,
      authors: [fullName],
    },
    twitter: {
      card: 'summary',
      title: `${note.title} — Kevin Wei`,
      description: note.excerpt,
    },
  };
}

export default async function NotePage({ params }: Props) {
  const { year, slug } = await params;
  const note = await getNoteBySlug(year, slug);
  const { newer, older } = getAdjacentNotes(year, slug);

  const formattedDate = formatNoteDate(note.date);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: note.title,
    description: note.excerpt,
    datePublished: note.date,
    author: { '@type': 'Person', name: fullName, url: siteUrl },
    url: `${siteUrl}/notes/${year}/${slug}`,
  };

  return (
    <section className="py-[72px] px-6" style={{ background: 'var(--bg-primary)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-[68ch] mx-auto">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--accent)] hover:underline mb-8"
        >
          <ArrowLeft size={14} />
          Back to Notes
        </Link>

        <header className="mb-10">
          <h1 className="font-serif text-[28px] font-bold text-[var(--text-primary)] leading-[1.2] mb-3">
            {note.title}
          </h1>
          <p className="text-[var(--text-muted)] text-[13px]" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formattedDate} · {note.readingMinutes} min read
          </p>
        </header>

        <ProseContent html={note.contentHtml} />

        {(older || newer) && (
          <nav
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-14 pt-8 border-t border-[var(--border)]"
            aria-label="Adjacent notes"
          >
            <div>
              {older && (
                <Link href={`/notes/${older.year}/${older.slug}`} className="group block no-underline">
                  <span className="block text-[13px] text-[var(--text-muted)] mb-1">← Older</span>
                  <span className="block font-serif text-[16px] text-[var(--text-primary)] leading-[1.4] group-hover:text-[var(--accent)] transition-colors duration-200">
                    {older.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="sm:text-right">
              {newer && (
                <Link href={`/notes/${newer.year}/${newer.slug}`} className="group block no-underline">
                  <span className="block text-[13px] text-[var(--text-muted)] mb-1">Newer →</span>
                  <span className="block font-serif text-[16px] text-[var(--text-primary)] leading-[1.4] group-hover:text-[var(--accent)] transition-colors duration-200">
                    {newer.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </section>
  );
}
