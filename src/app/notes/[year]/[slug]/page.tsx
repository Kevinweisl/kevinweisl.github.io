import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllNotes, getNoteBySlug, formatNoteDate } from '@/lib/notes';
import ProseContent from '@/components/ProseContent';

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
  return {
    title: note.title,
    description: note.excerpt,
    openGraph: {
      title: `${note.title} — Kevin Wei`,
      description: note.excerpt,
    },
  };
}

export default async function NotePage({ params }: Props) {
  const { year, slug } = await params;
  const note = await getNoteBySlug(year, slug);

  const formattedDate = formatNoteDate(note.date);

  return (
    <section className="py-[72px] px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[700px] mx-auto">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline mb-8"
        >
          <ArrowLeft size={14} />
          Back to Notes
        </Link>

        <header className="mb-10">
          <h1 className="font-serif text-3xl md:text-[36px] font-bold text-[var(--text-primary)] leading-[1.2] mb-3">
            {note.title}
          </h1>
          <p className="text-[var(--text-muted)] text-sm">{formattedDate}</p>
        </header>

        <ProseContent html={note.contentHtml} />
      </div>
    </section>
  );
}
