import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';
import { cache } from 'react';

const notesDirectory = path.join(process.cwd(), 'content', 'notes');

export interface NoteMeta {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  year: string;
}

export interface Note extends NoteMeta {
  contentHtml: string;
}

export function formatNoteDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getAllNotes(): NoteMeta[] {
  if (!fs.existsSync(notesDirectory)) return [];

  const years = fs.readdirSync(notesDirectory).filter((f) =>
    fs.statSync(path.join(notesDirectory, f)).isDirectory()
  );

  const notes: NoteMeta[] = [];

  for (const year of years) {
    const yearDir = path.join(notesDirectory, year);
    const files = fs.readdirSync(yearDir).filter((f) => f.endsWith('.md'));

    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(yearDir, file), 'utf-8');
        const { data } = matter(raw);
        notes.push({
          title: data.title || file.replace(/\.md$/, ''),
          date: data.date || '',
          excerpt: data.excerpt || '',
          slug: file.replace(/\.md$/, ''),
          year,
        });
      } catch {
        console.warn(`Skipping malformed note: ${year}/${file}`);
      }
    }
  }

  return notes.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export const getNoteBySlug = cache(async (year: string, slug: string): Promise<Note> => {
  const filePath = path.join(notesDirectory, year, `${slug}.md`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const result = await remark().use(remarkGfm).use(html, { sanitize: true }).process(content);

  return {
    title: data.title || slug,
    date: data.date || '',
    excerpt: data.excerpt || '',
    slug,
    year,
    contentHtml: result.toString(),
  };
});

export function getRecentNotes(count: number): NoteMeta[] {
  return getAllNotes().slice(0, count);
}
