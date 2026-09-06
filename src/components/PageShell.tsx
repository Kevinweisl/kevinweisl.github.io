import React from 'react';
import RailGrid, { type RailRow } from './RailGrid';

interface PageShellProps {
  title: string;
  /** What locates this page: a count on a listing, the date on an article. */
  rail?: React.ReactNode;
  /** Listings read at 720px; an article at 68ch. */
  measure?: '720px' | '68ch';
  /** Anything above the title — the article's back link, for instance. */
  beforeTitle?: React.ReactNode;
  /**
   * The body as one row. Most pages want this. Pass `bodyRows` instead when the
   * body's own items each carry a rail, as Experience's periods do.
   */
  children?: React.ReactNode;
  bodyRows?: RailRow[];
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
  bodyRows,
}) => (
  <section className="py-[96px] px-6">
    <RailGrid
      measure={measure}
      rows={[
        {
          key: 'heading',
          rail,
          content: (
            <>
              {beforeTitle}
              <h1 className="font-serif text-[28px] text-[var(--text-primary)] mb-8">{title}</h1>
            </>
          ),
        },
        ...(bodyRows ?? [{ key: 'body', content: children }]),
      ]}
    />
  </section>
);

export default PageShell;
