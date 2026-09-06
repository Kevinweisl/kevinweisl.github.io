import React from 'react';
import { experienceData } from '@/data/experience';
import ExperienceItem, { PeriodLabel } from './ExperienceItem';
import type { RailRow } from './RailGrid';

/**
 * Experience supplies rows rather than a block, so each period lands in the
 * instrument column level with its own row. The section number heads that
 * column and the periods run down it, which makes the rail an actual timeline
 * instead of a decoration — and it is the same column, not a second one
 * running alongside.
 *
 * A category heading gets an empty rail on purpose: it separates one group
 * from the next, and a separator has no position to report.
 *
 * The group's box is rebuilt per row rather than wrapped around them. One
 * element cannot enclose several rows of a grid it does not own, and the box
 * is only an edge — first row rounds the top, last rounds the bottom, all of
 * them carry the sides.
 */
export function experienceRows(highlight = false): RailRow[] {
  const rows: RailRow[] = [];

  experienceData.forEach((category, c) => {
    const items = highlight ? category.items.slice(0, 1) : category.items;

    rows.push({
      key: `cat-${c}`,
      content: (
        <div className={`flex items-center gap-3 mb-3 ${c > 0 ? 'mt-8' : ''}`}>
          <span className="label">{category.categoryTitle}</span>
          <span className="h-px flex-1 bg-[var(--border)]" aria-hidden="true" />
        </div>
      ),
    });

    items.forEach((item, j) => {
      const first = j === 0;
      const last = j === items.length - 1;
      rows.push({
        key: `item-${c}-${j}`,
        railFirst: true,
        rail: <PeriodLabel period={item.period} />,
        content: (
          <div
            className={[
              'border-x border-[var(--border)]',
              first ? 'border-t rounded-t-[var(--radius)]' : '',
              last ? 'border-b rounded-b-[var(--radius)]' : 'border-b',
            ].join(' ')}
          >
            <ExperienceItem {...item} compact={highlight} />
          </div>
        ),
      });
    });
  });

  return rows;
}
