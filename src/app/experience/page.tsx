import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/data/routes';
import { fullName } from '@/data/profile';
import ExperienceList from '@/components/ExperienceList';
import PageShell from '@/components/PageShell';

export const metadata = pageMetadata({
  path: routes.experience.path,
  title: routes.experience.label,
  description: `Academic, teaching, and professional experience of ${fullName}.`,
});

export default function ExperiencePage() {
  return (
    <PageShell title={routes.experience.label}>
      <ExperienceList />
    </PageShell>
  );
}
