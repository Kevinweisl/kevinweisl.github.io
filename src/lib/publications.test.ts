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
  it('groups consecutive papers of one year and keeps the list order', () => {
    const groups = groupByYear(publicationsData);
    expect(groups.map((g) => g.year)).toEqual([2026, 2025, 2024, 2021, 2016, 2014]);
    expect(groups.map((g) => g.items.length)).toEqual([3, 2, 2, 1, 1, 1]);
    expect(groups.flatMap((g) => g.items)).toEqual(publicationsData);
  });

  it('is empty for an empty list', () => {
    expect(groupByYear([])).toEqual([]);
  });
});
