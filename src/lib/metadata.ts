import type { Metadata } from 'next';
import { siteName, siteUrl, headline, siteDescription, twitterHandle } from '@/data/profile';

/** The one place the "<page> — <site>" title shape is defined. */
export function pageTitle(title?: string): string {
  return title ? `${title} — ${siteName}` : siteName;
}

interface PageMeta {
  /** Route path starting with '/', or '' for the homepage. */
  path: string;
  /** Page title without the site suffix. Omit for the homepage. */
  title?: string;
  description?: string;
  /** Present ⇒ og:type article, article:* tags, twitter summary card. Absent ⇒ website. */
  article?: { publishedTime: string; authors: string[] };
  /** Present ⇒ robots noindex/nofollow and no canonical (error pages). */
  noindex?: boolean;
}

/**
 * Everything a page needs to identify itself — <title>, canonical URL, and the
 * OpenGraph / Twitter cards — derived from a path and a title so no route can
 * forget one of them. Sets `title.absolute` so the layout has no template to
 * keep in step with; emits complete openGraph/twitter objects because Next
 * replaces (does not merge) nested metadata objects from parent segments.
 */
export function pageMetadata(meta: PageMeta): Metadata {
  const url = `${siteUrl}${meta.path}`;
  const docTitle = pageTitle(meta.title);
  // The homepage <title> is the bare site name; its social card carries the headline.
  const socialTitle = meta.title ? docTitle : headline;
  const description = meta.description ?? siteDescription;
  return {
    title: { absolute: docTitle },
    description,
    ...(meta.noindex
      ? { robots: { index: false, follow: false } }
      : { alternates: { canonical: url } }),
    openGraph: {
      type: meta.article ? 'article' : 'website',
      locale: 'en_US',
      siteName,
      url,
      title: socialTitle,
      description,
      images: ['/og.png'],
      ...(meta.article ?? {}),
    },
    twitter: {
      card: meta.article ? 'summary' : 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title: socialTitle,
      description,
      images: ['/og.png'],
    },
  };
}
