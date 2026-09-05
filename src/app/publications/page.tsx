import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/data/routes';
import { fullName } from '@/data/profile';
import PublicationSearch from '@/components/PublicationSearch';
import PageShell from '@/components/PageShell';

export const metadata = pageMetadata({
  path: routes.publications.path,
  title: routes.publications.label,
  description: `Academic publications by ${fullName} in NLP, LLM robustness, multimodal AI, and information retrieval.`,
});

export default function PublicationsPage() {
  return (
    <PageShell title={routes.publications.label}>
      <PublicationSearch />
    </PageShell>
  );
}
