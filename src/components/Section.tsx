import React from 'react';
import Link from 'next/link';

interface SectionProps {
  id: string;
  title: string;
  gradientWord?: string;
  subtitle?: string;
  viewAllHref?: string;
  alt?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  gradientWord,
  subtitle,
  viewAllHref,
  alt = false,
  children,
}) => {
  const renderTitle = () => {
    if (!gradientWord) {
      return <h2 className="font-serif text-[28px] font-semibold text-[var(--text-primary)]">{title}</h2>;
    }
    const parts = title.split(gradientWord);
    return (
      <h2 className="font-serif text-[28px] font-semibold text-[var(--text-primary)]">
        {parts[0]}<span className="gradient-text">{gradientWord}</span>{parts[1] || ''}
      </h2>
    );
  };

  return (
    <section
      id={id}
      className="py-[72px] px-6 transition-colors duration-200"
      style={{ background: alt ? 'var(--bg-secondary)' : 'var(--bg-primary)' }}
    >
      <div className="max-w-[900px] mx-auto">
        {(title || subtitle || viewAllHref) && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 sm:gap-4 mb-8">
            <div>
              {title && renderTitle()}
              {subtitle && (
                <p className="text-[var(--text-muted)] text-sm mt-1.5">{subtitle}</p>
              )}
            </div>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="text-[var(--accent)] text-sm font-medium hover:underline"
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
