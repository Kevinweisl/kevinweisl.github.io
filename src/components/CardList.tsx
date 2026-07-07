import React from 'react';

/** Bordered list container whose 1px gaps read as hairline dividers between rows. */
const CardList = ({ children }: { children: React.ReactNode }) => (
  <div
    className="flex flex-col overflow-hidden border border-[var(--border)] rounded-[var(--radius)]"
    style={{ gap: '1px', background: 'var(--border)' }}
  >
    {children}
  </div>
);

export default CardList;
