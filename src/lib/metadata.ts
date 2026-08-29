import type { Metadata } from 'next';
import { siteName, siteUrl, headline, siteDescription, twitterHandle } from '@/data/profile';

interface PageMeta {
  /** Route path starting with '/', or '' for the homepage. */
  path: string;
  /** Page title without the site suffix. Omit for the homepage, which uses the site headline. */
  title?: string;
  description?: string;
  ogType?: 'website' | 'article';
  article?: { publishedTime: string; authors: string[] };
  twitterCard?: 'summary' | 'summary_large_image';
}

/**
 * Everything a page needs to identify itself — canonical URL, <title>, and the
 * OpenGraph / Twitter cards — derived from a path and a title so no route can
 * forget one of them. Emits complete openGraph/twitter objects because Next
 * replaces (does not merge) nested metadata objects from parent segments.
 */
export function pageMetadata(meta: PageMeta): Metadata {
  const url = `${siteUrl}${meta.path}`;
  const socialTitle = meta.title ? `${meta.title} — ${siteName}` : headline;
  const description = meta.description ?? siteDescription;
  return {
    // Bare string → layout's `%s — Kevin Wei` template applies to <title>.
    title: meta.title ?? { absolute: siteName },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: meta.ogType ?? 'website',
      locale: 'en_US',
      siteName,
      url,
      title: socialTitle,
      description,
      images: ['/og.png'],
      ...(meta.article ?? {}),
    },
    twitter: {
      card: meta.twitterCard ?? 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title: socialTitle,
      description,
      images: ['/og.png'],
    },
  };
}
