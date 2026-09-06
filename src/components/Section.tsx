import React from 'react';
import Link from 'next/link';
import RailGrid from './RailGrid';
import Rail from './Rail';

interface SectionProps {
  id: string;
  title: string;
  /** A word inside `title` to set in the brand colour, e.g. "Publications" in "Selected Publications". */
  emphasis?: string;
  /** Position on this page, zero-padded. Computed by the page from the sections it renders. */
  index?: string;
  /** The rail's category word: Research, Writing, Career, Contact. */
  railLabel?: string;
  subtitle?: string;
  viewAllHref?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  emphasis,
  index,
  railLabel,
  subtitle,
  viewAllHref,
  children,
}) => {
  const renderTitle = () => {
    if (!emphasis) {
      return <h2 className="font-serif text-[28px] text-[var(--text-primary)]">{title}</h2>;
    }
    const parts = title.split(emphasis);
    return (
      <h2 className="font-serif text-[28px] text-[var(--text-primary)]">
        {parts[0]}<span className="brand-text">{emphasis}</span>{parts[1] || ''}
      </h2>
    );
  };

  const railId = `${id}-rail`;
  const rail = (index || railLabel) && <Rail id={railId} index={index} label={railLabel} />;

  return (
    <section
      id={id}
      className="py-[96px] px-6"
      // A section with no accessible name is not a landmark. Contact renders no
      // heading at all, so its rail is its name.
      aria-labelledby={title ? undefined : railId}
    >
      <RailGrid
        rail={rail}
        heading={
          (title || subtitle || viewAllHref) && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 sm:gap-4 mb-8">
              <div>
                {title && renderTitle()}
                {subtitle && (
                  <p className="text-[var(--text-muted)] text-[13px] mt-1.5">{subtitle}</p>
                )}
              </div>
              {viewAllHref && (
                <Link
                  href={viewAllHref}
                  className="text-[var(--accent)] text-[13px] font-medium hover:underline"
                >
                  View all →
                </Link>
              )}
            </div>
          )
        }
      >
        {children}
      </RailGrid>
    </section>
  );
};

export default Section;
