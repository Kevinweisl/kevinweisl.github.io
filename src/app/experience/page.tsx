import React from 'react';
import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/data/routes';
import { fullName } from '@/data/profile';
import ExperienceList from '@/components/ExperienceList';
import Section from '@/components/Section';

export const metadata = pageMetadata({
  path: routes.experience.path,
  title: routes.experience.label,
  description: `Academic, teaching, and professional experience of ${fullName}.`,
});

export default function ExperiencePage() {
  return (
    <Section id="full-experience" title="Experience">
      <ExperienceList />
    </Section>
  );
}
