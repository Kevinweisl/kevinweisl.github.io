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

## 2026-08-29 — Proving "rendered output unchanged" after a JSX refactor

**Context**: Replacing literals with `{constant}` in JSX and diffing `out/` before/after.

**Mistake**: Expected byte-identical HTML. React emits `<!-- -->` between adjacent JSX expressions (`{year} {siteName}`), and the RSC flight payload splits the same text into adjacent JSON strings. Two rounds of widening a regex normaliser before switching approach.

**Rule**: For "no visible change" claims, compare the *rendered text* — strip `<script>` blocks and tags, unescape, collapse whitespace — plus the meta/alt attribute sets. Don't chase markup-level equality across a JSX-shape change.

## 2026-08-29 — This shell is zsh: `PIPESTATUS` is empty

**Context**: A commit gate built on `${PIPESTATUS[0]}` after piped `npm test | grep`.

**Mistake**: zsh spells it `$pipestatus` (lowercase). The variables were empty, the gate failed closed — safe, but a wasted round trip after every check had actually passed.

**Rule**: In this environment use `${pipestatus[1]}` (zsh is 1-indexed) or avoid pipes on the command whose status matters (`npm test > log; status=$?; grep … log`).

## 2026-09-02 — 品牌色要從素材取，不能憑印象寫進 design context

**Context**: `.impeccable.md` 的 "Existing Brand Colors" 記 ccClub 是 Teal `#377A82` + Coral Red `#D24E42`。實際對 logo 取色：冰藍灰 `#CADFE3` 72.7%、Teal `#487981` 9.1%、粉紅 `#E288B3` 7.0%。

**Mistake**: 第二色根本不是 coral red 而是粉紅，而且佔 logo 七成面積的冰藍灰完全沒被記下來。錯的 design context 一路帶著跑，導致後來的配色只吸收了三色裡的一個。

**Rule**: 寫 design context 的品牌色時，一律對實際素材取色（`PIL` + `Counter` 數面積佔比），把**面積佔比一起記下來**——佔比決定一個顏色是主色還是點綴，只記 hex 會漏掉這個資訊。

## 2026-09-02 — 說好要給選項讓使用者挑，就不能直接落地一個方案

**Context**: 配色改版當初講好要讓 Kevin 挑風格，實際上 `a7f1285` → `00f69bc` 直接把藍紫換成單一藍綠 accent 就收工，中間沒有產出任何選項。三個月後被問「這件事有考慮進去嗎」才發現漏掉。

**Mistake**: 把「決定」和「執行」壓成一步。使用者要的是選擇權，我給的是結果。

**Rule**: 只要對話中出現「讓我挑」「我想看看選項」這類話，**產出物就是選項本身**，不是成品。做成可並排比較的實體樣本（同一份真實內容 × N 種 token），存進 `tasks/`，讓選擇有依據。做完才算交付，落地是下一個 task。

## 2026-09-02 — 給 Artifact 用的 HTML 仍要自帶 `<meta charset>`

**Context**: `tasks/palette-options.html` 寫成 Artifact 形狀（無 doctype/html/head/body），Artifact 的外殼會補 charset。但本地用 `python3 -m http.server` 預覽時整頁中文變亂碼。

**Mistake**: 以為 Artifact 會補就不用寫。python 的 http.server 不送 charset，瀏覽器只能猜。

**Rule**: 這種「本地也要能開、也要能發布成 Artifact」的雙用途檔案，第一行放 `<meta charset="utf-8">`。在 1024 bytes 內所以本地有效；Artifact 裡是重複宣告，瀏覽器直接忽略，無害。順帶：python http.server 會回 304，改完要用 `?v=N` 破快取，不然看到的還是舊的。

## 2026-09-03 — 修一個「字面值疊在 token 上」的對比度 bug 時，要把同一個字面值的所有實例一起修

**Context**: 2026-09-02 配色改版時發現 `ContactLinks` hover 的 `text-white` 疊在深色 accent 上只有 2.2:1，建了 `--text-on-primary` 修掉。隔天拆雙主題的盤點才發現 `PublicationItem` 的 venue 徽章、`ContactLinks` 的 mail icon、`not-found` 的 CTA 是**一模一樣的模式**（`text-white` on `var(--accent)`），當時沒修。

**Mistake**: 修了觸發我注意的那一個，沒有 grep 同一個字面值在同一種表面上的其他出現。四個實例修了一個。

**Rule**: 修任何「硬編顏色疊在 token 表面上」的 bug 時，修完立刻 `grep -rn "<那個字面值>" src/`，逐一判斷每個實例是不是同一個表面。搜尋的是**字面值**（`text-white`、`#fff`、`rgba(255`），不是元件名 —— 同一個 bug 不會只住在一個元件裡。

## 2026-09-05 · 總覽表與對照圖說的不一樣時，圖才是規格

做設計提案時同時產出了總覽表（文字）與八張前後對照板（視覺）。venue 徽章在三張板子上
都畫成 muted 描邊，總覽表卻寫「accent 描邊」。Kevin 是看圖做決定的，所以圖是他核准的東西；
表格的字是我從記憶重打的，打錯了。

**規則**：表格裡每一格描述的視覺屬性（顏色、尺寸、位置），寫完後回去對一次對應的板子。
不一致時改表格，不改圖 —— 除非圖違反了另一條已定的規則。這次是表格違反了 06「非可點擊不用
accent」，所以更確定是表格錯。

**順帶**：畫布上的裝飾性元素（區塊 eyebrow）在實作時發現與標題重複，plan 裡明寫「有意不做」
並給理由，讓 Kevin 在核准 plan 時看得到，而不是在部署後才發現少了東西。
