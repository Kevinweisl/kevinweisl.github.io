import React from 'react';
import { publicationsData } from '@/data/publications';
import PublicationItem from './PublicationItem';

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
      if (filter === 'featured' && !pub.featured) return false;
      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        const text = `${pub.title} ${pub.authors} ${pub.venue} ${pub.venueAcronym || ''} ${pub.year}`.toLowerCase();
        if (!text.includes(lower)) return false;
      }
      return true;
    })
    .slice(0, limit);

  if (filteredData.length === 0) {
    return (
      <p className="text-center text-[var(--text-muted)] py-4">
        {searchTerm ? `No publications found matching "${searchTerm}".` : 'No publications available.'}
      </p>
    );
  }

  return (
    <div
      className="flex flex-col overflow-hidden border border-[var(--border)] rounded-[var(--radius)]"
      style={{ gap: '1px', background: 'var(--border)' }}
    >
      {filteredData.map((pub, index) => (
        <PublicationItem key={pub.doiLink || pub.title || index} {...pub} />
      ))}
    </div>
  );
};

export default PublicationList;
