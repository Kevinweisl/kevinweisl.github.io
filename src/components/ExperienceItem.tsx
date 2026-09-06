import React from 'react';
import type { ExperienceDetail } from '@/data/experience';

interface ExperienceItemProps extends ExperienceDetail {
  compact?: boolean;
}

/** Periods are free text ("2021 - Present", "2022/05 - 2023/06"); an in-progress one ends in this. */
const PRESENT = 'Present';

/**
 * The period, rendered into the instrument column by `experienceRows` rather
 * than into a column of this component's own. Its old [120px_1fr] grid would
 * have run parallel to the section's rail — two vertical columns side by side.
 */
export const PeriodLabel: React.FC<{ period: string }> = ({ period }) => {
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

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  title,
  institution,
  description,
  semesters,
  compact = false,
}) => (
  <div className="row" data-spotlight>
    <span className="spot" aria-hidden="true" />
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

export default ExperienceItem;
