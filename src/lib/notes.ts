import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';
import { cache } from 'react';
import { siteUrl } from '@/data/profile';
import { estimateReadingMinutes } from './reading-time';

export interface NoteMeta {
  readonly title: string;
  /** Validated "YYYY-MM-DD". */
  readonly date: string;
  readonly excerpt: string;
  readonly slug: string;
  /** Directory name; guaranteed to equal date.slice(0, 4). */
  readonly year: string;
  readonly readingMinutes: number;
}

export interface Note extends NoteMeta {
  readonly contentHtml: string;
}

export interface NotesReader {
  getAllNotes(): readonly NoteMeta[];
  getNoteBySlug(year: string, slug: string): Promise<Note>;
  getRecentNotes(count: number): NoteMeta[];
  getAdjacentNotes(year: string, slug: string): { newer: NoteMeta | null; older: NoteMeta | null };
}

// ---------- errors ----------

export class NoteFrontmatterError extends Error {
  constructor(readonly file: string, readonly field: string, detail: string) {
    super(`${file}: frontmatter field "${field}" ${detail}`);
    this.name = 'NoteFrontmatterError';
  }
}

export class NoteParseError extends Error {
  constructor(readonly file: string, cause: unknown) {
    super(`${file}: frontmatter is not valid YAML — ${cause instanceof Error ? cause.message : String(cause)}`);
    this.name = 'NoteParseError';
  }
}

export class NoteNotFoundError extends Error {
  constructor(readonly year: string, readonly slug: string) {
    super(`No published note at ${year}/${slug}`);
    this.name = 'NoteNotFoundError';
  }
}

// ---------- URLs ----------

/** Site-relative href for a note, e.g. "/notes/2024/my-slug". */
export function noteHref(note: Pick<NoteMeta, 'year' | 'slug'>): string {
  return `/notes/${note.year}/${note.slug}`;
}

/** Absolute canonical URL for a note. */
export function noteUrl(note: Pick<NoteMeta, 'year' | 'slug'>): string {
  return `${siteUrl}${noteHref(note)}`;
}

// ---------- formatting ----------

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

// ---------- frontmatter contract ----------

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DRAFT_SUFFIX = '.draft.md';

type ParseResult =
  | { kind: 'published'; meta: NoteMeta; body: string }
  | { kind: 'draft' };

function describeValue(value: unknown): string {
  if (value instanceof Date) return `a Date (${value.toISOString().slice(0, 10)})`;
  if (typeof value === 'string') return `the string ${JSON.stringify(value)}`;
  return `a ${typeof value} (${String(value)})`;
}

function requireNonEmptyString(value: unknown, field: string, file: string): string {
  if (value === undefined || value === null) {
    throw new NoteFrontmatterError(file, field, 'is required but missing.');
  }
  if (typeof value !== 'string' || value.trim() === '') {
    throw new NoteFrontmatterError(file, field, `must be a non-empty string, got ${describeValue(value)}.`);
  }
  return value;
}

function requireIsoDate(value: unknown, file: string): string {
  if (value === undefined || value === null) {
    throw new NoteFrontmatterError(file, 'date', 'is required but missing.');
  }
  if (value instanceof Date) {
    throw new NoteFrontmatterError(
      file,
      'date',
      `must be quoted so YAML keeps it a string. Write: date: "${value.toISOString().slice(0, 10)}"`,
    );
  }
  if (typeof value !== 'string' || !ISO_DATE.test(value)) {
    throw new NoteFrontmatterError(file, 'date', `must be a quoted YYYY-MM-DD string, got ${describeValue(value)}.`);
  }
  const [y, m, d] = value.split('-').map(Number);
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== d) {
    throw new NoteFrontmatterError(file, 'date', `is not a real calendar date: ${value}.`);
  }
  return value;
}

/**
 * The single place the frontmatter contract is enforced. Pure: no IO.
 * Both getAllNotes and getNoteBySlug go through it, so they cannot disagree.
 *
 * Order matters: drafts are recognised (0, 2) before validation runs, so a
 * work-in-progress note may have broken YAML or missing fields.
 */
function parseNoteFile(args: { raw: string; year: string; fileName: string; displayPath: string }): ParseResult {
  const { raw, year, fileName, displayPath: file } = args;

  // 0. Uncommitted-draft filename convention (mirrors .gitignore).
  if (fileName.endsWith(DRAFT_SUFFIX)) return { kind: 'draft' };

  // 1. YAML must parse.
  let data: Record<string, unknown>;
  let body: string;
  try {
    ({ data, content: body } = matter(raw));
  } catch (cause) {
    throw new NoteParseError(file, cause);
  }

  // 2–3. draft must be a real boolean; YAML reads `yes` / "true" as strings, which would publish.
  if ('draft' in data) {
    if (data.draft === true) return { kind: 'draft' };
    if (data.draft !== false) {
      throw new NoteFrontmatterError(
        file,
        'draft',
        `must be the boolean true or false, got ${describeValue(data.draft)}. YAML does not read "yes"/"true" as a boolean, so this note would have been published.`,
      );
    }
  }

  // 4–9. Required fields.
  const title = requireNonEmptyString(data.title, 'title', file);
  const excerpt = requireNonEmptyString(data.excerpt, 'excerpt', file);
  const date = requireIsoDate(data.date, file);

  // 10. Directory year must agree with the date (the directory becomes the URL).
  if (date.slice(0, 4) !== year) {
    throw new NoteFrontmatterError(
      file,
      'date',
      `is ${date}, but the note lives in the "${year}" directory. Move the file to content/notes/${date.slice(0, 4)}/ or fix the date.`,
    );
  }

  const slug = fileName.replace(/\.md$/, '');
  if (!SLUG.test(slug)) {
    throw new NoteFrontmatterError(file, 'slug', `"${slug}" must be lowercase a-z, 0-9 and single hyphens (it becomes the URL path).`);
  }

  return {
    kind: 'published',
    body,
    meta: { title, date, excerpt, slug, year, readingMinutes: estimateReadingMinutes(body) },
  };
}

/** Newest first. Ties break on slug descending so a same-day series reads part2 → part1. */
function byNewestFirst(a: NoteMeta, b: NoteMeta): number {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  if (a.slug !== b.slug) return a.slug < b.slug ? 1 : -1;
  return 0;
}

// ---------- reader ----------

export function createNotesReader(notesDirectory: string): NotesReader {
  const displayPathOf = (year: string, fileName: string) =>
    path.relative(process.cwd(), path.join(notesDirectory, year, fileName));

  const readAllNotes = (): readonly NoteMeta[] => {
    if (!fs.existsSync(notesDirectory)) return [];

    const years = fs
      .readdirSync(notesDirectory, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);

    const notes: NoteMeta[] = [];
    for (const year of years) {
      const yearDir = path.join(notesDirectory, year);
      const files = fs
        .readdirSync(yearDir, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith('.md'))
        .map((e) => e.name);

      for (const fileName of files) {
        const result = parseNoteFile({
          raw: fs.readFileSync(path.join(yearDir, fileName), 'utf-8'),
          year,
          fileName,
          displayPath: displayPathOf(year, fileName),
        });
        if (result.kind === 'published') notes.push(result.meta);
      }
    }
    return notes.sort(byNewestFirst);
  };

  // getAllNotes is called N+4 times per build (sitemap, list, generateStaticParams,
  // home, one per note page). The memo lives in this closure so its lifetime is
  // the reader's — two readers never share it. Off in `next dev` so editing a
  // .md (not in the module graph, no HMR) is visible without a restart.
  const memoized = process.env.NODE_ENV !== 'development';
  let memo: readonly NoteMeta[] | null = null;
  const getAllNotes = (): readonly NoteMeta[] => {
    if (!memoized) return readAllNotes();
    memo ??= readAllNotes();
    return memo;
  };

  // React cache() dedupes generateMetadata + page for the same note within one render.
  const getNoteBySlug = cache(async (year: string, slug: string): Promise<Note> => {
    const fileName = `${slug}.md`;
    let raw: string;
    try {
      raw = fs.readFileSync(path.join(notesDirectory, year, fileName), 'utf-8');
    } catch {
      throw new NoteNotFoundError(year, slug);
    }
    const result = parseNoteFile({ raw, year, fileName, displayPath: displayPathOf(year, fileName) });
    if (result.kind === 'draft') throw new NoteNotFoundError(year, slug);

    const processed = await remark().use(remarkGfm).use(html, { sanitize: true }).process(result.body);
    return { ...result.meta, contentHtml: processed.toString() };
  });

  return {
    getAllNotes,
    getNoteBySlug,
    getRecentNotes: (count) => getAllNotes().slice(0, count),
    getAdjacentNotes: (year, slug) => {
      const all = getAllNotes();
      const index = all.findIndex((n) => n.year === year && n.slug === slug);
      if (index === -1) return { newer: null, older: null };
      return {
        newer: index > 0 ? all[index - 1] : null,
        older: index < all.length - 1 ? all[index + 1] : null,
      };
    },
  };
}

// ---------- default reader (the real content tree) ----------

const defaultReader = createNotesReader(path.join(process.cwd(), 'content', 'notes'));

// Named re-exports keep every existing import site unchanged.
// Safe to detach: every method is a closure, none uses `this`.
export const getAllNotes = defaultReader.getAllNotes;
export const getNoteBySlug = defaultReader.getNoteBySlug;
export const getRecentNotes = defaultReader.getRecentNotes;
export const getAdjacentNotes = defaultReader.getAdjacentNotes;
