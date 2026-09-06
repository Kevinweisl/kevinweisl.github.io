# 科技感改版 — 設計規格

**日期**：2026-09-06
**範圍**：全站六個頁面（`/`、`/publications`、`/notes`、`/notes/[year]/[slug]`、`/experience`、404）
**狀態**：已核准（33 項決定經逐題確認）
**選項板**：`tasks/palette-options-r2.html`、`tasks/layout-options.html`、`tasks/hover-merge.html`

---

## 這次要解決什麼

Kevin 的原始需求：「排版、配色、hover 特效，讓網站更有科技感」。盤點後找到三個具體問題：

1. **配色的錨點是錯的。** 現行 token 推導自 ccClub logo，但那個檔案不在 repo 裡、網站任何一頁都看不到它。真正天天出現在 hero 卡片的是 Kevin 的 KW 字標（`public/avatar.ico`），取色為天空藍 `#A0CCE7`（佔字標 72%）＋ 近黑 `#171E1D`（12%），而 `#A0CCE7` 在整份 token 表裡**零引用**。頁面上最顯眼的色塊，配色系統不認得它。
2. **整站只有一種節奏。** `py-[72px]` 用在每一頁的每一個區塊；4/6 的頁面是同一個 720px 殼；`13px` 承擔 23 種不同角色。所有東西同樣重要，等於沒有東西重要。
3. **互動幾乎不存在。** 現有 hover 只有換底色與換文字色，沒有任何狀態變化在傳達「這個東西可以動」。

---

## 已定案的方向

| 決策 | 選擇 |
|---|---|
| 字體語彙 | **A 精密儀器** — 等寬字接管 metadata、區塊編號、髮絲線分隔 |
| 互動 | **M1** — A 的左側指示條與右推 ＋ C 的聚光燈，不上浮 |
| 配色 | **印記藍 ＋ 深空** — accent `#A0CCE7`、ground `#06090B` |
| 版面 | **L1 節奏分級 ＋ L2 儀器欄**，另取 L3 的論文年份靠右 |
| 等寬字型 | **JetBrains Mono**（400/500/600，拉丁子集） |
| 範圍 | 全站六頁 |

### 刻意不做

- L3 的兩欄筆記卡片 — 會逼 `CardList` 重寫，收益比不上成本
- 主題切換 — dark-only 約束不變
- `CardList` 的分隔機制 — M1 定案後不需要動（見「分隔機制」）
- `public/og.png` 重畫 — 它確實壞了（改版前的淺色版、bio 仍寫 "CS PhD Candidate"），獨立議題，記在 `tasks/todo.md`
- `public/kevin-homepage/index.html` — `public/` 底下的舊獨立頁，不屬於這六頁

---

## 一、配色

### 色相對齊

深空 ground `#06090B` 的色相是 **204.0°**，KW 字標藍是 **202.8°**。兩案不是妥協地拼在一起，本來就在同一條色相線上。整組 token 落在 197–204°，只有低彩度的 body/muted 在 193°。

### Token 表

角色規則沿用 2026-09-05 的決定：**accent ＝ 可點擊，且只有可點擊**；**brand 粉紅只有三個工作**（byline 中作者本人的名字、區塊標題的強調字、進行中標記 `Present`）；**單一 ground，區塊間用髮絲線分隔**。

| Token | 值 | 對 ground | 對 card |
|---|---|---|---|
| `--bg-primary` | `#06090B` | — | — |
| `--bg-card` | `#101A1F` | 1.13 | — |
| `--bg-card-hover` | `#152530` | 1.27 | 1.13 |
| `--bg-footer` | `#030506` | — | — |
| `--bg-nav` | `rgba(6, 9, 11, 0.9)` | — | — |
| `--text-primary` | `#E6F0F2` | 17.22 | 15.22 |
| `--text-body` | `#9AAEB4` | 8.64 | 7.64 |
| `--text-muted` | `#84999F` | 6.69 | 5.92 |
| `--text-nav` | `#8EA4AB` | 7.65 | 6.77 |
| `--accent` | `#A0CCE7` | 11.68 | 10.33 |
| `--accent-hover` | `#C6E3F5` | 14.94 | 13.20 |
| `--text-on-primary` | `#06090B` | 對 accent 11.68 | — |
| `--brand` | `#EAA9C8` | 10.47 | 9.25 |
| `--border` | `#33474F` | 2.05 | 1.81 |

全數通過 WCAG AA。最低是 muted 落在卡片上 5.92 —— 現況是 4.78，**小字反而變好讀**，這對大量使用 10–11px 等寬 metadata 是必要條件。

`--bg-card-hover` 上的五個文字色各自重驗過：text-primary 13.52、text-body 6.79、text-muted 5.26、accent 9.17、brand 8.22。

### 光感與動效 token

```
--glow:        rgba(160, 204, 231, 0.17);   /* 聚光 */
--grid-line:   rgba(160, 204, 231, 0.045);  /* hero 環境網格 */

--ease-move:   cubic-bezier(.2, .8, .2, 1);
--dur-color:   .18s;   /* 顏色沒有慣性 */
--dur-move:    .24s;   /* 位移有慣性 */
```

只有兩個時間、兩條曲線。規則是「會動的東西用移動曲線，不動的用顏色曲線」——看程式碼就能判對錯。三級 fast/base/slow 是假精確：`.18` 與 `.22` 人眼分不出來。

`--grid-line` 的透明度刻意壓在 0.05 以下：網格是氛圍不是內容。

### 需要重新推導的既有值

- `--hero-*` 整組（gradient 兩個停點、三種半透明表面、CTA 填色）——對**每個 gradient 停點**與**每個半透明表面合成後的實際色**各驗一次
- `--accent-light`（現值 `#143038` 是對舊 ground 調的）。M1 之後它不再當列 hover 底色，但 `::selection` 與 Abstract/BibTeX chip 仍在用，不是死 token
- `.prose img` 的 `rgba(255,255,255,.05)` 白底襯框——圖多半是白底匯出，在更暗的 ground 上要重看

### 粉紅的兩個既有違例，一併修掉

1. `--hero-blob-2` 粉紅環境光暈 — 「裝飾光暈」不在粉紅的三個工作裡。移除，Hero 只留 teal 那顆光暈 ＋ 新的環境網格。
2. `--hero-label: var(--brand)`（`globals.css:69`，只用在 `Hero.tsx:101` 的 `Research Interests`）— 那是個 `.label`，「標籤」不在三個工作裡。**刪掉這個 token 與那行 inline 覆蓋**，讓 `.label` 自己的 `--text-muted` 生效，Hero 卡片標題自動與 Experience 的分類標題一致。

**後果**：粉紅完全退出首屏，第一次出現是往下捲的 `Selected **Publications**`。這是規則的代價，已確認接受。

---

## 二、排版

### 三組尺度

**垂直間距**（取代唯一的 72px）：

| 級 | 值 | 用在 |
|---|---|---|
| 入口 | 112px | Hero 上緣 |
| 內容 | 96px | Publications、Notes、Experience、各子頁主體 |
| 收尾 | 72px | Contact、404 |

**量測寬度**（四個值）：

| 值 | 用在 |
|---|---|
| 1100px | Navbar、Hero |
| 880px | 所有列表區塊 ＝ **128 欄 + 32 溝 + 720 內容** |
| 640px | Contact 收尾、搜尋列 |
| 68ch | 長文 `.prose` **與 Hero 內文** |

Hero 內文從 `max-w-[60ch]` 改為 68ch：它和文章內文是同一種東西——會逐字讀完的長段落，不是掃描的列表。同一種東西同一個量測。Hero 左欄實際可用寬約 772px，68ch（約 612px）放得下。

**字級**（9 級收成 6 級）：

| 值 | 角色 |
|---|---|
| 11px 等寬 | 儀器欄編號與分類、venue 徽章、年份、所有 `.label` |
| 13px | metadata：日期、作者、連結列、導覽、頁尾 |
| 16px | 內文、卡片標題、Hero 內文 |
| 20px | 筆記卡片標題 |
| 28px | 區塊與頁面標題（含 404，原 32px 併入） |
| clamp(34–48px) | Hero h1 |

現行 14px 的六處併入 13 或 16。

**兩個具名例外**，各自只存在於一個檔案：404 的 80px 裝飾引號（`not-found.tsx`）、Hero 的 clamp（`Hero.tsx`）。測試裡寫成具名白名單而非放寬規則——例外要指名道姓，才不會變成後門。

### 等寬字的三個出口

字型堆疊抽成單一變數，三種用法各取所需：

```css
--font-mono: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace;

.label { font-family: var(--font-mono); font-size: 11px; /* 其餘不變 */ }
.mono  { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
.prose code, .prose pre { font-family: var(--font-mono); }  /* 不要 tabular-nums */
```

`.label` 是「標記」這個角色的唯一擁有者，等寬是這個角色的屬性，不外包。`.mono` 是給「需要對齊的數字」——儀器欄編號、年份、日期——`tabular-nums` 才是它的重點。程式碼要等寬但不要表格數字。

`.label` 全站三處使用，**零 CJK**（Hero 的 "Research Interests"、Experience 的 Education/Teaching/Work、venue 徽章），改等寬不會觸發 fallback。注意 `.label` 是 unlayered、會蓋過同元素上的 Tailwind utility。

### 儀器欄

`128 + 32 + 720 = 880`，由單一元件 **`RailGrid`** 擁有——網格數值只存在於一個檔案。`Section`（首頁）與 `PageShell`（子頁與文章頁）都用它。

**唯一規則：欄位放「它旁邊那個單位的定位資訊」。**

| 旁邊是 | 欄裡放 |
|---|---|
| 首頁區塊標題 | 編號 ＋ 分類，`01 RESEARCH` / `02 WRITING` / `03 EXPERIENCE` / `04 CONTACT` |
| 子頁標題 | 數量，`24 PAPERS` / `12 ROLES` / `2 NOTES` |
| 文章標題 | 發表日 ＋ 閱讀時間（從標題區移出來） |
| 一筆經歷 | 該筆的期間 |
| Hero、404 | **不給欄** |

Hero 是封面不是章節，沒有「在序列中的位置」；404 的定義就是這個位置不存在，給它定位標記自相矛盾。編號從 Hero 下面第一個內容區塊算 `01`。

**編號即時計算**：首頁的 Notes 區塊是條件渲染（`recentNotes.length > 0`），編號依**實際渲染出的區塊**計算，不綁定身分。跳號會看起來像 bug 而不像刻意。實作上把首頁區塊改成陣列再 map。

**Experience 的兩根欄合併成一根**：`ExperienceItem` 本來就是 `grid-cols-[120px_1fr]`，左欄放期間。不要讓它與區塊儀器欄並排成兩根——讓它們是**同一根**：`03 EXPERIENCE` 坐頂端，各筆期間依序往下，那一欄成為真正的時間軸。`ExperienceItem` 自己的 `sm` 內部斷點因此消失，全站只剩一個欄斷點。

**期間進欄、論文年份不進欄**：Experience 是用時間掃描的（它就是時間軸），Publications 在首頁是編輯排序、在列表頁以會議與標題掃描，年份是次要資訊。

**分類標題不進欄**：`ExperienceList` 的 Education / Teaching / Work 是**組與組之間的分隔**，不是某個單位的定位資訊，維持滿寬橫跨，欄在旁邊留白。搬進去會讓欄同時裝三種階層，從刻度變成樹狀圖。

**樣式**：編號 11px 等寬 600，分類 10px 等寬加寬字距，兩者都 `--text-muted`。**不用 accent** —— accent 的意思是可點擊，儀器欄不可點擊。

**窄螢幕**：`md`(768) 以下塌到內容上方，兩行併成一行 `01 · RESEARCH`。與 Hero 雙欄同一個斷點。

**DOM 順序**：標題在前、欄用 CSS grid 明確定位到左邊。閱讀順序是「標題 → 補充定位」，符合視覺讀者的解析順序（眼睛先抓 28px serif 標題，不是 10px 灰色編號）。Contact 區塊靠 `aria-labelledby` 指向欄裡的文字取得可及名稱——`<section>` 沒有名稱就不構成 landmark，這是欄從裝飾升格為標題應付的代價。

### h1 統一

四頁四種尺寸與對齊，收斂成一種：**serif、靠左、28px、`--text-primary`**。Hero 的 clamp 是唯一例外（它是封面不是標題）。`PageShell` 現行的置中＋粉紅 h1 取消——粉紅的三個工作不含「頁面標題」。

### 文章頁收進 `PageShell`

`1165232` 那次把三個子頁收進 `PageShell` 但刻意跳過文章頁。現在 `py-[72px] px-6` 與 `font-serif text-[28px]` 是手工複製的，而這次改版**本來就要動到每一個手工複製的值**（padding 改 96、h1 統一、加儀器欄）——維持分離等於同一批值改兩次。而 h1 統一之後，當初讓它們分家的理由（置中粉紅 vs 靠左白字）消失了。

`PageShell` 加一個 `measure` prop（`720` | `68ch`）。順帶清掉文章頁 `:49` 多餘的 inline `background: var(--bg-primary)`——`body` 已經有了。

### 分隔機制：維持現狀

`CardList` 用 1px 間隙露出底色當縫線，`ExperienceItem` 用 `border-b`，兩者渲染結果一致。**不動。** 原本要改成「8px 間隙 + 各卡片描邊」，理由是卡片要能上浮、要有自己的亮框；M1 不上浮，理由消失。而左側指示條反而**需要**列與列連續——在有間隙的獨立卡片上，那條線會斷成四段浮在空中。

### 頁尾

現行 `Footer` 完全滿版、沒有內層容器。改為對齊 1100px 欄。

---

## 三、互動

### 列 hover（M1）

```
左側指示條:  ::before，2px 寬、滿高、--accent
             transform: scaleY(0) → scaleY(1)，transform-origin: top
             var(--dur-move) var(--ease-move)        ← 由上往下展開，不是淡入
整列右推:    padding-left 18px → 24px                ← 同一條曲線
底色:        --bg-card → --bg-card-hover             var(--dur-color)
徽章:        --text-muted → --accent（文字與描邊）     var(--dur-color)
聚光:        radial-gradient(220px circle at var(--mx) var(--my), var(--glow), transparent 60%)
             opacity 0 → 1                           var(--dur-move)
```

**沒有上浮、沒有外框轉亮。** 那是獨立卡片模型的行為，與連續平列不相容——右推與上浮同時做，列會斜著跑。

右推動 `padding-left` 而非 `transform: translateX`：指示條是列的 `::before`，必須留在原位，動的是內容不是整個盒子。代價是 `padding` 不在合成器路徑上，但只有單一列在動、距離 6px。若實測掉幀，改用內層 wrapper 的 `translateX`，指示條留外層。

### 誰可以動：按鈕上浮、列右推

一條規則，互不越界：

- **按鈕**（Hero 的兩個 CTA、`ContactLinks`）是**你要按下去的物件**，上浮是按下前的預期回饋 → `translateY`
- **列**（`PublicationItem`、`NoteCard`、`ExperienceItem`）是**你正指著的項目**，右推是游標把它往指示條方向推了一下 → `padding-left`

好檢查：看到 `translateY` 就該是按鈕，看到 `padding-left` 就該是列。

### 聚光：一個擁有者

游標追蹤需要 `mousemove`。逐張卡片掛監聽會把 `NoteCard` 這類 server component 全部拖成 client component，對靜態匯出的站是純粹的 JS 增量。

改為**單一擁有者**：新增 `src/components/Spotlight.tsx`（client），在 `app/layout.tsx` 掛載一次，於 `document` 上掛**一個** `mousemove`，用 `e.target.closest('[data-spotlight]')` 找到當下的列並寫入 `--mx` / `--my`。任何元件加上 `data-spotlight` 屬性即可加入，不需要變成 client component。與 `1165232 One owner for the sub-page shell` 同一個模式。

**只給列表列**（`PublicationItem` / `NoteCard` / `ExperienceItem`）。`ContactLinks` 的 hover 是整塊填滿 accent 實色，聚光放在實色下面看不見，等於白做。

**不掛載的情況**（在 `Spotlight` 內 early return）：`prefers-reduced-motion: reduce`、`(hover: none)` 觸控裝置。

### 鍵盤 focus

`:focus-visible` 拿到**指示條與底色**（M1 的非動態那一半），全域外框保留。滑鼠與鍵盤使用者看到同一個「這一列被選中」的語彙。不加右推（裝飾）與聚光（需要游標座標，鍵盤沒有）。

**不用指示條取代外框**——外框是可靠且慣例的指示，不拿設計去換掉它。

搜尋框的自訂 `focus:ring-2` 拿掉，讓全域 `:focus-visible` 生效。除了統一之外還修掉實質問題：Tailwind 的 `focus:` **滑鼠點擊也會觸發**，`:focus-visible` 不會，所以現在用滑鼠點搜尋框會跳出一圈本來只該給鍵盤使用者看的光環。

### `PublicationItem` 拿掉整列 onClick

`PublicationItem.tsx:38` 是 `div` 掛 `onClick` 展開摘要，沒有 role、沒有 `aria-expanded`、Tab 不到。這是既有缺陷，而新的 hover **會讓它惡化**——指示條加聚光讓那一列看起來比今天更像可以點，對鍵盤使用者卻依然按不到。而連結列裡本來就有一個 `Abstract` 按鈕做同一件事。

**拿掉整列 onClick，保留既有的 Abstract / BibTeX 按鈕。** 修掉無障礙缺陷與重複操作面，而且程式碼變少。

連帶：論文列不是連結 → `cursor: default`；筆記列是 `<Link>` → `pointer`。M1 的 hover 在兩者都出現，語意是「你正指著這一列」，真正表達可點擊的是遊標形狀與 accent 連結色。

### 減量動效

```css
@media (prefers-reduced-motion: reduce) {
  /* 右推與聚光全關；指示條直接顯示（不做 scaleY 展開）；
     底色與徽章的顏色變化保留。四件事降成兩件，
     但「這一列被選中」仍然明確。 */
}
```

hover 的視覺效果一律包在 `@media (hover: hover)` 內，觸控裝置不會卡在 hover 狀態。

### Navbar 捲動狀態

底部髮絲線改成**捲動後才出現**——在頂端時它分隔的是空氣。用 CSS `animation-timeline: scroll()` 實作，**零 JS**；不支援的瀏覽器退化成「線一直都在」，也就是今天的行為，無害。不加第二個全域監聽器（聚光已經用掉一個，第二個要有更好的理由）。

### Hero 環境網格

44px 方格，`--grid-line`，以 `mask-image` 從上緣往下淡出。純 CSS、無動畫、不進合成器熱路徑。保留 teal 光暈，移除粉紅光暈。

### `.prose`

`code` / `pre` 改用 `--font-mono`（不含 `tabular-nums`）。頁面已經載了自己挑的等寬字，程式碼區塊卻用瀏覽器預設，說不過去。其餘只換 token 並重驗對比。

---

## 四、資料遷移

十筆 `venueAcronym` 拿掉年份（`Findings of ACL 2026` → `Findings of ACL`），右側年份改從既有的 `year` 欄位渲染。年份目前在資料模型裡重複兩次，`year` 平常不渲染（只在沒有 acronym 時當 fallback）。

**搜尋不會迴歸**：過濾字串是 `` `${title} ${authors} ${venue} ${venueAcronym || ''} ${year}` ``（`PublicationList.tsx:22`），`venueAcronym` 與 `year` 本來就相鄰，遷移後仍組成 `Findings of ACL 2026`，輸入 `"ACL 2026"` 照樣命中。而且今天那串其實是 `Findings of ACL 2026 2026`，遷移順便修掉搜尋索引中重複的年份。

`venueAcronym` 是選填，fallback `` `${venue} ${year}` `` 是活的程式碼，遷移後要確認它仍正確（它本來就把 year 接在後面，會變得更一致）。

年份靠右出現在**首頁與 `/publications` 兩處**，同一個元件同一個行為。

---

## 五、實作順序（六層）

每層結束時網站都必須是可用、可部署的。任何一層做完發現方向不對，可以停在那裡。

| 層 | 內容 |
|---|---|
| **0 守門測試** | 三個測試先寫，一開始是紅的。它們的失敗清單就是精確的待辦 |
| **1 Token** | `globals.css` token、JetBrains Mono 載入、`--font-mono`、`.label` / `.mono`、`.impeccable.md` 同步。此時全站只是「換了顏色」 |
| **2 尺度與內容整理** | 三組尺度、h1 統一、Footer 對齊、`venueAcronym` 遷移、拿掉整列 onClick、拿掉搜尋框自訂 focus。必須早於第 4 層，否則 hover 會加在等下要改的元件上 |
| **3 骨架** | `RailGrid`、`PageShell` 的 `measure` prop、文章頁收編、各頁填入定位資訊、Experience 兩欄合併 |
| **4 互動** | `Spotlight.tsx`、M1 hover、focus、減量動效、Navbar 捲動線、Hero 環境網格 |
| **5 驗收** | 六頁逐頁對規格檢查 |

分支 `design/tech-redesign`，一層一 commit。**不 push、不開 PR**，等 Kevin 指示。

---

## 六、驗證

### 既有測試必須維持綠燈

- `src/lib/typography.test.ts` — Young Serif 只有 400 字重，serif 元素不得宣告字重
- `npm test`（現況 32 passed）、`npm run build`

### 三個新的守門測試（第 0 層先寫）

延續 `typography.test.ts` 的風格：用來源掃描把設計規則變成可執行的約束。

1. **字級白名單** — `text-[Npx]` 與行內 `fontSize` 只允許 11/13/16/20/28，兩個例外寫成具名白名單（`Hero.tsx` 的 clamp、`not-found.tsx` 的 80px）
2. **顏色字面值** — 元件內不得出現 `#`、`rgba(`、`text-white` 等顏色字面值。這是 2026-09-03 那條教訓的自動化版本：當時同一個 `text-white` 疊在 accent 上的 bug 有四個實例，只修了一個
3. **等寬字只從 `.label` / `.mono` / `--font-mono` 進來** — 元件不得直接寫 `font-mono` 或 font-family

### 人工驗收

依 2026-04-16 的教訓（設計系統重構後每種頁型至少實走一遍），六頁逐頁檢查：`/`、`/publications`、`/notes`、`/notes/2024/llm-selection-bias-part1`、`/experience`、404。

每頁確認：儀器欄對齊與塌陷、M1 hover 四件事、鍵盤 focus、DOM 閱讀順序、對比度。另外開 `prefers-reduced-motion` 再走一次首頁與 `/publications`。

**分工**：Claude 這個 session 的 Chrome 擴充功能沒有連上，無法判斷「看起來對不對」。所以每層做完由 Claude 起本地 build，**Kevin 用瀏覽器看**；Claude 負責機械性驗證（build 產出解析、對比度計算、grep 稽核），並以平行 subagent 逐頁對規格清單回報——六個頁面彼此不共用狀態，天生可平行。

### 不採用的驗證方式

不比對 `out/` 的位元組差異。依 2026-08-29 的兩條教訓，Next.js 輸出跨 build 永不相同（chunk hash、RSC flight payload、React fragment key），而這次是刻意的視覺改動，逐位元比對沒有意義。
