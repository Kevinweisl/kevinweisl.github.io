import React from 'react';
import type { Metadata } from 'next';
import ExperienceList from '@/components/ExperienceList';
import Section from '@/components/Section';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Academic, teaching, and professional experience of Sheng-Lun (Kevin) Wei.',
  openGraph: {
    title: 'Experience — Kevin Wei',
    description: 'Academic, teaching, and professional experience of Sheng-Lun (Kevin) Wei.',
  },
};

export default function ExperiencePage() {
  return (
    <Section id="full-experience" title="Experience" alt>
      <ExperienceList />
    </Section>
  );
}
