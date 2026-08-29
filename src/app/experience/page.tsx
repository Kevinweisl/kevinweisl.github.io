import React from 'react';
import { pageMetadata } from '@/lib/metadata';
import { fullName } from '@/data/profile';
import ExperienceList from '@/components/ExperienceList';
import Section from '@/components/Section';

export const metadata = pageMetadata({
  path: '/experience',
  title: 'Experience',
  description: `Academic, teaching, and professional experience of ${fullName}.`,
});

export default function ExperiencePage() {
  return (
    <Section id="full-experience" title="Experience" alt>
      <ExperienceList />
    </Section>
  );
}
