'use client';

import { useEffect } from 'react';
import { COLOR_SCHEME_QUERY, applyTheme, readStoredTheme, resolveTheme } from '@/lib/theme';

/**
 * Keeps the page following the OS while the visitor has made no explicit choice.
 *
 * Renders nothing and holds no state: the theme lives on <html>, applied before
 * hydration by themeInitScript, so there is nothing here for React to own.
 */
export default function ThemeSync() {
  useEffect(() => {
    // No-op when themeInitScript ran; self-heals if something blocked the inline script.
    applyTheme(resolveTheme());

    const mq = window.matchMedia(COLOR_SCHEME_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme() !== null) return; // an explicit choice outranks the OS
      applyTheme(event.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return null;
}
