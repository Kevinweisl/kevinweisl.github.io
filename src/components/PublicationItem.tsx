'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronUp } from 'lucide-react';
import type { Publication } from '@/data/publications';

const PublicationItem: React.FC<Publication> = ({
  title,
  authors,
  venue,
  venueAcronym,
  year,
  abstract,
  bibtex,
  pdfLink,
  doiLink,
  codeLink,
  thumbnailUrl,
}) => {
  const [showAbstract, setShowAbstract] = useState(false);
  const [showBibtex, setShowBibtex] = useState(false);

  const handleMainClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    if (abstract) setShowAbstract(!showAbstract);
  };

  const links: { label: string; href?: string; onClick?: () => void }[] = [];
  if (pdfLink) links.push({ label: 'PDF', href: pdfLink });
  if (doiLink) links.push({ label: 'DOI', href: doiLink });
  if (codeLink) links.push({ label: 'Code', href: codeLink });
  if (abstract) links.push({ label: 'Abstract', onClick: () => setShowAbstract(!showAbstract) });
  if (bibtex) links.push({ label: 'BibTeX', onClick: () => setShowBibtex(!showBibtex) });

  return (
    <div
      className={`py-[18px] px-5 bg-[var(--bg-card)] transition-colors duration-200 ${abstract ? 'cursor-pointer' : 'cursor-default'} hover:bg-[var(--accent-light)]`}
      onClick={handleMainClick}
    >
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-serif text-[16px] font-semibold text-[var(--text-primary)] leading-[1.4] mb-1">
            {title}
          </p>
          <p className="text-[13px] text-[var(--text-muted)] mb-2">
            {authors.map((author, i) => (
              <React.Fragment key={author}>
                {i > 0 && ', '}
                {author.startsWith('Sheng-Lun Wei') ? (
                  <strong className="accent-text font-semibold">{author}</strong>
                ) : (
                  author
                )}
              </React.Fragment>
            ))}
          </p>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="accent-bg text-white text-[13px] font-bold px-2.5 py-[3px] rounded-[var(--radius)]">
              {venueAcronym || `${venue} ${year}`}
            </span>
            <div className="flex gap-2 items-center">
              {links.map((link, i) => (
                <React.Fragment key={link.label}>
                  {i > 0 && <span className="text-[var(--text-muted)] text-[13px]">·</span>}
                  {link.href ? (
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-medium text-[var(--accent)] hover:underline"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={link.onClick}
                      className="text-[13px] font-medium text-[var(--accent)] hover:underline cursor-pointer"
                    >
                      {link.label}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt=""
            width={96}
            height={96}
            className="hidden sm:block w-24 h-24 shrink-0 object-cover rounded-[var(--radius)] border border-[var(--border)]"
            unoptimized
          />
        )}
      </div>

      {showAbstract && abstract && (
        <div className="mt-4 p-3 bg-[var(--bg-primary)] rounded-[var(--radius)] border border-[var(--border)] text-[14px] text-[var(--text-primary)]">
          <h4 className="font-semibold mb-1 text-[var(--text-body)]">Abstract</h4>
          <p className="whitespace-pre-wrap leading-relaxed text-[var(--text-body)]">{abstract}</p>
          <button
            onClick={() => setShowAbstract(false)}
            className="text-[13px] text-[var(--accent)] hover:underline mt-2 inline-flex items-center cursor-pointer"
          >
            <ChevronUp size={12} className="mr-0.5" /> Collapse
          </button>
        </div>
      )}

      {showBibtex && bibtex && (
        <div className="mt-4 p-3 bg-[var(--bg-primary)] rounded-[var(--radius)] border border-[var(--border)] text-[14px] text-[var(--text-primary)]">
          <h4 className="font-semibold mb-1 text-[var(--text-body)]">BibTeX</h4>
          <pre className="bg-[var(--bg-card)] p-2 rounded-[var(--radius)] text-[13px] border border-[var(--border)] font-mono whitespace-pre-wrap break-words text-[var(--text-body)]">
            <code>{bibtex}</code>
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(bibtex || '')}
            className="text-[13px] bg-[var(--accent-light)] hover:opacity-80 text-[var(--accent)] px-2 py-0.5 rounded-[var(--radius)] mt-2 mr-2 transition-colors cursor-pointer"
          >
            Copy
          </button>
          <button
            onClick={() => setShowBibtex(false)}
            className="text-[13px] text-[var(--accent)] hover:underline mt-2 inline-flex items-center cursor-pointer"
          >
            <ChevronUp size={12} className="mr-0.5" /> Collapse
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicationItem;
