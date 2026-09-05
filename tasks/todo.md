# Todo — 2026-09-05 統一三個子頁面的殼

Kevin：「Experience 頁面的風格跟 Notes 和 Publication 頁面不同，可以統一嗎」

## 為什麼會漂
Notes 與 Publications 各自手寫 `<section>` + 置中 h1（粉紅）；Experience 借用首頁的 `Section`
（h2、靠左、白字、有 View all 槽）。同一個殼有兩份手寫加一份借用，沒有 owner。順帶：Experience
頁原本沒有 h1。

## 改動
- [x] 新增 `components/PageShell.tsx`：section py-72 px-6 → 720px 欄 → 置中 h1（brand-text）→ children
- [x] `notes/page.tsx`、`publications/page.tsx`、`experience/page.tsx` 改用 PageShell，
      標題取 `routes.X.label`（與 metadata title 同源）
- [x] Publications 的標題下間距 mb-3 → mb-8（三頁一致；搜尋框是內容的控制項，不是標題的一部分）
- [x] 刪掉 `id="full-experience"`（無人引用）

## 驗證
- [x] `npm test`、`npm run build` 綠
- [x] `grep -rn "text-\[28px\] text-center" src` 只剩 PageShell
- [x] 三頁的 build 輸出：`<h1 class="font-serif text-[28px] text-center mb-8 brand-text">` 各一
- [x] Section 只剩首頁在用
- [x] commit + push + gh run watch
