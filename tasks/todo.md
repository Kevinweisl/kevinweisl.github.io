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
- [ ] **Experience 的時間軸**：Q17(d)「兩欄合併成一根」在實作時發現結構成本比預估高
      （列高不固定，誠實的合併是單一 grid 橫跨兩欄，但分類的外框卡片跨不過去）。
      目前落地的是期間在列內、帶 `mono`。要不要付重構成本換那根時間軸，需要 Kevin 決定。
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
