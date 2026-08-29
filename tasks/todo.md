# Todo — 2026-08-29 架構審查 #2 candidates 4–7

計畫全文：`~/.claude/plans/noble-bouncing-crystal.md`。每項一個 commit，順序 4 → 5 → 6 → 7。

## 4. 補完 profile seam
- [x] profile.ts 加 `researchSummary`，siteDescription 引用它
- [x] Hero / Navbar / Footer / 三個 page description 讀 siteName / fullName / researchSummary
- [x] ContactLinks 直接 import profile，刪五個 props；page.tsx 改 `<ContactLinks />`
- [x] build；`grep "Kevin Wei" src/**/*.tsx` 為零
- [x] commit

## 5. title 形狀單一擁有者
- [x] metadata.ts：`pageTitle()`、`title: { absolute }`、`article?` 單一共變欄位、`noindex?`
- [x] layout.tsx 移除 template；not-found 用 `noindex: true`；[slug] 移除 ogType/twitterCard
- [x] build；metadata 表與 319aabd 一致，404 無 canonical
- [x] commit

## 6. 路由清單一處 + robots.ts
- [ ] src/data/routes.ts；Navbar / sitemap / 各頁 pageMetadata 讀它
- [ ] src/app/robots.ts；刪 public/robots.txt
- [ ] build；sitemap.xml 逐字節相同；robots.txt 三欄位相同
- [ ] commit

## 7. theme 字串契約測試
- [ ] src/lib/theme.test.ts（4 個測試）；theme.ts 加一行註解
- [ ] npm test 33 綠；手動把 `.dark` 改壞確認測試會紅（不 commit）
- [ ] commit

## 收尾
- [ ] tasks/lessons.md（若有）
- [ ] Review 段落

## Review
_(完成後補)_
