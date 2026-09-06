import React from 'react';
import Link from 'next/link';
import type { NoteMeta } from '@/lib/notes';
import { formatNoteDate, noteHref } from '@/lib/notes';

const NoteCard: React.FC<NoteMeta> = ({ title, date, excerpt, year, slug, readingMinutes }) => {
  const formattedDate = formatNoteDate(date);

  return (
    <Link
      href={noteHref({ year, slug })}
      className="block row"
      data-spotlight
    >
      <span className="spot" aria-hidden="true" />
      <div className="flex flex-col-reverse sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 mb-1">
        <h3 className="font-serif text-[20px] text-[var(--text-primary)] leading-[1.4]">
          {title}
        </h3>
        <span
          className="mono text-[13px] text-[var(--text-muted)] whitespace-nowrap"
        >
          {formattedDate} · {readingMinutes} min
        </span>
      </div>
      <p className="text-[16px] text-[var(--text-body)] leading-[1.6]">
        {excerpt}
      </p>
    </Link>
  );
};

export default NoteCard;
