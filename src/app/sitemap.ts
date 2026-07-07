import type { MetadataRoute } from 'next';
import { getAllNotes } from '@/lib/notes';
import { siteUrl } from '@/data/profile';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/publications', '/notes', '/experience'].map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  const noteRoutes = getAllNotes().map((note) => ({
    url: `${siteUrl}/notes/${note.year}/${note.slug}`,
    lastModified: note.date,
  }));

  return [...staticRoutes, ...noteRoutes];
}
