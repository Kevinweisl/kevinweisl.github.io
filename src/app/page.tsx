import Hero from '@/components/Hero';
import Section from '@/components/Section';
import ContactLinks from '@/components/ContactLinks';
import PublicationList from '@/components/PublicationList';
import ExperienceList from '@/components/ExperienceList';
import NoteCard from '@/components/NoteCard';
import CardList from '@/components/CardList';
import { getRecentNotes } from '@/lib/notes';
import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/data/routes';

export const metadata = pageMetadata({ path: routes.home.path });

export default function HomePage() {
  const recentNotes = getRecentNotes(3);

  return (
    <>
      <Hero />

      <Section
        id="publications"
        title="Selected Publications"
        emphasis="Publications"
        subtitle="Recent research in Natural Language Processing and Large Language Models"
        viewAllHref="/publications"
      >
        <PublicationList filter='featured' />
      </Section>

      {recentNotes.length > 0 && (
        <Section
          id="notes"
          title="Recent Notes"
          emphasis="Notes"
          viewAllHref="/notes"
        >
          <CardList>
            {recentNotes.map((note) => (
              <NoteCard key={`${note.year}/${note.slug}`} {...note} />
            ))}
          </CardList>
        </Section>
      )}

      <Section
        id="experience"
        title="Experience"
        viewAllHref="/experience"
      >
        <ExperienceList highlight />
      </Section>

      <Section id="contact" title="">
        <div className="text-center">
          <p className="text-[20px] font-medium mb-8 max-w-xl mx-auto">
            <span className="text-[var(--text-primary)]">Open to research collaborations, talks, and teaching.</span>
          </p>
          <ContactLinks />
        </div>
      </Section>
    </>
  );
}
