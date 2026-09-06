import React from 'react';
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

  // The rail numbers say where a section sits on this page, not what it is, so
  // they are counted off the sections actually rendered — Recent Notes is
  // conditional, and a gap in the sequence would read as a bug rather than a
  // decision. Hero has no number: a cover has no position in the sequence.
  const sections = [
    {
      id: 'publications',
      title: 'Selected Publications',
      emphasis: 'Publications',
      railLabel: 'Research',
      subtitle: 'Recent research in Natural Language Processing and Large Language Models',
      viewAllHref: '/publications',
      body: <PublicationList filter="featured" />,
    },
    ...(recentNotes.length > 0
      ? [
          {
            id: 'notes',
            title: 'Recent Notes',
            emphasis: 'Notes',
            railLabel: 'Writing',
            viewAllHref: '/notes',
            body: (
              <CardList>
                {recentNotes.map((note) => (
                  <NoteCard key={`${note.year}/${note.slug}`} {...note} />
                ))}
              </CardList>
            ),
          },
        ]
      : []),
    {
      id: 'experience',
      title: 'Experience',
      railLabel: 'Career',
      viewAllHref: '/experience',
      body: <ExperienceList highlight />,
    },
    {
      id: 'contact',
      title: '',
      railLabel: 'Contact',
      body: (
        <div className="text-center">
          <p className="text-[20px] font-medium mb-8 max-w-[640px] mx-auto">
            <span className="text-[var(--text-primary)]">Open to research collaborations, talks, and teaching.</span>
          </p>
          <ContactLinks />
        </div>
      ),
    },
  ];

  return (
    <>
      <Hero />
      {sections.map(({ body, ...section }, i) => (
        <Section key={section.id} index={String(i + 1).padStart(2, '0')} {...section}>
          {body}
        </Section>
      ))}
    </>
  );
}
