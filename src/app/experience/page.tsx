import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/data/routes';
import { fullName } from '@/data/profile';
import { experienceRows } from '@/components/ExperienceList';
import PageShell from '@/components/PageShell';

export const metadata = pageMetadata({
  path: routes.experience.path,
  title: routes.experience.label,
  description: `Academic, teaching, and professional experience of ${fullName}.`,
});

/**
 * No rail beside the heading. The instrument column here is a timeline of
 * periods; a count of roles is a different unit in the same column, and it
 * would be the one thing in it that does not answer "when".
 */
export default function ExperiencePage() {
  return <PageShell title={routes.experience.label} bodyRows={experienceRows()} />;
}
