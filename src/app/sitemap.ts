import type { MetadataRoute } from 'next';
import { getAllNotes, noteUrl } from '@/lib/notes';
import { siteUrl } from '@/data/profile';
import { routes } from '@/data/routes';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = Object.values(routes).map((route) => ({
    url: `${siteUrl}${route.path}`,
  }));

  const noteRoutes = getAllNotes().map((note) => ({
    url: noteUrl(note),
    lastModified: note.date,
  }));

  return [...staticRoutes, ...noteRoutes];
}
