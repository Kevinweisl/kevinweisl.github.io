import type { MetadataRoute } from 'next';
import { getAllNotes, noteUrl } from '@/lib/notes';
import { siteUrl } from '@/data/profile';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/publications', '/notes', '/experience'].map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  const noteRoutes = getAllNotes().map((note) => ({
    url: noteUrl(note),
    lastModified: note.date,
  }));

  return [...staticRoutes, ...noteRoutes];
}
