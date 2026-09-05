import React from 'react';
import { experienceData } from '@/data/experience';
import ExperienceItem from './ExperienceItem';

interface ExperienceListProps {
  highlight?: boolean;
}

const ExperienceList: React.FC<ExperienceListProps> = ({ highlight = false }) => {
  const categories = experienceData;

  return (
    <div className="space-y-8">
      {categories.map((category, i) => {
        const items = highlight ? category.items.slice(0, 1) : category.items;

        return (
          <div key={i}>
            <div className="flex items-center gap-3 mb-3">
              <span className="label">{category.categoryTitle}</span>
              <span className="h-px flex-1 bg-[var(--border)]" aria-hidden="true" />
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[var(--radius)] overflow-hidden">
              {items.map((item, j) => (
                <ExperienceItem key={j} {...item} compact={highlight} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExperienceList;
