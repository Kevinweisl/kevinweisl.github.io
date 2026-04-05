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
  compact = false,
}) => {
  const descText =
    typeof description === 'string'
      ? description
      : Array.isArray(description) && description.length > 0
        ? description.join(', ')
        : null;

  const lines = descText?.split('\n');
  const mainDesc = lines?.[0] ?? descText;
  const subDesc = !compact && lines && lines.length > 1 ? lines[1] : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-4 py-3.5 px-5 border-b border-[var(--border)] last:border-b-0">
      <div className="text-[13px] text-[var(--text-muted)] pt-[3px]" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {period}
      </div>
      <div>
        <div className="font-serif text-[15px] font-semibold text-[var(--text-primary)]">
          {title}
        </div>
        <div className="text-sm font-medium gradient-text mt-0.5">
          {institution}
        </div>
        {mainDesc && (
          <div className="text-sm text-[var(--text-body)] mt-1 leading-[1.6]">
            {mainDesc}
          </div>
        )}
        {subDesc && (
          <div className="text-xs text-[var(--text-muted)] mt-0.5">
            {subDesc}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceItem;
