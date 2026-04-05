'use client';

import React, { useState } from 'react';
import PublicationList from '@/components/PublicationList';
import { Search } from 'lucide-react';

export default function PublicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <section className="py-[72px] px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[900px] mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-3 text-[var(--text-primary)]">
          <span className="gradient-text">Publications</span>
        </h1>

        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search publications (title, author, venue...)"
              className="w-full px-4 py-2 pl-10 border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] rounded-[var(--radius)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-shadow placeholder:text-[var(--text-muted)]"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              <Search size={20} />
            </div>
          </div>
        </div>

        <PublicationList filter="all" searchTerm={searchTerm} />
      </div>
    </section>
  );
}
