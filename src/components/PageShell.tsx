import React from 'react';

interface PageShellProps {
  /** The page's one-word title. On a sub-page the whole title is the emphasis, so it wears the brand colour. */
  title: string;
  children: React.ReactNode;
}

/**
 * The shell every listing sub-page shares — Notes, Publications, Experience: a centred h1
 * over the 720px content column. Home-page sections use `Section` (h2, left-aligned,
 * optional "View all"); this is the other shape, and the only place it is written down.
 */
const PageShell: React.FC<PageShellProps> = ({ title, children }) => (
  <section className="py-[72px] px-6">
    <div className="max-w-[720px] mx-auto">
      <h1 className="font-serif text-[28px] text-center mb-8 brand-text">{title}</h1>
      {children}
    </div>
  </section>
);

export default PageShell;
