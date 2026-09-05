# Todo — 2026-09-05 套用八個改版方向

計畫全文：`~/.claude/plans/sprightly-riding-flask.md`。提案原稿：`tasks/design-review/`，
畫布 https://claude.ai/code/artifact/162bdf86-ee2e-4220-b6c5-fbde204ca9e4。

## 共用基礎（globals.css）
- [x] 07 `--border` / `--border-card` → `#2b4d57`
- [x] 08 新增 `--brand: #eaa9c8`；`--hero-label` / `--hero-link` 改引用
- [x] 02 刪 `--bg-secondary`；新增 `main > section + section { border-top }`
- [x] 01 新增 `.label` utility；08 新增 `.brand-text`
- [x] 03 刪 `.prose h1–h4` 的 `font-weight: 600`
- [x] 06 `.prose blockquote` border-left → `var(--border)`

## 逐元件
- [x] `Section.tsx`：刪 alt、720px、`gradientWord`→`emphasis`、brand-text、刪 font-semibold
- [x] `app/page.tsx`：刪 alt、prop 改名、Contact 句子 → text-primary
- [x] `app/experience/page.tsx`：刪 alt
- [x] `app/publications/page.tsx`、`app/notes/page.tsx`：720px、brand-text、刪 font-semibold
- [x] `app/notes/[year]/[slug]/page.tsx`：h1 刪 font-bold
- [x] `ExperienceList.tsx`：分類升成 `.label` 列 + hairline，刪 100px 欄
- [x] `ExperienceItem.tsx`：刪 font-semibold、機構名 14px body、Present 粉紅
- [x] `PublicationItem.tsx`：刪 font-semibold、venue 描邊移到標題上方、作者名 brand-text
- [x] `NoteCard.tsx`：刪 font-semibold、摘要 14px body
- [x] `Hero.tsx`：刪 font-bold、Research Interests → `.label`
- [x] `Navbar.tsx`、`ContactLinks.tsx`：刪 serif 上的 font-semibold
- [x] `not-found.tsx`：code chip 改 card/border/primary

## 契約測試
- [x] 新增 `src/lib/typography.test.ts`（serif 不得帶字重；synthesis 鎖仍在）

## 文件
- [x] `.impeccable.md`
- [x] 本檔 Review 段

## 驗證
- [x] `npm test` 綠；`npm run build` 綠
- [x] 契約 grep 歸零（bg-secondary / gradientWord / alt / grid-cols-[100px / 舊徽章 class）
- [x] 對比腳本
- [x] build 輸出純文字檢查
- [ ] 瀏覽器目視 — Chrome 擴充功能未連線，改以 build 輸出與 CSS bundle 驗證
- [x] commit + push + `gh run watch`

## Review

**共用基礎**：兩個新東西撐起八條 —— `.label` utility（12/600/大寫/.08em/muted）與 `--brand`
（#eaa9c8）。01、04、05 收斂到 `.label`；08 收斂到 `--brand`；06 的規則「非可點擊不用 accent」
是靠這兩個東西才能執行，否則拿掉 accent 之後那些元素會沒有身份。

**刪掉的**：`--bg-secondary`、Section 的 `alt` prop 與 inline background、`gradientWord`（改名
`emphasis`）、Experience 外層 100px 欄、venue 徽章的實心底、12 個 serif 元素上的無效字重宣告、
`.prose h1–h4` 的 `font-weight: 600`。

**視覺上真的變了的**（03 是純刪除，畫面不變）：
- 區塊之間多了一條 hairline，交替底色沒了；內容欄 900 → 720
- 邊框 #1f383f → #2b4d57，卡片、CardList 分隔線、hairline 一起變清楚
- Experience 分類從左側小字變成卡片上方的標籤列，機構名不再是 teal
- venue 徽章從連結列的實心色塊變成標題上方的描邊小標
- 「Publications」「Notes」強調字、作者列的 Sheng-Lun Wei、期間欄的 Present 變粉紅
- Contact 區的句子從 teal 變白；NoteCard 摘要 13px muted → 14px body

**契約測試**：`typography.test.ts` 三條 —— synthesis 鎖仍在、tsx 裡 font-serif 不帶字重、
CSS 裡選 serif 的規則不設 font-weight。29 → 32。

**與畫布不同的兩處**（已寫在 plan 裡）：不加區塊 eyebrow（與標題重複）；venue 描邊用 muted
不用 accent（總覽表寫錯，06 的規則不允許）。

**沒做到的**：瀏覽器目視。Chrome 擴充功能兩次都連不上。改以 build 輸出純文字（標籤、徽章位置、
brand-text 位置、Present）與 CSS bundle（三條新規則）驗證。
