import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The design system's rules, made executable.
 *
 * Sister file `typography.test.ts` guards the serif weight contract; this one
 * guards the type scale, where colour may come from, and who may name a font
 * family. All three are source scans — no rendering, so they run in milliseconds
 * and fail with a list you can work through.
 */

const SRC = join(__dirname, '..');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === '__fixtures__') continue;
      walk(full, out);
    } else if (full.endsWith('.tsx')) out.push(full);
  }
  return out;
}

const rel = (f: string) => f.replace(SRC, 'src');
const files = () => walk(SRC);

/**
 * Six steps: 11 mono / 13 metadata / 16 body / 20 card title / 28 heading,
 * plus the hero's clamp. Two exceptions are named rather than waved through —
 * an exception that has to say its own name cannot quietly become a back door.
 */
const ALLOWED_PX = new Set([11, 13, 16, 20, 28]);
const NAMED_EXCEPTIONS: Record<string, number[]> = {
  'src/components/Hero.tsx': [34, 48], // clamp(34px, 5vw, 48px) — the cover, site's only clamp
  'src/app/not-found.tsx': [80], // decorative quote glyph, 404 only
};

describe('type scale', () => {
  it('only the six steps appear, plus two named exceptions', () => {
    const offenders: string[] = [];
    for (const file of files()) {
      const source = readFileSync(file, 'utf8');
      const allowedHere = NAMED_EXCEPTIONS[rel(file)] ?? [];
      for (const m of source.matchAll(/text-\[(\d+)px\]|fontSize:\s*'(\d+)px'|(\d+)px,\s*[\d.]+vw|[\d.]+vw,\s*(\d+)px/g)) {
        const px = Number(m[1] ?? m[2] ?? m[3] ?? m[4]);
        if (ALLOWED_PX.has(px) || allowedHere.includes(px)) continue;
        offenders.push(`${rel(file)}: ${px}px`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});

/**
 * Colour comes from tokens, never from a literal sitting in a component.
 *
 * This is the 2026-09-03 lesson made automatic: a `text-white` over a dark
 * accent was 2.2:1, and the same literal on the same surface lived in four
 * components. Only one got fixed, because the search was for the component
 * rather than for the literal.
 */
const COLOUR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\b(?:text|bg|border)-(?:white|black)\b/;

/**
 * `themeColor` becomes a `<meta>` tag, which is outside CSS: a var() there
 * names nothing. It is the one place a component must spell a colour out,
 * so it says its own name here rather than loosening the rule for everyone.
 */
const COLOUR_EXCEPTIONS: Record<string, RegExp[]> = {
  'src/app/layout.tsx': [/^\s*themeColor:/],
};

/** A hex inside a comment documents a token; it does not paint anything. */
const stripComments = (line: string) => line.replace(/\/\/.*$|\/\*.*?\*\//g, '');

describe('colour literals', () => {
  it('components carry no colour literals — only var(--token)', () => {
    const offenders: string[] = [];
    for (const file of files()) {
      const allowedHere = COLOUR_EXCEPTIONS[rel(file)] ?? [];
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (allowedHere.some((re) => re.test(line))) return;
          if (COLOUR_LITERAL.test(stripComments(line))) {
            offenders.push(`${rel(file)}:${i + 1}: ${line.trim()}`);
          }
        });
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});

/**
 * The mono family has exactly three doors, all in globals.css: `.label`,
 * `.mono`, and `.prose code`. A component that names a family of its own
 * is a fourth door nobody documented.
 */
/**
 * `.label` renders in JetBrains Mono, which has no CJK. A Chinese category
 * name would fall back mid-string to Noto and break the line's rhythm, so the
 * fields that flow into a label have to stay Latin. The site is bilingual
 * everywhere else — note titles, the hero's bio — which is exactly why this
 * needs saying out loud rather than being left to luck.
 */
const CJK = /[　-〿㐀-䶿一-鿿豈-﫿＀-￯]/;

describe('label text stays Latin', () => {
  it('no field rendered through .label carries CJK', () => {
    const offenders: string[] = [];
    const fields: Array<[string, RegExp]> = [
      ['src/data/experience.ts', /categoryTitle:\s*['"](.+?)['"]/g],
      ['src/data/publications.ts', /venueAcronym:\s*['"](.+?)['"]/g],
      ['src/data/publications.ts', /venue:\s*['"](.+?)['"]/g],
    ];
    for (const [file, re] of fields) {
      const source = readFileSync(join(SRC, file.replace('src/', '')), 'utf8');
      for (const m of source.matchAll(re)) {
        if (CJK.test(m[1])) offenders.push(`${file}: ${m[1]}`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});

describe('mono font ownership', () => {
  it('no component declares a font family or reaches for font-mono', () => {
    const offenders: string[] = [];
    for (const file of files()) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (/\bfont-mono\b|fontFamily|monospace/.test(line)) {
            offenders.push(`${rel(file)}:${i + 1}: ${line.trim()}`);
          }
        });
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
