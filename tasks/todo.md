# Todo — 2026-09-05 Teaching 學期清單加上總數

## 起因
Kevin：「teaching 有列出每個學期，是否應該要在最前面做個統計，例如 N semesters: xxx, xxx」
且「兩門課分別加」、「這個資訊要粗體」。

左欄的 `2021 - Present` 只講跨度不講密度。右邊是 120 字元、13px 灰字、十個長得
幾乎一樣的 token，沒有人會去數。數字才是重點，清單是佐證。

## 改動
- [x] `data/experience.ts`：`note?: string` → `semesters?: string[]`，兩筆資料拆成陣列
- [x] `ExperienceItem.tsx`：`{semesters.length} semesters` 包 `<strong className="font-semibold">`，
      後面接 `: ` 與 `semesters.join(', ')`
- [x] 單複數：`length === 1` 時輸出 `semester`

**為什麼要改資料型別**：數字若手打，之後加一個學期要同時改清單和數字兩個地方，
遲早不同步。改成陣列後數量由 `.length` 導出，加學期是單點編輯。

## 有意不做
- 不做 Teaching 區塊層級的總計。兩門課相加是 15，但去重後的日曆學期只有 10
  （ECON1024 每次都與 GenEdu5010 撞同一個春季）。Kevin 指定分別加，正好避開這題。
- 不壓縮清單本身（例如 `Spring 2022–2026`）。GenEdu5010 缺 2024 Fall，
  不是連續區間，壓縮寫法哪天補了秋季班就崩。

## 驗證
- [x] `npm test` 29 綠；`npm run build` 綠
- [x] `grep -rn "\bnote\b" src/` 沒有殘留的 `note` prop（命中的都是文章 note，無關）
- [x] `out/experience.html` 純文字：`10 semesters: 2021 Spring, …` / `5 semesters: 2022 Spring, …`
- [x] CSS bundle：`.font-semibold{font-weight:var(--font-weight-semibold)}` = 600，
      class 特異性勝過 Tailwind preflight 的 `strong{font-weight:bolder}`
- [x] `--text-muted` `#7b9096` on `--bg-card` `#12242a` = **4.78**，過 AA
- [ ] 瀏覽器目視 — 擴充功能未連線，改以 build 後的純文字與 CSS 規則驗證
