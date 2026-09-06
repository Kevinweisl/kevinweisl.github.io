import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllNotes, getNoteBySlug, getAdjacentNotes, formatNoteDate, noteHref, noteUrl } from '@/lib/notes';
import ProseContent from '@/components/ProseContent';
import PageShell from '@/components/PageShell';
import Rail from '@/components/Rail';
import { siteUrl, fullName } from '@/data/profile';
import { pageMetadata } from '@/lib/metadata';

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
  return pageMetadata({
    path: noteHref({ year, slug }),
    title: note.title,
    description: note.excerpt,
    article: { publishedTime: note.date, authors: [fullName] },
  });
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
    url: noteUrl({ year, slug }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageShell
        title={note.title}
        measure="68ch"
        beforeTitle={
          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 text-[13px] text-[var(--accent)] hover:underline mb-8"
          >
            <ArrowLeft size={14} />
            Back to Notes
          </Link>
        }
        // An article is located in time, so the rail carries its date and how
        // long it takes — which also clears both off the title.
        rail={
          <Rail>
            <div className="mono text-[11px] text-[var(--text-muted)] leading-[1.7]">
              <div>{formattedDate}</div>
              <div>{note.readingMinutes} min read</div>
            </div>
          </Rail>
        }
      >
        <ProseContent html={note.contentHtml} />

        {(older || newer) && (
          <nav
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-14 pt-8 border-t border-[var(--border)]"
            aria-label="Adjacent notes"
          >
            <div>
              {older && (
                <Link href={noteHref(older)} className="group block no-underline">
                  <span className="block text-[13px] text-[var(--text-muted)] mb-1">← Older</span>
                  <span className="block font-serif text-[16px] text-[var(--text-primary)] leading-[1.4] group-hover:text-[var(--accent)] transition-colors duration-200">
                    {older.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="sm:text-right">
              {newer && (
                <Link href={noteHref(newer)} className="group block no-underline">
                  <span className="block text-[13px] text-[var(--text-muted)] mb-1">Newer →</span>
                  <span className="block font-serif text-[16px] text-[var(--text-primary)] leading-[1.4] group-hover:text-[var(--accent)] transition-colors duration-200">
                    {newer.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </PageShell>
    </>
  );
}
