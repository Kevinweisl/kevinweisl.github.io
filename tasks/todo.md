# Todo — 2026-08-29 架構審查 candidates 2–6

計畫全文：`~/.claude/plans/noble-bouncing-crystal.md`。每項一個 commit，順序 1→2→3→6→4→5。

## 1. 縮圖移除（已完成，只需 commit）
- [x] commit `content: Remove publication thumbnails`

## 2. profile.ts 成為真正的 seam
- [ ] profile.ts 新增 publicationName / twitterHandle / jobTitle / affiliation(+Short) / phdYear / headline / siteDescription / researchInterests
- [ ] Hero.tsx 讀常數（副標、bio 內的機構與年份、research tags）
- [ ] layout.tsx 讀常數（siteDescription、og/twitter title、handle、JSON-LD jobTitle/affiliation/knowsAbout）
- [ ] PublicationItem.tsx `startsWith(publicationName)`（保留 startsWith，因為有 `"Sheng-Lun Wei*"`）
- [ ] build；grep Hero/layout 無 literal 職稱/機構/2026
- [ ] commit

## 3. pageMetadata() 統一頁面身分
- [ ] 新增 src/lib/metadata.ts
- [ ] layout.tsx 只留 site-wide 欄位；template 改 `%s — Kevin Wei`
- [ ] page.tsx / notes / publications / experience / not-found / [slug] 全部改用 pageMetadata
- [ ] build；四頁 canonical 各自正確、twitter:title 與 `<title>` 一致
- [ ] commit

## 6. noteHref / noteUrl
- [ ] notes.ts 新增兩個 helper
- [ ] 六個呼叫點替換（sitemap、[slug] ×4、NoteCard）
- [ ] SKILL.md 刪除「更新 public/sitemap.xml」步驟
- [ ] build；`grep -rn '/notes/\${' src/` 只剩 helper；sitemap.xml 不變
- [ ] commit

## 4. notes module + vitest
- [ ] 加 vitest devDep + test script；**重新產生並 commit package-lock.json**
- [ ] vitest.config.ts（alias、TZ=Pacific/Kiritimati）
- [ ] 抽出 src/lib/reading-time.ts + 測試
- [ ] fixture tree src/lib/__fixtures__/
- [ ] notes.ts 改寫：createNotesReader、parseNoteFile、驗證規則、byNewestFirst、closure memo
- [ ] notes.test.ts（約 20 個）
- [ ] npm test 綠；build；out/sitemap.xml 與 out/notes/** 不變
- [ ] deploy.yml 在 npm ci 與 build 之間插入 npm test
- [ ] SKILL.md 補 frontmatter 契約
- [ ] commit

## 5. theme module
- [ ] src/lib/theme.ts（常數、resolve/apply/toggle、themeInitScript）
- [ ] globals.css 三條規則
- [ ] ThemeToggle.tsx 靜態雙 icon/label
- [ ] ThemeSync.tsx；刪除 ThemeProvider.tsx；layout.tsx 接線
- [ ] build；grep 無 `aria-label="Switch to`、lucide-sun ×2、data-theme-only 4/4、script 含 remove(C) 與 catch
- [ ] 瀏覽器驗證：關 JS + theme=dark → Sun；首次點擊正確；dev 無 hydration 警告
- [ ] commit

## 收尾
- [ ] tasks/lessons.md 補本次教訓
- [ ] Review 段落

## Review
_(完成後補)_
