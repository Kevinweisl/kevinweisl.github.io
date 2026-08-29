import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import {
  createNotesReader,
  formatNoteDate,
  getAllNotes as getRealNotes,
  NoteFrontmatterError,
  NoteNotFoundError,
  NoteParseError,
} from './notes';

const fixture = (name: string) => fileURLToPath(new URL(`./__fixtures__/${name}`, import.meta.url));
const valid = () => createNotesReader(fixture('valid'));

/** Asserts the reader throws a frontmatter error naming the file and the field. */
function expectFrontmatterError(dir: string, field: string, messageIncludes?: string) {
  const reader = createNotesReader(fixture(dir));
  let caught: unknown;
  try {
    reader.getAllNotes();
  } catch (e) {
    caught = e;
  }
  expect(caught).toBeInstanceOf(NoteFrontmatterError);
  const err = caught as NoteFrontmatterError;
  expect(err.field).toBe(field);
  expect(err.message).toContain(`__fixtures__/${dir}/`);
  expect(err.message).toContain(`"${field}"`);
  if (messageIncludes) expect(err.message).toContain(messageIncludes);
}

describe('formatNoteDate', () => {
  it('formats YYYY-MM-DD as an en-US long date', () => {
    expect(formatNoteDate('2024-06-29')).toBe('June 29, 2024');
  });

  it('keeps the same calendar day under a non-UTC machine timezone', () => {
    // vitest.config.ts pins TZ=Pacific/Kiritimati (UTC+14) for exactly this.
    expect(formatNoteDate('2024-01-01')).toBe('January 1, 2024');
  });
});

describe('getAllNotes', () => {
  it('returns every published note and nothing else', () => {
    expect(valid().getAllNotes().map((n) => n.slug)).toEqual(['gamma', 'beta', 'alpha']);
  });

  it('returns an empty array when the directory does not exist', () => {
    expect(createNotesReader(fixture('does-not-exist')).getAllNotes()).toEqual([]);
  });

  it('excludes *.draft.md files before parsing them', () => {
    expect(valid().getAllNotes().some((n) => n.slug.includes('hidden'))).toBe(false);
  });

  it('excludes draft: true even when required fields are missing', () => {
    // valid/2024/unfinished.md has draft: true and no excerpt — excluded, not an error.
    expect(() => valid().getAllNotes()).not.toThrow();
    expect(valid().getAllNotes().some((n) => n.slug === 'unfinished')).toBe(false);
  });

  it('sorts newest first and breaks same-day ties by slug descending', () => {
    const [, second, third] = valid().getAllNotes();
    expect(second.date).toBe(third.date);
    expect([second.slug, third.slug]).toEqual(['beta', 'alpha']);
  });

  it('derives year from the directory and readingMinutes from the body', () => {
    const gamma = valid().getAllNotes()[0];
    expect(gamma.year).toBe('2026');
    expect(gamma.readingMinutes).toBeGreaterThanOrEqual(1);
  });
});

describe('frontmatter validation fails the build', () => {
  it('unquoted date (YAML Date object) — and suggests the fix', () => {
    expectFrontmatterError('invalid-unquoted-date', 'date', 'date: "2024-06-29"');
  });
  it('date not in YYYY-MM-DD', () => {
    expectFrontmatterError('invalid-date-format', 'date', '2024/06/29');
  });
  it('date that is not a real calendar day', () => {
    expectFrontmatterError('invalid-date-calendar', 'date', '2024-02-31');
  });
  it('directory year disagreeing with the date — names both', () => {
    expectFrontmatterError('invalid-year-mismatch', 'date', '"2024" directory');
  });
  it('missing title', () => {
    expectFrontmatterError('invalid-missing-title', 'title');
  });
  it('missing excerpt', () => {
    expectFrontmatterError('invalid-missing-excerpt', 'excerpt');
  });
  it('draft: yes (a string, which would otherwise publish)', () => {
    expectFrontmatterError('invalid-draft-value', 'draft', '"yes"');
  });
  it('slug with uppercase or underscores', () => {
    expectFrontmatterError('invalid-slug', 'slug', 'Bad_Slug');
  });
  it('malformed YAML', () => {
    expect(() => createNotesReader(fixture('invalid-yaml')).getAllNotes()).toThrow(NoteParseError);
  });
});

describe('getNoteBySlug', () => {
  it('renders markdown to HTML, including GFM tables, and strips raw HTML', async () => {
    const note = await valid().getNoteBySlug('2026', 'gamma');
    expect(note.contentHtml).toContain('<table>');
    expect(note.contentHtml).not.toContain('<script>');
  });

  it('returns metadata identical to the matching getAllNotes entry', async () => {
    const reader = valid();
    const fromList = reader.getAllNotes().find((n) => n.slug === 'alpha')!;
    const fromSingle = await reader.getNoteBySlug('2024', 'alpha');
    expect(fromSingle).toMatchObject(fromList);
  });

  it('throws NoteNotFoundError for a missing slug', async () => {
    await expect(valid().getNoteBySlug('2024', 'nope')).rejects.toBeInstanceOf(NoteNotFoundError);
  });

  it('throws NoteNotFoundError for a draft', async () => {
    await expect(valid().getNoteBySlug('2024', 'unfinished')).rejects.toBeInstanceOf(NoteNotFoundError);
  });
});

describe('getAdjacentNotes', () => {
  it('returns neighbours in reverse-chronological order', () => {
    const { newer, older } = valid().getAdjacentNotes('2024', 'beta');
    expect(newer?.slug).toBe('gamma');
    expect(older?.slug).toBe('alpha');
    expect(valid().getAdjacentNotes('2026', 'gamma').newer).toBeNull();
    expect(valid().getAdjacentNotes('2024', 'alpha').older).toBeNull();
  });

  it('matches on year and slug together, not slug alone', () => {
    const reader = createNotesReader(fixture('duplicate-slug'));
    expect(reader.getAdjacentNotes('2024', 'shared').newer?.year).toBe('2025');
    expect(reader.getAdjacentNotes('2025', 'shared').older?.year).toBe('2024');
  });
});

describe('createNotesReader', () => {
  it('memoizes within one reader but never across readers', () => {
    const a = valid();
    expect(a.getAllNotes()).toBe(a.getAllNotes());
    expect(createNotesReader(fixture('duplicate-slug')).getAllNotes()).not.toEqual(a.getAllNotes());
  });
});

describe('the real content tree', () => {
  it('every note under content/notes satisfies the frontmatter contract', () => {
    expect(getRealNotes().length).toBeGreaterThan(0);
  });
});
