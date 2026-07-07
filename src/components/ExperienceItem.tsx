import React from 'react';
import type { ExperienceDetail } from '@/data/experience';

interface ExperienceItemProps extends ExperienceDetail {
  compact?: boolean;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  title,
  institution,
  period,
  description,
  note,
  compact = false,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-4 py-[18px] px-5 border-b border-[var(--border)] last:border-b-0">
      <div className="text-[13px] text-[var(--text-muted)] pt-[3px]" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {period}
      </div>
      <div>
        <div className="font-serif text-[16px] font-semibold text-[var(--text-primary)]">
          {title}
        </div>
        <div className="text-[13px] font-medium accent-text mt-0.5">
          {institution}
        </div>
        {description && (
          <div className="text-[16px] text-[var(--text-body)] mt-1 leading-[1.6]">
            {description}
          </div>
        )}
        {note && !compact && (
          <div className="text-[13px] text-[var(--text-muted)] mt-0.5">
            {note}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceItem;
