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
- [x] src/data/routes.ts；Navbar / sitemap / 各頁 pageMetadata 讀它
- [x] src/app/robots.ts；刪 public/robots.txt
- [x] build；sitemap.xml 逐字節相同；robots.txt 三欄位相同
- [x] commit

## 7. theme 字串契約測試
- [x] src/lib/theme.test.ts（4 個測試）；theme.ts 加一行註解
- [x] npm test 33 綠；手動把 `.dark` 改壞確認測試會紅（不 commit）
- [x] commit

## 收尾
- [x] tasks/lessons.md
- [x] Review 段落

## Review

四個 commit，36 個測試綠、build 綠。每一頁的可見文字、meta、alt 與改動前逐字相同（用去 tag 後的文字比對，而非原始 HTML —— React 會在相鄰 JSX 運算式之間插 `<!-- -->`，RSC payload 也會把字串拆段）。

- **4** `Kevin Wei` / `Sheng-Lun (Kevin) Wei` 在 `src/**/*.tsx` 歸零；`researchSummary` 讓研究方向那句話只有一個家；`ContactLinks` 五個 props 刪除。
- **5** `pageTitle()` 是 title 形狀唯一擁有者；layout 不再有 template；`article?` 單一共變欄位；`noindex: true` → 404 不再有 canonical。
- **6** `routes.ts` 供 Navbar / sitemap / 各頁讀；`robots.ts` 取代手寫檔。sitemap.xml 逐字節相同，robots.txt 三欄位相同。
- **7** `theme.test.ts` 7 個測試；實際把 `.dark` 改壞確認會紅。誠實邊界：重複沒有消失，只是會叫。

**未做（有意）**：`public/kevin-homepage/index.html` 仍硬編 host（舊網址轉址頁，必然如此）；`experience.ts` 的 NTU 字面值（顯示資料）；review #2 的 1、2、3 與小掃除清單。尚未 push。
