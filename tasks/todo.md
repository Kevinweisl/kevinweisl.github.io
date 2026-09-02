# Todo — 2026-09-03 只留深色：拆掉雙主題機制

計畫全文：`~/.claude/plans/sprightly-riding-flask.md`。

## 起因
Kevin：「淺色跟深色兩種有點不必要，留著深色即可。」雙主題的成本在上一輪配色改版
放大了一倍 —— 每個顏色算兩次對比、驗兩個底、7 個測試只為了守 CSS ↔ TS 契約。

## 1. 刪機制
- [x] 刪 `src/lib/theme.ts`、`theme.test.ts`、`ThemeToggle.tsx`、`ThemeSync.tsx`（互相引用，一起刪）
- [x] `layout.tsx`：拿掉 inline init script、`<ThemeSync />`、`suppressHydrationWarning`
- [x] `layout.tsx`：新增 `viewport = { colorScheme: 'dark', themeColor: '#0a1519' }`
- [x] `Navbar.tsx`：拿掉兩處 `<ThemeToggle />`；手機 wrapper 只剩一個子元素 → 漢堡按鈕直接提升到 nav 列

## 2. `globals.css`
- [x] 42 個 `.dark` 值逐字搬進 `:root`（程式化替換，非手抄），刪 `.dark` block
- [x] `html { color-scheme: dark }`
- [x] 刪整段 Theme Toggle（註解 + 三條 `[data-theme-only]` 規則）
- [x] `.dark .prose img` 併進 `.prose img`（這條是文章圖片邊框，不是 toggle plumbing）
- [x] 重寫三處兩主題時期的註解

## 3. 順手修：三個「白字疊在 accent 上」
深色成為唯一模式後這是每個訪客都看到的 bug（白字 on `#7fb6c0` ≈ 2.2）。
上一輪已建 `--text-on-primary`（`#08181d`，8.07）但只用在 ContactLinks hover：
- [x] `PublicationItem.tsx` venue 徽章
- [x] `ContactLinks.tsx` 信件 modal 的 icon
- [x] `not-found.tsx` 404 的 CTA

## 4. 文件
- [x] `.impeccable.md`：約束改為 dark only；「冰藍底當家」改為「深 teal 底、冰藍留作 CTA」
- [x] `tasks/ccclub-plan.md`：「深色模式自動加邊框」→「自動加邊框」

## 驗證
- [x] `npm test` **29 綠**（36 − 7）；`npm run build` 綠
- [x] `grep` `src/`：`.dark` / `data-theme-only` / `ThemeToggle` / `ThemeSync` / `themeInitScript` / `prefers-color-scheme` / `suppressHydrationWarning` **全部歸零**（只剩 globals.css 註解裡的一句說明）
- [x] `text-white` 只剩 `ProseContent.tsx:40`（lightbox 關閉鈕，疊在 `bg-black/80` 上，正確）
- [x] `out/index.html`：有 `<meta name="color-scheme" content="dark">` 與 `<meta name="theme-color" content="#0a1519">`，`localStorage` 出現 0 次
- [x] 首頁：`<html>` **沒有** `dark` class 但 body 底色是 `#0a1519` —— 深色值來自 `:root` 無條件生效；`color-scheme` 計算值 `dark`；navbar 無 toggle；漢堡按鈕在 nav 列且 `md:hidden`
- [x] 文章頁：4 張 `.prose img` 全部有 1px 邊框、8px 內距、5% 白底
- [x] 404：CTA 深字 on teal = **8.07**

## Review

**刪掉的**：4 個檔案、1 支 inline script、1 個 hydration 例外、42 個重複的 token、
3 條 toggle 規則、7 個契約測試。`src/` 裡不再有任何「主題」的概念。

**拿到的**：`color-scheme: dark` 讓原生捲軸與 Publications 搜尋框跟著變深；
`theme-color` 讓手機瀏覽器框架與頁面同色。雙主題時期做不到（要 media-query 陣列）。

**順手修的三個對比度問題**是這次改動的直接後果 —— 它們原本是「一半訪客看到」，
現在是「全部」。修法是套用上一輪已經建好的 token，沒有新東西。

**有意不做**：
- `public/og.png` 是淺色的（92% 像素亮度 > 200），現在是網站最後一個淺色資產，
  每一頁的 `og:image` 都在用。需要重做圖，建議當下一個 task。
- `avatar.ico` 自帶淡藍底（上一輪已標記）。
- `--text-on-primary` 現在其實是「疊在 accent 上的字」，改名會擴散 4 個檔案，不值得。
- `tasks/lessons.md` 的 theme 教訓、`tasks/palette-options.html` 保留，那是歷史。
