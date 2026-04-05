import React from 'react';

interface ExperienceItemProps {
  title: string;
  institution: string;
  period: string;
  description?: string | string[];
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  title,
  institution,
  period,
  description,
}) => {
  const descText =
    typeof description === 'string'
      ? description
      : Array.isArray(description) && description.length > 0
        ? description.join(', ')
        : null;

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
        {descText && descText.includes('\n') ? (
          <>
            <div className="text-sm text-[var(--text-body)] mt-1 leading-[1.6]">
              {descText.split('\n')[0]}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              {descText.split('\n')[1]}
            </div>
          </>
        ) : descText ? (
          <div className="text-sm text-[var(--text-body)] mt-1 leading-[1.6]">
            {descText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ExperienceItem;
