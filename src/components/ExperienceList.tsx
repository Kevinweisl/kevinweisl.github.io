import React from 'react';
import { experienceData } from '@/data/experience';
import ExperienceItem from './ExperienceItem';

interface ExperienceListProps {
  highlight?: boolean;
}

/**
 * Category headings stay full width with the rail empty beside them: a heading
 * separates one group from the next, and a separator has no position to report.
 */
const ExperienceList: React.FC<ExperienceListProps> = ({ highlight = false }) => (
  <div className="space-y-8">
    {experienceData.map((category, i) => {
      const items = highlight ? category.items.slice(0, 1) : category.items;

      return (
        <div key={i}>
          <div className="flex items-center gap-3 mb-3">
            <span className="label">{category.categoryTitle}</span>
            <span className="h-px flex-1 bg-[var(--border)]" aria-hidden="true" />
          </div>
          <div className="border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
            {items.map((item, j) => (
              <ExperienceItem key={j} {...item} compact={highlight} />
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

export default ExperienceList;
