import React from 'react';
import RailGrid from './RailGrid';

interface PageShellProps {
  title: string;
  /** What locates this page: a count on a listing, the date on an article. */
  rail?: React.ReactNode;
  /** Listings read at 720px; an article at 68ch. */
  measure?: '720px' | '68ch';
  /** Anything above the title — the article's back link, for instance. */
  beforeTitle?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * The shell every page but the home page shares — Notes, Publications,
 * Experience, and an article.
 *
 * The heading is serif, left, 28px, --text-primary, everywhere. Four pages once
 * had four sizes and alignments, and the article page hand-copied this file's
 * padding and type rather than importing it; unifying the heading removed the
 * reason they had diverged.
 */
const PageShell: React.FC<PageShellProps> = ({
  title,
  rail,
  measure = '720px',
  beforeTitle,
  children,
}) => (
  <section className="py-[96px] px-6">
    <RailGrid
      rail={rail}
      measure={measure}
      heading={
        <>
          {beforeTitle}
          <h1 className="font-serif text-[28px] text-[var(--text-primary)] mb-8">{title}</h1>
        </>
      }
    >
      {children}
    </RailGrid>
  </section>
);

export default PageShell;
