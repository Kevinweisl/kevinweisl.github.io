import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/data/routes';
import { fullName } from '@/data/profile';
import PublicationSearch from '@/components/PublicationSearch';

export const metadata = pageMetadata({
  path: routes.publications.path,
  title: routes.publications.label,
  description: `Academic publications by ${fullName} in NLP, LLM robustness, multimodal AI, and information retrieval.`,
});

export default function PublicationsPage() {
  return (
    <section className="py-[72px] px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[900px] mx-auto">
        <h1 className="font-serif text-[28px] font-semibold text-center mb-3 text-[var(--text-primary)]">
          <span className="accent-text">Publications</span>
        </h1>
        <PublicationSearch />
      </div>
    </section>
  );
}
