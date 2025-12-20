'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Link as LinkIcon, Code, FileCode2, FileSearch, ChevronDown, ChevronUp } from 'lucide-react';

interface Publication {
  title: string;
  authors: string;
  venue: string;
  venueAcronym?: string;
  year: number;
  abstract?: string;
  bibtex?: string;
  pdfLink?: string;
  doiLink?: string;
  codeLink?: string;
  thumbnailUrl?: string;
}

type PublicationItemProps = Publication;

const PublicationItem: React.FC<PublicationItemProps> = ({
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

  const titleSeed = title.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) || 'defaultpub';
  const defaultThumbnail = `https://picsum.photos/seed/${titleSeed}/128`;

  let finalThumbnailUrl = thumbnailUrl || defaultThumbnail;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  if (thumbnailUrl && thumbnailUrl.startsWith('/') && !thumbnailUrl.startsWith(basePath)) {
    finalThumbnailUrl = `${basePath}${thumbnailUrl}`;
  }

  const highlightedAuthors = authors.replace('Sheng-Lun Wei', '<b>Sheng-Lun Wei</b>');

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 border-l-4 border-blue-500 bg-gray-50 rounded-r-lg shadow-sm transition-shadow hover:shadow-md">
      <div className="flex-shrink-0 w-full md:w-32 h-32 md:h-auto relative mb-4 md:mb-0 self-center md:self-start">
        <Image
          src={finalThumbnailUrl}
          alt={`Thumbnail for ${title}`}
          width={128}
          height={128}
          objectFit="cover"
          className="rounded"
          onError={(e) => {
            e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
            e.currentTarget.style.backgroundColor = '#e5e7eb';
            e.currentTarget.width = 128;
            e.currentTarget.height = 128;
          }}
        />
      </div>

      <div className="flex-grow flex flex-col">
        <div className="mb-1 flex items-start gap-2">
          <p className="font-semibold text-gray-800 flex-grow">{title}</p>
          {venueAcronym && (
            <span className="flex-shrink-0 inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap">
              {venueAcronym}
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600 italic mb-1" dangerouslySetInnerHTML={{ __html: highlightedAuthors }}></div>
        <p className="text-sm text-gray-600 mb-3">{venue}</p>

        <div className="flex flex-wrap gap-2 text-sm mt-auto pt-2">
          {pdfLink && <Link href={pdfLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded transition-colors font-medium"><FileText size={14} className="mr-1" />PDF</Link>}
          {doiLink && <Link href={doiLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-gray-100 text-gray-700 hover:bg-gray-200 px-2 py-1 rounded transition-colors font-medium"><LinkIcon size={14} className="mr-1" />DOI</Link>}
          {codeLink && (
            <Link href={codeLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-purple-100 text-purple-700 hover:bg-purple-200 px-2 py-1 rounded transition-colors font-medium">
              <Code size={14} className="mr-1" />Code
            </Link>
          )}

          {abstract && (
            <button onClick={() => setShowAbstract(!showAbstract)} className="inline-flex items-center bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded transition-colors font-medium">
              <FileSearch size={14} className="mr-1" />Abstract {showAbstract ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
            </button>
          )}
          {bibtex && (
            <button onClick={() => setShowBibtex(!showBibtex)} className="inline-flex items-center bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-2 py-1 rounded transition-colors font-medium">
              <FileCode2 size={14} className="mr-1" />BibTeX {showBibtex ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
            </button>
          )}
        </div>

        {showAbstract && abstract && (
          <div className="mt-4 p-3 bg-gray-100 rounded border border-gray-200 text-sm text-gray-800">
            <h4 className="font-semibold mb-1 text-gray-700">Abstract</h4>
            <p className="whitespace-pre-wrap leading-relaxed">{abstract}</p>
            <button onClick={() => setShowAbstract(false)} className="text-xs text-blue-600 hover:underline mt-2 inline-flex items-center">
              <ChevronUp size={12} className="mr-0.5" /> Collapse
            </button>
          </div>
        )}

        {showBibtex && bibtex && (
          <div className="mt-4 p-3 bg-gray-100 rounded border border-gray-200 text-sm text-gray-800">
            <h4 className="font-semibold mb-1 text-gray-700">BibTeX Citation</h4>
            <pre className="bg-white p-2 rounded text-xs border font-mono whitespace-pre-wrap break-words"><code>{bibtex}</code></pre>
            <button
              onClick={() => navigator.clipboard.writeText(bibtex || '')}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-0.5 rounded mt-2 mr-2 transition-colors"
            >
              Copy
            </button>
            <button onClick={() => setShowBibtex(false)} className="text-xs text-blue-600 hover:underline mt-2 inline-flex items-center">
              <ChevronUp size={12} className="mr-0.5" /> Collapse
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PublicationItem;
