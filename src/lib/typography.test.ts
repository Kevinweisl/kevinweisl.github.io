import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Young Serif ships a single weight (400) and body sets `font-synthesis-weight: none`,
 * so a weight class on a serif element is a lie: the CSS says 600, the screen shows 400.
 * These tests keep the lie from coming back one `font-bold` at a time.
 */

const SRC = join(__dirname, '..');
const CSS = readFileSync(join(SRC, 'styles/globals.css'), 'utf8');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith('.tsx')) out.push(full);
  }
  return out;
}

const WEIGHT_UTILITY = /\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/;

describe('serif typography contract', () => {
  it('body keeps the synthesis lock that makes the rest of this file matter', () => {
    expect(CSS).toMatch(/body\s*\{[^}]*font-synthesis-weight:\s*none/);
  });

  it('no font-serif className also declares a weight utility', () => {
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      const source = readFileSync(file, 'utf8');
      for (const m of source.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
        const cls = m[1] ?? m[2] ?? '';
        if (cls.includes('font-serif') && WEIGHT_UTILITY.test(cls)) {
          offenders.push(`${file.replace(SRC, 'src')}: "${cls}"`);
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('no stylesheet rule that selects the serif face also sets font-weight', () => {
    const offenders: string[] = [];
    for (const block of CSS.split('}')) {
      if (block.includes('var(--font-serif)') && /font-weight\s*:/.test(block)) {
        offenders.push(block.trim().split('\n')[0]);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
