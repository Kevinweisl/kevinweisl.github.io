import React from 'react';
import type { ExperienceDetail } from '@/data/experience';

interface ExperienceItemProps extends ExperienceDetail {
  compact?: boolean;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  title,
  institution,
  url,
  location,
  description,
  semesters,
  compact = false,
}) => (
  <div className="row" data-spotlight>
    <span className="spot" aria-hidden="true" />
    <div className="font-serif text-[16px] text-[var(--text-primary)]">{title}</div>
    <div className="text-[13px] text-[var(--text-body)] mt-0.5">
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--accent)] hover:underline"
        >
          {institution}
        </a>
      ) : (
        institution
      )}
      {location && <> | {location}</>}
    </div>
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
