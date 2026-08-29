# Todo — 2026-08-29 架構審查 candidates 2–6

計畫全文：`~/.claude/plans/noble-bouncing-crystal.md`。每項一個 commit，順序 1→2→3→6→4→5。

## 1. 縮圖移除（已完成，只需 commit）
- [x] commit `content: Remove publication thumbnails`

## 2. profile.ts 成為真正的 seam
- [x] profile.ts 新增 publicationName / twitterHandle / jobTitle / affiliation(+Short) / phdYear / headline / siteDescription / researchInterests
- [x] Hero.tsx 讀常數（副標、bio 內的機構與年份、research tags）
- [x] layout.tsx 讀常數（siteDescription、og/twitter title、handle、JSON-LD jobTitle/affiliation/knowsAbout）
- [x] PublicationItem.tsx `startsWith(publicationName)`（保留 startsWith，因為有 `"Sheng-Lun Wei*"`）
- [x] build；grep Hero/layout 無 literal 職稱/機構/2026
- [x] commit

## 3. pageMetadata() 統一頁面身分
- [x] 新增 src/lib/metadata.ts
- [x] layout.tsx 只留 site-wide 欄位；template 改 `%s — Kevin Wei`
- [x] page.tsx / notes / publications / experience / not-found / [slug] 全部改用 pageMetadata
- [x] build；四頁 canonical 各自正確、twitter:title 與 `<title>` 一致
- [x] commit

## 6. noteHref / noteUrl
- [x] notes.ts 新增兩個 helper
- [x] 六個呼叫點替換（sitemap、[slug] ×4、NoteCard）
- [x] SKILL.md 刪除「更新 public/sitemap.xml」步驟
- [x] build；`grep -rn '/notes/\${' src/` 只剩 helper；sitemap.xml 不變
- [x] commit

## 4. notes module + vitest
- [x] 加 vitest devDep + test script；**重新產生並 commit package-lock.json**
- [x] vitest.config.ts（alias、TZ=Pacific/Kiritimati）
- [x] 抽出 src/lib/reading-time.ts + 測試
- [x] fixture tree src/lib/__fixtures__/
- [x] notes.ts 改寫：createNotesReader、parseNoteFile、驗證規則、byNewestFirst、closure memo
- [x] notes.test.ts（約 20 個）
- [x] npm test 綠；build；out/sitemap.xml 與 out/notes/** 不變
- [x] deploy.yml 在 npm ci 與 build 之間插入 npm test
- [x] SKILL.md 補 frontmatter 契約
- [x] commit

## 5. theme module
- [x] src/lib/theme.ts（常數、resolve/apply/toggle、themeInitScript）
- [x] globals.css 三條規則
- [x] ThemeToggle.tsx 靜態雙 icon/label
- [x] ThemeSync.tsx；刪除 ThemeProvider.tsx；layout.tsx 接線
- [x] build；grep 無 `aria-label="Switch to`、lucide-sun ×2、data-theme-only 4/4、script 含 remove(C) 與 catch
- [x] 瀏覽器驗證：關 JS + theme=dark → Sun；首次點擊正確；dev 無 hydration 警告
- [x] commit

## 收尾
- [x] tasks/lessons.md 補本次教訓
- [x] Review 段落

## Review

六個 commit，全部 build 綠、29 個測試綠；`out/` 在 notes/**、sitemap.xml、index.html、notes.html 上除 bundle hash / build id / fragment key 外逐字節不變。

**線上 bug 修掉三個**
- canonical：/notes、/publications、/experience、/404 從指向首頁改為各自正確；twitter:title 與 `<title>` 一致，分隔符統一 `—`
- theme toggle：靜態 HTML 現在同時帶兩組 icon/label，由 `.dark` 的 CSS 選；首次點擊從 DOM class 推導，不再算錯
- `PublicationItem` 作者比對改用 `publicationName`（保留 `startsWith`，因有 `"Sheng-Lun Wei*"`）

**計畫外的修正**
- 計畫寫 dark icon 用 `display: inline`（「UA 預設」），實測 Tailwind preflight 讓 svg 是 `block`，改 `block` 讓兩種主題的按鈕盒一致（34×34）
- `vitest.config.ts` → `.mts`，避免 Vite 以 CJS 載入的警告
- 一次 lint 錯誤（測試裡的未用解構變數），改 `toMatchObject`

**未做（有意）**
- 第 1 項（BibTeX 推導）與第 7 項（publications 資料越過 client seam）不在本次範圍
- `public/robots.txt` 仍硬編 host；Hero 內雇主連結仍是 JSX 文案
- 尚未 push
