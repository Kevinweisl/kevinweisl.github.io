# 科技感改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把個人網站從「單一節奏、配色錨點錯置、幾乎沒有互動」改成一套有刻度的設計系統：印記藍配色、儀器欄骨架、M1 hover。

**Architecture:** 六層，由地基往上：守門測試 → token → 尺度與內容整理 → 骨架 → 互動 → 驗收。每層結束時網站都可部署。三個原始碼掃描測試在第 0 層先寫成紅的，它們的失敗清單就是後續各層的待辦。

**Tech Stack:** Next.js 15（static export）、React 19、Tailwind CSS v4、vitest、next/font/google。

**Spec:** `docs/superpowers/specs/2026-09-06-tech-redesign-design.md`

---

## File Structure

**新增**

| 檔案 | 職責 |
|---|---|
| `src/lib/design-system.test.ts` | 三個守門測試：字級白名單、顏色字面值、等寬字出口。純原始碼掃描，不 render |
| `src/components/RailGrid.tsx` | 儀器欄網格的唯一擁有者。`128 + 32 + 720 = 880` 只寫在這裡 |
| `src/components/Spotlight.tsx` | 聚光的唯一擁有者。client，`document` 上一個 `mousemove` |

**修改**

| 檔案 | 這次改什麼 |
|---|---|
| `src/styles/globals.css` | token、`.label` / `.mono`、hover、focus、減量動效、Hero 網格、Navbar 捲動線 |
| `src/app/layout.tsx` | 載入 JetBrains Mono、掛載 `Spotlight`、`themeColor` |
| `src/components/Section.tsx` | 用 `RailGrid`，接收外部算好的編號與分類 |
| `src/components/PageShell.tsx` | 加 `measure` 與 `rail` prop，h1 統一，用 `RailGrid` |
| `src/components/Hero.tsx` | 節奏、68ch、環境網格、移除粉紅光暈、移除 label inline 色 |
| `src/components/Navbar.tsx` | 只換 token（捲動線在 CSS） |
| `src/components/Footer.tsx` | 對齊 1100 欄 |
| `src/components/NoteCard.tsx` | `data-spotlight`、字級 |
| `src/components/PublicationItem.tsx` | 等寬徽章、年份靠右、拿掉整列 onClick、`data-spotlight` |
| `src/components/ExperienceList.tsx` | 兩欄合併成一根儀器欄 |
| `src/components/ExperienceItem.tsx` | 拿掉自己的 120px 欄與內部斷點 |
| `src/components/PublicationSearch.tsx` | 拿掉自訂 focus ring、640px |
| `src/components/ContactLinks.tsx` | hover 對新 accent 重驗 |
| `src/app/page.tsx` | 區塊改成陣列、即時編號 |
| `src/app/notes/[year]/[slug]/page.tsx` | 收進 `PageShell` |
| `src/app/not-found.tsx` | 行內樣式改 token、32px → 28px |
| `src/data/publications.ts` | 十筆 `venueAcronym` 拿掉年份 |
| `.impeccable.md` | 品牌色來源、token 表、儀器欄與三組尺度規則 |

---

## Phase 0 — 守門測試（先寫成紅的）

### Task 1: 三個設計系統守門測試

**Files:**
- Create: `src/lib/design-system.test.ts`

- [ ] **Step 1: 寫測試檔**

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * 設計系統的規則，寫成可執行的約束。
 * 姊妹檔 typography.test.ts 守的是 serif 字重；這裡守的是字級、顏色、等寬字的出口。
 */

const SRC = join(__dirname, '..');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === '__fixtures__') continue;
      walk(full, out);
    } else if (full.endsWith('.tsx')) out.push(full);
  }
  return out;
}

const rel = (f: string) => f.replace(SRC, 'src');

/** 字級尺度：11 / 13 / 16 / 20 / 28。兩個例外指名道姓，不放寬規則。 */
const ALLOWED_PX = new Set([11, 13, 16, 20, 28]);
const NAMED_EXCEPTIONS: Record<string, number[]> = {
  'src/components/Hero.tsx': [34, 48], // clamp(34px, 5vw, 48px)：封面，全站唯一
  'src/app/not-found.tsx': [80],       // 裝飾引號，只在 404
};

describe('type scale', () => {
  it('only the six steps appear, plus two named exceptions', () => {
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      const source = readFileSync(file, 'utf8');
      const allowedHere = NAMED_EXCEPTIONS[rel(file)] ?? [];
      for (const m of source.matchAll(/text-\[(\d+)px\]|fontSize:\s*'(\d+)px'|(\d+)px,\s*\d+vw/g)) {
        const px = Number(m[1] ?? m[2] ?? m[3]);
        if (ALLOWED_PX.has(px) || allowedHere.includes(px)) continue;
        offenders.push(`${rel(file)}: ${px}px`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});

/** 顏色只能從 token 來。2026-09-03 的教訓：同一個字面值的 bug 不會只住在一個元件裡。 */
const COLOUR_LITERAL = /#[0-9a-fA-F]{3,8}\b|rgba?\(|\btext-white\b|\bbg-white\b|\btext-black\b/;

describe('colour literals', () => {
  it('components carry no colour literals — only var(--token)', () => {
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      for (const [i, line] of readFileSync(file, 'utf8').split('\n').entries()) {
        if (!COLOUR_LITERAL.test(line)) continue;
        offenders.push(`${rel(file)}:${i + 1}: ${line.trim()}`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});

/** 等寬字只有三個出口：.label / .mono / --font-mono，全在 globals.css 裡。 */
describe('mono font ownership', () => {
  it('no component declares a mono family or the font-mono utility', () => {
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      for (const [i, line] of readFileSync(file, 'utf8').split('\n').entries()) {
        if (!/\bfont-mono\b|fontFamily|monospace/.test(line)) continue;
        offenders.push(`${rel(file)}:${i + 1}: ${line.trim()}`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
```

- [ ] **Step 2: 跑測試，確認是紅的**

Run: `npx vitest run src/lib/design-system.test.ts`
Expected: FAIL。三個 describe 都會列出違規清單——這份清單就是 Phase 1–4 的精確待辦。把輸出貼進 `tasks/todo.md` 當作對照基準。

- [ ] **Step 3: Commit**

```bash
git add src/lib/design-system.test.ts
git commit -m "test: Guard the design system before changing it

Three source scans turn the spec's rules into executable constraints:
the type scale (six steps, two named exceptions), colour literals in
components, and where the mono family may be declared. All three fail
today; their failure lists are the todo for the layers that follow."
```

---

## Phase 1 — Token

### Task 2: 載入 JetBrains Mono 並定義 `--font-mono`

**Files:**
- Modify: `src/app/layout.tsx:1`, `:27-55`, `:82`
- Modify: `src/styles/globals.css`（`@theme inline` 區塊）

- [ ] **Step 1: `layout.tsx` 匯入與設定字型**

第 1 行改成：

```tsx
import { Albert_Sans, Young_Serif, Noto_Sans_TC, Noto_Serif_TC, JetBrains_Mono } from 'next/font/google';
```

在 `notoSerifTC` 宣告之後（`:55` 後）加入：

```tsx
// Metadata、儀器欄編號、年份都靠它；拉丁子集就夠，這些位置不會出現 CJK。
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});
```

`:82` 的 `<html className>` 加上 `${jetbrainsMono.variable}`：

```tsx
<html lang="en" className={`${albertSans.variable} ${youngSerif.variable} ${notoSansTC.variable} ${notoSerifTC.variable} ${jetbrainsMono.variable} scroll-smooth`}>
```

- [ ] **Step 2: `globals.css` 的 `@theme inline` 加入 mono 堆疊**

```css
@theme inline {
  --font-sans: var(--font-albert-sans), var(--font-noto-sans-tc), ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-serif: var(--font-young-serif), var(--font-noto-serif-tc), Georgia, Cambria, serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
```

- [ ] **Step 3: 驗證字型有載入**

Run: `npm run build && grep -c "jetbrains" out/index.html`
Expected: 大於 0（字型變數會出現在 html 的 class 上）

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/styles/globals.css
git commit -m "feat: Load JetBrains Mono and give the theme a mono stack"
```

---

### Task 3: 換掉整組配色 token

**Files:**
- Modify: `src/styles/globals.css:20-77`（`:root` 區塊）
- Modify: `src/app/layout.tsx:24`（`themeColor`）

- [ ] **Step 1: 換 `:root` 的核心 token**

把 `:root` 開頭到 `--radius` 之間換成：

```css
:root {
  --bg-primary: #06090b;
  --bg-card: #101a1f;
  /* 列 hover 的表面。其上五個文字色各自驗過，最低 text-muted 5.26。 */
  --bg-card-hover: #152530;
  --bg-nav: rgba(6, 9, 11, 0.9);
  --bg-footer: #030506;

  --text-primary: #e6f0f2;
  --text-body: #9aaeb4;
  --text-muted: #84999f;
  --text-nav: #8ea4ab;
  --text-on-primary: #06090b;
  --text-footer: #84999f;

  /* KW 字標的天空藍（佔字標 72%）。色相 202.8°，與 ground 的 204.0° 同線。 */
  --accent: #a0cce7;
  --accent-hover: #c6e3f5;
  --accent-light: #10222e;

  /* 第二品牌色。四個工作：byline 中作者本人的名字、區塊標題的強調字、
     進行中標記 Present、以及 Hero 內文的斜體連結。其餘一律不用。 */
  --brand: #eaa9c8;

  --border: #33474f;

  --glow: rgba(160, 204, 231, 0.17);
  --grid-line: rgba(160, 204, 231, 0.045);

  /* 兩個時間、兩條曲線。顏色沒有慣性，位移有。 */
  --dur-color: 0.18s;
  --dur-move: 0.24s;
  --ease-move: cubic-bezier(0.2, 0.8, 0.2, 1);

  --radius: 4px;
```

刪除 `--border-card`（與 `--border` 同值，多餘）、`--shadow-card`、`--shadow-card-hover`、`--shadow-contact-hover`、`--transition`。`--shadow-contact-hover` 在 Task 14 改寫 `ContactLinks` 時一併處理。

- [ ] **Step 2: 換 Hero 那組**

```css
  /* Hero 是不同的亮度環境，所以有自己的文字階。每個 gradient 停點與每個
     半透明表面合成後的實際色都各驗過一次，最低 5.16（cta2:hover 上的 --hero-muted）。 */
  --hero-bg: linear-gradient(135deg, #0c161d 0%, #1c3240 55%, #13242f 100%);
  --hero-heading: #ffffff;
  --hero-subtitle: var(--accent);
  --hero-body: rgba(255, 255, 255, 0.76);
  --hero-blob: rgba(160, 204, 231, 0.16);
  /* Hero 亮度環境裡的次要文字：卡片標題與 tag 共用一個角色，就共用一個值。 */
  --hero-muted: #b6d5db;
  --hero-cta-bg: #cadfe3;
  --hero-cta-text: #06090b;
  --hero-cta-shadow: rgba(0, 0, 0, 0.35);
  --hero-cta2-bg: rgba(255, 255, 255, 0.08);
  --hero-cta2-border: rgba(255, 255, 255, 0.2);
  --hero-cta2-hover: rgba(255, 255, 255, 0.16);
  --hero-card-bg: rgba(255, 255, 255, 0.07);
  --hero-card-border: rgba(255, 255, 255, 0.13);
  --hero-card-img-bg: rgba(255, 255, 255, 0.05);
  --hero-tag-bg: rgba(255, 255, 255, 0.09);
  --hero-tag-border: rgba(255, 255, 255, 0.09);
  /* 粉紅的第四個工作。 */
  --hero-link: var(--brand);
  --hero-link-border: rgba(234, 169, 200, 0.5);
  --hero-link-hover: #f3cddf;
}
```

刪除 `--hero-blob-2`（粉紅裝飾光暈，不在粉紅的四個工作裡）、`--hero-label`（標籤不是品牌色的工作；改由 `--hero-muted` 承接）、`--hero-cta2-text` 與 `--hero-tag-text`（都併入 `--hero-muted`）。

- [ ] **Step 3: 同步 `themeColor`**

`src/app/layout.tsx:21-25`：

```tsx
// Dark only: tell the browser so native scrollbars, form controls and the
// mobile chrome match the page instead of flashing light. #06090b = --bg-primary.
export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#06090b',
};
```

- [ ] **Step 4: 找出所有還指向已刪 token 的地方**

Run:
```bash
grep -rn "border-card\|shadow-card\|hero-label\|hero-blob-2\|hero-cta2-text\|hero-tag-text\|var(--transition)" src/
```
Expected: 列出的每一處都要在 Phase 1–2 修掉。此時建置會壞——這是預期的，因為元件還指著舊 token。

- [ ] **Step 5: Commit**

```bash
git add src/styles/globals.css src/app/layout.tsx
git commit -m "feat: Repalette on the monogram blue and a near-black ground

The accent is now #A0CCE7, sampled from the KW monogram that the hero
actually shows; the ground drops to #06090B. Both sit at hue 204, so
they merge without adjustment.

Pink loses two uses it never had a claim to — the decorative hero blob
and the hero card's label — and --hero-muted takes the label over. Every
hero surface was re-derived: the translucent card composited over the
brightest gradient stop put --text-muted at 3.61, under AA, which is why
the hero keeps a text ramp of its own."
```

---

### Task 4: `.label`、`.mono`、`.prose` 的等寬字

**Files:**
- Modify: `src/styles/globals.css`（工具類與 `.prose`）

- [ ] **Step 1: `.label` 吃下等寬字**

```css
/* 標記角色的唯一擁有者：分類名、venue 徽章、Hero 的 tag 標題、儀器欄的分類。
   靠大小寫、字距與字族與內文區隔，所以顏色可以留給互動。
   Unlayered，會蓋過同元素上的 Tailwind utility —— 別在同一個元素上疊 text-[…] 或 font-*。 */
.label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Hero 是更亮的表面，需要自己的次要文字色才過得了 AA。 */
#home .label {
  color: var(--hero-muted);
}

/* 需要垂直對齊的數字：儀器欄編號、年份、日期。tabular-nums 才是重點。 */
.mono {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 2: `.prose` 的程式碼區塊用同一套等寬字（但不要 tabular-nums）**

在 `globals.css` 的 `.prose code` 與 `.prose pre code` 規則各加一行 `font-family: var(--font-mono);`。**不要**加 `font-variant-numeric` —— 那對數字對齊是對的，對程式碼是錯的。

- [ ] **Step 3: 跑等寬字守門測試**

Run: `npx vitest run src/lib/design-system.test.ts -t "mono font ownership"`
Expected: PASS（元件裡本來就沒有 font-mono / fontFamily / monospace）

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css
git commit -m "feat: One mono stack, three doors — .label, .mono, .prose code

.label owns the mono family because 'is a label' is a role, not a
utility to bolt on. .mono is for numerals that stack and must align, so
tabular-nums rides with it. Code blocks take the family and refuse the
figures. #home .label uses --hero-muted: the hero is a brighter surface
and --text-muted lands at 3.61 there."
```

---

### Task 5: 同步 `.impeccable.md`

**Files:**
- Modify: `.impeccable.md`

- [ ] **Step 1: 改寫 "Existing Brand Colors" 與 "Constraints"**

把品牌色來源改成 KW 字標並附面積佔比（2026-09-02 的教訓：佔比決定主色還是點綴，只記 hex 會漏掉這個資訊）；貼上新的 token 表；補上儀器欄規則與三組尺度。ccClub 的三色以「歷史錨點」保留說明，並註明它不在 repo 裡、網站上看不到。

- [ ] **Step 2: Commit**

```bash
git add .impeccable.md
git commit -m "docs: Design context now records the mark the site shows"
```

---

## Phase 2 — 尺度與內容整理

### Task 6: `venueAcronym` 拿掉年份

**Files:**
- Modify: `src/data/publications.ts`（十筆 `venueAcronym`）

- [ ] **Step 1: 十筆改值**

`Findings of ACL 2026` → `Findings of ACL`；`LREC 2026` → `LREC`；`Findings of EACL 2026` → `Findings of EACL`；`Findings of EMNLP 2025` → `Findings of EMNLP`；`SIGIR 2025` → `SIGIR`；`EMNLP 2024` → `EMNLP`；`Findings of ACL 2024` → `Findings of ACL`；`WI-IAT 2021` → `WI-IAT`；`COLING 2016` → `COLING`；`SIGIR Workshop 2014` → `SIGIR Workshop`。

- [ ] **Step 2: 確認沒有年份殘留在 acronym 裡**

Run: `grep -n "venueAcronym.*[0-9]\{4\}" src/data/publications.ts`
Expected: 無輸出

- [ ] **Step 3: 確認搜尋沒有迴歸**

過濾字串是 `` `${title} ${authors} ${venue} ${venueAcronym || ''} ${year}` ``（`PublicationList.tsx:22`），acronym 與 year 相鄰，所以 `"ACL 2026"` 仍是連續子字串。

Run: `npm run build && grep -o "Findings of ACL" out/publications.html | head -1`
Expected: `Findings of ACL`

- [ ] **Step 4: Commit**

```bash
git add src/data/publications.ts
git commit -m "refactor: The year lives in one field, not two

Every venueAcronym carried its own year while the year field sat unused
except as a fallback, which also meant the search haystack read
'Findings of ACL 2026 2026'. The acronym now names the venue and only
the venue. Search is unaffected: the filter concatenates acronym and
year adjacently, so 'ACL 2026' still matches."
```

---

### Task 7: `PublicationItem` — 等寬徽章、年份靠右、拿掉整列 onClick

**Files:**
- Modify: `src/components/PublicationItem.tsx:37-50`, `:107`

- [ ] **Step 1: 拿掉整列 onClick 與 `handleMainClick`**

`:37-39` 的外層 div 改成：

```tsx
    <div
      className="relative overflow-hidden py-[18px] px-5 bg-[var(--bg-card)] pub-row"
      data-spotlight
    >
      <span className="spot" aria-hidden="true" />
```

刪掉 `onClick={handleMainClick}`、`cursor-pointer` / `cursor-default` 判斷，以及元件上方 `handleMainClick` 的定義。展開摘要仍由連結列裡既有的 `Abstract` / `BibTeX` 按鈕負責——那本來就是同一個操作，整列 onClick 是重複的操作面，而且是 `div` 掛 onClick，Tab 不到。

- [ ] **Step 2: 徽章與年份**

`:41-43` 換成：

```tsx
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="label inline-block border border-[var(--border)] px-2 py-[2px] rounded-[2px] pub-badge">
          {venueAcronym || venue}
        </span>
        <span className="mono text-[11px] text-[var(--text-muted)] whitespace-nowrap">
          {year}
        </span>
      </div>
```

- [ ] **Step 3: `:107` 的 chip 移除 `hover:opacity-80`**

改用 token 的 hover 底色而非 opacity：`className="text-[13px] bg-[var(--accent-light)] text-[var(--accent)] px-2 py-0.5 rounded-[var(--radius)] mt-2 mr-2"`。

- [ ] **Step 4: 建置並確認年份出現在徽章外**

Run: `npm run build && grep -o 'class="mono[^"]*"[^>]*>2026' out/publications.html | head -2`
Expected: 有輸出

- [ ] **Step 5: Commit**

```bash
git add src/components/PublicationItem.tsx
git commit -m "fix: The publication row stops pretending to be a button

The row was a div with onClick that no keyboard could reach, duplicating
the Abstract button already in the link row. The new hover makes a row
look more clickable than it does today, so leaving it would have made
the gap worse. Dropping it removes the a11y hole and the duplicate
affordance, and the component gets shorter.

The badge now names the venue and the year sits right-aligned in
tabular figures, which is what makes a column of years scan."
```

---

### Task 8: 字級與間距尺度掃過各元件

**Files:**
- Modify: `src/components/NoteCard.tsx:25`, `src/components/ExperienceItem.tsx:37`, `src/components/PublicationItem.tsx:87,100`, `src/app/not-found.tsx:22,51,63`

- [ ] **Step 1: 14px 併入 13 或 16**

- `NoteCard.tsx:25` 摘要 `text-[14px]` → `text-[16px]`（它是要讀的內文）
- `ExperienceItem.tsx:37` 機構名 `text-[14px]` → `text-[13px]`（它是 metadata）
- `PublicationItem.tsx:87,100` 摘要／BibTeX 面板 `text-[14px]` → `text-[13px]`
- `not-found.tsx:51,63` CTA 標籤 `text-[14px]` → `text-[13px]`

- [ ] **Step 2: 404 的 32px → 28px**

`not-found.tsx:22` 的 inline `fontSize: '32px'` 改成 `fontSize: '28px'`，並把其餘 inline 顏色改成 `var(--…)` token。80px 裝飾引號保留（測試裡具名允許）。

- [ ] **Step 3: 跑字級守門測試**

Run: `npx vitest run src/lib/design-system.test.ts -t "type scale"`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components src/app/not-found.tsx
git commit -m "refactor: Nine type sizes become six

14px was doing two different jobs — body you read and metadata you scan —
so each of its six uses joins 16 or 13 by what it actually is. The 404's
32px heading joins the 28px every other page heading uses; its 80px
quote glyph stays, named in the test rather than waved through."
```

---

### Task 9: Footer 對齊 1100、搜尋框拿掉自訂 focus

**Files:**
- Modify: `src/components/Footer.tsx:6-11`
- Modify: `src/components/PublicationSearch.tsx:12,19`

- [ ] **Step 1: Footer 加內層容器**

```tsx
    <footer
      className="py-7 mt-auto text-[13px]"
      style={{ background: 'var(--bg-footer)', color: 'var(--text-footer)' }}
    >
      <div className="max-w-[1100px] mx-auto px-6 text-center">
        <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </div>
    </footer>
```

- [ ] **Step 2: 搜尋框**

`:12` 的 `max-w-xl` → `max-w-[640px]`。`:19` 拿掉 `focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent`，保留其餘。全域 `:focus-visible` 會接手——而且不會像 Tailwind 的 `focus:` 那樣在滑鼠點擊時也亮起。

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx src/components/PublicationSearch.tsx
git commit -m "fix: One focus vocabulary, and a footer that lines up

The search input drew its own focus ring with Tailwind's focus:, which
fires on mouse click too — a keyboard affordance shown to people who
never asked for it. The global :focus-visible already handles this.
The footer had no inner container at all, so it aligned to neither
column; it now sits on the 1100px one."
```

---

## Phase 3 — 骨架

### Task 10: `RailGrid`

**Files:**
- Create: `src/components/RailGrid.tsx`

- [ ] **Step 1: 寫元件**

```tsx
import React from 'react';

interface RailGridProps {
  /** 欄裡的定位資訊：序列中的編號、時間中的日期、分類中的類別。沒有就留空。 */
  rail?: React.ReactNode;
  children: React.ReactNode;
  /** 內容欄的量測。列表用 720px，長文用 68ch。 */
  measure?: '720px' | '68ch';
}

/**
 * 儀器欄網格的唯一擁有者。128 欄 + 32 溝 + 720 內容 = 880，這組數字只寫在這裡。
 *
 * DOM 順序是內容在前、欄在後，再用 grid 把欄放回左邊：螢幕閱讀器先聽到標題
 * 才聽到補充定位，和視覺讀者的解析順序一致（眼睛先抓 28px 標題，不是 11px 編號）。
 * md 以下欄塌到內容上方。
 */
const RailGrid: React.FC<RailGridProps> = ({ rail, children, measure = '720px' }) => (
  <div className="mx-auto grid grid-cols-1 md:grid-cols-[128px_1fr] md:gap-x-8" style={{ maxWidth: measure === '68ch' ? 'calc(160px + 68ch)' : '880px' }}>
    <div className="md:col-start-2 md:row-start-1" style={{ maxWidth: measure }}>
      {children}
    </div>
    {rail && (
      <div className="md:col-start-1 md:row-start-1 order-first md:order-none mb-3 md:mb-0">
        {rail}
      </div>
    )}
  </div>
);

export default RailGrid;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RailGrid.tsx
git commit -m "feat: One owner for the 128+32+720 grid

Content comes first in the DOM and the rail is placed back on the left
with grid, so the reading order is heading then locator — the order a
sighted reader parses, not the order the pixels sit in."
```

---

### Task 11: `Section` 用 `RailGrid`，首頁即時編號

**Files:**
- Modify: `src/components/Section.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: `Section` 接收算好的編號與分類**

`SectionProps` 加上 `index?: string` 與 `railLabel?: string`；`py-[72px]` 改 `py-[96px]`；`max-w-[720px]` 那層換成 `RailGrid`，`rail` 傳入：

```tsx
  const rail = index && (
    <div id={`${id}-rail`}>
      <div className="mono text-[11px] font-semibold tracking-[0.11em] text-[var(--text-muted)]">{index}</div>
      {railLabel && <div className="label mt-1.5 text-[11px]">{railLabel}</div>}
    </div>
  );
```

`<section>` 加上 `aria-labelledby={title ? undefined : `${id}-rail`}` —— 沒有標題的區塊（Contact）靠欄取得可及名稱，否則它不構成 landmark。

- [ ] **Step 2: 首頁區塊改成陣列**

`src/app/page.tsx` 把四個 `<Section>` 收進陣列後 map，編號用 `String(i + 1).padStart(2, '0')`：

```tsx
  const sections = [
    { id: 'publications', title: 'Selected Publications', emphasis: 'Publications', railLabel: 'Research',
      subtitle: 'Recent research in Natural Language Processing and Large Language Models',
      viewAllHref: '/publications', body: <PublicationList filter="featured" /> },
    ...(recentNotes.length > 0 ? [{ id: 'notes', title: 'Recent Notes', emphasis: 'Notes', railLabel: 'Writing',
      viewAllHref: '/notes',
      body: <CardList>{recentNotes.map((n) => <NoteCard key={`${n.year}/${n.slug}`} {...n} />)}</CardList> }] : []),
    { id: 'experience', title: 'Experience', railLabel: 'Career', viewAllHref: '/experience',
      body: <ExperienceList highlight /> },
    { id: 'contact', title: '', railLabel: 'Contact', body: (
      <div className="text-center">
        <p className="text-[20px] font-medium mb-8 max-w-[640px] mx-auto">
          <span className="text-[var(--text-primary)]">Open to research collaborations, talks, and teaching.</span>
        </p>
        <ContactLinks />
      </div>
    ) },
  ];
```

編號在 map 時算，不綁定身分——Notes 缺席時 Experience 自然變成 `02`，不會跳號。

- [ ] **Step 3: 驗證缺席時不跳號**

Run: `npm run build && grep -o "0[1-4]" out/index.html | sort -u`
Expected: `01 02 03 04`（目前有筆記）。暫時把 `content/notes` 移開再 build 一次，應得 `01 02 03`。

- [ ] **Step 4: Commit**

```bash
git add src/components/Section.tsx src/app/page.tsx
git commit -m "feat: Home sections carry a rail, numbered by position

The numbers describe where a section sits on this page, not what it is,
so they are computed from the sections actually rendered — Recent Notes
is conditional, and a gap in the sequence would read as a bug.

The contact section renders no heading at all, so its rail is now its
accessible name via aria-labelledby; without one the section is not a
landmark."
```

---

### Task 12: `PageShell` 加 `measure` 與 `rail`，文章頁收編

**Files:**
- Modify: `src/components/PageShell.tsx`
- Modify: `src/app/publications/page.tsx`, `src/app/notes/page.tsx`, `src/app/experience/page.tsx`
- Modify: `src/app/notes/[year]/[slug]/page.tsx:49-67`

- [ ] **Step 1: 改寫 `PageShell`**

```tsx
import React from 'react';
import RailGrid from './RailGrid';

interface PageShellProps {
  title: string;
  /** 欄裡的定位資訊：子頁放數量，文章頁放日期與閱讀時間。 */
  rail?: React.ReactNode;
  /** 列表頁 720px；長文 68ch。 */
  measure?: '720px' | '68ch';
  /** 標題之前的內容，例如文章頁的返回連結。 */
  beforeTitle?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * 每個非首頁頁面共用的殼。標題一律 serif、靠左、28px、--text-primary
 * —— 四頁曾經有四種尺寸與對齊。
 */
const PageShell: React.FC<PageShellProps> = ({ title, rail, measure = '720px', beforeTitle, children }) => (
  <section className="py-[96px] px-6">
    <RailGrid rail={rail} measure={measure}>
      {beforeTitle}
      <h1 className="font-serif text-[28px] text-[var(--text-primary)] mb-8">{title}</h1>
      {children}
    </RailGrid>
  </section>
);

export default PageShell;
```

- [ ] **Step 2: 三個子頁傳入數量**

`publications/page.tsx`：`rail={<div className="label">{publicationsData.length} Papers</div>}`
`notes/page.tsx`：`rail={<div className="label">{notes.length} Notes</div>}`
`experience/page.tsx`：`rail={<div className="label">{roleCount} Roles</div>}`（`roleCount` = 各分類 items 長度總和）

- [ ] **Step 3: 文章頁收進 `PageShell`**

`notes/[year]/[slug]/page.tsx:49-67` 換成：

```tsx
      <PageShell
        title={note.title}
        measure="68ch"
        beforeTitle={
          <Link href="/notes" className="inline-flex items-center gap-1.5 text-[13px] text-[var(--accent)] hover:underline mb-8">
            ← Back to Notes
          </Link>
        }
        rail={
          <div className="mono text-[11px] text-[var(--text-muted)] leading-[1.6]">
            <div>{formattedDate}</div>
            <div>{note.readingMinutes} min read</div>
          </div>
        }
      >
```

刪掉手工複製的 `py-[72px] px-6`、`max-w-[68ch] mx-auto`、`font-serif text-[28px]`，以及多餘的 inline `background: 'var(--bg-primary)'`（`body` 已經有了）。日期與閱讀時間從標題下方移到欄裡。JSON-LD script 留在 `PageShell` 外面。

- [ ] **Step 4: 驗證四頁的 h1 一致**

Run: `npm run build && grep -o '<h1 class="[^"]*"' out/publications.html out/notes.html out/experience.html out/notes/2024/llm-selection-bias-part1.html`
Expected: 四個都是 `font-serif text-[28px] text-[var(--text-primary)] mb-8`

- [ ] **Step 5: Commit**

```bash
git add src/components/PageShell.tsx src/app
git commit -m "refactor: The article page joins the shell it was copying

1165232 gave the sub-pages one owner and deliberately left the article
page out. It had been hand-copying py-[72px] px-6 and font-serif
text-[28px] ever since, and this redesign changes every one of those
values — keeping it separate meant editing the same numbers twice.
Unifying h1 also removed the reason they diverged.

The rail holds what locates each page: a count on the listings, the date
and reading time on an article, which also clears those off the title."
```

---

### Task 13: Experience 兩欄合併成一根

**Files:**
- Modify: `src/components/ExperienceList.tsx`
- Modify: `src/components/ExperienceItem.tsx:22-32`

- [ ] **Step 1: `ExperienceItem` 拿掉自己的欄**

`:22` 的外層 div 改成單欄，期間欄移除；期間改由 `ExperienceList` 放進儀器欄的位置：

```tsx
    <div className="relative overflow-hidden py-[18px] px-5 border-b border-[var(--border)] last:border-b-0" data-spotlight>
      <span className="spot" aria-hidden="true" />
      <div className="font-serif text-[16px] text-[var(--text-primary)]">{title}</div>
      ...
```

`period` 改由 `ExperienceList` 使用；`ExperienceItem` 仍接收它以渲染 `Present` 標記，但不再自己佈局成欄。

- [ ] **Step 2: `ExperienceList` 把期間放進欄**

每一筆用 `RailGrid` 包裹，`rail` 放該筆的期間：

```tsx
              {items.map((item, j) => (
                <RailGrid key={j} rail={<PeriodLabel period={item.period} />}>
                  <ExperienceItem {...item} compact={highlight} />
                </RailGrid>
              ))}
```

分類標題（Education / Teaching / Work）維持滿寬橫跨，欄在它旁邊留白——它是組與組之間的分隔，不是某個單位的定位資訊。

- [ ] **Step 3: 驗證只剩一根欄**

Run: `npm run build && grep -c "120px_1fr" out/experience.html`
Expected: 0

- [ ] **Step 4: Commit**

```bash
git add src/components/ExperienceList.tsx src/components/ExperienceItem.tsx
git commit -m "feat: Experience's two columns become one

ExperienceItem already had a [120px_1fr] grid with the period on the
left; a section rail beside it would have made two parallel columns.
They are now the same column: the section number sits at its head and
each period follows down the side, which turns the rail into an actual
timeline. ExperienceItem's own sm breakpoint disappears with it, so the
whole site has one rail breakpoint."
```

---

## Phase 4 — 互動

### Task 14: `Spotlight`

**Files:**
- Create: `src/components/Spotlight.tsx`
- Modify: `src/app/layout.tsx:89-95`

- [ ] **Step 1: 寫元件**

```tsx
'use client';

import { useEffect } from 'react';

/**
 * 聚光的唯一擁有者。
 *
 * 游標追蹤需要 mousemove。逐列掛監聽會把 NoteCard 這類 server component
 * 全部拖成 client component，對靜態匯出的站是純粹的 JS 增量。這裡在 document
 * 上掛一個，用 closest('[data-spotlight]') 找到當下的列——任何元件加上那個
 * 屬性就能參加，不必變成 client component。
 */
export default function Spotlight() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(hover: none)').matches;
    if (reduced || coarse) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const row = (e.target as Element | null)?.closest?.('[data-spotlight]') as HTMLElement | null;
        if (!row) return;
        const r = row.getBoundingClientRect();
        row.style.setProperty('--mx', `${e.clientX - r.left}px`);
        row.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
```

- [ ] **Step 2: 掛載一次**

`layout.tsx` 的 `<body>` 內、`<Navbar />` 之前加入 `<Spotlight />`，並在檔頂 `import Spotlight from '@/components/Spotlight';`。

- [ ] **Step 3: Commit**

```bash
git add src/components/Spotlight.tsx src/app/layout.tsx
git commit -m "feat: One listener owns the spotlight

Per-row mousemove would have turned every list row into a client
component for a static export. One document listener plus
closest('[data-spotlight]') lets a server component opt in with an
attribute. Writes are rAF-coalesced, and the listener never attaches
under reduced motion or on a coarse pointer."
```

---

### Task 15: M1 hover、focus、減量動效

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/components/NoteCard.tsx:10-13`

- [ ] **Step 1: 加入列的樣式**

```css
/* ===== 列：M1 ===== */
/* 左側指示條由上往下展開、整列右推、底色、徽章亮起、跟游標的聚光。
   沒有上浮 —— 那是獨立卡片模型的行為，和連續平列一起做會讓列斜著跑。 */
.row {
  position: relative;
  overflow: hidden;
  padding: 18px 20px 18px 18px;
  background: var(--bg-card);
  transition: background var(--dur-color) ease, padding-left var(--dur-move) var(--ease-move);
}
.row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--accent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform var(--dur-move) var(--ease-move);
}
.row .spot {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--dur-move) ease;
  background: radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), var(--glow), transparent 60%);
}

@media (hover: hover) {
  .row:hover {
    background: var(--bg-card-hover);
    padding-left: 24px;
  }
  .row:hover::before { transform: scaleY(1); }
  .row:hover .spot { opacity: 1; }
  .row:hover .label { color: var(--accent); border-color: var(--accent); }
}

/* 鍵盤拿到同一個「這一列被選中」的語彙，但不含右推（裝飾）
   與聚光（需要游標座標，鍵盤沒有）。全域 focus 外框保留。 */
.row:focus-visible,
.row:has(:focus-visible) {
  background: var(--bg-card-hover);
}
.row:focus-visible::before,
.row:has(:focus-visible)::before { transform: scaleY(1); }

@media (prefers-reduced-motion: reduce) {
  .row { transition: background var(--dur-color) ease; }
  .row::before { transition: none; }
  .row:hover { padding-left: 18px; }
  .row .spot { display: none; }
}
```

- [ ] **Step 2: 三個列元件套用 `.row`**

`NoteCard.tsx:10-13` 的 `<Link>` className 換成 `block row`，加 `data-spotlight`，並在內部第一個子元素前加 `<span className="spot" aria-hidden="true" />`。`PublicationItem` 與 `ExperienceItem` 在 Task 7 / 13 已加好 `data-spotlight` 與 `.spot`，這裡把它們的 `py-[18px] px-5 bg-[var(--bg-card)]` 換成 `row`。

- [ ] **Step 3: 驗證減量動效**

Run: `npm run build && grep -c "prefers-reduced-motion" out/_next/static/css/*.css`
Expected: 大於 0

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css src/components
git commit -m "feat: M1 — the indicator bar, the shift, and the spotlight

Four things at once: a 2px bar scaling in from the top, the row shifting
6px right, the ground lifting, the badge lighting up, and a spotlight
tracking the cursor. No lift — the bar needs rows that run continuously,
and a shift plus a lift sends the row diagonally.

The shift moves padding-left rather than the box so the ::before bar
stays put. Keyboard focus gets the bar and the ground but not the shift
(decoration) or the spotlight (there is no cursor). Reduced motion keeps
the colour changes and drops the rest."
```

---

### Task 16: Navbar 捲動線、Hero 環境網格

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/components/Hero.tsx:20-35`, `:51`, `:100-102`

- [ ] **Step 1: Navbar 捲動線（零 JS）**

```css
/* 頂端時那條線分隔的是空氣。捲動後才出現。
   不支援 scroll-driven animation 的瀏覽器退化成「線一直都在」，也就是今天的行為。 */
@supports (animation-timeline: scroll()) {
  .nav-shell {
    border-bottom-color: transparent;
    animation: nav-rule linear both;
    animation-timeline: scroll();
    animation-range: 0 80px;
  }
  @keyframes nav-rule {
    to { border-bottom-color: var(--border); }
  }
}
```

`Navbar.tsx` 的 `<nav>` 加上 `nav-shell` class。

- [ ] **Step 2: Hero 環境網格與移除粉紅光暈**

`Hero.tsx:26-34` 兩個裝飾 div 改成一個（teal 光暈），並加上網格層：

```tsx
      <div className="hero-grid" aria-hidden="true" />
      <div
        className="absolute -top-1/2 -right-[20%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--hero-blob) 0%, transparent 70%)' }}
      />
```

```css
.hero-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(circle at 50% 0%, #000 0%, transparent 70%);
  mask-image: radial-gradient(circle at 50% 0%, #000 0%, transparent 70%);
}
```

- [ ] **Step 3: Hero 節奏與量測**

`:22` 的 `py-[72px]` → `pt-[112px] pb-[96px]`；`:51` 的 `max-w-[60ch]` → `max-w-[68ch]`；`:100-102` 拿掉 `style={{ color: 'var(--hero-label)' }}`（`#home .label` 已接手）。

- [ ] **Step 4: 跑全部測試**

Run: `npm test && npm run build`
Expected: 全綠

- [ ] **Step 5: Commit**

```bash
git add src/styles/globals.css src/components/Hero.tsx src/components/Navbar.tsx
git commit -m "feat: A grid under the hero and a rule that waits for scroll

The nav's hairline separated nothing while the page sat at the top; it
now fades in with scroll via animation-timeline, no JS, degrading to
today's always-on rule where unsupported.

The hero keeps its teal bloom, loses the pink one — an ambient blob was
never one of pink's jobs — and gains a 44px grid at 4.5% opacity,
masked out below the fold line. Ambience, not content."
```

---

## Phase 5 — 驗收

### Task 17: 六頁逐頁對規格

**Files:** 無（只讀）

- [ ] **Step 1: 全綠**

Run: `npm test && npm run build`
Expected: `typography.test.ts` 與 `design-system.test.ts` 全過；build 成功

- [ ] **Step 2: 起本地 server 讓 Kevin 看**

Run: `cd out && python3 -m http.server 4321`
把網址交給 Kevin：`/`、`/publications.html`、`/notes.html`、`/notes/2024/llm-selection-bias-part1.html`、`/experience.html`、任一不存在的網址。

**這一步不能由 Claude 代勞**——這個 session 的 Chrome 擴充功能沒有連上，無法判斷「看起來對不對」。

- [ ] **Step 3: 平行 subagent 逐頁對規格**

六個頁面各派一個 subagent 讀 `out/` 的產出與 `out/_next/static/css/*.css`，對照 spec 檢查：儀器欄的 `128px` 網格與 `md` 塌陷、h1 一律 `font-serif text-[28px]`、字級只在白名單內、`.row` 的五個 hover 宣告齊備、`aria-labelledby` 在 contact 區塊、DOM 裡標題在欄之前。六頁彼此不共用狀態，天生可平行。

- [ ] **Step 4: 對比度複驗**

用 `contrast.py` 對建置後 CSS 裡的實際值重跑一次，特別是 hero 的三個 gradient 停點與每個半透明表面合成後的顏色。

- [ ] **Step 5: 更新 todo 與 commit**

```bash
git add tasks/todo.md
git commit -m "docs: Redesign verified across all six page types"
```

---

## Self-Review

**Spec coverage** — 逐節對照：配色（Task 3）、光感與動效 token（Task 3）、hero 重驗（Task 3）、粉紅兩個違例（Task 3、16）、三組尺度（Task 8、11、12、16）、等寬字三個出口（Task 4）、儀器欄（Task 10–13）、h1 統一（Task 12）、文章頁收編（Task 12）、分隔機制維持（無 task，刻意）、頁尾（Task 9）、M1（Task 15）、按鈕上浮 vs 列右推（Task 15 的 `.row` 只動 padding；按鈕的 `translateY` 不動）、聚光（Task 14）、focus（Task 15）、`PublicationItem` onClick（Task 7）、減量動效（Task 15）、Navbar（Task 16）、Hero 網格（Task 16）、`.prose`（Task 4）、資料遷移（Task 6）、三個守門測試（Task 1）、六頁驗收（Task 17）。無缺口。

**Placeholder scan** — 無 TBD／TODO；每個改動步驟都附實際程式碼或實際字串值。

**Type consistency** — `RailGrid` 的 `rail` / `measure` / `children` 在 Task 10 定義，Task 11–13 的用法一致；`PageShell` 的 `title` / `rail` / `measure` / `beforeTitle` 在 Task 12 定義後即固定；`.row` 與 `.spot` 兩個 class 名在 Task 7、13、15 一致；`data-spotlight` 屬性名在 Task 7、13、14、15 一致。

**已知的一處待實作時決定**：Task 13 的 `PeriodLabel` 是把 `ExperienceItem` 現有的 `Present` 粉紅標記邏輯（`ExperienceItem.tsx:19,24-31`）抽出來的小元件，抽出時把那段程式碼原樣搬過去即可，行為不變。
