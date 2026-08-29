# Lessons

## 2026-04-16 — Removing gradient-text: check inline `-webkit-text-fill-color` too

**Context**: Migrating from blue-purple gradient to solid slate blue-green accent. Changed `.gradient-text` from `background: linear-gradient(...) + background-clip: text + -webkit-text-fill-color: transparent` to just `color: var(--accent)`.

**Mistake**: Missed that `PublicationItem.tsx:24` had an inline `style="-webkit-text-fill-color:transparent"` string embedded in `dangerouslySetInnerHTML`. Grep for `background-clip` or `-webkit-text-fill-color` in CSS files alone misses these. After CSS update, author names rendered invisible on `/publications`.

**Rule**: When removing a gradient-text class, grep BOTH CSS and TSX/JSX files for `-webkit-text-fill-color` and `background-clip`. Inline style strings inside `dangerouslySetInnerHTML` (or any template literal used as `style=`) are not matched by CSS-only searches.

**Verification pattern**: After any design-system refactor, walk at least one view of every page type (home / list / detail) before declaring done. The bug was invisible in source review but obvious in the rendered page.

## 2026-08-29 — "UA default" claims must be checked against Tailwind preflight

**Context**: Theme toggle refactor. A design note asserted `display: inline` is the UA default for `<svg>`, so revealing the dark-mode icon with `inline` would keep the button box identical to light mode.

**Mistake**: Tailwind preflight sets `svg { display: block }`. Static greps all passed; only measuring `getComputedStyle` in the browser showed the light-mode Moon was `block` while the dark-mode Sun was `inline`.

**Rule**: In this repo, "browser default" for a display property is whatever preflight says, not the spec. When a rule is supposed to preserve an existing box, verify with `getComputedStyle` / `getBoundingClientRect` in both states, not by reasoning about defaults.

## 2026-08-29 — A grep anchored on a class name eats selector prefixes

**Context**: Verifying compiled CSS with `grep -o '\.theme-toggle[^{]*{[^}]*}'`.

**Mistake**: The match starts at `.theme-toggle`, so `.dark .theme-toggle …` printed as `.theme-toggle …` and looked like the `.dark` scoping had been stripped by the minifier. Ten minutes chasing a non-bug.

**Rule**: To inspect a compiled rule, capture the whole rule from the previous `}`: `grep -o '[^}]*theme-toggle[^}]*}'`. Minifiers also merge rules with identical declarations into one selector list — expect fewer rules than you wrote.

## 2026-08-29 — Next.js build output is never byte-identical across builds

**Context**: Proving a refactor didn't change rendered HTML by diffing `out/` before and after.

**Mistake**: Three rounds of widening a normaliser. Beyond `/_next/static/*` hashes, the RSC flight payload embeds chunk paths *without* the `/_next/` prefix, a per-build id (`"b":"…"`), and 21-char random React fragment keys.

**Rule**: Normalise all three before diffing, or use a character-level `difflib` pass to see exactly what differs instead of guessing at regexes.
