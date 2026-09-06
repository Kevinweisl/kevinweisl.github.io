'use client';

import { useEffect } from 'react';

/**
 * The one owner of the spotlight.
 *
 * Tracking the cursor needs `mousemove`. Attaching that per row would have
 * turned NoteCard and ExperienceItem — plain server components on a statically
 * exported site — into client components, for a glow. One listener on
 * `document` plus `closest('[data-spotlight]')` lets any component opt in with
 * an attribute and stay on the server. Same shape as the sub-page shell: one
 * place owns the behaviour, everyone else declares that they want it.
 *
 * Nothing attaches at all under reduced motion or on a coarse pointer, so the
 * listener is not merely inert there — it is absent.
 */
export default function Spotlight() {
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(hover: none)').matches;
    if (still || coarse) return;

    let frame = 0;
    let last: MouseEvent | null = null;

    const onMove = (event: MouseEvent) => {
      last = event;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!last) return;
        const target = last.target as Element | null;
        const row = target?.closest?.('[data-spotlight]') as HTMLElement | null;
        if (!row) return;
        const box = row.getBoundingClientRect();
        row.style.setProperty('--mx', `${last.clientX - box.left}px`);
        row.style.setProperty('--my', `${last.clientY - box.top}px`);
      });
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
