import React from 'react';

interface RailGridProps {
  /**
   * The heading block. Separate from `children` so the rail can sit between
   * them in the DOM — see below.
   */
  heading?: React.ReactNode;
  /**
   * What locates the unit beside it: a number in a sequence, a date in time,
   * a category in a taxonomy, a count. Omit it and the column is empty space,
   * which is the right answer for a group heading — a separator has no position.
   */
  rail?: React.ReactNode;
  /** Lists read at 720px; long-form at 68ch. */
  measure?: '720px' | '68ch';
  children: React.ReactNode;
}

/**
 * The one owner of the instrument column: 128 rail + 32 gutter + 720 content.
 * Those three numbers exist here and nowhere else.
 *
 * DOM order is heading, then rail, then body. The heading leads because that is
 * what a sighted reader lands on first — the eye takes a 28px serif line before
 * an 11px grey number — and the rail follows immediately because it qualifies
 * that heading. Putting the rail last instead, which is where a two-slot version
 * of this component naturally leaves it, made a screen reader wait through an
 * entire article before hearing its date.
 *
 * Below `md` the column collapses above the heading via `order`, so the layout
 * reads top-down without the reading order changing.
 */
const RailGrid: React.FC<RailGridProps> = ({ heading, rail, measure = '720px', children }) => {
  const column = 'md:col-start-2 min-w-0';
  const width = { maxWidth: measure };

  return (
    <div
      className="mx-auto grid grid-cols-1 md:grid-cols-[128px_1fr] md:gap-x-8"
      style={{ maxWidth: measure === '68ch' ? 'calc(160px + 68ch)' : '880px' }}
    >
      {heading && (
        <div className={`${column} md:row-start-1`} style={width}>
          {heading}
        </div>
      )}
      {rail && (
        <div className="order-first md:order-none md:col-start-1 md:row-start-1 mb-3 md:mb-0">
          {rail}
        </div>
      )}
      <div className={`${column} ${heading ? 'md:row-start-2' : 'md:row-start-1'}`} style={width}>
        {children}
      </div>
    </div>
  );
};

export default RailGrid;
