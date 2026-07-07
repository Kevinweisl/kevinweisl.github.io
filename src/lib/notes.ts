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
  readingMinutes: number;
}

export interface Note extends NoteMeta {
  contentHtml: string;
}

export function formatNoteDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC', // YYYY-MM-DD frontmatter parses as UTC midnight; keep the same day regardless of build-machine TZ
  });
}

// CJK is read per character (~400 chars/min); Latin per word (~200 words/min).
function estimateReadingMinutes(content: string): number {
  const cjkCount = (content.match(/[一-鿿぀-ヿ]/g) || []).length;
  const latinWords = content
    .replace(/[一-鿿぀-ヿ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(cjkCount / 400 + latinWords / 200));
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
        const { data, content } = matter(raw);
        if (data.draft === true) continue;
        if (!data.title || !data.date) {
          console.warn(`Note ${year}/${file} is missing required frontmatter (title/date)`);
        }
        notes.push({
          title: data.title || file.replace(/\.md$/, ''),
          date: data.date || '',
          excerpt: data.excerpt || '',
          slug: file.replace(/\.md$/, ''),
          year,
          readingMinutes: estimateReadingMinutes(content),
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
    readingMinutes: estimateReadingMinutes(content),
    contentHtml: result.toString(),
  };
});

export function getRecentNotes(count: number): NoteMeta[] {
  return getAllNotes().slice(0, count);
}

/** Adjacent notes in reverse-chronological order (newer = published after, older = before). */
export function getAdjacentNotes(year: string, slug: string): {
  newer: NoteMeta | null;
  older: NoteMeta | null;
} {
  const all = getAllNotes();
  const index = all.findIndex((n) => n.year === year && n.slug === slug);
  if (index === -1) return { newer: null, older: null };
  return {
    newer: index > 0 ? all[index - 1] : null,
    older: index < all.length - 1 ? all[index + 1] : null,
  };
}
