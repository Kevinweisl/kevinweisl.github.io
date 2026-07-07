# Todo — 2026-07-07 全面修正 + 上線

## A. Housekeeping / 部署準備
- [x] .gitignore 加入 .playwright-mcp/
- [x] 刪除根目錄 hero-dark-mode.png / hero-light-mode.png（先確認是否可做 og.png 素材）
- [x] Commit 工具鏈遷移（write-note command→skill、skills-lock.json、.agents/、.claude/skills/、tasks/）
- [x] deploy.yml: npm install → npm ci

## B. 重構（未來營運）
- [x] src/app/sitemap.ts 自動產生 sitemap，刪除 public/sitemap.xml
- [x] notes.ts: draft: true 支援 + date 缺漏 fail-soft（Invalid Date fallback）
- [x] src/data/profile.ts：siteUrl / 姓名 / 社群連結收斂一處
- [x] publications.ts authors 改 string[]，PublicationItem 移除 dangerouslySetInnerHTML
- [x] CardList wrapper 收斂三處重複列表容器
- [x] experience.ts 副描述改顯式 note 欄位，移除 \n split
- [x] react-icons → 內嵌 X SVG，移除依賴

## C. UI 專業度
- [x] Young Serif 假粗體：Hero/Section/NoteCard/note page/globals prose 改 font-normal
- [x] globals.css：::selection、:focus-visible、scrollbar-color、text-wrap balance/pretty
- [x] CJK 排版：line-break strict、text-spacing-trim、hanging-punctuation、max-width 68ch
- [x] Navbar 移除 focus:outline-none
- [x] Hero 非連結機構名去 accent 色（只留 italic）
- [x] Hero CTA transition-all → transition-transform
- [x] Footer 年份動態化
- [x] 首頁 metadata 覆寫刪除、聯絡區文案改具體
- [x] PublicationItem 展開面板 16px → 14px
- [x] not-found borderRadius 3px → var(--radius)
- [x] 列表項 py 統一、NoteCard 日期 tabular-nums
- [x] .gradient-text/.gradient-bg 改名 .accent-text/.accent-bg（grep CSS + TSX，含 inline style）

## D. 內容 / 功能
- [x] PublicationItem render doiLink + thumbnailUrl
- [x] Notes 上一篇/下一篇導覽
- [x] Notes 閱讀時間（CJK 字元計）
- [x] og.png + metadata（openGraph.images、twitter summary_large_image）

## E. 驗證與部署
- [x] npm run build 通過
- [x] 依 lessons.md：實際瀏覽 home / publications / notes 列表 / note 內頁（light + dark）
- [x] 分邏輯 commit → push main（觸發 GitHub Pages 部署，ccClub Part 1 上線）

## 需要 Kevin 提供（無法自動完成）
- [ ] 真人照頭像（取代 avatar.ico 亮藍色方塊）
- [ ] CV PDF（public/cv.pdf + Hero CTA）
- [ ] ORCID / Semantic Scholar ID
- [ ] ccClub 三篇文章照片（見 tasks/ccclub-plan.md）
