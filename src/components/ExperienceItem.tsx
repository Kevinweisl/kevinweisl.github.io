import React from 'react';
import type { ExperienceDetail } from '@/data/experience';

interface ExperienceItemProps extends ExperienceDetail {
  compact?: boolean;
}

/** Periods are free text ("2021 - Present", "2022/05 - 2023/06"); an in-progress one ends in this. */
const PRESENT = 'Present';

/**
 * The period leads the row as mono metadata rather than sitting in a column of
 * its own. Its old [120px_1fr] grid would have run parallel to the section's
 * rail — two vertical columns side by side — and merging the two turned out to
 * cost more than it looked: rows are variable height, so the only honest merge
 * is one grid spanning both, which the group's bordered box cannot straddle.
 */
const ExperienceItem: React.FC<ExperienceItemProps> = ({
  title,
  institution,
  period,
  description,
  semesters,
  compact = false,
}) => {
  const ongoing = period.endsWith(PRESENT);

  return (
    <div className="row border-b border-[var(--border)] last:border-b-0" data-spotlight>
      <span className="spot" aria-hidden="true" />
      <div className="mono text-[11px] text-[var(--text-muted)] mb-1.5">
        {ongoing ? (
          <>
            {period.slice(0, -PRESENT.length)}
            <span className="brand-text">{PRESENT}</span>
          </>
        ) : (
          period
        )}
      </div>
      <div className="font-serif text-[16px] text-[var(--text-primary)]">{title}</div>
      <div className="text-[13px] text-[var(--text-body)] mt-0.5">{institution}</div>
      {description && (
        <div className="text-[16px] text-[var(--text-body)] mt-1 leading-[1.6]">{description}</div>
      )}
      {semesters && semesters.length > 0 && !compact && (
        <div className="text-[13px] text-[var(--text-muted)] mt-0.5">
          <strong className="font-semibold">
            {semesters.length} {semesters.length === 1 ? 'semester' : 'semesters'}
          </strong>
          {': '}
          {semesters.join(', ')}
        </div>
      )}
    </div>
  );
};

export default ExperienceItem;
