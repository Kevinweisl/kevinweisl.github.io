import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/data/routes';
import { fullName } from '@/data/profile';
import { experienceRows } from '@/components/ExperienceList';
import PageShell from '@/components/PageShell';
import Rail from '@/components/Rail';
import { experienceData } from '@/data/experience';

export const metadata = pageMetadata({
  path: routes.experience.path,
  title: routes.experience.label,
  description: `Academic, teaching, and professional experience of ${fullName}.`,
});

export default function ExperiencePage() {
  const roleCount = experienceData.reduce((n, category) => n + category.items.length, 0);

  return (
    <PageShell
      title={routes.experience.label}
      rail={<Rail label={`${roleCount} ${roleCount === 1 ? 'Role' : 'Roles'}`} />}
      bodyRows={experienceRows()}
    />
  );
}
