import type { Metadata } from 'next';

import Hero from '@/components/Hero';
import Section from '@/components/Section';
import ContactLinks from '@/components/ContactLinks';
import PublicationList from '@/components/PublicationList';
import ExperienceList from '@/components/ExperienceList';

export const metadata: Metadata = {
  title: 'Kevin Wei - Personal Website',
  description: 'Welcome to the personal website of Kevin Wei.',
};

export default function HomePage() {
  const myObfuscatedEmail = "weisl AT nlg.csie DOT ntu.edu.tw";
  const myGithubUrl = "https://github.com/Kevinweisl";
  const myLinkedinUrl = "https://linkedin.com/in/kevin-wei-02001b91";
  const myGoogleScholarUrl = "https://scholar.google.com/citations?user=200UnXEAAAAJ";
  const myTwitterUrl = "https://x.com/kevinweisl";

  return (
    <>
      <Hero />

      <Section
        id="publications"
        title="Selected Publications"
        gradientWord="Publications"
        subtitle="Recent research in Natural Language Processing and Large Language Models"
        viewAllHref="/publications"
      >
        <PublicationList filter='featured' />
      </Section>

      <Section
        id="experience"
        title="Experience"
        viewAllHref="/experience"
        alt
      >
        <ExperienceList highlight />
      </Section>

      <Section id="contact" title="">
        <div className="text-center">
          <p className="text-lg font-medium mb-8 max-w-xl mx-auto">
            <span className="gradient-text">Interested in collaboration? Let&apos;s connect.</span>
          </p>
          <ContactLinks
            obfuscatedEmail={myObfuscatedEmail}
            githubUrl={myGithubUrl}
            linkedinUrl={myLinkedinUrl}
            googleScholarUrl={myGoogleScholarUrl}
            twitterUrl={myTwitterUrl}
          />
        </div>
      </Section>
    </>
  );
}
