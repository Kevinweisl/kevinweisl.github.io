import React from 'react';
import type { ExperienceDetail } from '@/data/experience';

interface ExperienceItemProps extends ExperienceDetail {
  compact?: boolean;
}

/** Periods are free text ("2021 - Present", "2022/05 - 2023/06"); an in-progress one ends in this. */
const PRESENT = 'Present';

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
    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-4 py-[18px] px-5 border-b border-[var(--border)] last:border-b-0">
      <div className="text-[13px] text-[var(--text-muted)] pt-[3px]" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {ongoing ? (
          <>
            {period.slice(0, -PRESENT.length)}
            <span className="brand-text">{PRESENT}</span>
          </>
        ) : (
          period
        )}
      </div>
      <div>
        <div className="font-serif text-[16px] text-[var(--text-primary)]">
          {title}
        </div>
        <div className="text-[14px] text-[var(--text-body)] mt-0.5">
          {institution}
        </div>
        {description && (
          <div className="text-[16px] text-[var(--text-body)] mt-1 leading-[1.6]">
            {description}
          </div>
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
    </div>
  );
};

export default ExperienceItem;
