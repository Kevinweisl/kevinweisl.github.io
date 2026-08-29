import { describe, it, expect } from 'vitest';
import { estimateReadingMinutes } from './reading-time';

describe('estimateReadingMinutes', () => {
  it('never reports less than one minute', () => {
    expect(estimateReadingMinutes('')).toBe(1);
    expect(estimateReadingMinutes('hello')).toBe(1);
  });

  it('counts Latin prose at ~200 words per minute', () => {
    expect(estimateReadingMinutes('word '.repeat(600))).toBe(3);
  });

  it('counts CJK prose at ~400 characters per minute', () => {
    expect(estimateReadingMinutes('字'.repeat(1200))).toBe(3);
  });

  it('sums the CJK and Latin contributions for mixed content', () => {
    // 400 CJK chars (1 min) + 200 Latin words (1 min); CJK must not also count as words.
    expect(estimateReadingMinutes('字'.repeat(400) + ' word'.repeat(200))).toBe(2);
  });
});
