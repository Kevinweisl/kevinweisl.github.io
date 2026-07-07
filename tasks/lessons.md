# Lessons

## 2026-04-16 — Removing gradient-text: check inline `-webkit-text-fill-color` too

**Context**: Migrating from blue-purple gradient to solid slate blue-green accent. Changed `.gradient-text` from `background: linear-gradient(...) + background-clip: text + -webkit-text-fill-color: transparent` to just `color: var(--accent)`.

**Mistake**: Missed that `PublicationItem.tsx:24` had an inline `style="-webkit-text-fill-color:transparent"` string embedded in `dangerouslySetInnerHTML`. Grep for `background-clip` or `-webkit-text-fill-color` in CSS files alone misses these. After CSS update, author names rendered invisible on `/publications`.

**Rule**: When removing a gradient-text class, grep BOTH CSS and TSX/JSX files for `-webkit-text-fill-color` and `background-clip`. Inline style strings inside `dangerouslySetInnerHTML` (or any template literal used as `style=`) are not matched by CSS-only searches.

**Verification pattern**: After any design-system refactor, walk at least one view of every page type (home / list / detail) before declaring done. The bug was invisible in source review but obvious in the rendered page.
