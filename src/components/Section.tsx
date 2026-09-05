import React from 'react';
import Link from 'next/link';

interface SectionProps {
  id: string;
  title: string;
  /** A word inside `title` to set in the brand colour, e.g. "Publications" in "Selected Publications". */
  emphasis?: string;
  subtitle?: string;
  viewAllHref?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  emphasis,
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

  return (
    <section id={id} className="py-[72px] px-6">
      <div className="max-w-[720px] mx-auto">
        {(title || subtitle || viewAllHref) && (
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
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
