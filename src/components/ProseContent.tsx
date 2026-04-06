'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

export default function ProseContent({ html }: { html: string }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.querySelectorAll('img').forEach((img) => {
      img.style.cursor = 'zoom-in';
    });
  }, [html]);

  const handleArticleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      setLightboxSrc((target as HTMLImageElement).src);
    }
  }, []);

  return (
    <>
      <article
        ref={contentRef}
        className="prose"
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={handleArticleClick}
      />

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <img
            src={lightboxSrc}
            alt=""
            className="max-w-full max-h-[90vh] object-contain rounded-[var(--radius)]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
