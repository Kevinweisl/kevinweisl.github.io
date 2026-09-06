import React from 'react';

export interface RailRow {
  /**
   * What locates the unit beside it: a number in a sequence, a date in time,
   * a category or a count. Omit it and the column is empty space beside this
   * row, which is the right answer for a group heading — a separator has no
   * position to report.
   */
  rail?: React.ReactNode;
  content: React.ReactNode;
  /**
   * Put the rail before the content in the DOM.
   *
   * Default is content first: a sighted reader takes the 28px serif heading
   * before an 11px grey number, and a screen reader should hear it in that
   * order too. Timeline rows want the opposite — "2021 - Present, PhD, NTU"
   * is how a timeline reads.
   */
  railFirst?: boolean;
  key?: string;
}

interface RailGridProps {
  rows: RailRow[];
  /** Lists read at 720px; long-form at 68ch. */
  measure?: '720px' | '68ch';
}

/**
 * The one owner of the instrument column: 128 rail + 32 gutter + content.
 * Those numbers exist here and nowhere else.
 *
 * Every row shares one grid rather than nesting a grid of its own, which is
 * what lets a period sit level with a row of any height — they occupy the same
 * grid row, so the browser aligns them. An earlier attempt used two
 * independent columns matched by hand-computed heights; rows here are variable
 * (some carry a description, some a list of semesters) so that could only ever
 * have been a guess, and the first content change would have broken it.
 *
 * Rows are placed explicitly rather than by auto-flow. Auto-placement is sparse
 * — it never backtracks — so a content cell in column 2 followed by a rail cell
 * in column 1 lands the rail on the *next* row. Naming the row removes the
 * question. The placement applies only from `md`; below that the grid is one
 * column and cells stack in DOM order.
 */
const RailGrid: React.FC<RailGridProps> = ({ rows, measure = '720px' }) => (
  <div
    className="mx-auto grid grid-cols-1 md:grid-cols-[128px_1fr] md:gap-x-8"
    style={{ maxWidth: measure === '68ch' ? 'calc(160px + 68ch)' : '880px' }}
  >
    {rows.map((row, i) => {
      const key = row.key ?? i;
      const place = { '--rail-row': i + 1 } as React.CSSProperties;
      const rail = row.rail && (
        <div key={`${key}-rail`} className="rail-cell md:col-start-1 mb-3 md:mb-0" style={place}>
          {row.rail}
        </div>
      );
      const content = (
        <div
          key={`${key}-content`}
          className="rail-cell md:col-start-2 min-w-0"
          style={{ ...place, maxWidth: measure }}
        >
          {row.content}
        </div>
      );
      return row.railFirst ? [rail, content] : [content, rail];
    })}
  </div>
);

export default RailGrid;
