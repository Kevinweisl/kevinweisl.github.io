import React from 'react';

interface RailProps {
  /** Position in a sequence, zero-padded: "01". Omitted where there is no sequence. */
  index?: string;
  /** The category, or a count, or a date — whatever locates this unit. */
  label?: string;
  /** Extra lines, e.g. an article's reading time under its date. */
  children?: React.ReactNode;
  id?: string;
}

/**
 * What sits in the instrument column. Muted, never accent: accent means
 * clickable and the rail is not. Collapsed to one line below `md` — see
 * `RailGrid`, which owns the grid itself.
 */
const Rail: React.FC<RailProps> = ({ index, label, children, id }) => (
  <div id={id} className="flex items-baseline gap-2 md:block">
    {index && (
      <div className="mono text-[11px] font-semibold tracking-[0.11em] text-[var(--text-muted)]">
        {index}
      </div>
    )}
    {index && label && <span className="text-[var(--text-muted)] md:hidden" aria-hidden="true">·</span>}
    {label && <div className={`label ${index ? 'md:mt-1.5' : ''}`}>{label}</div>}
    {children}
  </div>
);

export default Rail;
