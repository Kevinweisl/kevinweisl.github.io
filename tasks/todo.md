# Todo — 2026-09-06 科技感改版

Kevin：「Is there any way to make the design better? 包含排版、配色、或是一些網頁的小特效(when mouse hover) 讓網站更有科技感一些」

規格：`docs/superpowers/specs/2026-09-06-tech-redesign-design.md`
選項板（Kevin 據以決定的東西）：`tasks/palette-options-r2.html`、`tasks/layout-options.html`、`tasks/hover-merge.html`

## 已定案
- 字體語彙 **A 精密儀器**、互動 **M1**（A 的左側指示條與右推 + C 的聚光燈，不上浮）
- 配色 **印記藍 + 深空**：accent `#A0CCE7`（KW 字標取色）、ground `#06090B`
- 版面 **L1 節奏分級 + L2 儀器欄**，另取 L3 的論文年份靠右
- 等寬字 **JetBrains Mono**
- 範圍：全站六頁

計畫：`docs/superpowers/plans/2026-09-06-tech-redesign.md`

## 實作（六層，每層結束時網站都可部署）
- [x] 0 守門測試 — 字級白名單、顏色字面值、等寬字出口、`.label` 不得含 CJK
- [x] 1 Token 層 — 配色、JetBrains Mono、`--font-mono`、`.label` / `.mono` / `code,pre`
- [x] 2 尺度層 — 九級字階收成六級、`venueAcronym` 遷移、拿掉整列 onClick、Footer 對齊、搜尋框 focus
- [x] 3 骨架層 — `RailGrid` / `Rail`、即時編號、子頁計數、文章頁收進 `PageShell`
- [x] 4 互動層 — `Spotlight.tsx`、M1、focus、減量動效、Navbar 捲動線、Hero 網格
- [x] 5 驗收 — 六頁稽核完成（51/51 通過），待 Kevin 用瀏覽器看

## 尚未定案（實作中浮現）
- [x] **Experience 的時間軸**：Kevin 批准重構後完成。解法是**停止巢狀**——`RailGrid` 改成
      接收 rows，所有格子放進同一條 grid，期間與經歷列佔同一個 grid row，由瀏覽器對齊，
      不計算任何高度。分類外框改成每列自帶邊（首列圓上緣、末列圓下緣、每列都有側邊）。
- [x] `.impeccable.md` 已同步：錨點改成 KW 字標、粉紅四個工作、三組尺度、儀器欄規則、動效規則

## 已知的既有限制（非本次造成）
- 零篇筆記時 `npm run build` 會失敗：`generateStaticParams()` 回空陣列，`output: export` 不支援。
  本次驗證編號改用 `getRecentNotes(0)` 繞過。

## 驗證
- [x] `npm test`（36 passed）、`npm run build` 綠
- [x] 四個守門測試全綠
- [x] hero 每個 gradient 停點與每個半透明表面合成後各驗一次對比 —— **用 build 產出的實際值重算**，
      最低 5.16（`--hero-muted` 疊在 hover 狀態的次要 CTA 上），無任何項目低於 AA
- [x] 編號在區塊缺席時不跳號（實測 `getRecentNotes(0)`：01 Research / 02 Career / 03 Contact）
- [x] 六頁稽核 subagent 回報：51 個檢查點全過
- [x] DOM 閱讀順序修正：稽核抓到 rail 排在整篇文章之後（螢幕閱讀器要聽完全文才聽到日期），
      `RailGrid` 改成標題／rail／內容三個 slot，逐區塊實測 `h2 < rail < 內容`
- [ ] Kevin 用瀏覽器實走六頁（Claude 這個 session 的 Chrome 擴充沒連上，判斷不了「看起來對不對」）
- [ ] 開 `prefers-reduced-motion` 再走一次首頁與 `/publications`

---

# 另案：og.png 是壞的

改版過程中發現，與本次改版無關，但別忘了。

`public/og.png` 還是**改版前的淺色版**，而且 bio 仍寫著 "CS PhD Candidate"（Kevin 現在是
Adjunct Instructor，`src/data/profile.ts` 早就更新了）。分享到 Slack / Twitter / LinkedIn 的
預覽圖跟實際網站完全不像，內容也是錯的。

- [ ] 依新配色重新產生 `public/og.png`，文案取自 `src/data/profile.ts` 而不是手寫
- [ ] 找出當初產生它的方法；若無，考慮做成可重跑的腳本，避免下次改版又漂掉

---

# Publications 頁：年份時間軸（B 案，2026-09-12）

Kevin 從 `tasks/publications-options.html` 三案中選 B。

- [x] `src/lib/publications.ts`：`searchPublications`、`groupByYear`，先寫測試（紅）再實作（綠），5 個測試
- [x] `RailPeriod` 從 `ExperienceItem` 搬進 `Rail.tsx`——rail 裡放的東西由 `Rail.tsx` 擁有；Experience 與 Publications 共用
- [x] `PublicationTimeline`（client）取代 `PublicationSearch`：搜尋狀態在這裡，所以由它渲染 `PageShell` + `bodyRows`，
      一條 grid、不巢狀；每年一列，rail 放年份、內容放該年的 `CardList`
- [x] `PublicationItem` 加 `showYear`（預設 true）：`/publications` 關掉、首頁 Selected（依排名、年份交錯）保留
- [x] 組與組之間 24px：rail 與內容兩格都帶 `mt-6`（否則年份與框錯位）；窄螢幕堆疊時只有 rail 帶（內容用 `md:mt-6`）
- [x] 驗證（解析 build 產出）：rail 年份序 2026/2025/2024/2021/2016/2014；六組 rail 與內容同 row；
      `/publications` 每列年份為 0、首頁為 5；搜尋框在第一個年份之前；Experience 11 個期間照常
- [x] tsc、eslint、`npm test` 41 passed、build 綠

## Review

分組是空間上的：每年自己一個框、框間 24px，不花顏色。年份從十次減成六次。搜尋過濾後分組依顯示結果重算。
`PublicationList` 只剩首頁在用，搜尋路徑拿掉了。
