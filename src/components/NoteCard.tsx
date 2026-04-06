import React from 'react';
import Link from 'next/link';
import type { NoteMeta } from '@/lib/notes';
import { formatNoteDate } from '@/lib/notes';

const NoteCard: React.FC<NoteMeta> = ({ title, date, excerpt, year, slug }) => {
  const formattedDate = formatNoteDate(date);

  return (
    <Link
      href={`/notes/${year}/${slug}`}
      className="block py-[18px] px-5 bg-[var(--bg-card)] transition-colors duration-200 hover:bg-[var(--accent-light)]"
    >
      <div className="flex flex-col-reverse sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 mb-1">
        <h3 className="font-serif text-[16px] font-semibold text-[var(--text-primary)] leading-[1.4]">
          {title}
        </h3>
        <span className="text-[12px] text-[var(--text-muted)] whitespace-nowrap">
          {formattedDate}
        </span>
      </div>
      <p className="text-[13px] text-[var(--text-muted)] leading-[1.5]">
        {excerpt}
      </p>
    </Link>
  );
};

export default NoteCard;
