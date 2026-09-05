import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/data/routes';
import { siteName } from '@/data/profile';
import { getAllNotes } from '@/lib/notes';
import NoteCard from '@/components/NoteCard';
import CardList from '@/components/CardList';
import PageShell from '@/components/PageShell';

export const metadata = pageMetadata({
  path: routes.notes.path,
  title: routes.notes.label,
  description: `Research notes, technical writings, and reflections by ${siteName}.`,
});

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <PageShell title={routes.notes.label}>
      {notes.length === 0 ? (
        <p className="text-center text-[var(--text-muted)] py-8">No notes yet.</p>
      ) : (
        <CardList>
          {notes.map((note) => (
            <NoteCard key={`${note.year}/${note.slug}`} {...note} />
          ))}
        </CardList>
      )}
    </PageShell>
  );
}
