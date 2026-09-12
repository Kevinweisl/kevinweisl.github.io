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

/** Periods are free text ("2021 - Present", "2022/05 - 2023/06", "2026"); an in-progress one ends in this. */
const PRESENT = 'Present';

/**
 * A point or span in time, level with the first line of the row beside it —
 * the 18px is the row's own top padding. Experience's periods and
 * Publications' years both go through here.
 */
export const RailPeriod: React.FC<{ period: string }> = ({ period }) => {
  const ongoing = period.endsWith(PRESENT);
  return (
    <div className="mono text-[11px] text-[var(--text-muted)] leading-[1.7] pt-[18px]">
      {ongoing ? (
        <>
          {period.slice(0, -PRESENT.length)}
          <span className="brand-text">{PRESENT}</span>
        </>
      ) : (
        period
      )}
    </div>
  );
};
