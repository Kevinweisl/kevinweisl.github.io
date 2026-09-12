import { describe, it, expect } from 'vitest';
import { searchPublications, groupByYear } from './publications';
import { publicationsData } from '@/data/publications';

describe('searchPublications', () => {
  it('returns everything, in the data file order, for an empty term', () => {
    expect(searchPublications('')).toEqual(publicationsData);
    expect(searchPublications('   ')).toEqual(publicationsData);
  });

  it('matches case-insensitively on title, author, venue, acronym, track and year', () => {
    expect(searchPublications('selection biases').map((p) => p.year)).toEqual([2024]);
    expect(searchPublications('hen-hsen').length).toBeGreaterThan(5);
    expect(searchPublications('findings').every((p) => p.track === 'Findings')).toBe(true);
    expect(searchPublications('findings').length).toBe(4);
    expect(searchPublications('workshop').map((p) => p.venueAcronym)).toEqual(['SIGIR']);
    expect(searchPublications('2016').map((p) => p.venueAcronym)).toEqual(['COLING']);
  });

  it('returns nothing for a term that matches nothing', () => {
    expect(searchPublications('zzzz-no-such-paper')).toEqual([]);
  });
});

describe('groupByYear', () => {
  const paper = (year: number, title: string) =>
    ({ title, authors: [], venue: '', year }) as (typeof publicationsData)[number];

  it('groups consecutive papers of one year and keeps the list order', () => {
    const list = [paper(2026, 'a'), paper(2026, 'b'), paper(2025, 'c'), paper(2021, 'd')];
    const groups = groupByYear(list);
    expect(groups.map((g) => g.year)).toEqual([2026, 2025, 2021]);
    expect(groups.map((g) => g.items.map((p) => p.title))).toEqual([['a', 'b'], ['c'], ['d']]);
  });

  it('loses nothing and splits the real list at every change of year', () => {
    const groups = groupByYear(publicationsData);
    expect(groups.flatMap((g) => g.items)).toEqual(publicationsData);
    groups.forEach((g, i) => {
      expect(g.items.every((p) => p.year === g.year)).toBe(true);
      if (i > 0) expect(g.year).not.toBe(groups[i - 1].year);
    });
  });

  it('is empty for an empty list', () => {
    expect(groupByYear([])).toEqual([]);
  });
});
