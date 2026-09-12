'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { routes } from '@/data/routes';
import { searchPublications, groupByYear } from '@/lib/publications';
import PageShell from './PageShell';
import { RailPeriod } from './Rail';
import CardList from './CardList';
import PublicationItem from './PublicationItem';
import type { RailRow } from './RailGrid';

/**
 * The Publications page below its heading: the search box, then one row per
 * year — the year in the rail, that year's papers boxed beside it. The rail
 * answers "when" here as it does on Experience, and a year is printed once
 * per group rather than once per paper.
 *
 * This renders the page shell itself rather than sitting inside it: the rows
 * depend on the search term, and the term is client state. The shell and its
 * grid are small enough to hydrate.
 */
export default function PublicationTimeline() {
  const [term, setTerm] = useState('');
  const groups = groupByYear(searchPublications(term));

  const rows: RailRow[] = [
    {
      key: 'search',
      content: (
        <div className="relative mb-8">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search publications (title, author, venue...)"
            className="w-full px-4 py-2 pl-10 border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] rounded-[var(--radius)] placeholder:text-[var(--text-muted)]"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <Search size={20} />
          </div>
        </div>
      ),
    },
    ...(groups.length === 0
      ? [
          {
            key: 'empty',
            content: (
              <p className="text-center text-[var(--text-muted)] py-4">
                No publications found matching &quot;{term}&quot;.
              </p>
            ),
          },
        ]
      : groups.map((group, i) => ({
          key: `year-${group.year}`,
          railFirst: true,
          // Both cells carry the gap between groups, so the year stays level with
          // its box. Below md the cells stack, and only the first of them — the
          // rail — should open the gap.
          rail: (
            <div className={i > 0 ? 'mt-6' : ''}>
              <RailPeriod period={String(group.year)} />
            </div>
          ),
          content: (
            <div className={i > 0 ? 'md:mt-6' : ''}>
              <CardList>
                {group.items.map((pub) => (
                  <PublicationItem key={pub.doiLink || pub.title} {...pub} showYear={false} />
                ))}
              </CardList>
            </div>
          ),
        }))),
  ];

  return <PageShell title={routes.publications.label} bodyRows={rows} />;
}
