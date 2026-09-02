# Todo — 2026-09-02 配色改版：把 ccClub logo 帶進網站

比較頁：`tasks/palette-options.html`（也發布為 Artifact）。

## 起因
現況只吸收了 logo 三色裡的一個（teal），而且色相比 logo 更藍。粉紅與冰藍從未進站，
根因是 `.impeccable.md` 的品牌色是憑印象寫的，第二色記成不存在的 Coral Red `#D24E42`。

## 1. 取色與提案
- [x] 對 logo 實際取色：冰藍 `#CADFE3` 72.7%、teal `#487981` 9.1%、粉紅 `#E288B3` 7.0%
- [x] 四個方向各做一份實體樣本（同一份真實內容 × 不同 token），可切淺／深色
- [x] 每案逐對算 WCAG 對比度，全部 ≥ 4.5

## 2. Kevin 的選擇
- [x] 淺色：**C 冰藍底當家**，但卡片不要浮成白色
- [x] 深色：**C**，但 hero 的斜體字要改成粉色

## 3. 落地
- [x] `globals.css` 兩組 token 全換；卡片 `#ffffff` → `#eff5f6`（貼著底色提亮，不再是白色塊）
- [x] 新增 `--hero-link`：hero 斜體連結不再借用 `--accent`，淺色維持 teal（僅底線粉），深色文字本身轉粉
- [x] `Hero.tsx` 移除 `accent-text`，顏色交給 `.hero-link` 一個類別擁有
- [x] `ContactLinks.tsx` 兩個舊字面值換成 token（`--shadow-contact-hover`、`--text-on-primary`）
- [x] 驗證：token 覆蓋率（無單邊定義）＋ 全部文字對比度 ≥ AA
- [x] 36 測試綠、build 綠、三種頁型（首頁／清單／文章）淺深色實地走過
- [x] `.impeccable.md` 品牌色改為從素材取的實際值＋面積佔比

## Review

**Kevin 的兩點指定都照做了**：淺色卡片從 `#ffffff` 改成 `#eff5f6`，和底色 `#e9f1f3`
只差 1.04 的對比 —— 靠邊框而不是靠亮度差來讀出「這是一張卡片」。深色 hero 的斜體連結
（ShopBack / Junyi Academy / KKStream / ccClub）文字轉為粉色 `#EAA9C8`。

**順手修掉的既有問題**（都是這次改動會踩到的）：
- `ContactLinks` hover 的 `text-white` 疊在深色 accent 上只有 3.14，換成 C 的亮 teal 後
  會掉到 2.24。改走 `--text-on-primary`（深色給深字），變成 8.07。
  順帶讓那個一直沒被使用的 token 有了實際用途。
- `ContactLinks` 的 `rgba(54,120,142,0.22)` 是唯一殘留在 TSX 的舊 accent 字面值，換成 token。
- hero 斜體連結原本借用 `--accent` 上色 —— hero 其餘每個顏色都有自己的 `--hero-*` token，
  只有它伸手到家族外。加 `--hero-link` 後才有辦法讓兩個主題各走各的。

**誠實邊界**：
- `--radius` 跟著 C 從 6px 變成 4px（樣本裡就是這樣，Kevin 是看著它選的）。
  若不喜歡，改 `globals.css` 一行即可。
- 「hero 的斜體字」我讀成**斜體連結**。純斜體的機構名（National Taiwan University、
  Center of General Education、Department of Economics）不是連結，維持內文色。
  若原意是全部斜體都要轉粉，說一聲就改。
- `avatar.ico` 自帶淺藍底，在深色 hero 上偏亮 —— 這是圖片本身，非本次改動，未處理。
