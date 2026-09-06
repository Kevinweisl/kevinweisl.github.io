import React from 'react';

interface RailGridProps {
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
 * Content comes first in the DOM and the rail is placed back on the left with
 * grid, so a screen reader hears the heading before the locator — the order a
 * sighted reader parses too, since the eye lands on the 28px serif heading
 * rather than the 11px grey number. Below `md` the column collapses above the
 * content instead of scrolling sideways.
 */
const RailGrid: React.FC<RailGridProps> = ({ rail, measure = '720px', children }) => (
  <div
    className="mx-auto grid grid-cols-1 md:grid-cols-[128px_1fr] md:gap-x-8"
    style={{ maxWidth: measure === '68ch' ? 'calc(160px + 68ch)' : '880px' }}
  >
    <div className="md:col-start-2 md:row-start-1 min-w-0" style={{ maxWidth: measure }}>
      {children}
    </div>
    {rail && (
      <div className="order-first md:order-none md:col-start-1 md:row-start-1 mb-3 md:mb-0">
        {rail}
      </div>
    )}
  </div>
);

export default RailGrid;
