import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { THEMES, THEME_STORAGE_KEY, DARK_CLASS, COLOR_SCHEME_QUERY, themeInitScript } from './theme';

// CSS cannot import a constant, so globals.css and ThemeToggle.tsx mirror the
// theme constants by hand. These tests turn a silent drift into a red test.

const read = (rel: string) => fs.readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf-8');
const css = read('../styles/globals.css');
const toggle = read('../components/ThemeToggle.tsx');

const themeOnlyValues = (source: string) =>
  new Set([...source.matchAll(/data-theme-only=['"]([^'"]+)['"]/g)].map((m) => m[1]));

describe('themeInitScript is generated from the constants', () => {
  it('embeds every constant verbatim', () => {
    for (const value of [THEME_STORAGE_KEY, DARK_CLASS, COLOR_SCHEME_QUERY]) {
      expect(themeInitScript).toContain(JSON.stringify(value));
    }
    expect(themeInitScript).toContain(JSON.stringify(THEMES));
  });

  it('both adds and removes the class, and guards storage', () => {
    expect(themeInitScript).toContain('classList.add(C)');
    expect(themeInitScript).toContain('classList.remove(C)');
    expect(themeInitScript).toContain('catch(e){}');
  });
});

describe('globals.css honours the theme constants', () => {
  it('defines the dark token block on the DARK_CLASS selector', () => {
    expect(css).toMatch(new RegExp(`^\\.${DARK_CLASS}\\s*\\{`, 'm'));
  });

  it('scopes every theme-only swap rule with DARK_CLASS', () => {
    const prefixes = [...css.matchAll(/^\.([a-z-]+)\s+\.theme-toggle\s+\[data-theme-only=/gm)].map((m) => m[1]);
    expect(prefixes.length).toBeGreaterThan(0);
    for (const prefix of prefixes) expect(prefix).toBe(DARK_CLASS);
  });

  it('uses exactly the THEMES values for data-theme-only', () => {
    expect(themeOnlyValues(css)).toEqual(new Set(THEMES));
  });
});

describe('ThemeToggle honours the theme constants', () => {
  it('uses exactly the THEMES values for data-theme-only', () => {
    expect(themeOnlyValues(toggle)).toEqual(new Set(THEMES));
  });

  it('has no aria-label — the accessible name must come from the visible sr-only label', () => {
    expect(toggle).not.toMatch(/aria-label=/);
  });
});
