# Todo — 2026-09-06 科技感改版

Kevin：「Is there any way to make the design better? 包含排版、配色、或是一些網頁的小特效(when mouse hover) 讓網站更有科技感一些」

規格：`docs/superpowers/specs/2026-09-06-tech-redesign-design.md`
選項板（Kevin 據以決定的東西）：`tasks/palette-options-r2.html`、`tasks/layout-options.html`

## 已定案
- 字體語彙 **A 精密儀器**、互動 **C 發光**
- 配色 **印記藍 + 深空**：accent `#A0CCE7`（KW 字標取色）、ground `#06090B`
- 版面 **L1 節奏分級 + L2 儀器欄**，另取 L3 的論文年份靠右
- 等寬字 **JetBrains Mono**
- 範圍：全站六頁

## 實作（五層，每層結束時網站都必須可部署）
- [ ] 1 Token 層 — `globals.css` token、JetBrains Mono 載入、`.mono` 工具、`.impeccable.md` 同步
- [ ] 2 尺度層 — 間距/寬度/字級三組尺度、h1 統一、分隔機制統一、Footer 對齊 1100
- [ ] 3 骨架層 — 儀器欄進 `Section` 與 `PageShell`，各頁填入定位資訊
- [ ] 4 互動層 — `Spotlight.tsx`、hover、減量動效、Hero 環境網格
- [ ] 5 測試層 — 三個新測試 + 六頁人工驗收

## 驗證
- [ ] `npm test`、`npm run build` 綠
- [ ] 新測試：字級白名單、元件無顏色字面值、等寬字只從 `.mono` 進來
- [ ] 六頁實走：`/`、`/publications`、`/notes`、`/notes/2024/llm-selection-bias-part1`、`/experience`、404
- [ ] hero 每個 gradient 停點與每個半透明表面合成後各驗一次對比
- [ ] 開 `prefers-reduced-motion` 再走一次首頁與 `/publications`

---

# 另案：og.png 是壞的

改版過程中發現，與本次改版無關，但別忘了。

`public/og.png` 還是**改版前的淺色版**，而且 bio 仍寫著 "CS PhD Candidate"（Kevin 現在是
Adjunct Instructor，`src/data/profile.ts` 早就更新了）。分享到 Slack / Twitter / LinkedIn 的
預覽圖跟實際網站完全不像，內容也是錯的。

- [ ] 依新配色重新產生 `public/og.png`，文案取自 `src/data/profile.ts` 而不是手寫
- [ ] 找出當初產生它的方法；若無，考慮做成可重跑的腳本，避免下次改版又漂掉
