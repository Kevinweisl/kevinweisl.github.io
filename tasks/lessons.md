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

## 2026-09-06 — 靠別人的背景服務送設計選項，要先確認它活多久

**Context**: 用 brainstorming skill 的 visual companion server 送配色/版面選項給 Kevin 看。連續兩次
「連不上」：第一次 `{"reason":"idle timeout"}`（閒置 30 分鐘自動關），第二次
`{"reason":"owner process exited"}` —— 我把 `start-server.sh` 包在 `$(...)` 命令替換裡跑，
子 shell 一結束，server 認定 owner 死了就跟著收工，起來 60 秒就沒了。

**Mistake**: 兩件事。(1) 沒讀那個 server 的生命週期規則就用它送**需要 Kevin 花時間看**的東西——
選項板正是他會盯著看十幾分鐘的東西，剛好落在 idle timeout 的射程內。(2) 第二次重啟時為了拿
JSON 裡的 `screen_dir` 而包了命令替換，順手改變了行程的父子關係，製造出第一次沒有的新失敗模式。

**Rule**: 要送給使用者「慢慢看」的東西，不要放在會自己收工的臨時服務上。這個 repo 已經有現成慣例：
`tasks/*.html` 實體檔案 + 一個 `nohup` 的靜態 server。實體檔案還有兩個附帶好處——決策依據留在
版控裡，之後翻得回來；而且它就是 2026-09-02 那條教訓要的「可並排比較的實體樣本」。

**順帶**: 重啟一個背景服務時，不要為了解析它的輸出而把它包進 `$(...)`。要拿輸出就讓它自己寫檔
（這支就有寫 `$STATE_DIR/server-info`），事後再讀。

## 2026-09-06 — 使用者選「A+C」時，要當場把合併後的規格覆述出來給他確認

**Context**: Kevin 從三個 hover 方向裡選了「A+C」。A 的 hover 是三件事（左側 2px 指示條由上往下
展開、整列右推 6px、徽章亮起），C 是三件事（上浮 3px、外框轉亮、跟游標的聚光）。我後續交出的
spec 裡，hover 只剩 C 的三件事加 A 的徽章——**A 的指示條與右推整個消失了**。

**Mistake**: 「A+C」是一個需要我做合併決策的答案，不是一個明確規格。我沒有把合併結果講出來確認，
直接往下走。更糟的是錯誤會傳染：接下來的配色板與版面板上，示範列的 hover 全都只有 C，所以 Kevin
在那兩輪核准時看到的都是同一個錯誤，等於用錯誤的樣本連續核准了兩次。

**Rule**: 使用者選了「X+Y」這種混搭時，下一句話就要把合併後的具體行為**逐項列出來**請他確認——
X 有哪幾件事、Y 有哪幾件事、合併後留下哪幾件、哪幾件因為互斥被丟掉、為什麼。混搭答案的資訊量
永遠小於它聽起來的樣子。

**順帶**: 兩個方向合併時要主動找**互斥項**。這次是 A 的「右推」與 C 的「上浮」——一個往右一個
往上，同時做會斜著跑；還有 A 的連續平列與 C 的獨立卡片是兩種容器模型，左側指示條在有間隙的
卡片上會斷成四段。互斥項就是必須請使用者裁決的地方，不能自己吞掉。

**再順帶**: 一旦發現某個決定是錯的，要往回檢查**這個錯誤污染了後面哪些已核准的東西**。這次
往回看才發現後兩張板子都帶著同一個錯誤。

## 2026-09-06 — 版面決策要先確認「容器結構」撐不撐得住，再確認它好不好看

**Context**: 提案時抓到 `ExperienceItem` 的 `[120px_1fr]` 網格會和新的區塊儀器欄變成兩根平行的欄，
提出四個選項，推薦並由 Kevin 選了 (d)「讓它們是同一根」—— 區塊編號坐頂端、各筆期間依序往下，
變成一根時間軸。實作時才發現：經歷列的高度不固定（有的有描述、有的有學期清單），
兩個獨立欄位只能靠猜高度對齊，第一次內容變動就歪；誠實的作法是單一 grid 橫跨兩欄，
但分類的外框卡片跨不過那個 grid。我當時已經在寫 `h-[calc(1.4em+0.75rem)]` 這種對齊 hack 了。

**Mistake**: 我用「視覺上會長怎樣」評估了那個選項，沒有用「DOM 要長怎樣才撐得住」評估。
兩根欄要對齊，等於要求兩個獨立的子樹在垂直方向上共用格線 —— 那在 CSS 裡是很強的約束
（單一 grid、或 subgrid），不是換個 class 就有的東西。提案時我沒問這個問題。

**Rule**: 提出「把兩個東西對齊成同一根」這類版面選項前，先問一句：**它們會不會在同一個
grid 容器裡？** 如果不會，那個對齊就要靠猜高度或負 margin，那就不是一個可以推薦的選項，
或者必須把「連容器一起重構」的成本寫進選項的描述裡。對齊是容器的性質，不是元素的性質。

**做對的地方**：發現在寫 hack 的當下就停了，把它做成能動的狀態（期間改成列內的 mono metadata）、
在 commit message 裡寫清楚為什麼沒做原案，並把那個決定放回 `tasks/todo.md` 讓 Kevin 決定要不要
付重構成本。沒有硬幹，也沒有默默降級當作沒事。

## 2026-09-06 — CSS grid 的 auto-placement 是 sparse 的，它不會往回填

**Context**: `RailGrid` 把每一列拆成 rail 格（`col-start-1`）與 content 格（`col-start-2`），
想靠 auto-placement 讓同一列的兩格自動落在同一個 grid row。DOM 順序是 content 先（為了
螢幕閱讀器先聽到標題），rail 後。

**Mistake**: 以為「指定了 column，row 交給 auto」就會填進第一個空格。實際上
`grid-auto-flow: row` 的預設是 **sparse**：游標只會往前走，不會回頭找前面那列的空位。
所以 content 放進 row 1 col 2 之後，接著的 rail 指定 col 1，游標已經過了 row 1，
於是它落到 row 2。畫面上期間會整排往下錯開一列。

**Rule**: 只要一個 grid 裡有「同一列但 DOM 順序與視覺順序不同」的格子，就**明確寫出
`grid-row`**，不要依賴 auto-placement。`grid-auto-flow: dense` 也能填回去，但它會重排
其他項目，對可及性與可預測性更糟。這次的作法是每格帶 `--rail-row` 變數，配一條
`@media (min-width: 768px) { .rail-cell { grid-row: var(--rail-row) } }` ——
窄螢幕單欄時規則自動失效，格子照 DOM 順序堆疊，正好是想要的行為。

**順帶**：驗證「兩格是否真的在同一列」不能靠看畫面（我看不到），要解析 build 產出把每格的
`--rail-row` 抓出來配對。這次就是這樣抓到 off-by-one 的：9 筆經歷、9 個期間、row 編號一一吻合。
