import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/data/routes';
import { siteName } from '@/data/profile';
import { getAllNotes } from '@/lib/notes';
import NoteCard from '@/components/NoteCard';
import CardList from '@/components/CardList';

export const metadata = pageMetadata({
  path: routes.notes.path,
  title: routes.notes.label,
  description: `Research notes, technical writings, and reflections by ${siteName}.`,
});

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <section className="py-[72px] px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[720px] mx-auto">
        <h1 className="font-serif text-[28px] text-center mb-8 text-[var(--text-primary)]">
          <span className="brand-text">Notes</span>
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
