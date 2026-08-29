/**
 * Single source of truth for theming.
 *
 * The theme is expressed as exactly one thing: the presence of DARK_CLASS on
 * <html>, which selects the `.dark { ... }` token block in globals.css. The
 * DOM is the state; there is deliberately no React copy to fall out of sync.
 *
 * Imported by the server component that renders <head> (for themeInitScript)
 * AND by client components, so: no 'use client', no server-only imports, and
 * no `window`/`document` at module scope. Every function is browser-only.
 */

export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

/** localStorage key holding the visitor's explicit choice. */
export const THEME_STORAGE_KEY = 'theme';
/** Class on <html> that activates the dark token block. */
export const DARK_CLASS = 'dark';
/** OS preference consulted when the visitor has made no explicit choice. */
export const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

function isTheme(value: unknown): value is Theme {
  return (THEMES as readonly unknown[]).includes(value);
}

/** The visitor's explicit choice, or null if none. Junk values mean "no choice", not "chose". */
export function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null; // localStorage throws in some privacy / partitioned contexts
  }
}

export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Non-fatal: the theme still applies to this page, it just will not persist.
  }
}

/** Explicit choice wins; otherwise follow the OS. */
export function resolveTheme(): Theme {
  return readStoredTheme() ?? (window.matchMedia(COLOR_SCHEME_QUERY).matches ? 'dark' : 'light');
}

/** What is on screen right now — the real state. */
export function getAppliedTheme(): Theme {
  return document.documentElement.classList.contains(DARK_CLASS) ? 'dark' : 'light';
}

/** Symmetric: adds AND removes, so `light` is a real state and not merely "not dark". */
export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle(DARK_CLASS, theme === 'dark');
}

/** Flip from what is on screen, never from a React copy that may be stale. */
export function toggleTheme(): Theme {
  const next: Theme = getAppliedTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  storeTheme(next);
  return next;
}

/**
 * Pre-hydration script, injected into <head> by layout.tsx.
 *
 * It runs before any bundle exists, so it cannot import this module. What it
 * CAN share is every value: the key, class, media query and theme list below
 * are interpolated from the constants above via JSON.stringify, so the two
 * encodings cannot drift on any value. Four lines of control flow mirror
 * resolveTheme() + applyTheme().
 *
 * Deliberately ES5. Uses classList.add/remove rather than two-argument
 * toggle because old engines ignore the `force` argument.
 */
export const themeInitScript = `(function(){
var K=${JSON.stringify(THEME_STORAGE_KEY)},C=${JSON.stringify(DARK_CLASS)},Q=${JSON.stringify(COLOR_SCHEME_QUERY)},V=${JSON.stringify(THEMES)},t=null;
try{var s=window.localStorage.getItem(K);if(V.indexOf(s)>-1)t=s;}catch(e){}
if(t===null&&window.matchMedia(Q).matches)t="dark";
var r=document.documentElement;
if(t==="dark")r.classList.add(C);else r.classList.remove(C);
})();`;
