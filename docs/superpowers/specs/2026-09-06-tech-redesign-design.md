# 科技感改版 — 設計規格

**日期**：2026-09-06
**範圍**：全站六個頁面（`/`、`/publications`、`/notes`、`/notes/[year]/[slug]`、`/experience`、404）
**狀態**：待 Kevin 審核

---

## 這次要解決什麼

Kevin 的原始需求：「排版、配色、hover 特效，讓網站更有科技感」。

盤點後找到三個具體問題，這份規格逐一對應：

1. **配色的錨點是錯的。** 現行 token 推導自 ccClub logo，但那個檔案不在 repo 裡、網站任何一頁都看不到它。真正天天出現在 hero 卡片的是 Kevin 的 KW 字標，取色為天空藍 `#A0CCE7`（佔字標 72%）＋ 近黑 `#171E1D`（12%），而 `#A0CCE7` 在整份 token 表裡**零引用**。頁面上最顯眼的色塊，配色系統不認得它。
2. **整站只有一種節奏。** `py-[72px]` 用在每一頁的每一個區塊；4/6 的頁面是同一個 720px 殼；`13px` 承擔 23 種不同角色。所有東西同樣重要，等於沒有東西重要。
3. **互動幾乎不存在。** 現有 hover 只有換底色與換文字色。沒有任何一個狀態變化在傳達「這個東西可以動」。

---

## 已定案的方向

| 決策 | 選擇 | 依據 |
|---|---|---|
| 字體語彙 | **A 精密儀器** — 等寬字接管 metadata、區塊編號、髮絲線分隔 | Kevin 從三案並排選擇（`tasks/` 對照板） |
| 互動 | **C 發光** — 上浮、亮框、跟隨游標的聚光 | 同上 |
| 配色 | **印記藍 ＋ 深空** — accent `#A0CCE7`、ground `#06090B` | `tasks/palette-options-r2.html` 四案並排 |
| 版面 | **L1 節奏分級 ＋ L2 儀器欄**，另取 L3 的論文年份靠右 | `tasks/layout-options.html` 三案並排 |
| 等寬字型 | **JetBrains Mono**（400/500/600，拉丁子集） | 字腔最大，metadata 多落在 10–11px |
| 範圍 | 全站 | 配色是 token 層，改了本來就全站生效 |

**刻意不做**（避免部署後才發現少東西）：

- 不做 L3 的兩欄筆記卡片 — 會逼 `CardList` 的 1px 縫線分隔器整個重寫，收益比不上成本。
- 不做主題切換 — `.impeccable.md` 的 dark-only 約束不變。
- 不重畫 `public/og.png` — 它確實壞了（還是改版前的淺色版、bio 仍寫 "CS PhD Candidate"），但那是獨立議題，記在 `tasks/todo.md`。

---

## 一、配色

### 色相對齊（這是兩案能疊的原因）

深空 ground `#06090B` 的色相是 **204.0°**，KW 字標藍是 **202.8°**。兩案不是妥協地拼在一起，本來就在同一條色相線上。整組 token 落在 197–204°，只有低彩度的 body/muted 在 193°。

### Token 表

角色規則沿用 2026-09-05 的決定，不變：**accent ＝ 可點擊，且只有可點擊**；**brand 粉紅只有三個工作**（byline 中作者本人的名字、區塊標題的強調字、進行中標記 `Present`）；**單一 ground，區塊間用髮絲線分隔，不用交替底色**。

| Token | 值 | 對 ground | 對 card |
|---|---|---|---|
| `--bg-primary` | `#06090B` | — | — |
| `--bg-card` | `#101A1F` | 1.13 | — |
| `--bg-footer` | `#030506` | — | — |
| `--bg-nav` | `rgba(6, 9, 11, 0.9)` | — | — |
| `--text-primary` | `#E6F0F2` | 17.22 | 15.22 |
| `--text-body` | `#9AAEB4` | 8.64 | 7.64 |
| `--text-muted` | `#84999F` | 6.69 | 5.92 |
| `--text-nav` | `#8EA4AB` | 7.65 | 6.77 |
| `--accent` | `#A0CCE7` | 11.68 | 10.33 |
| `--accent-hover` | `#C6E3F5` | 14.94 | 13.20 |
| `--accent-light` | `#10222E` | — | — |
| `--text-on-primary` | `#06090B` | 對 accent 11.68 | — |
| `--brand` | `#EAA9C8` | 10.47 | 9.25 |
| `--border` | `#33474F` | 2.05 | 1.81 |
| `--border-hover` | `#57808F` | — | 4.11 |

全數通過 WCAG AA。最低是 muted 落在卡片上 5.92 —— 現況是 4.78，**小字反而變好讀**，這對 A 方向大量使用 10–11px 等寬 metadata 是必要條件。

### 新增的光感 token

```
--glow:           rgba(160, 204, 231, 0.17);   /* 聚光與 hover 陰影 */
--shadow-card-hover: 0 14px 34px var(--glow);
--grid-line:      rgba(160, 204, 231, 0.045);  /* hero 環境網格 */
```

`--grid-line` 的透明度刻意壓在 0.05 以下：網格是氛圍不是內容，看得出來就過頭了。

### 需要重驗的既有 token

`--hero-*` 整組（gradient 兩個停點、三種半透明表面、CTA 填色）都疊在新 ground 上，必須逐一重算對比，不能沿用舊值。實作時對**每個 gradient 停點**與**每個半透明表面合成後的實際色**各驗一次，比照 `globals.css` 現有註解的作法。

---

## 二、版面

### 三組尺度

**垂直間距**（取代唯一的 72px）：

| 級 | 值 | 用在 |
|---|---|---|
| 入口 | 112px | Hero 上緣 |
| 內容 | 96px | Publications、Notes、Experience、各子頁主體 |
| 收尾 | 72px | Contact、404 |

**量測寬度**：

| 值 | 用在 |
|---|---|
| 1100px | Navbar、Hero |
| 880px | 所有列表區塊 ＝ **128 欄 + 32 溝 + 720 內容** |
| 640px | Contact 收尾、搜尋列 |
| 68ch | 長文 `.prose` |

> 板子上的說明寫成「96 + 28 + 720 = 880」，算術是錯的（＝844）。規格以 **128 + 32 + 720 = 880** 為準；128 也貼近 `ExperienceItem` 既有的 120px 左欄，等於沿用既有值而非另立新值。

**字級**（9 級收成 6 級）：

| 值 | 角色 |
|---|---|
| 11px 等寬 | 儀器欄編號與分類、venue 徽章、年份、所有 `.label` |
| 13px | metadata：日期、作者、連結列、導覽、頁尾 |
| 16px | 內文、卡片標題、Hero 內文 |
| 20px | 筆記卡片標題 |
| 28px | 區塊與頁面標題 |
| clamp(34–48px) | Hero h1，全站唯一的 clamp |

現行 14px 的六處併入 13 或 16；404 的 32px 併入 28。

**`.label` 從 12px sans 變成 11px 等寬**，其餘屬性（600、uppercase、`0.08em` 字距、`--text-muted`）不變。它本來就靠大小寫與字距與內文區隔，換成等寬只是把那個區隔做得更徹底，也讓「標記」與「內文」的分野變成字族層級的事。這一併吃掉現行字階的 12px 級。

**兩個保留的例外**，兩者都只存在於一個檔案、且都是刻意的：

- 404 的 80px 裝飾引號（`not-found.tsx`）
- Hero 的 `clamp(34px, 5vw, 48px)`（`Hero.tsx`）

### 新增 `.mono` 工具

等寬字只能從這裡進來，元件不得自行宣告 font-family：

```css
.mono {
  font-family: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
  font-variant-numeric: tabular-nums;
}
```

`tabular-nums` 是重點而不是附帶：儀器欄的編號、年份、日期會垂直堆疊，等寬數字才對得齊。這也是選等寬字的實際理由之一，不只是氣氛。

### 儀器欄（L2）

左欄 128px，放**定位資訊**——這是它唯一的規則：

- **在序列中** → 編號。首頁四個區塊：`01 RESEARCH` / `02 WRITING` / `03 EXPERIENCE` / `04 CONTACT`
- **在時間中** → 日期。文章頁放發表日與閱讀時間
- **在分類中** → 類別。子頁放該頁的分類標記，不放編號（單一頁面沒有序列，硬給編號是假的）

`ExperienceItem` 現行的 `grid-cols-[120px_1fr]`（左欄放年份）就是這個模式，只是沒被升格成系統。這次把它變成全站骨架，`ExperienceItem` 從特例回歸為常例。

**窄螢幕**：`md` 以下欄位塌陷到內容上方，成為一行水平標記，不做水平捲動。

### h1 統一

四頁四種尺寸與對齊，收斂成一種：**serif、靠左、28px、`--text-primary`**。Hero 的 clamp 是唯一例外（它是封面不是標題）。`PageShell` 現行的置中＋粉紅色 h1 取消——粉紅的三個工作不包含「整個頁面標題」。

### 分隔機制統一

現行兩套並存：`CardList` 用 1px 間隙露出底色當縫線，`ExperienceItem` 用真的 `border-b`。C 方向的卡片要能上浮、要有自己的亮框，就必須各自有邊界。統一為：**卡片之間 8px 間隙，每張卡片自己的 1px 描邊**。`CardList` 的縫線機制移除。

### 頁尾

現行 `Footer` 完全滿版、沒有任何內層容器，不對齊 1100 也不對齊 880。改為對齊 1100px 欄。

---

## 三、互動

### 卡片 hover

```
transform:    translateY(-3px)
border-color: --border → --border-hover (#57808F)
box-shadow:   --shadow-card-hover
badge:        --text-muted → --accent（文字與描邊同時）
聚光:         radial-gradient(220px circle at var(--mx) var(--my), var(--glow), transparent 60%)
transition:   transform .25s cubic-bezier(.2,.8,.2,1), box-shadow/border-color .25s ease
```

### 聚光的實作：一個擁有者

游標追蹤需要 `mousemove`。逐張卡片掛監聽會把 `NoteCard` 這類 server component 全部拖成 client component，對靜態匯出的站是純粹的 JS 增量。

改為**單一擁有者**：新增 `src/components/Spotlight.tsx`（client），在 `app/layout.tsx` 掛載一次，於 `document` 上掛**一個** `mousemove`，用 `e.target.closest('[data-spotlight]')` 找到當下卡片並寫入 `--mx` / `--my`。任何元件只要加上 `data-spotlight` 屬性即可加入，不需要變成 client component。

這與 `1165232 refactor: One owner for the sub-page shell` 是同一個模式。

**不掛載的情況**（在 `Spotlight` 內判斷，直接 early return）：

- `prefers-reduced-motion: reduce`
- `(hover: none)` 觸控裝置

### 減量動效

```css
@media (prefers-reduced-motion: reduce) {
  /* 位移與聚光全關，只留顏色變化 —— 狀態仍然看得出來 */
}
```

hover 的視覺效果一律包在 `@media (hover: hover)` 內，觸控裝置不會卡在 hover 狀態。

### Hero 環境網格

44px 方格，`--grid-line`，以 `mask-image` 從上緣往下淡出。純 CSS，無動畫，不進入合成器熱路徑。

---

## 四、受影響的檔案

**新增**

- `src/components/Spotlight.tsx` — 聚光的唯一擁有者

**設計系統**

- `src/styles/globals.css` — token、`.label` 與新的 `.mono` 工具、`.prose`、hover 與減量動效規則
- `src/app/layout.tsx` — 載入 JetBrains Mono、掛載 `Spotlight`
- `.impeccable.md` — **必改**。更新品牌色來源（KW 字標，附面積佔比）、新的 token 表、儀器欄與三組尺度的規則

**版面骨架**

- `Section.tsx`、`PageShell.tsx` — 儀器欄網格、h1 統一
- `Hero.tsx` — 節奏、字級、環境網格
- `Navbar.tsx`、`Footer.tsx` — 對齊 1100 欄
- `CardList.tsx` — 縫線改間隙

**列表元件**

- `PublicationItem.tsx` — 等寬徽章、年份靠右、`data-spotlight`
- `NoteCard.tsx` — 字級、`data-spotlight`
- `ExperienceItem.tsx` / `ExperienceList.tsx` — 併入儀器欄系統
- `ContactLinks.tsx` — hover 與新的 accent 一致

**頁面**

- `app/page.tsx` — 四個區塊的編號與分類
- `app/notes/[year]/[slug]/page.tsx` — 儀器欄放日期與閱讀時間；目前它手工複製了 `PageShell` 的值，一併收斂
- `app/not-found.tsx` — 行內樣式改用 token
- `app/publications/page.tsx`、`notes/page.tsx`、`experience/page.tsx` — 隨 `PageShell` 變動

---

## 五、驗證

**既有測試必須維持綠燈**

- `src/lib/typography.test.ts` — Young Serif 只有 400 字重，任何 serif 元素都不得宣告字重。新的字級表不觸碰 serif 字重。
- `npm test`、`npm run build`

**新增測試**（延續 `typography.test.ts` 的風格：用來源掃描把設計規則變成可執行的約束）

1. **字級白名單** — 掃描 `src/`，`text-[Npx]` 與行內 `fontSize` 只允許 11/13/16/20/28。兩個例外在測試裡寫成**具名白名單**（`Hero.tsx` 的 clamp、`not-found.tsx` 的 80px），而不是放寬規則——例外要指名道姓，才不會變成後門。防止字階再度長回 9 級。
2. **顏色字面值** — 元件內不得出現顏色字面值（`#`、`rgba(`、`text-white`）。這正是 2026-09-03 那條教訓的自動化版本：當時同一個 `text-white` 疊在 accent 上的 bug 有四個實例，只修了一個。
3. **等寬字只從 `.mono` 工具進來** — 元件不得直接寫 `font-mono` 或 font-family。

**人工驗收**（依 2026-04-16 的教訓：設計系統重構後，每種頁型至少實走一遍）

- 六個頁面各走一次：`/`、`/publications`、`/notes`、`/notes/2024/llm-selection-bias-part1`、`/experience`、一個 404 網址
- 每頁確認：儀器欄對齊、hover 上浮與聚光、鍵盤 focus 環仍然看得見、窄螢幕欄位塌陷正確
- 開 `prefers-reduced-motion` 再走一次首頁與 `/publications`
- 對比度：hero 的每個 gradient 停點與每個半透明表面合成後各驗一次

**不採用的驗證方式**：不比對 `out/` 的位元組差異。依 2026-08-29 的兩條教訓，Next.js 的輸出跨 build 永不相同（chunk hash、RSC flight payload、React fragment key），這次是刻意的視覺改動，逐位元比對沒有意義。

---

## 六、實作順序

配色是地基，版面坐在上面，互動坐在版面上面。順序即依賴：

1. **Token 層** — `globals.css` 的 token、JetBrains Mono 載入、`.mono` 工具、`.impeccable.md` 同步更新。此時全站應該只是「換了顏色」，版面不動。
2. **尺度層** — 三組尺度（間距、寬度、字級）、h1 統一、分隔機制統一、Footer 對齊。
3. **骨架層** — 儀器欄進 `Section` 與 `PageShell`，各頁填入定位資訊。
4. **互動層** — `Spotlight`、hover、減量動效、Hero 環境網格。
5. **測試層** — 三個新測試 ＋ 六頁人工驗收。

每一層結束時網站都必須是可用的、可部署的。任何一層做完發現方向不對，可以停在那裡。
