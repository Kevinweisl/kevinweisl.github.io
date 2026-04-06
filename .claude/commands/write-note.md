# Write Note

Help Kevin write a new note for his personal website through collaborative dialogue.

## Context

Read the memory file at `/Users/kevin/.claude/projects/-Users-kevin-Documents-kevin-macbook-air-kevin-homepage/memory/project_notes_strategy.md` for Kevin's content strategy and positioning.

Notes are Markdown files stored in `content/notes/[year]/[slug].md` with frontmatter (title, date, excerpt).

## Process

### Phase 1: Topic Discovery (conversational)

Start by asking Kevin ONE question at a time:

1. **What's on your mind?** — Open-ended. Let him describe the topic loosely.
2. **Identify the article type** together:
   - Research Explainer (白話解讀自己的論文)
   - Experience Sharing (PhD/業界/求職/workflow)
   - Thematic Technical Survey (某主題的 mini-survey)
   - Field Commentary (領域觀點)
3. **Who is the audience?** — Researchers? Students? General tech audience?
4. **What's the key takeaway?** — One sentence the reader should walk away with.

Don't rush. If Kevin is unsure, suggest 2-3 angles based on his research and experience.

### Phase 2: Outline (collaborative)

Propose a draft outline (5-8 sections). Ask Kevin to:
- Reorder, add, or remove sections
- Flag which parts he wants to write himself vs. needs help with

Keep iterating until he says the outline is good.

### Phase 3: Drafting (section by section)

Write one section at a time (200-400 words). After each section:
- Show it to Kevin
- Ask for feedback before moving on
- Adjust tone, depth, or direction as needed

For **Research Explainer** articles: reference Kevin's actual papers in `src/data/publications.ts` for accurate details.

For **Experience Sharing** articles: reference `src/data/experience.ts` for career timeline accuracy.

### Phase 4: Polish & Publish

Once all sections are done:
1. **Review the full draft** — show the complete article for final review
2. **Proofread** — fix grammar, improve flow, ensure consistent tone
3. **Generate frontmatter** — title, date (today), excerpt (1-2 sentences)
4. **Generate slug** — from the title, lowercase, hyphens
5. **Save the file** — write to `content/notes/[year]/[slug].md`
6. **Verify** — run `npm run build` to confirm static generation works
7. **Update sitemap** — if needed, remind Kevin to add the note URL to `public/sitemap.xml`

### Optional: Import from Medium

If Kevin wants to migrate an existing Medium article:
1. Ask for the URL
2. Fetch and convert to Markdown
3. Adapt formatting to match the site's style
4. Follow Phase 4 to publish

## Tone Guidelines

- Kevin's notes are professional but approachable
- Write in English (unless Kevin specifies otherwise)
- Use first person ("I", "my research")
- Keep paragraphs short (3-4 sentences)
- Include code examples when relevant
- For research explainers: start with the problem, not the solution
- Do NOT use em-dash (——), use commas or periods instead
- Minimize bullet points; prefer flowing paragraphs. Use bullets only for definitions or steps.
- Avoid "**heading:** description" pattern excessively

## Markdown Formatting Checks

Before saving the final file, verify:
- **Bold spacing**: `**text**` must have a space before/after if followed by non-punctuation (e.g., `**茶葉**從` breaks parsing, use `**茶葉** 從`)
- **Tables**: Ensure `remark-gfm` is used in the pipeline for GFM table rendering
- **Images with captions**: Use `![alt](/path)` followed by `*caption text*` on the next line

## Key Principle

This is a DIALOGUE, not a task. Ask questions, listen, iterate. Kevin's voice should come through — you're a writing partner, not a ghostwriter.
