import { publicationsData, type Publication } from '@/data/publications';

/** The full list, in the data file's chronological order, narrowed by a search term. */
export function searchPublications(term: string): Publication[] {
  const q = term.trim().toLowerCase();
  if (!q) return publicationsData;
  return publicationsData.filter((p) =>
    [p.title, ...p.authors, p.venue, p.venueAcronym ?? '', p.track ?? '', String(p.year)]
      .join(' ')
      .toLowerCase()
      .includes(q),
  );
}

export interface YearGroup {
  year: number;
  items: Publication[];
}

/** Consecutive papers of one year become one group; the list's order is kept. */
export function groupByYear(list: Publication[]): YearGroup[] {
  const groups: YearGroup[] = [];
  for (const p of list) {
    const last = groups[groups.length - 1];
    if (last && last.year === p.year) last.items.push(p);
    else groups.push({ year: p.year, items: [p] });
  }
  return groups;
}
