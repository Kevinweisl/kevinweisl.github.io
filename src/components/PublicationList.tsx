import React from 'react';
import { publicationsData } from '@/data/publications';
import PublicationItem from './PublicationItem';
import CardList from './CardList';

interface PublicationListProps {
  filter?: 'all' | 'featured';
  limit?: number;
}

/** The home page's list. The Publications page is `PublicationTimeline`, which also searches. */
const PublicationList: React.FC<PublicationListProps> = ({ filter = 'all', limit }) => {
  const filteredData = publicationsData.filter(
    (pub) => filter !== 'featured' || pub.featured !== undefined,
  );
  // The full list keeps the data file's chronological order; the featured list is ranked.
  if (filter === 'featured') filteredData.sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
  const shown = filteredData.slice(0, limit);

  if (shown.length === 0) {
    return (
      <p className="text-center text-[var(--text-muted)] py-4">No publications available.</p>
    );
  }

  return (
    <CardList>
      {shown.map((pub, index) => (
        <PublicationItem key={pub.doiLink || pub.title || index} {...pub} />
      ))}
    </CardList>
  );
};

export default PublicationList;
