import type { Metadata } from 'next';
import PublicationSearch from '@/components/PublicationSearch';

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Academic publications by Sheng-Lun (Kevin) Wei in NLP, LLM robustness, multimodal AI, and information retrieval.',
  openGraph: {
    title: 'Publications — Kevin Wei',
    description: 'Academic publications by Sheng-Lun (Kevin) Wei in NLP, LLM robustness, multimodal AI, and information retrieval.',
  },
};

export default function PublicationsPage() {
  return (
    <section className="py-[72px] px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[900px] mx-auto">
        <h1 className="font-serif text-[28px] font-semibold text-center mb-3 text-[var(--text-primary)]">
          <span className="gradient-text">Publications</span>
        </h1>
        <PublicationSearch />
      </div>
    </section>
  );
}
