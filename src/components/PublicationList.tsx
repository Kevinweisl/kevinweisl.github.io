import React from 'react';
import { publicationsData } from '@/data/publications';
import PublicationItem from './PublicationItem';
import CardList from './CardList';

interface PublicationListProps {
  filter?: 'all' | 'featured';
  limit?: number;
  searchTerm?: string;
}

const PublicationList: React.FC<PublicationListProps> = ({
  filter = 'all',
  limit,
  searchTerm = '',
}) => {
  const filteredData = publicationsData
    .filter(pub => {
      if (filter === 'featured' && pub.featured === undefined) return false;
      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        const text = `${pub.title} ${pub.authors.join(' ')} ${pub.venue} ${pub.venueAcronym || ''} ${pub.year}`.toLowerCase();
        if (!text.includes(lower)) return false;
      }
      return true;
    });
  // The full list keeps the data file's chronological order; the featured list is ranked.
  if (filter === 'featured') filteredData.sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
  const shown = filteredData.slice(0, limit);

  if (shown.length === 0) {
    return (
      <p className="text-center text-[var(--text-muted)] py-4">
        {searchTerm ? `No publications found matching "${searchTerm}".` : 'No publications available.'}
      </p>
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
