import type { Metadata } from 'next';
import { getAllNotes } from '@/lib/notes';
import NoteCard from '@/components/NoteCard';
import CardList from '@/components/CardList';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Research notes, technical writings, and reflections by Kevin Wei.',
  openGraph: {
    title: 'Notes — Kevin Wei',
    description: 'Research notes, technical writings, and reflections by Kevin Wei.',
  },
};

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <section className="py-[72px] px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[900px] mx-auto">
        <h1 className="font-serif text-[28px] font-semibold text-center mb-8 text-[var(--text-primary)]">
          <span className="accent-text">Notes</span>
        </h1>

        {notes.length === 0 ? (
          <p className="text-center text-[var(--text-muted)] py-8">No notes yet.</p>
        ) : (
          <CardList>
            {notes.map((note) => (
              <NoteCard key={`${note.year}/${note.slug}`} {...note} />
            ))}
          </CardList>
        )}
      </div>
    </section>
  );
}
