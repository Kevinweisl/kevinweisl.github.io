import React from 'react';
import { experienceData } from '@/data/experience';
import ExperienceItem from './ExperienceItem';

interface ExperienceListProps {
  highlight?: boolean;
}

const ExperienceList: React.FC<ExperienceListProps> = ({ highlight = false }) => {
  const categories = experienceData;

  return (
    <div className="space-y-5">
      {categories.map((category, i) => {
        const items = highlight ? category.items.slice(0, 1) : category.items;

        return (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-0"
          >
            <div className="font-serif text-[13px] font-semibold text-[var(--accent)] md:text-right md:pt-[18px] md:pr-5 pb-2 md:pb-0">
              {category.categoryTitle}
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
