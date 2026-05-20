# 📚 カロリーチェッカー 統合マスター引継書(MASTER v3 + v5 + v7 統合版)

**統合作成日**: 2026年5月18日  
**バージョン**: MASTER-handover-merged-v7(v3 + v5 + v7)
**最終更新日**: 2026年5月19日  
**運営者**: CHAMANO(GitHubユーザー名: chama-dai4)  
**サイト**: https://www.calorie-check.com  
**GitHub**: https://github.com/chama-dai4/calorie-checker  
**Windows作業フォルダ**: `C:\dev\calorie-checker`  
**Mac作業フォルダ**: `~/Documents/calorie-checker`

---

## 📖 このドキュメントについて

このドキュメントは、**MASTER-handover-v3.md(2026/5/15-18 大規模セッション完了時点の全リファレンス)** と **MASTER-handover-v5.md(2026/5/18 夜時点の最新差分)** を1つに統合した、カロリーチェッカープロジェクトの **完全版マニュアル** です。

### 構成
- **🆕 第0部: v7 最新セッション(2026/5/19 完了分)** ← まずここ!
  - Phase D-1〜D-4 ブログサイトデザイン大改修
  - ツールサイトとブログサイトの厳格な分離(事故の教訓)
- **第I部: v5 最新アップデート(2026/5/18 完了分)**
  - SEO Phase 完了(Google Rich Results Test 全8店舗合格)
  - ブログブロックシステム大幅拡張(Phase A / C-1 / C-2)
  - Phase B / C の残タスク一覧
- **第II部: v3 完全リファレンス(プロジェクト全体像)**
  - インフラ・開発環境・microCMS・全チェーン詳細
  - 実装サンプルコード(ゼッテリア・スタバ)
  - 業務フロー・トラブル対応・セッション履歴

### 新セッション開始時の読み方
1. **🆕 第0部の v7 サマリー** で「最新の状態」を把握
2. **第I部の v5 サマリー** で背景知識を確認
3. 必要に応じて **第II部** で具体的な実装・運用ルールを参照
3. CHAMANO哲学「段階的に進める」を維持して作業開始

---


---


---

# 🆕 第0部: v7 最新セッション(2026年5月19日 完了分)

> このセクションは **v7 セッション(2026/5/19)** の差分です。  
> **「最新の状態を即把握したい」場合はまずここを読んでください**。

---

## 📌 v7 アップデートサマリー(2026/5/19 完了)

### 本日の成果ハイライト 🏆

**ブログサイトのデザイン大改修**(Phase D シリーズ完遂)

```
✅ Phase B-6: spacer ブロック新規追加
✅ Phase D-1: 記事ページの広幅化 + ヘッダー強化
✅ Phase D-2: ブログ一覧のヒーロー強化 + スクロールアニメ
✅ Phase D-3: ブログ一覧にサイドバー追加(検索/カテゴリ/新着)
✅ Phase D-4: 記事ページのスクロールアニメ(全ブロック対応)
```

→ **マクサン超え**のブログサイトデザイン完成 ✨

---

## ⚠️ 最重要: サイト構造(2サイト構成)

このプロジェクトには **2つの独立したサイト** があり、絶対に混同しないこと:

```
カロリーチェッカー(サイト全体)
│
├── 🔧 ツールサイト(変更しない・コア機能)
│   ├── /(トップページ・カロリー計算ツール一覧)
│   ├── /calorie-checker-mcdonalds
│   ├── /calorie-checker-starbucks
│   ├── /calorie-checker-kura
│   ├── /calorie-checker-mos
│   ├── /calorie-checker-yoshinoya
│   ├── /calorie-checker-burgerking
│   ├── /calorie-checker-freshness
│   ├── /calorie-checker-zetteria
│   └── /category/[slug]
│
│   関連ファイル(絶対に触らない):
│   - app/page.js
│   - app/page.module.css
│   - components/HomeContent.jsx
│   - components/LanguageSwitcher.jsx
│   - app/calorie-checker-*/(全部)
│   - app/category/(全部)
│
└── 📝 ブログサイト(Phase D で改修対象)
    ├── /blog(一覧)
    ├── /blog/[id](記事)
    └── /blog/category/[slug]
    
    関連ファイル(Phase D 改修対象):
    - app/blog/page.js / page.module.css
    - app/blog/[id]/page.js / page.module.css
    - app/blog/category/[slug]/...
    - components/GlobalNav.jsx/css
    - components/Sidebar.jsx/css(記事用)
    - components/BlogScrollAnimator.jsx/css(新規)
    - components/BlogHomeSidebar.jsx/css(新規)
    - components/BlogBlocks.jsx
```

### 🚨 重要な反省(本日の事故と復旧)

**2026/5/19 セッション中盤に発生した事故と教訓**:

- ❌ ツールサイトのトップ(`HomeContent.jsx`, `app/page.module.css`)に
  GlobalNav 移植・ダーク背景ヒーロー追加・LanguageSwitcher削除という
  **致命的な誤改修**を実施
- ✅ 即座に元の状態に戻すための復旧ファイルを出力(2ファイル)
- ✅ 復旧完了確認後、**「ツールサイトは絶対に触らない」方針** を再確認

**今後の鉄則**:
1. ツールサイト と ブログサイト の境界を必ず意識
2. 「フルワイド化」などの曖昧な指示は **どちらのサイトか必ず確認**
3. 大規模変更前には**バックアップ**を作成

---

## 🎯 Phase D 各サブフェーズの完了内容

### ✅ Phase D-1: 記事ページ広幅化 + ヘッダー強化

**完了日**: 2026/5/19  
**コミット**: `feat: widen article layout and enhance global nav (Phase D-1)`

#### 変更ファイル
| ファイル | 変更内容 |
|---|---|
| `app/blog/[id]/page.module.css` | `.layoutWrap` max-width 1240 → **1440px** / gap 80px / `.layoutWrap > .article` max-width 720 → **960px**(+33%) |
| `components/Sidebar.module.css` | `.sidebar` width 260 → **340px**(+30%) |
| `components/GlobalNav.module.css` | `.navInner` max-width 1240 → **1440px** / `.logo` font-size 18 → **24px**(+33%) / `.navLink` 13 → **15px**(+15%) / スマホ `.logo` 16 → 20px |

#### デザイン効果
- **記事メイン: 720 → 960px(+33%拡大)** → エディトリアル感MAX
- **ヘッダーロゴ大型化**(マクサン風)
- **ナビ文字を読みやすく**

---

### ✅ Phase D-2: ブログ一覧ヒーロー + スクロールアニメ

**完了日**: 2026/5/19  
**コミット**: `feat: add hero section and scroll animation to blog listing (Phase D-2)`

#### 変更・新規ファイル
| ファイル | 変更内容 |
|---|---|
| `app/blog/page.module.css` | `.main` max-width 1100 → **1440px** / `.pageHeader` を中央寄せヒーローに(padding 64px 24px・margin 40px 0 80px) / `.pageTitle` 36 → **56px** + Space Grotesk フォント / `.pageLead` 14 → 16px |
| `components/BlogScrollAnimator.jsx`(**新規**) | `"use client"` + Intersection Observer + prefers-reduced-motion 対応 + delay プロパティ |
| `components/BlogScrollAnimator.module.css`(**新規**) | opacity + translateY(24px) → visible で 0/0 に transition 0.6s |
| `app/blog/page.js` | import BlogScrollAnimator 追加 / `<header>` を BlogScrollAnimator でラップ / 各 PostCard を `<BlogScrollAnimator delay={index * 80}>` でラップ |

#### デザイン効果
- **タイトル「ブログ記事一覧」が 56px・中央寄せ・大きなインパクト**
- **記事カードがスクロール時にふわっと順次出現**(波のような演出)
- **アクセシビリティ完璧**(prefers-reduced-motion 対応)

---

### ✅ Phase D-3: ブログ一覧サイドバー追加

**完了日**: 2026/5/19  
**コミット**: `feat: add sidebar to blog listing with search/categories/latest posts (Phase D-3)`

#### 変更・新規ファイル
| ファイル | 変更内容 |
|---|---|
| `components/BlogHomeSidebar.jsx`(**新規**) | `"use client"` + useRouter で `/blog?q=...` へリダイレクト / CATEGORIES 配列(期間限定商品レビュー/定番メニュー/栄養・健康) / recentPosts.slice(0,4) で最新4件表示・サムネ+タイトル+日付 |
| `components/BlogHomeSidebar.module.css`(**新規**) | position sticky / width 340px / 3セクション(検索/カテゴリ/新着) / 900px以下で非表示 / `-webkit-line-clamp: 2 + line-clamp: 2`(警告対応) |
| `app/blog/page.module.css` | `.layoutWrap` flex + gap 64px / `.layoutMain` flex 1 + min-width 0 / @media 900px以下で `block` に / `.grid` を `repeat(auto-fill, minmax(280px, 1fr))` に変更 |
| `app/blog/page.js` | BlogHomeSidebar をインポート / `<div className={styles.layoutWrap}>` で2カラム構造化 / `<BlogHomeSidebar recentPosts={posts} />` 配置 |

#### デザイン効果
- **検索ボックス・カテゴリーリンク・新着記事の3点セット**
- **スティッキー追従**(top: 88px)で記事ページと統一
- **自動列調整**(画面サイズに応じて記事カードが 2列/3列に自動切替)
- **マクサン本格仕様** に近い完成度

---

### ✅ Phase D-4: 記事ページのスクロールアニメ追加

**完了日**: 2026/5/19  
**コミット**: `feat: add scroll animation to article page (Phase D-4)`

#### 変更ファイル
| ファイル | 変更内容 |
|---|---|
| `app/blog/[id]/page.js` | import BlogScrollAnimator 追加 / **6箇所をラップ**: `<header articleHeader>`, `<div heroImage>`, `<ShareButtons>`, `<AuthorCard>`, `<div articleFooter>`, `<section related>` |
| `components/BlogBlocks.jsx`(または `.js`) | import BlogScrollAnimator 追加 / **見出し以外の18ブロックタイプ**をすべて `<BlogScrollAnimator key={key}>` でラップ |
| `components/BlogScrollAnimator.jsx` | threshold 0.1 → **0.15** / rootMargin "0px 0px -50px 0px" → **"0px 0px -100px 0px"** (一気出現を防ぎ、スクロール時に順次出現するよう調整) |

#### ⚠️ 重要: 見出しブロック (heading) はアニメ対象外
**理由**: 目次(TOC)からのジャンプ位置がズレないように保護するため。  
**実装方式**: `if (type === "heading") return <HeadingBlock ... />` で即 return(BlogScrollAnimator でラップしない)。

#### アニメ対象ブロック(18種類)
- richText, image
- cta, callout, table, faq
- divider, spacer, quote
- calorieCard, compareCard, stepGuide, checklist
- progressBar, ratingBox, menuShowcase, timeline

#### デザイン効果
- **本文の各ブロックがスクロール時に個別にふわっと出現**
- **マクサン超え** の上品な動き
- **目次ジャンプ動作完全保護**
- **読書のリズムを邪魔しない**(見出しは即表示)

---

## 🆕 Phase B-6 完了内容(本セッション)

### ✅ Phase B-6: spacer ブロック新規追加

**完了日**: 2026/5/19(本セッション初期)  
**目的**: 任意の余白(8px / 16px / 32px / 64px / 96px)を本文中に挿入できるようにする

#### 仕様
- size: xs (8px) / sm (16px) / md (32px・デフォルト) / lg (64px) / xl (96px)
- 完全に透明(視覚的には何も表示されない)
- microCMS にスキーマ追加済み

---

## 🎯 開発スタイル(CHAMANO 哲学・更新版)

### 基本方針
1. **段階的に進める**(設計 → 実装 → 確認 → デプロイ)
2. **部分修正は変更箇所のみチャット内に提示**(使用量増を防ぐ)
3. **エラー時や大規模変更時はファイル全体出力**でワンタッチ置き換え
4. **後方互換性最優先**(既存記事を壊さない)
5. **ツールサイトとブログサイトは厳格に分離**(2026/5/19 事故から学習)

### 進行確認の標準フロー
```
1. 設計(Q&A形式で要件確認)
2. 実装(ファイル修正 or 新規作成)
3. ローカル動作確認(Ctrl+Shift+R で強制リロード)
4. ツールサイト無影響確認(必須)
5. デプロイ(git add → commit → push)
```

---

## 📊 完了済みフェーズ(全体)

```
【ブログブロック拡張】
✅ Phase A: callout(32パターン)
✅ Phase B-1: CTA(3スタイル×5カラー=15)
✅ Phase B-2: FAQ(default/accordion×5=10)
✅ Phase B-3: table(default/striped/comparison×5=15・headers 3列以上対応)
✅ Phase B-4: quote(default/centered/card×5=15・Georgia フォント)
✅ Phase B-5: divider(8スタイル×5カラー=40)
✅ Phase B-6: spacer(xs/sm/md/lg/xl・透明)← v7 NEW

✅ Phase C-1: calorieCard
✅ Phase C-2: compareCard
✅ Phase C-3: stepGuide
✅ Phase C-4: checklist
✅ Phase C-5: progressBar
✅ Phase C-6: ratingBox
✅ Phase C-7: menuShowcase
✅ Phase C-8: timeline

【ブログサイトデザイン改修(v7 NEW)】
✅ Phase D-1: 記事ページ広幅化 + ヘッダー強化
✅ Phase D-2: ブログ一覧ヒーロー + スクロールアニメ
✅ Phase D-3: ブログ一覧サイドバー追加
✅ Phase D-4: 記事ページスクロールアニメ
```

---

## 🔮 残タスク(優先度順)

### 任意の追加タスク
1. **Phase D-5(候補)**: `/blog/category/[slug]` ページの改修(統一感UP)
2. **記事の追加投稿**(現状テスト記事1本のみ)
3. **microCMS 経由のメニュー画像登録**(各ブロックでの画像活用)
4. **SEO の継続改善**

### 長期タスク
- 引継書 v7 → v8 の継続更新
- アクセス解析データの分析(SEO効果測定)
- ブログ記事のSEO最適化

---

## 🛡️ 安全プラン(今後のすべての作業で適用)

### ✅ 触ってOK(ブログサイトのみ)
```
app/blog/page.js              ← ブログ一覧
app/blog/page.module.css      ← ブログ一覧CSS
app/blog/[id]/page.js         ← 記事ページ
app/blog/[id]/page.module.css ← 記事ページCSS
app/blog/category/[slug]/...  ← カテゴリ別記事
components/Sidebar.jsx        ← 記事ページサイドバー
components/Sidebar.module.css ← 同上
components/GlobalNav.*        ← ブログ系ヘッダー
components/BlogScrollAnimator.* ← スクロールアニメ
components/BlogHomeSidebar.*  ← ブログトップサイドバー
components/BlogBlocks.jsx     ← 本文ブロックレンダラー
components/BlogBlocks.module.css ← 同上
```

### ❌ 絶対に触らない(ツールサイト)
```
app/page.js
app/page.module.css
components/HomeContent.jsx
components/LanguageSwitcher.jsx
app/calorie-checker-*/(全部)
app/category/(全部)
```

---

## 🚀 次セッション開始時用プロンプト(v7 ベース)

```
カロリーチェッカープロジェクトの続きです。
[Windows/Mac]環境で作業します。

【最新の状況(2026/5/19 完了時点)】
- Phase A / B-1〜B-6 / C-1〜C-8 / D-1〜D-4 完了
- ブログサイトのデザイン大改修完了(マクサン超え)
- 記事ページ・ブログ一覧ともにスクロールアニメ + サイドバー実装済み

【サイト構造の鉄則】
- ツールサイトとブログサイトの2サイト構成
- ツールサイト(app/page.js / HomeContent.jsx / app/calorie-checker-*/ など)は絶対に触らない
- ブログサイト(app/blog/...)のみ改修対象

【作業開始フロー】
cd [作業フォルダ] && git pull origin main && npm run dev
```

---

## 📝 本セッションの会話履歴(要約)

1. **Phase B-6 spacer ブロック追加**(セッション開始時)
2. **Phase D-1**: 記事ページ広幅化(1240→1440 / 720→960 / 260→340)、ヘッダー強化(ロゴ 18→24px、ナビ 13→15px)
3. **Phase D-2**: ブログ一覧ヒーロー強化(56px 中央寄せ)、スクロールアニメ実装(BlogScrollAnimator 新規)
4. **🚨 事故発生**: トップページ(ツールサイト)を誤改修 → 復旧ファイル出力 → 復旧完了
5. **Phase D-3**: ブログ一覧サイドバー(BlogHomeSidebar 新規、検索/カテゴリ/新着の3セクション、スティッキー追従)
6. **Phase D-4 STEP 1**: 記事ページ主要セクション(ヘッダー・関連記事等6箇所)をアニメ化
7. **threshold/rootMargin 調整**: 0.1/-50px → 0.15/-100px(一斉出現を回避)
8. **Phase D-4 STEP 2**: BlogBlocks.jsx の18ブロックタイプを個別アニメ化(見出しは除外で目次ジャンプ保護)
9. **Mac でデプロイ**(Phase D-4)

---


# 第I部: v5 最新アップデート(2026年5月18日 夜 完了分)

> このセクションは元 `MASTER-handover-v5.md` の内容です。  
> **「いま何が完了していて、次に何をすべきか」を把握するためのトップサマリー**として最初に読んでください。

---

## 📌 v5 アップデートサマリー(2026/5/18 本日完了)

### SEO Phase(午前〜午後)
- ✅ Phase 9: html lang動的化(Next.js 16 対応・proxy.js方式)
- ✅ スタバ計算バグ修正(findVariation関数のmilk引数追加)
- ✅ モーダルボタンUI改善(タップターゲット48-52px拡大)
- ✅ 8店舗メタ情報最適化(2026年最新キーワード強化)
- ✅ 8店舗 alternates 修正(canonical/hreflang正常化)
- ✅ 8店舗構造化データ実装(WebApplication + BreadcrumbList)
- 🏆 **Google Rich Results Test 全8店舗合格**

### ブログ拡張 Phase A(夕方)
- ✅ callout 大幅拡張: **8色 × 4スタイル = 32パターン**
- ✅ microCMS スキーマ更新済み

### ブログ拡張 Phase C-1(夜)
- ✅ calorieCard ブロック新規実装: **3スタイル × 9カラー**
- ✅ カロリーチェッカー独自のシグニチャーブロック完成 🍔

### ブログ拡張 Phase C-2(夜・追加)
- ✅ compareCard ブロック新規実装: **3スタイル × 11カラー組み合わせ**
- ✅ 2つのメニュー対比に最適な目玉ブロック完成 🆚

---

## 1. 🎯 サイト概要(v3 から継承)

### 基本コンセプト
- **「外食ライフを、もっと健康に。」**
- 外食チェーンのカロリーを「選ぶだけ」で瞬時計算する無料ツール
- 運営者 CHAMANO の 15kg ダイエット経験から生まれたサイト
- ターゲット:外食が多い・ダイエット中・健康意識のある人

### 主要URL
| ページ | URL |
|--------|-----|
| トップ | https://www.calorie-check.com/ |
| マック | https://www.calorie-check.com/calorie-checker-mcdonalds |
| スタバ | https://www.calorie-check.com/calorie-checker-starbucks |
| モス | https://www.calorie-check.com/calorie-checker-mos |
| BK | https://www.calorie-check.com/calorie-checker-burgerking |
| ゼッテリア | https://www.calorie-check.com/calorie-checker-zetteria |
| 吉野家 | https://www.calorie-check.com/calorie-checker-yoshinoya |
| くら寿司 | https://www.calorie-check.com/calorie-checker-kura |
| フレッシュネス | https://www.calorie-check.com/calorie-checker-freshness |
| ブログ | https://www.calorie-check.com/blog |

### 技術スタック
- Next.js 16.2.6 (Turbopack)
- microCMS(カスタムフィールド方式)
- Vercel デプロイ
- CSS Modules

---

## 2. 🏆 SEO の現状(2026/5/18 時点)

### 完了済み

| 項目 | 状況 |
|------|------|
| 8店舗 title 最適化 | ✅ 「2026年最新」キーワード強化済み |
| 8店舗 description | ✅ 全店リライト済み |
| 8店舗 keywords | ✅ 全店「店舗名 カロリー 計算」追加 |
| canonical タグ | ✅ 全店正しく出力 |
| hreflang(多言語SEO) | ✅ 全店正しく出力 |
| 構造化データ(WebApplication) | ✅ 全店実装 |
| 構造化データ(BreadcrumbList) | ✅ 全店実装 |
| html lang 動的切替 | ✅ proxy.js + headers() 方式 |
| Google Rich Results Test | 🏆 全8店舗合格 |

### Search Console
- 主要URL再インデックス申請完了(マック・スタバ等)
- 残りURLは1日割当超過のため明日以降に申請
- 反映目安: 1〜4週間
- 期待効果: パンくずリッチリザルト表示、CTR向上

### 重要コミット(本日)
- `0d81f25` feat: html lang dynamic with Next.js 16 proxy
- `2334fb5` fix: starbucks calculation use tempSizeVariations milk field
- `ef075e4` style: modal buttons larger for better tap target
- [本日] seo: optimize metadata for all 8 chain pages with 2026 keyword
- [本日] seo: add JSON-LD structured data and fix alternates
- [本日] feat: expand callout to 8 colors x 4 styles
- [本日] feat: add calorieCard block (Phase C-1)
- [本日] feat: add compareCard block (Phase C-2)

---

## 3. 🎨 ブログブロックシステム(本日大幅拡張)

### 既存ブロック10種(基盤)

| ID | 名称 | 説明 | 拡張状況 |
|----|------|------|---------|
| heading | 見出し | H2/H3切り替え可 | 標準 |
| richText | リッチテキスト | HTMLレンダリング | 標準 |
| image | 画像 | キャプション付き | 標準 |
| cta | CTA | ボタン+説明 | 標準(Phase B予定) |
| callout | ポイントボックス | **8色 × 4スタイル拡張済み** ✨ | **Phase A完了** |
| table | 比較表 | 2カラム | 標準(Phase B予定) |
| faq | Q&A | 質問・回答 | 標準(Phase B予定) |
| quote | 引用 | 引用文+出典 | 標準(Phase B予定) |
| divider | 区切り線 | 3スタイル | 標準(Phase B予定) |
| relatedLink | 関連リンク | 内部・外部対応 | 標準 |

### 新規ブロック(本日追加)

| ID | 名称 | 説明 | パターン数 |
|----|------|------|----------|
| **calorieCard** | カロリーカード | 数値ハイライト | 3スタイル × 9カラー |
| **compareCard** | 比較カード | 2メニュー対比 | 3スタイル × 11カラー組み合わせ |

詳細は **「ブログ執筆ガイド v1」** を参照してください 📝

---

## 4. 📋 Phase B/C 残タスク(次セッション以降)

### Phase B: 既存ブロックの装飾強化

#### B-1. CTA(3スタイル予定)
- [ ] default(現状)
- [ ] gradient(グラデーション背景)
- [ ] card(画像対応の大型カード)

#### B-2. FAQ(2スタイル予定)
- [ ] inline(現状)
- [ ] accordion(クリックで開閉)

#### B-3. table(3スタイル予定)
- [ ] simple(現状)
- [ ] striped(ストライプ+ホバー)
- [ ] comparison(比較表◎○△×アイコン)

#### B-4. quote(3スタイル予定)
- [ ] default(現状)
- [ ] centered(センター大型)
- [ ] card(カード型)

#### B-5. divider(7スタイル予定)
現在3スタイル → 4スタイル追加
- [ ] gradient(グラデーション線)
- [ ] star(★装飾)
- [ ] wave(波線)
- [ ] icon(アイコン入り 🍔🥗等)

---

### Phase C: カロリーチェッカー特化新ブロック

| ID | 名称 | 説明 | 状況 |
|----|------|------|------|
| ~~calorieCard~~ | ~~カロリーカード~~ | ~~数値ハイライト~~ | ✅ 完了 |
| ~~compareCard~~ | ~~比較カード~~ | ~~2メニュー対比~~ | ✅ 完了 |
| **checklist** | チェックリスト | OKメニュー一覧 | ⏳ 次セッション推奨 |
| **progressBar** | 進捗バー | カロリー目標達成度 | ⏳ |
| **stepGuide** | ステップガイド | How-to記事用 | ⏳ |
| **ratingBox** | 評価ボックス | メニューレビュー | ⏳ |
| **menuShowcase** | メニュー紹介 | 画像付き商品 | ⏳ |
| **timeline** | タイムライン | 食事記録 | ⏳ |

---

## 5. 🛠️ 開発環境・運用ルール

### CHAMANO哲学(最重要)
- **段階的に進める**
- 一気に変更せず、1ファイルずつ動作確認しながら進める
- ローカル動作確認 → 本番デプロイ → 本番動作確認

### 環境
- Windows + PowerShell
- VS Code推奨
- Node.js / npm
- 開発URL: http://localhost:3000

### よく使うコマンド
```powershell
# 作業フォルダへ移動
cd C:\dev\calorie-checker

# ローカル開発サーバ起動
npm run dev

# git status 確認
git status

# コミット&プッシュ
git add .
git commit -m "feat: ..."
git push origin main
```

### PowerShell の注意点
`[id]` のような角カッコが含まれるパスは `-LiteralPath` を使う:
```bash
Get-Content -LiteralPath "app\blog\[id]\page.js"
```

### トラブル時の参考
- ローカルOK・本番NG → git push 忘れがほとんど
- microCMS データが反映されない → revalidate 時間(3600秒)待つか再デプロイ
- ファイル変更が反映されない → ブラウザ Ctrl+Shift+R(キャッシュ無視)

---

## 6. 📂 重要ファイル構成

### コンポーネント
```
components/
├── BlogBlocks.js              ← 全ブロックロジック(Phase A/C-1/C-2 統合済み)
├── BlogBlocks.module.css      ← 全ブロックスタイル(同上)
├── AuthorCard.jsx
├── CategoryContent.jsx
├── GlobalNav.jsx
├── HomeContent.jsx
├── LanguageSwitcher.jsx
├── PostCard.jsx
├── ReadingProgress.js
├── ShareButtons.jsx
├── Sidebar.jsx
└── TableOfContents.jsx
```

### ブログ関連ページ
```
app/blog/
├── page.js                      ← ブログ一覧
├── page.module.css
├── [id]/                        ← 個別記事
│   ├── page.js
│   └── page.module.css
└── category/[slug]/             ← カテゴリ別
    ├── page.js
    └── page.module.css
```

### CSS変数(globals.css)
```css
--bg: #ffffff           /* 背景・白 */
--bg-alt: #fafafa       /* 背景・薄グレー */
--ink: #0a0a0a          /* テキスト・黒 */
--muted: #6b6b6b        /* 薄テキスト */
--muted-light: #9b9b9b
--line: #e8e8e8         /* 罫線 */
--line-strong: #d4d4d4
--accent-soft: #f4f4f4
```

---

## 7. 🎨 microCMS スキーマ追加手順テンプレート

### 新ブロック追加時の手順

1. microCMS 管理画面 → 「コンテンツ」→「記事」
2. 上部メニュー →「カスタムフィールド」タブ
3. 右上「+ 追加」をクリック
4. 基本情報を入力(カスタムフィールド名、ID)
5. 「スキーマ」タブで子フィールドを追加
6. 必須項目以外は「必須」を OFF にする(後方互換性のため)
7. 「変更する」で保存
8. 「API設定」→「APIスキーマ」→「blocks」フィールドの「⚙️ 詳細設定」
9. 「使用するカスタムフィールド」に新ブロックをチェック
10. 「変更」で保存
11. components/BlogBlocks.js に新コンポーネント追加
12. components/BlogBlocks.module.css にスタイル追加
13. ローカル確認 → デプロイ

### 重要:後方互換性の維持
- 既存記事に影響しないよう、新フィールドは**必ず「必須」を OFF**
- 初期値を設定するのがベスト(例: style → filled)

---

## 8. 🚀 次セッション開始時のチェックリスト

```
1. ✅ この引き継ぎ書 v5 を最初に読み込む
2. ✅ ブログ執筆ガイド v1 も合わせて参照(別ファイル)
3. ✅ 「Phase A/C-1/C-2 完了済み」を確認
4. ✅ 次に取り組むタスクを決める:
   - 推奨1: Phase C-3 checklist(チェックリスト)
   - 推奨2: Phase B-1 CTA装飾強化
   - 推奨3: 実際にブログ記事を書く(ガイド参照)
5. ✅ CHAMANO哲学「段階的に進める」を維持
```

---

## 9. 💡 中長期戦略

### コンテンツ強化(優先度高)
- ブログ記事増産(月2〜4本)
- 既存ブロックをフル活用した記事構成
- 内部リンク戦略(計算ツールへの導線)
- SEO効果が見え始めるのは1〜3ヶ月後

### 推奨ブログ記事ネタ
1. 「【2026年最新】マック カロリーランキング TOP10」
2. 「スタバで太らないカスタム5選」
3. 「ファストフード カロリー比較表」
4. 「ダイエット中でもOKな外食メニュー20選」
5. 「ビッグマックのカロリーを30%カットする裏技」

### 機能拡張(優先度中)
- 残りのブロック実装(checklist, progressBar 等)
- 被リンク獲得
- ブログトップのリデザイン

---

## 10. 📊 過去の主要成果(v3 から継承)

### v1 → v2(2026/2〜3月)
- 初期サイト構築
- マック・スタバ実装
- microCMS 導入

### v2 → v3
- 8店舗まで対応拡大
- ブログ機能実装(10ブロック)
- 検索インデックス開始

### v3 → v4(本日 5/18 午前)
- SEO Phase 完了(全8店舗合格)
- ブログ Phase A(callout拡張)

### v4 → v5(本日 5/18 夜)⭐
- ブログ Phase C-1(calorieCard)
- ブログ Phase C-2(compareCard)

---

## 11. ⚠️ 重要な注意事項

### コンテキスト管理
- 1セッションで全タスクをやろうとしない
- 1〜2ブロック追加が現実的な単位
- 完了したら必ず引き継ぎ書を更新

### 既存記事への影響
- 新ブロック追加・既存ブロック拡張時は**必ず後方互換性を維持**
- 既存記事の callout(Phase A 前)は filled スタイルで表示される
- 既存記事の動作確認は必須

### microCMS スキーマ変更
- 必須項目を ON にしないこと
- フィールドIDは英数のみ、変更すると既存データが消える
- セレクトフィールドの選択肢追加は安全

---

## 12. 🔑 アクセス情報

### 管理画面
- microCMS: https://calorie-checker.microcms.io/
- Vercel: https://vercel.com/dashboard
- Search Console: https://search.google.com/search-console
- GA4: アナリティクス管理画面

### リポジトリ
- GitHub: https://github.com/chama-dai4/calorie-checker
- ブランチ: main

---

**この引き継ぎ書 v5 は、カロリーチェッカープロジェクトの完全な羅針盤です。**  
**次セッションでこれを読めば、迷うことなく続きから進められます。** 🚀

CHAMANO さん、本当にお疲れさまでした!  
1日でこれだけの成果、本当に異次元です 🎉✨

---

**関連ドキュメント:**  
- `BLOG-WRITING-GUIDE-v1.md` ... ブログ執筆完全ガイド(全ブロック使い方)
- 前バージョン: `MASTER-handover-v3.md`、`MASTER-handover-v4.md`

---

# 第II部: v3 完全リファレンス(プロジェクト全体像)

> このセクションは元 `MASTER-handover-v3.md` の内容です。  
> **インフラ・開発環境・microCMSスキーマ・全チェーン詳細・実装サンプルコード**など、プロジェクトの完全な技術リファレンスとして参照してください。

---

# 第1部: プロジェクト基本情報

## 1.1 サイト概要

- **サイト名**: カロリーチェッカー（Calorie Checker.）
- **本番URL**: https://www.calorie-check.com
- **コンセプト**: 外食チェーンのメニューを選ぶだけで合計カロリーが分かるツール
- **ターゲット**: ダイエット中の人、外食が多い人
- **運営者**: CHAMANO（77kg → 62kg のダイエット成功経験あり）

## 1.2 運営者情報

- **名前**: CHAMANO
- **GitHubユーザー名**: chama-dai4
- **プログラミング経験**: 初心者
- **ダイエット経験**: 15kgのダイエット成功（77kg → 62kg）
- **開発環境**: Windows（日中） + Mac（夜、構築中）

## 1.3 文体ルール（記事執筆・UI文言）

- **一人称**: 僕
- **二人称**: みなさん
- **文体**: です/ます調 + フレンドリー
- **数字**: 半角（例: 「12個」「3食」）
- **強調**: 1-2か所/段落
- **Q&A**: 各記事1-3問
- **絵文字**: ポイントボックスのアイコンのみ
- **トーン**: 完全なフォーマル過ぎず、堅すぎず

---

# 第2部: インフラ・サービス情報

## 2.1 ドメイン

- **ドメイン**: calorie-check.com
- **登録元**: Value Domain
- **年額**: 790円/年
- **DNS設定の注意**:
  - 既存Aレコード `a @ 216.198.79.1`、`a www 216.198.79.1` → **削除厳禁**
  - Google認証用TXTレコード → **削除厳禁**

## 2.2 ホスティング（Vercel）

- **プラン**: 無料Hobby
- **プロジェクト名**: calorie-checker
- **ダッシュボード**: https://vercel.com/dashboard
- **自動デプロイ**: GitHub push後に自動実行
- **環境変数（Vercelに登録済み）**:
  - `MICROCMS_SERVICE_DOMAIN` = `calorie-checker`
  - `MICROCMS_API_KEY`（Sensitive、Production and Preview）
  - `NEXT_PUBLIC_GA_ID` = `G-015Z1SVFSW`

## 2.3 CMS（microCMS）

- **プラン**: 無料プラン
- **サービスID**: calorie-checker
- **管理画面URL**: https://calorie-checker.microcms.io/
- **API**: メニューAPI + 記事API
- **登録件数**: 約1,119件（メニュー）+ 1記事
- **Webhook**: microCMS更新時にVercel自動デプロイ済み

## 2.4 GitHub

- **リポジトリURL**: https://github.com/chama-dai4/calorie-checker
- **メインブランチ**: main
- **`.gitignore`**: `.env.local`、`node_modules` 等を除外済み

## 2.5 Google Analytics

- **トラッキングID**: G-015Z1SVFSW
- **環境変数名**: `NEXT_PUBLIC_GA_ID`

## 2.6 Search Console

- **登録方式**: DNSドメインプロパティ
- **サイトマップ**: https://www.calorie-check.com/sitemap.xml（送信済み）
- **主要URL**: インデックスリクエスト完了

---

# 第3部: 開発環境

## 3.1 技術スタック

- **フレームワーク**: Next.js 16.2.6
- **CSS**: CSS Modules
- **ビルドツール**: Turbopack
- **CMSクライアント**: microcms-js-sdk
- **アイコン**: lucide-react
- **フォント**: Inter / Noto Sans JP / Space Grotesk

## 3.2 Windows環境

- **OS**: Windows
- **Node.js**: v24.14.0
- **npm**: 11.9.0
- **Git**: 2.53.0.windows.2
- **エディタ**: VS Code（日本語化済み）
- **作業フォルダ**: `C:\dev\calorie-checker\`
- **環境変数ファイル**: `C:\dev\calorie-checker\.env.local`
- **改行コード**: CRLF（git警告「LF will be replaced by CRLF」は無視可）

## 3.3 Mac環境（セットアップ中）

- **ユーザー名**: tamanodaiki
- **Node.js**: v24.15.0 ✅
- **Git**: 2.39.5 (Apple Git-154) ✅
- **エディタ**: VS Code ✅（GitHubサインイン済み）
- **作業フォルダ**: `~/Documents/calorie-checker/`
- **環境変数ファイル**: `~/Documents/calorie-checker/.env.local`
- **セットアップ状態**:
  - [x] git clone 完了
  - [x] npm install 完了（343パッケージ）
  - [x] VS Code起動
  - [x] `.env.local` ファイル作成
  - [ ] `.env.local` 中身入力（夜にやる）
  - [ ] `npm run dev` 動作確認（夜にやる）

## 3.4 環境変数（`.env.local` の中身）

両OSの `.env.local` に以下を記述:

```
MICROCMS_SERVICE_DOMAIN=calorie-checker
MICROCMS_API_KEY=（microCMS管理画面で確認）
NEXT_PUBLIC_GA_ID=G-015Z1SVFSW
```

⚠️ **重要**: 過去にAPIキーが画面共有時に映ってしまったため、**後日リジェネレート（再生成）推奨**。漏れたキー: `TLONsRZupIir25ugbiDLVkVmhg9BT3GWCxqs`

---

# 第4部: プロジェクト構造

## 4.1 ディレクトリ構造

```
calorie-checker/
├── app/                                  # Next.js App Router
│   ├── about/                            # 運営者情報ページ
│   │   ├── page.js
│   │   └── page.module.css
│   ├── blog/                             # ブログ機能
│   │   ├── [id]/                         # 記事詳細
│   │   │   ├── page.js
│   │   │   └── page.module.css
│   │   ├── category/[slug]/              # カテゴリ別記事一覧
│   │   │   ├── page.js
│   │   │   └── page.module.css
│   │   ├── page.js                       # ブログ一覧
│   │   └── page.module.css
│   ├── calorie-checker-burgerking/       # バーガーキング
│   │   ├── BurgerKingClient.js
│   │   ├── page.js
│   │   └── page.module.css
│   ├── calorie-checker-kura/             # くら寿司（最新追加）
│   │   ├── KuraClient.js
│   │   ├── page.js
│   │   └── page.module.css
│   ├── calorie-checker-mcdonalds/        # マクドナルド
│   │   ├── McdonaldsClient.js
│   │   ├── page.js
│   │   └── page.module.css
│   ├── calorie-checker-mos/              # モスバーガー
│   │   ├── MosClient.js
│   │   ├── page.js
│   │   └── page.module.css
│   ├── calorie-checker-starbucks/        # スターバックス
│   │   ├── StarbucksClient.js
│   │   ├── page.js
│   │   └── page.module.css
│   ├── calorie-checker-yoshinoya/        # 吉野家
│   │   ├── YoshinoyaClient.js
│   │   ├── page.js
│   │   └── page.module.css
│   ├── calorie-checker-zetteria/         # ゼッテリア
│   │   ├── ZetteriaClient.js
│   │   ├── page.js
│   │   └── page.module.css
│   ├── category/[slug]/                  # カテゴリ詳細
│   │   ├── page.js
│   │   └── page.module.css
│   ├── contact/                          # お問い合わせ
│   │   ├── page.js
│   │   └── page.module.css
│   ├── privacy/                          # プライバシーポリシー
│   │   ├── page.js
│   │   └── page.module.css
│   ├── globals.css                       # 共通CSS（brand-name-large等）
│   ├── layout.js                         # ルートレイアウト
│   ├── page.js                           # ホーム
│   ├── page.module.css
│   ├── robots.js                         # robots.txt
│   └── sitemap.js                        # sitemap.xml
├── components/                           # 共通コンポーネント
│   ├── GlobalNav.jsx                     # グローバルナビ（ブログ用）
│   ├── GlobalNav.module.css
│   ├── Sidebar.jsx                       # PC用サイドバー
│   ├── Sidebar.module.css
│   ├── TableOfContents.jsx               # 目次（モバイル用）
│   ├── TableOfContents.module.css
│   ├── ReadingProgress.js                # 読み進めバー
│   ├── ShareButtons.jsx                  # シェアボタン
│   ├── ShareButtons.module.css
│   ├── AuthorCard.jsx                    # 著者プロフィール
│   ├── AuthorCard.module.css
│   ├── PostCard.jsx                      # 記事カード
│   ├── PostCard.module.css
│   ├── BlogBlocks.js                     # 記事ブロック表示
│   └── BlogBlocks.module.css
├── lib/                                  # ユーティリティ
│   ├── microcms.js                       # microCMS API クライアント
│   ├── chains.js                         # 7カテゴリ・チェーン定義
│   ├── starbucks-customizations.js       # スタバカスタマイズ19項目
│   └── blogUtils.js                      # 読了時間、目次生成
├── public/                               # 静的ファイル
│   ├── author-avatar.png                 # 著者アバター（Gemini生成）
│   └── favicon.ico
├── .env.local                            # 環境変数（Git管理外）
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── package-lock.json
├── AGENTS.md
├── CLAUDE.md
└── README.md
```

## 4.2 主要URL一覧

### 公開ページ
- ホーム: `/`
- マクドナルド: `/calorie-checker-mcdonalds`
- モスバーガー: `/calorie-checker-mos`
- バーガーキング: `/calorie-checker-burgerking`
- ゼッテリア: `/calorie-checker-zetteria`
- スターバックス: `/calorie-checker-starbucks`
- 吉野家: `/calorie-checker-yoshinoya`
- くら寿司: `/calorie-checker-kura`

### カテゴリページ
- ハンバーガー: `/category/burger`
- カフェ: `/category/cafe`
- ピザ: `/category/pizza`
- 牛丼: `/category/gyudon`
- 寿司: `/category/sushi`
- ラーメン: `/category/ramen`
- 定食: `/category/teishoku`

### ブログ・固定ページ
- ブログ一覧: `/blog`
- ブログ詳細: `/blog/[id]`
- ブログカテゴリ: `/blog/category/[slug]`
- 運営者情報: `/about`
- プライバシー: `/privacy`
- お問い合わせ: `/contact`

---

# 第5部: microCMS詳細

## 5.1 メニューAPIスキーマ（menus）

| フィールドID | 表示名 | 種類 | 必須 | 用途 |
|---|---|---|---|---|
| `name` | 商品名 | テキスト | ✓ | メニュー名 |
| `chain` | チェーン店 | セレクト | ✓ | チェーン店名 |
| `category` | カテゴリ | セレクト | ✓ | サブカテゴリ |
| `calorie` | カロリー(kcal) | 数字 | ✓ | カロリー値 |
| `protein` | たんぱく質(g) | 数字 | ✓ | PFC（くら寿司は0） |
| `fat` | 脂質(g) | 数字 | ✓ | PFC（くら寿司は0） |
| `carbohydrate` | 炭水化物(g) | 数字 | ✓ | PFC（くら寿司は0） |
| `isLimited` | 期間限定 | 真偽値 | - | 限定商品判定 |
| `subCategory` | サブカテゴリ | セレクト | - | スタバ用 |
| `hasMilkOption` | ミルク変更可 | 真偽値 | - | スタバ用 |
| `milkVariations` | ミルクJSON | テキストエリア | - | スタバ用 |
| `hasSizeOption` | サイズあり | 真偽値 | - | サイズ展開 |
| `sizeVariations` | サイズJSON | テキストエリア | - | サイズ展開 |
| `allergens` | アレルゲン情報 | テキストエリア | - | くら寿司用JSON |

## 5.2 chainセレクトの全値

- マクドナルド
- スターバックス
- 吉野家
- モスバーガー
- バーガーキング
- ゼッテリア
- くら寿司

## 5.3 categoryセレクトの全値

```
バーガー、サイドメニュー、ドリンク、マックカフェ、季節のおすすめ、
コーヒー、エスプレッソ、フラペチーノ®、ティー｜TEAVANA™、その他、
デザート、ペストリー、サンドイッチ、パッケージフード、
丼、重・特別丼、皿(おかず)、定食、朝定食、から揚げ系、
黒カレー、油そばセット、お子様セット、テイクアウト専門、
サラダ、汁物、トッピング、ご飯・ドレッシング、
ハンバーガー、とびきりバーガー、ソイパティ、モスの菜摘、
モスライス/ホットドッグ、朝モス、モスワイワイセット、低アレルゲン、
ドリンク・スープ、ワッパー、ビーフバーガー、チキンバーガー、
ポークバーガー、フィッシュバーガー、ホットドッグ、コールドドリンク、
フロートドリンク、付属品、ホットドリンク、モーニング、ジュース、
シェーキ、アルコール、店舗限定、定番寿司、限定商品
```

## 5.4 記事APIスキーマ（articles）

| フィールドID | 表示名 | 種類 | 必須 |
|---|---|---|---|
| `title` | タイトル | テキスト | ✓ |
| `slug` | スラッグ | テキスト | - |
| `excerpt` | 抜粋 | テキストエリア | - |
| `content` | 本文 | リッチエディタ | - |
| `thumbnail` | サムネイル画像 | 画像 | - |
| `category` | カテゴリ | セレクト | - |
| `tags` | タグ | テキスト複数値 | - |
| `seoTitle` | SEOタイトル | テキスト | - |
| `seoDescription` | SEO説明 | テキスト | - |
| `blocks` | ブロック | 繰り返し（10種類） | - |

## 5.5 記事カテゴリ

- 期間限定商品レビュー
- 定番メニュー
- 栄養・健康
- お知らせ
- その他

## 5.6 記事のカスタムフィールド10種類

1. heading（H2/H3）
2. richText
3. image
4. cta
5. callout（info/tip/warning/success）
6. table
7. faq
8. quote
9. divider
10. relatedLink

## 5.7 現在の記事

- **記事ID**: `tv_3z7tv8zg`
- **slug**: hello
- **タイトル**: 【ご挨拶】カロリーチェッカーをはじめました — ダイエット経験者が作る外食カロリー計算ツール
- **カテゴリ**: お知らせ
- **タグ**: ご挨拶 / 自己紹介 / ダイエット
- **公開中**

---

# 第6部: 公開中チェーン詳細

## 6.1 公開チェーン一覧（7チェーン）

| チェーン | URL | 件数 | 特徴 |
|---|---|---|---|
| 🍔 マクドナルド | `/calorie-checker-mcdonalds` | 約201 | 最初のチェーン |
| 🍔 モスバーガー | `/calorie-checker-mos` | 106 | 3区分11サブカテゴリ |
| 🍔 バーガーキング | `/calorie-checker-burgerking` | 83 | ワッパー系2サイズ統合 |
| 🍔 ゼッテリア | `/calorie-checker-zetteria` | 100 | 店舗限定バッジ |
| ☕ スターバックス | `/calorie-checker-starbucks` | 約204 | ミルク変更対応 |
| 🍚 吉野家 | `/calorie-checker-yoshinoya` | 116 | 並盛優先 |
| 🍣 くら寿司 | `/calorie-checker-kura` | 303 | **アレルゲン表示対応** |

**合計**: 約1,119件

## 6.2 各チェーンの大区分（GROUPS）構造

すべてのチェーンで「3区分タブ」構造を統一:

### マクドナルド
- 主要メニュー: バーガー、サイドメニュー、マックカフェ、季節のおすすめ
- サイド: なし（バーガーに統合）
- ドリンク: ドリンク

### スターバックス
- 主要メニュー: コーヒー、エスプレッソ、フラペチーノ®
- サイド: ペストリー、サンドイッチ、パッケージフード、デザート
- ドリンク: ティー、その他

### 吉野家
- 主要メニュー: 丼、重・特別丼、定食、朝定食、お子様セット
- サイド: 皿(おかず)、サラダ、汁物、トッピング、ご飯・ドレッシング、テイクアウト専門
- ドリンク: から揚げ系、黒カレー、油そばセット

### モスバーガー
- 主要メニュー: ハンバーガー、とびきりバーガー、ソイパティ、モスの菜摘、モスライス/ホットドッグ、朝モス、モスワイワイセット
- サイド: サイドメニュー、デザート、低アレルゲン
- ドリンク: ドリンク・スープ

### バーガーキング
- 主要メニュー: ワッパー、ビーフバーガー、チキンバーガー、ポークバーガー、フィッシュバーガー、ホットドッグ
- サイド: サイドメニュー、デザート、付属品
- ドリンク: コールドドリンク、フロートドリンク、ホットドリンク

### ゼッテリア
- 主要メニュー: ハンバーガー、モーニング、店舗限定
- サイド: サイドメニュー、デザート
- ドリンク: コーヒー、ジュース、シェーキ、アルコール

### くら寿司
- 主要メニュー: 定番寿司、限定商品
- サイド: サイドメニュー、デザート
- ドリンク: ドリンク

## 6.3 サイズ展開ロジック

各チェーンのデフォルトサイズ:
- **吉野家**: 並盛優先
- **モス**: M優先
- **バーキン**: レギュラー / M / 8ピース優先
- **ゼッテリア**: M優先

### sizeVariations JSON形式
```json
[
  {"name":"S","order":1,"calorie":255,"protein":2.4,"fat":15.9,"carbohydrate":26.3,"salt":0.5},
  {"name":"M","order":2,"calorie":357,"protein":3.4,"fat":22.3,"carbohydrate":36.8,"salt":0.7},
  {"name":"L","order":3,"calorie":459,"protein":4.3,"fat":28.6,"carbohydrate":47.3,"salt":1.1}
]
```

## 6.4 くら寿司のアレルゲン仕様（特殊）

### スキーマ
- `allergens` フィールド（テキストエリア）にJSON保存
- PFC（protein/fat/carbohydrate）は0固定、UI上で非表示

### JSON形式
```json
{
  "contains": ["卵", "小麦", "大豆", "りんご"],
  "sameLine": ["えび", "かに", "さば", "鶏肉", "豚肉", "ゼラチン"]
}
```

### アレルゲン27項目（順序固定）
1. 卵
2. 小麦
3. 乳成分
4. 落花生
5. そば
6. えび
7. かに
8. クルミ
9. いか
10. いくら
11. さけ
12. さば
13. 牛肉
14. 鶏肉
15. 豚肉
16. 大豆
17. オレンジ
18. りんご
19. ゼラチン
20. バナナ
21. キウイ
22. 山芋
23. モモ
24. ごま
25. あわび
26. カシューナッツ
27. 松茸

### PDFアレルゲン抽出方法
pdfplumberを使用してPDFテーブルから自動抽出:
```python
import pdfplumber

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()
        # ●印 → contains, ▲印 → sameLine
```

### UI仕様
- **商品クリック = 即追加・解除**（モーダルなし）
- **アレルゲン警告バナー**を上部に常時表示
- **アレルゲンタグ**（オレンジ色）を商品行に表示
- **「特定アレルゲンなし」**は緑色で表示
- **合計アレルゲン集計**（PC右サイドカード、モバイル展開シート）
- **公式サイトリンク**を多用（責任分散）

---

# 第7部: 共通機能・UI仕様

## 7.1 全チェーン共通機能

### 「選択中のメニュー」機能
- **PC**: 合計カードの下に常時表示、画面追従、内部スクロール
  - CSS: `max-height: calc(100vh - 100px)` + flex + `overflow-y: auto`
- **モバイル**: 下部カードタップで展開シート、削除可能
- **各商品×ボタン**で個別削除、「選択をクリア」で全削除

### パンくずリスト
全チェーンで以下のリンク構造:
- マック/モス/バーキン/ゼッテリア: ホーム / [ハンバーガー](/category/burger) / チェーン名
- スタバ: ホーム / [カフェ](/category/cafe) / スターバックス
- 吉野家: ホーム / [牛丼](/category/gyudon) / 吉野家
- くら寿司: ホーム / [寿司](/category/sushi) / くら寿司

### ページフェードインアニメーション
- `app/globals.css` に `pageFadeInUp` 定義
- アクセシビリティ対応（`prefers-reduced-motion`）
- 各ページ最上位要素に `className="page-fade-in"` を付与
- 適用対象: 全7チェーン + ホーム + カテゴリページ

### UI統一
- 全チェーンで `.backLink` クラス使用
- 「ホームに戻る」ボタン枠デザイン統一
- AnimatedNumberでスムーズなカウントアップ演出

## 7.2 ブログ機能

### ブログ詳細ページ（`/blog/[id]`）
- 目次の自動生成（クリックでスムーズスクロール、見出し2個以上で表示）
- 読み進めバー（ページ上部の細い黒線）
- 読了時間表示（「読了 約X分」）
- フェードインアニメーション
- シェアボタン（X、はてブ、URLコピー）
- 著者プロフィールカード（アバター画像、CHAMANO、自己紹介、aboutリンク）
- 関連記事のカード化（PostCard使用）
- PCサイドバー（目次スクロール追従、著者情報、シェアボタン、900px以上で表示）
- モバイル用目次（900px以下で本文中に表示）
- GlobalNav表示

### ブログ一覧ページ（`/blog`）
- カード型グリッドレイアウト（PC:3列、タブレット:2列、モバイル:1列）
- サムネプレースホルダー（画像なしの場合）
- ページヘッダー（Blog ラベル + 大タイトル + リード文）
- GlobalNav表示

### カテゴリページ（`/blog/category/[slug]`）
- カテゴリ別記事一覧
- 該当記事のみカード型で表示
- 空状態の表示「このカテゴリにはまだ記事がありません。」
- GlobalNav表示

## 7.3 グローバルナビゲーション

- **表示ページ**: ブログ関連のみ（一覧、詳細、カテゴリ）
- **メニュー項目**: Calorie Checker. / 期間限定商品レビュー / 定番メニュー / 栄養・健康 / お問い合わせ
- **スクロール追従**: sticky、半透明 + ぼかし
- アクティブページに下線
- **モバイル**: ハンバーガーメニュー（☰）→ 全画面オーバーレイ
- **配置方法**: layout.jsには組み込まず、各ブログ関連ページに個別に `<GlobalNav />` を配置

## 7.4 ヘッダー使い分け

| ページ | ヘッダー種類 |
|---|---|
| ブログ関連 | GlobalNav |
| トップ・各チェーン | 既存ヘッダー（`brand-name-large`クラス） |

### 注意点
- `className="brand-name-large"` → `Calorie Checker` と書く（CSSで `.` 自動追加）
- `className={styles.logo}` → `Calorie Checker.` と書く（手動でピリオド）

---

# 第8部: 重要な運用ルール

## 8.1 microCMS CSV作成のコツ

1. **BOMなしUTF-8で保存**
   - Python: `encoding="utf-8"`
   - ❌ `utf-8-sig`（BOMありになるのでNG）
2. **列数はスキーマと完全一致**
   - 使わないフィールドも空欄で含める
3. **QUOTE_MINIMALを使う**（Python csv.writer）
4. **コンテンツID列は完全に空**（クォートもなし）
5. **セレクト選択肢は事前にスキーマに登録**
6. **VS Codeで開いてアップロード**（Excel厳禁・文字化け）

### Pythonによる典型的なCSV出力コード
```python
import csv
import json

with open("output.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
    writer.writerow([
        "id", "name", "chain", "category", "calorie", "protein", "fat",
        "carbohydrate", "isLimited", "subCategory", "hasMilkOption",
        "milkVariations", "hasSizeOption", "sizeVariations", "allergens"
    ])
    for item in items:
        writer.writerow([
            "",  # id (空)
            item["name"],
            "チェーン名",
            item["category"],
            item["calorie"],
            # ...
        ])
```

## 8.2 コード関連ルール

- **CSS Modulesは純粋セレクタ必須**
  - ✅ `.foo`、`:global(.foo)`
  - ❌ `[id^="..."]`
- **JSXは複雑な構造を1行にまとめる**（コピペエラー減少）
- **`<a>`タグなど、複数属性は1行記述推奨**
- **ファイル全置き換え時は「Ctrl+A → Delete → 貼り付け」が安全**
  - インクリメンタル修正は重複発生しやすい
- **microCMSのSensitive変数は保存後に空欄表示されるのが正常**

## 8.3 環境ルール

- **改行コード**: Windows CRLF、git警告は無視可
- **ExcelでUTF-8 CSVを開かない**（破壊される）
- **Value Domain DNSの既存レコード削除厳禁**
- **VercelのUse existing Build Cache**: 環境変数変更後はチェックを外す

## 8.4 デプロイフロー

1. ローカルで動作確認（`npm run dev`）
2. `git add .`
3. `git commit -m "メッセージ"`
4. `git push`
5. Vercelが自動でデプロイ（30秒〜2分）
6. https://www.calorie-check.com で動作確認

## 8.5 Windows/Mac 同時運用フロー

### 朝（Windows作業開始）
```bash
cd C:\dev\calorie-checker
git pull
```

### 朝終了（Windows）/ 夜開始（Mac）切り替え時
**Windows側:**
```bash
git add .
git commit -m "Windows作業内容"
git push
```

**Mac側:**
```bash
cd ~/Documents/calorie-checker
git pull
```

### 夜（Mac）終了時
```bash
git add .
git commit -m "Mac作業内容"
git push
```

### ⚠️ 同時運用の注意点
- 同じファイルを同時編集するとコンフリクトが起きる
- 必ず作業開始時に `git pull`
- `.env.local` はGit管理外なので、両方に手動で同じ内容を入れる

---

# 第9部: 設計パターン

## 9.1 新チェーン追加の標準手順

新しいチェーン店を追加する時は、以下の流れで進めます:

### ステップ1: データ準備
1. 公式サイトの栄養成分情報を取得（PDF or HTML）
2. PDFの場合: pdfplumberでテキスト抽出
3. CSV形式に変換（microCMS用フォーマット）
4. サブカテゴリの分類設計

### ステップ2: microCMS準備
1. `chain`セレクトに新チェーン名を追加
2. `category`セレクトに必要な値を追加（既存に合わせる方が楽）
3. 特殊フィールドが必要な場合は追加（例: くら寿司の`allergens`）

### ステップ3: CSVインポート
1. VS CodeでCSV確認
2. microCMS管理画面 → コンテンツ → メニュー → 右上「・・・」→ インポート
3. ファイル選択 → アップロード → 件数確認 → 実行

### ステップ4: コード実装（5ファイル）
1. `lib/chains.js`（更新、新チェーンを`available: true`に）
2. `app/calorie-checker-XXX/page.js`（新規、Server Component）
3. `app/calorie-checker-XXX/XXXClient.js`（新規、Client Component）
4. `app/calorie-checker-XXX/page.module.css`（新規）
5. `app/sitemap.js`（更新、URLを追加）

### ステップ5: 動作確認 & デプロイ
1. `npm run dev` でローカル確認
2. 各機能のテスト
3. `git push` でデプロイ

## 9.2 クライアント実装の共通パターン

```javascript
"use client";

// === 大区分の定義 ===
const GROUPS = [
  { id: "main", label: "主要メニュー", categories: [...] },
  { id: "side", label: "サイド", categories: [...] },
  { id: "drink", label: "ドリンク", categories: [...] },
];

export default function XXXClient({ menus }) {
  const [activeGroup, setActiveGroup] = useState("main");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selections, setSelections] = useState({});
  const [modalState, setModalState] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // ... 各種ロジック ...

  return (
    <div className="page-fade-in">
      {/* トップナビ */}
      {/* ヘッダー（パンくず + タイトル） */}
      {/* 大区分タブ */}
      {/* サブカテゴリチップ */}
      {/* 検索ボックス */}
      {/* メニュー一覧 */}
      {/* PC合計カード（右サイド） */}
      {/* モバイル下部カード */}
      {/* モバイル展開シート */}
      {/* サイズ選択モーダル（あれば） */}
      {/* サイトフッター */}
    </div>
  );
}
```

## 9.3 共通機能の実装パターン

### AnimatedNumber コンポーネント
```javascript
function AnimatedNumber({ value, duration = 280 }) {
  // requestAnimationFrameでスムーズに数値変化
}
```

### fieldMatches ヘルパー
```javascript
function fieldMatches(field, value) {
  if (!field) return false;
  if (Array.isArray(field)) return field.includes(value);
  return field === value;
}
```

### サイズ展開のパース
```javascript
try {
  const variations = JSON.parse(item.sizeVariations);
  // 使用
} catch (e) {
  // フォールバック
}
```

### アレルゲンのパース（くら寿司）
```javascript
function parseAllergens(allergensStr) {
  if (!allergensStr) return { contains: [], sameLine: [] };
  try {
    const obj = JSON.parse(allergensStr);
    return {
      contains: obj.contains || [],
      sameLine: obj.sameLine || [],
    };
  } catch {
    return { contains: [], sameLine: [] };
  }
}
```

---

# 第10部: 実装サンプルコード（ゼッテリアを例に）

このセクションでは、**実際に動いているゼッテリアの3ファイル全文**を掲載します。新チェーン追加時のテンプレートとして使えます。

ゼッテリアを例に選んだ理由:
- ✅ サイズ展開あり（モス・バーキン・吉野家パターン）
- ✅ 店舗限定バッジあり（ZOZOマリン・千里中央・関空）
- ✅ アレルゲンのような特殊機能はない（標準的）
- ✅ ミルク変更のような特殊カスタマイズもない
- ✅ **最も汎用的な「標準テンプレート」**として参考になる

くら寿司の特殊実装（アレルゲン対応）は後段で補足します。

---

## 10.1 page.js（Server Component）

**ファイルパス**: `app/calorie-checker-zetteria/page.js`

役割: microCMSからデータ取得 + SEOメタデータ定義 + Client Componentを呼び出すだけ

```javascript
import { getMenusByChain } from "@/lib/microcms";
import ZetteriaClient from "./ZetteriaClient";

export const metadata = {
  title: "【サイズ別対応】ゼッテリアのカロリー計算ツール | カロリーチェッカー",
  description:
    "ゼッテリア（旧ロッテリア）の全メニュー・サイズ別(S/M/L)のカロリーをすぐに計算。絶品チーズバーガー、ハンバーガー、サイド、ドリンクのカロリーや脂質・たんぱく質・炭水化物を選ぶだけで合計表示。ZOZOマリン・千里中央など店舗限定メニューにも対応。",
  keywords: ["ゼッテリア カロリー", "Zetteria カロリー", "絶品チーズバーガー カロリー", "ロッテリア カロリー", "ZOZOマリン メニュー カロリー"],
};

export const revalidate = 3600;  // 1時間キャッシュ

export default async function ZetteriaPage() {
  const data = await getMenusByChain("ゼッテリア");
  const menus = data.contents;

  return <ZetteriaClient menus={menus} />;
}
```

### 解説

| 項目 | 役割 |
|---|---|
| `metadata` | ページのSEO情報（title, description, keywords） |
| `revalidate = 3600` | ISR（Incremental Static Regeneration）で1時間キャッシュ |
| `getMenusByChain("ゼッテリア")` | microCMSから`chain="ゼッテリア"`のメニュー取得 |
| `<ZetteriaClient menus={menus} />` | Client Componentへデータを渡す |

新チェーン追加時はチェーン名・URL・SEOテキストだけ書き換えればOK。

---

## 10.2 ZetteriaClient.js（Client Component）

**ファイルパス**: `app/calorie-checker-zetteria/ZetteriaClient.js`

役割: 全インタラクティブUIの実装（タブ、検索、選択、合計表示、モバイル展開シート、サイズ選択モーダル）

```javascript
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

// === 大区分の定義 ===
// チェーンごとに「主要メニュー / サイド / ドリンク」の3区分に分類
const GROUPS = [
  {
    id: "main",
    label: "主要メニュー",
    categories: ["ハンバーガー", "モーニング", "店舗限定"],
  },
  {
    id: "side",
    label: "サイド",
    categories: ["サイドメニュー", "デザート"],
  },
  {
    id: "drink",
    label: "ドリンク",
    categories: ["コーヒー", "ジュース", "シェーキ", "アルコール"],
  },
];

// microCMSのフィールドが配列or文字列どちらでもマッチさせるヘルパー
function fieldMatches(field, value) {
  if (!field) return false;
  if (Array.isArray(field)) return field.includes(value);
  return field === value;
}

// 数値のスムーズアニメーション（合計カロリーのカウントアップ用）
function AnimatedNumber({ value, duration = 280 }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const startValue = previousValueRef.current;
    const endValue = value;
    if (startValue === endValue) return;

    const startTime = performance.now();
    let rafId;

    function step(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const current = startValue + (endValue - startValue) * progress;
      setDisplayValue(current);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        previousValueRef.current = endValue;
      }
    }
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);

  const isInteger = Number.isInteger(value);
  return <>{isInteger ? Math.round(displayValue) : displayValue.toFixed(1)}</>;
}

export default function ZetteriaClient({ menus }) {
  // === ステート定義 ===
  const [activeGroup, setActiveGroup] = useState("main");         // 大区分タブ
  const [activeCategory, setActiveCategory] = useState("all");    // サブカテゴリチップ
  const [search, setSearch] = useState("");                       // 検索ボックス
  const [selections, setSelections] = useState({});               // 選択中アイテム { itemId: { sizeName } }
  const [modalState, setModalState] = useState(null);             // サイズ選択モーダル
  const [sheetOpen, setSheetOpen] = useState(false);              // モバイル下部展開シート

  const currentGroup = GROUPS.find((g) => g.id === activeGroup);

  // === メモ化（パフォーマンス最適化） ===

  // 現在の大区分のサブカテゴリ別件数
  const categoryCounts = useMemo(() => {
    const counts = {};
    currentGroup.categories.forEach((cat) => {
      counts[cat] = menus.filter((m) => fieldMatches(m.category, cat)).length;
    });
    counts["all"] = currentGroup.categories.reduce((sum, cat) => sum + (counts[cat] || 0), 0);
    return counts;
  }, [menus, currentGroup]);

  // 大区分ごとの総件数
  const groupCounts = useMemo(() => {
    const counts = {};
    GROUPS.forEach((g) => {
      counts[g.id] = menus.filter((m) =>
        g.categories.some((cat) => fieldMatches(m.category, cat))
      ).length;
    });
    return counts;
  }, [menus]);

  // 表示するメニュー（フィルタリング後）
  const visibleMenus = useMemo(() => {
    return menus
      .filter((m) => {
        if (!currentGroup.categories.some((cat) => fieldMatches(m.category, cat))) {
          return false;
        }
        if (activeCategory !== "all" && !fieldMatches(m.category, activeCategory)) {
          return false;
        }
        return true;
      })
      .filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()));
  }, [menus, currentGroup, activeCategory, search]);

  // 個別商品の栄養素計算（サイズ展開対応）
  const calcItemNutrition = (item, sizeName) => {
    let kcal = item.calorie || 0;
    let protein = item.protein || 0;
    let fat = item.fat || 0;
    let carb = item.carbohydrate || 0;

    if (item.hasSizeOption && sizeName && item.sizeVariations) {
      try {
        const variations = JSON.parse(item.sizeVariations);
        const selected = variations.find((v) => v.name === sizeName);
        if (selected) {
          kcal = Number(selected.calorie) || 0;
          protein = Number(selected.protein) || 0;
          fat = Number(selected.fat) || 0;
          carb = Number(selected.carbohydrate) || 0;
        }
      } catch (e) {
        // JSON パース失敗時は基本値のまま
      }
    }

    return { kcal, protein, fat, carb };
  };

  // 合計栄養素
  const totals = useMemo(() => {
    let calorie = 0, protein = 0, fat = 0, carb = 0;
    let count = 0;

    Object.entries(selections).forEach(([itemId, sel]) => {
      const item = menus.find((m) => m.id === itemId);
      if (!item) return;
      const n = calcItemNutrition(item, sel.sizeName);
      calorie += n.kcal;
      protein += n.protein;
      fat += n.fat;
      carb += n.carb;
      count += 1;
    });

    return {
      calorie: Math.round(calorie),
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      carbohydrate: Math.round(carb * 10) / 10,
      count,
    };
  }, [selections, menus]);

  // 選択中アイテムの詳細リスト（PC右サイド・モバイルシート用）
  const selectedItems = useMemo(() => {
    return Object.entries(selections)
      .map(([itemId, sel]) => {
        const item = menus.find((m) => m.id === itemId);
        if (!item) return null;
        const n = calcItemNutrition(item, sel.sizeName);
        return {
          id: itemId,
          name: item.name,
          sizeName: sel.sizeName,
          calorie: Math.round(n.kcal),
        };
      })
      .filter(Boolean);
  }, [selections, menus]);

  // デフォルトサイズ取得（M優先）
  const getDefaultSize = (item) => {
    if (!item.sizeVariations) return null;
    try {
      const variations = JSON.parse(item.sizeVariations);
      const m = variations.find((v) => v.name === "M");
      if (m) return m.name;
      return variations[0]?.name || null;
    } catch {
      return null;
    }
  };

  // === ハンドラ群 ===

  // 商品クリック時の動作分岐
  const handleItemClick = (item) => {
    if (!item.hasSizeOption) {
      // サイズなし: 即追加/解除
      setSelections((prev) => {
        const next = { ...prev };
        if (next[item.id]) {
          delete next[item.id];
        } else {
          next[item.id] = { sizeName: null };
        }
        return next;
      });
      return;
    }

    // サイズあり: モーダル表示
    if (selections[item.id]) {
      const current = selections[item.id];
      setModalState({
        itemId: item.id,
        tempSizeName: current.sizeName || getDefaultSize(item),
      });
    } else {
      setModalState({
        itemId: item.id,
        tempSizeName: getDefaultSize(item),
      });
    }
  };

  const removeSelection = (itemId) => {
    const next = { ...selections };
    delete next[itemId];
    setSelections(next);
  };

  const clearSelection = () => {
    setSelections({});
    setSheetOpen(false);
  };

  const closeModal = () => setModalState(null);

  const handleSizeSelect = (sizeName) => {
    setModalState((prev) => ({ ...prev, tempSizeName: sizeName }));
  };

  const confirmModal = () => {
    if (!modalState) return;
    setSelections((prev) => ({
      ...prev,
      [modalState.itemId]: {
        sizeName: modalState.tempSizeName,
      },
    }));
    setModalState(null);
  };

  const deleteFromModal = () => {
    if (!modalState) return;
    removeSelection(modalState.itemId);
    setModalState(null);
  };

  // ESCキーでモーダル閉じる
  useEffect(() => {
    if (!modalState) return;
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalState]);

  const modalItem = modalState ? menus.find((m) => m.id === modalState.itemId) : null;
  const isEditing = modalState && selections[modalState.itemId];

  // モーダル用サイズリスト（order順ソート）
  const modalSizes = useMemo(() => {
    if (!modalItem || !modalItem.hasSizeOption || !modalItem.sizeVariations) return [];
    try {
      const arr = JSON.parse(modalItem.sizeVariations);
      return arr.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch {
      return [];
    }
  }, [modalItem]);

  const handleGroupChange = (groupId) => {
    setActiveGroup(groupId);
    setActiveCategory("all");
    setSearch("");
  };

  // === JSX ===
  return (
    <div className="page-fade-in">
      {/* トップナビ（sticky） */}
      <nav className={styles.topnav}>
        <div className={styles.topnavInner}>
          <Link href="/" className="brand-name-large">Calorie Checker</Link>
          <Link href="/" className={styles.backLink}>← ホームに戻る</Link>
        </div>
      </nav>

      <div className={styles.wrapper}>
        {/* ページヘッダー（パンくず + タイトル） */}
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/">ホーム</Link>
            <span className={styles.sep}>/</span>
            <Link href="/category/burger">ハンバーガー</Link>
            <span className={styles.sep}>/</span>ゼッテリア
          </div>
          <h1>ゼッテリア</h1>
          <p className={styles.subtitle}>メニューを選んでサイズを指定。合計カロリーが分かります。</p>
        </header>

        {/* 2カラムレイアウト（PC: 左メニュー + 右サイドバー、モバイル: 1カラム） */}
        <div className={styles.mainLayout}>
          <div className={styles.leftCol}>
            {/* 大区分タブ */}
            <div className={styles.genreBar}>
              {GROUPS.map((g) => (
                <button
                  key={g.id}
                  className={`${styles.genreTab} ${activeGroup === g.id ? styles.active : ""}`}
                  onClick={() => handleGroupChange(g.id)}
                >
                  {g.label}
                  <span className={styles.num}>{groupCounts[g.id] || 0}</span>
                </button>
              ))}
            </div>

            {/* サブカテゴリチップ */}
            <div className={styles.subCatBar}>
              <button
                className={`${styles.subCatChip} ${activeCategory === "all" ? styles.subCatActive : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                すべて <span className={styles.subCatNum}>{categoryCounts["all"] || 0}</span>
              </button>
              {currentGroup.categories.map((cat) => {
                const count = categoryCounts[cat] || 0;
                if (count === 0) return null;
                return (
                  <button
                    key={cat}
                    className={`${styles.subCatChip} ${activeCategory === cat ? styles.subCatActive : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat} <span className={styles.subCatNum}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* 検索ボックス */}
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="7" cy="7" r="5" />
                <path d="m11 11 3 3" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="メニュー名で検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* メニュー一覧 */}
            <div className={styles.menuStack}>
              {visibleMenus.length === 0 ? (
                <div className={styles.emptyState}>該当するメニューがありません</div>
              ) : (
                visibleMenus.map((item) => {
                  const sel = selections[item.id];
                  const isSelected = !!sel;
                  const itemNutri = isSelected
                    ? calcItemNutrition(item, sel.sizeName)
                    : { kcal: item.calorie, protein: item.protein, fat: item.fat, carb: item.carbohydrate };

                  return (
                    <div
                      key={item.id}
                      className={`${styles.menuRow} ${isSelected ? styles.selected : ""}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className={styles.check}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3 8 3.5 3.5L13 5" />
                        </svg>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.name}>{item.name}</div>
                        <div className={styles.pfc}>
                          たんぱく質 {Math.round(itemNutri.protein * 10) / 10}g · 脂質 {Math.round(itemNutri.fat * 10) / 10}g · 炭水化物 {Math.round(itemNutri.carb * 10) / 10}g
                        </div>
                        {isSelected && sel.sizeName && (
                          <span className={styles.sizeBadge}>サイズ: {sel.sizeName}</span>
                        )}
                        {item.hasSizeOption && !isSelected && (
                          <span className={styles.sizeHint}>サイズ選択あり</span>
                        )}
                        {item.isLimited && (
                          <span className={styles.limitedBadge}>店舗限定</span>
                        )}
                      </div>
                      <div className={styles.right}>
                        <div className={styles.kcal}>
                          {Math.round(itemNutri.kcal)}<span className={styles.u}>kcal</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ページ最下部の補足 */}
            <div className={styles.pageFooter}>
              数値は <a href="https://www.zetteria.jp/" target="_blank" rel="noopener">ゼッテリア公式サイト</a> の成分情報を参照した参考値です。<br />
              本サービスはゼッテリアと提携・関係ありません。最新かつ正確な情報は公式サイトをご確認ください。
            </div>
          </div>

          {/* PC右サイドバー（合計カード + 選択中リスト） */}
          <aside className={styles.rightCol}>
            <div className={styles.totalCardPc}>
              <div className={styles.label}>合計</div>
              <div className={styles.countLine}>{totals.count} 品 選択中</div>
              <div className={styles.kcalBig}>
                <AnimatedNumber value={totals.calorie} />
                <span className={styles.u}>kcal</span>
              </div>
              <hr className={styles.divider} />
              <div className={styles.nutriList}>
                <div className={styles.nutriRow}>
                  <span className={styles.nutriName}>たんぱく質</span>
                  <span className={styles.nutriValue}>
                    <AnimatedNumber value={totals.protein} />
                    <span className={styles.u}>g</span>
                  </span>
                </div>
                <div className={styles.nutriRow}>
                  <span className={styles.nutriName}>脂質</span>
                  <span className={styles.nutriValue}>
                    <AnimatedNumber value={totals.fat} />
                    <span className={styles.u}>g</span>
                  </span>
                </div>
                <div className={styles.nutriRow}>
                  <span className={styles.nutriName}>炭水化物</span>
                  <span className={styles.nutriValue}>
                    <AnimatedNumber value={totals.carbohydrate} />
                    <span className={styles.u}>g</span>
                  </span>
                </div>
              </div>
              <button className={styles.clearBtnPc} onClick={clearSelection} disabled={totals.count === 0}>
                選択をクリア
              </button>
            </div>

            {/* 選択中のメニュー一覧（スクロール可能） */}
            {selectedItems.length > 0 && (
              <div className={styles.selectedListCard}>
                <div className={styles.selectedListLabel}>選択中のメニュー</div>
                <div className={styles.selectedList}>
                  {selectedItems.map((it) => (
                    <div key={it.id} className={styles.selectedItem}>
                      <div className={styles.selectedItemInfo}>
                        <div className={styles.selectedItemName}>{it.name}</div>
                        <div className={styles.selectedItemMeta}>
                          {it.sizeName && <span>{it.sizeName} · </span>}
                          <span>{it.calorie} kcal</span>
                        </div>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeSelection(it.id)}
                        aria-label={`${it.name}を解除`}
                      >
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="m4 4 8 8M12 4l-8 8" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* モバイル下部の合計カード（タップで展開シート） */}
      <div className={styles.totalCardMobile}>
        <button
          className={styles.mobileExpandBtn}
          onClick={() => setSheetOpen(true)}
          disabled={totals.count === 0}
        >
          <div className={styles.mobileTop}>
            <div className={styles.mobileMeta}>
              <div className={styles.mobileLabel}>合計</div>
              <div className={styles.mobileCount}>
                {totals.count} 品 選択中{totals.count > 0 && <span className={styles.expandHint}> · タップで詳細</span>}
              </div>
            </div>
            <div className={styles.kcalNum}>
              <AnimatedNumber value={totals.calorie} />
              <span className={styles.u}>kcal</span>
            </div>
          </div>
          <div className={styles.nutrients}>
            <div className={styles.nCell}>
              <div className={styles.nL}>たんぱく質</div>
              <div className={styles.nV}>
                <AnimatedNumber value={totals.protein} />
                <span className={styles.u}>g</span>
              </div>
            </div>
            <div className={styles.nCell}>
              <div className={styles.nL}>脂質</div>
              <div className={styles.nV}>
                <AnimatedNumber value={totals.fat} />
                <span className={styles.u}>g</span>
              </div>
            </div>
            <div className={styles.nCell}>
              <div className={styles.nL}>炭水化物</div>
              <div className={styles.nV}>
                <AnimatedNumber value={totals.carbohydrate} />
                <span className={styles.u}>g</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* モバイル展開シート（下部からスライドアップ） */}
      {sheetOpen && (
        <div className={styles.sheetOverlay} onClick={() => setSheetOpen(false)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHeader}>
              <div className={styles.sheetTitle}>選択中のメニュー</div>
              <button className={styles.sheetCloseBtn} onClick={() => setSheetOpen(false)} aria-label="閉じる">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="m4 4 8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            <div className={styles.sheetBody}>
              {selectedItems.length === 0 ? (
                <div className={styles.sheetEmpty}>選択されたメニューはありません</div>
              ) : (
                selectedItems.map((it) => (
                  <div key={it.id} className={styles.sheetItem}>
                    <div className={styles.sheetItemInfo}>
                      <div className={styles.sheetItemName}>{it.name}</div>
                      <div className={styles.sheetItemMeta}>
                        {it.sizeName && <span>{it.sizeName} · </span>}
                        <span>{it.calorie} kcal</span>
                      </div>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeSelection(it.id)}
                      aria-label={`${it.name}を解除`}
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="m4 4 8 8M12 4l-8 8" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className={styles.sheetFooter}>
              <div className={styles.sheetTotalLine}>
                <span>合計</span>
                <span className={styles.sheetTotalKcal}>
                  <AnimatedNumber value={totals.calorie} />
                  <span className={styles.u}>kcal</span>
                </span>
              </div>
              <div className={styles.sheetNutri}>
                <div>たんぱく質 <strong><AnimatedNumber value={totals.protein} /></strong>g</div>
                <div>脂質 <strong><AnimatedNumber value={totals.fat} /></strong>g</div>
                <div>炭水化物 <strong><AnimatedNumber value={totals.carbohydrate} /></strong>g</div>
              </div>
              <button className={styles.sheetClearBtn} onClick={clearSelection} disabled={totals.count === 0}>
                選択をクリア
              </button>
            </div>
          </div>
        </div>
      )}

      {/* サイズ選択モーダル */}
      {modalState && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{modalItem.name}</div>
              <div className={styles.modalSubtitle}>サイズを選択してください</div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.sizeList}>
                {modalSizes.map((s) => (
                  <div
                    key={s.name}
                    className={`${styles.sizeOption} ${modalState.tempSizeName === s.name ? styles.selected : ''}`}
                    onClick={() => handleSizeSelect(s.name)}
                  >
                    <span className={styles.sizeName}>{s.name}</span>
                    <span className={styles.sizeKcal}>{s.calorie} kcal</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              {isEditing && (
                <button className={styles.modalBtn} onClick={deleteFromModal} style={{ marginRight: 'auto', color: '#c33', borderColor: '#e7baba' }}>
                  選択を解除
                </button>
              )}
              <button className={styles.modalBtn} onClick={closeModal}>キャンセル</button>
              <button className={styles.modalBtnPrimary} onClick={confirmModal}>完了</button>
            </div>
          </div>
        </div>
      )}

      {/* サイトフッター */}
      <footer className={styles.siteFooter}>
        <div className={styles.siteFooterInner}>
          <div>
            <p className={styles.siteFooterText}>
              <span className={styles.brandName}>Calorie Checker</span>
              数値は各社の公式情報を参照した参考値です。本サービスは各チェーン店と提携・関係ありません。
            </p>
          </div>
          <div className={styles.siteFooterLinks}>
            <Link href="/blog">ブログ</Link>
            <Link href="/about">運営者情報</Link>
            <Link href="/privacy">プライバシーポリシー</Link>
            <Link href="/contact">お問い合わせ</Link>
          </div>
        </div>
        <div className={styles.siteFooterCopy}>
          © 2026 CHAMANO. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
```

### コードの構造解説

| ブロック | 役割 |
|---|---|
| **ステート定義** | 6つのstate（タブ、カテゴリ、検索、選択、モーダル、シート） |
| **useMemo** | フィルタリングと集計をパフォーマンス最適化 |
| **calcItemNutrition** | サイズ展開を加味した栄養素計算（重要ロジック） |
| **handleItemClick** | サイズなし=即追加、サイズあり=モーダル表示の分岐 |
| **JSX** | ナビ→ヘッダー→2カラム→モバイルカード→モーダル→フッターの順 |

---

## 10.3 page.module.css（スタイル定義）

**ファイルパス**: `app/calorie-checker-zetteria/page.module.css`

役割: 全UIのスタイル定義。レスポンシブ対応（PC 900px以上 / モバイル 900px以下）。

```css
/* ========== 共通レイアウト ========== */
.topnav {
  border-bottom: 1px solid var(--line);
  padding: 14px 0;
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 50;
}
.topnavInner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.backLink {
  font-size: 12px;
  color: var(--muted);
  border: 1px solid var(--line-strong);
  padding: 5px 12px;
  border-radius: 4px;
  transition: all 0.15s;
}
.backLink:hover {
  border-color: var(--ink);
  color: var(--ink);
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px 0;
}
@media (max-width: 760px) {
  .wrapper { padding: 20px 20px 0; }
}

.header {
  margin-bottom: 28px;
}
.breadcrumb {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.breadcrumb a { color: var(--muted); }
.breadcrumb a:hover { color: var(--ink); }
.sep { margin: 0 6px; opacity: 0.5; }
.header h1 {
  font-weight: 700;
  font-size: 32px;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.subtitle {
  font-size: 14px;
  color: var(--muted);
}
@media (max-width: 760px) {
  .header h1 { font-size: 26px; }
  .subtitle { font-size: 13px; }
}

/* PC 2カラム / モバイル 1カラム */
.mainLayout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 40px;
  align-items: start;
  padding-bottom: 80px;
}
@media (max-width: 900px) {
  .mainLayout {
    grid-template-columns: 1fr;
    gap: 0;
    padding-bottom: 200px;
  }
}
.leftCol { min-width: 0; }

/* ========== 大区分タブ ========== */
.genreBar {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--line);
  margin-bottom: 18px;
  overflow-x: auto;
  scrollbar-width: none;
}
.genreBar::-webkit-scrollbar { display: none; }
.genreTab {
  flex: 0 0 auto;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 10px 16px 12px;
  font-family: inherit;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  color: var(--muted);
  white-space: nowrap;
  transition: all 0.15s;
  margin-bottom: -1px;
}
.genreTab:first-child { padding-left: 0; }
.genreTab:hover { color: var(--ink); }
.genreTab.active {
  color: var(--ink);
  font-weight: 600;
  border-bottom-color: var(--ink);
}
.num {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  margin-left: 5px;
  color: var(--muted);
  font-weight: 400;
}

/* ========== サブカテゴリチップ ========== */
.subCatBar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}
.subCatChip {
  background: var(--bg);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  padding: 5px 12px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.12s;
  white-space: nowrap;
}
.subCatChip:hover {
  border-color: var(--ink);
  color: var(--ink);
}
.subCatActive {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--bg);
}
.subCatActive .subCatNum {
  color: rgba(255, 255, 255, 0.7);
}
.subCatNum {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  margin-left: 4px;
  opacity: 0.7;
  font-weight: 400;
}

/* ========== 検索ボックス ========== */
.searchWrap {
  margin-bottom: 16px;
  position: relative;
}
.searchInput {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  padding: 10px 14px 10px 36px;
  font-family: inherit;
  font-size: 13px;
  color: var(--ink);
  transition: border-color 0.15s;
}
.searchInput::placeholder { color: var(--muted); }
.searchInput:focus { outline: none; border-color: var(--ink); }
.searchIcon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--muted);
}

/* ========== 商品一覧 ========== */
.menuStack {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line);
}
.menuRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 4px;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  gap: 14px;
  transition: background 0.12s;
}
.menuRow:hover { background: var(--bg-alt); }
.menuRow.selected { background: var(--accent-soft); }

.check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid var(--line-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.check svg {
  width: 12px;
  height: 12px;
  color: var(--bg);
  opacity: 0;
}
.menuRow.selected .check {
  background: var(--ink);
  border-color: var(--ink);
}
.menuRow.selected .check svg { opacity: 1; }

.sizeBadge {
  font-size: 10px;
  color: var(--muted);
  background: var(--bg-alt);
  padding: 2px 6px;
  border-radius: 3px;
  margin-top: 4px;
  display: inline-block;
}
.sizeHint {
  font-size: 10px;
  color: var(--muted);
  background: var(--bg-alt);
  padding: 2px 6px;
  border-radius: 3px;
  margin-top: 4px;
  display: inline-block;
  border: 1px dashed var(--line-strong);
}
.limitedBadge {
  font-size: 10px;
  color: #b8741b;
  background: #fef3e0;
  padding: 2px 6px;
  border-radius: 3px;
  margin-top: 4px;
  margin-left: 4px;
  display: inline-block;
  font-weight: 600;
}

.emptyState {
  text-align: center;
  padding: 40px 20px;
  color: var(--muted);
  font-size: 13px;
}

.info { flex: 1; min-width: 0; }
.name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 4px;
}
.pfc {
  font-size: 11px;
  color: var(--muted);
  font-family: 'Inter', sans-serif;
}
.right { text-align: right; flex-shrink: 0; }
.kcal {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
}
.u {
  font-size: 10px;
  color: var(--muted);
  margin-left: 2px;
  font-weight: 400;
}

.pageFooter {
  margin-top: 28px;
  font-size: 11px;
  color: var(--muted);
  line-height: 1.7;
  padding: 16px 0;
  border-top: 1px solid var(--line);
}
.pageFooter a {
  color: var(--muted);
  text-decoration: underline;
}
.pageFooter a:hover { color: var(--ink); }

/* ========== PC右サイドバー（合計カード） ========== */
.rightCol {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
@media (max-width: 900px) {
  .rightCol { display: none; }
}

.totalCardPc {
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  padding: 20px 18px 18px;
  background: var(--bg);
}
.label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 4px;
}
.countLine {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 8px;
}
.kcalBig {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}
.kcalBig .u { font-size: 12px; margin-left: 4px; }
.divider {
  border: none;
  border-top: 1px solid var(--line);
  margin: 12px 0 14px;
}
.nutriList {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.nutriRow {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 12px;
}
.nutriName { color: var(--muted); }
.nutriValue {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}
.clearBtnPc {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--line-strong);
  border-radius: 4px;
  padding: 8px;
  font-family: inherit;
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
}
.clearBtnPc:hover:not(:disabled) {
  border-color: var(--ink);
  color: var(--ink);
}
.clearBtnPc:disabled { opacity: 0.4; cursor: not-allowed; }

/* ========== PC選択中メニューカード ========== */
.selectedListCard {
  margin-top: 0;
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  padding: 16px 14px 14px;
  background: var(--bg);
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.selectedListLabel {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 10px;
}
.selectedList {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  margin: 0 -4px;
  padding: 0 4px;
}
.selectedList::-webkit-scrollbar { width: 6px; }
.selectedList::-webkit-scrollbar-thumb {
  background: var(--line-strong);
  border-radius: 3px;
}
.selectedList::-webkit-scrollbar-track { background: transparent; }
.selectedItem {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}
.selectedItem:last-child { border-bottom: none; padding-bottom: 0; }
.selectedItem:first-child { padding-top: 0; }
.selectedItemInfo { flex: 1; min-width: 0; }
.selectedItemName {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.35;
  margin-bottom: 2px;
  word-break: break-word;
}
.selectedItemMeta {
  font-size: 10px;
  color: var(--muted);
  font-family: 'Inter', sans-serif;
}
.removeBtn {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--line-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  color: var(--muted);
  transition: all 0.15s;
  padding: 0;
}
.removeBtn:hover {
  border-color: #c33;
  color: #c33;
}
.removeBtn svg { width: 10px; height: 10px; }

/* ========== モバイル下部固定カード ========== */
.totalCardMobile { display: none; }
@media (max-width: 900px) {
  .totalCardMobile {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--bg);
    border-top: 1px solid var(--line-strong);
    padding: 12px 16px 14px;
    z-index: 40;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
  }
}
.mobileExpandBtn {
  display: block;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  font-family: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.mobileExpandBtn:disabled { cursor: default; }
.expandHint { opacity: 0.7; }
.mobileTop {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}
.mobileMeta { display: flex; flex-direction: column; }
.mobileLabel {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  line-height: 1;
}
.mobileCount {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}
.kcalNum {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 26px;
  line-height: 1;
  letter-spacing: -0.02em;
}
.nutrients {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 8px;
  align-items: center;
}
.nCell {
  border-left: 1px solid var(--line);
  padding-left: 8px;
}
.nCell:first-child { border-left: none; padding-left: 0; }
.nL {
  font-size: 9px;
  color: var(--muted);
  margin-bottom: 2px;
}
.nV {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 13px;
}
.nV .u { font-size: 9px; }

/* ========== モバイル展開シート ========== */
.sheetOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 90;
  animation: fadeIn 0.15s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.sheet {
  background: var(--bg);
  width: 100%;
  max-width: 600px;
  border-radius: 14px 14px 0 0;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUpSheet 0.22s ease;
}
@keyframes slideUpSheet {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.sheetHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--line);
}
.sheetTitle { font-size: 14px; font-weight: 600; }
.sheetCloseBtn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--line-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--muted);
  padding: 0;
}
.sheetCloseBtn svg { width: 12px; height: 12px; }
.sheetBody {
  padding: 8px 18px;
  overflow-y: auto;
  flex: 1;
}
.sheetEmpty {
  text-align: center;
  padding: 28px 16px;
  color: var(--muted);
  font-size: 13px;
}
.sheetItem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}
.sheetItem:last-child { border-bottom: none; }
.sheetItemInfo { flex: 1; min-width: 0; }
.sheetItemName {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 2px;
  word-break: break-word;
}
.sheetItemMeta {
  font-size: 11px;
  color: var(--muted);
  font-family: 'Inter', sans-serif;
}
.sheetFooter {
  padding: 14px 18px 18px;
  border-top: 1px solid var(--line);
  background: var(--bg-alt);
}
.sheetTotalLine {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 13px;
  margin-bottom: 8px;
}
.sheetTotalKcal {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 20px;
}
.sheetNutri {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: var(--muted);
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.sheetNutri strong {
  font-family: 'Inter', sans-serif;
  color: var(--ink);
  font-weight: 600;
  margin: 0 2px;
}
.sheetClearBtn {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--line-strong);
  border-radius: 4px;
  padding: 10px;
  font-family: inherit;
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
}
.sheetClearBtn:hover:not(:disabled) {
  border-color: var(--ink);
  color: var(--ink);
}
.sheetClearBtn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ========== モーダル共通（サイズ選択用） ========== */
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  animation: fadeIn 0.15s ease;
}
.modal {
  background: var(--bg);
  border-radius: 10px;
  width: 100%;
  max-width: 420px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.2s ease;
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.modalHeader {
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--line);
}
.modalTitle {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.4;
}
.modalSubtitle {
  font-size: 11px;
  color: var(--muted);
}
.modalBody {
  padding: 16px 20px;
  overflow-y: auto;
  flex: 1;
}
.modalFooter {
  padding: 14px 20px;
  border-top: 1px solid var(--line);
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.modalBtn {
  background: var(--bg);
  border: 1px solid var(--line-strong);
  border-radius: 4px;
  padding: 8px 14px;
  font-family: inherit;
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
}
.modalBtn:hover {
  border-color: var(--ink);
  color: var(--ink);
}
.modalBtnPrimary {
  background: var(--ink);
  border: 1px solid var(--ink);
  border-radius: 4px;
  padding: 8px 18px;
  font-family: inherit;
  font-size: 12px;
  color: var(--bg);
  cursor: pointer;
  transition: all 0.15s;
}
.modalBtnPrimary:hover {
  opacity: 0.85;
  border-color: var(--ink);
}

/* サイズ選択リスト */
.sizeList {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sizeOption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.12s;
  background: var(--bg);
}
.sizeOption:hover {
  border-color: var(--ink);
}
.sizeOption.selected {
  border-color: var(--ink);
  background: var(--accent-soft);
}
.sizeName {
  font-size: 14px;
  font-weight: 500;
}
.sizeKcal {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 13px;
  color: var(--muted);
}
.sizeOption.selected .sizeKcal {
  color: var(--ink);
}

/* ========== サイトフッター ========== */
.siteFooter {
  background: var(--bg);
  border-top: 1px solid var(--line);
  padding: 32px 0;
  margin-top: 40px;
}
@media (max-width: 900px) {
  .siteFooter { margin-bottom: 140px; }
}
.siteFooterInner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}
.siteFooterText {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.7;
  max-width: 540px;
}
.brandName {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  color: var(--ink);
  margin-right: 8px;
}
.siteFooterLinks {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.siteFooterLinks a {
  font-size: 11px;
  color: var(--muted);
  transition: color 0.15s;
}
.siteFooterLinks a:hover { color: var(--ink); }
.siteFooterCopy {
  max-width: 1200px;
  margin: 16px auto 0;
  padding: 0 24px;
  font-size: 10px;
  color: var(--muted);
  font-family: 'Inter', sans-serif;
}
```

### CSSの構造解説

| セクション | 役割 |
|---|---|
| **共通レイアウト** | topnav、wrapper、header、breadcrumb、mainLayout |
| **大区分タブ** | `.genreBar`、`.genreTab`、`.active`（下線スタイル） |
| **サブカテゴリチップ** | `.subCatChip`、`.subCatActive`（黒背景白文字） |
| **検索ボックス** | `.searchWrap`、`.searchInput`、`.searchIcon` |
| **商品一覧** | `.menuStack`、`.menuRow`、`.check`、`.selected`、`.limitedBadge` |
| **PC右サイドバー** | `.rightCol`（sticky）、`.totalCardPc`、`.selectedListCard` |
| **モバイル下部カード** | `.totalCardMobile`（fixed bottom）、`.mobileExpandBtn` |
| **モバイル展開シート** | `.sheetOverlay`、`.sheet`、slideUpSheetアニメーション |
| **モーダル** | `.modalOverlay`、`.modal`、`.sizeList`、`.sizeOption` |
| **サイトフッター** | `.siteFooter`、`.siteFooterInner` |

### CSS変数（`app/globals.css` で定義）

```css
:root {
  --ink: #1a1a1a;            /* メインの文字色 */
  --bg: #ffffff;             /* 背景色 */
  --bg-alt: #f7f7f5;         /* 補助背景色（ホバー時等） */
  --muted: #888888;          /* 控えめな文字色 */
  --line: #ececec;           /* 細い境界線 */
  --line-strong: #d0d0d0;    /* 強めの境界線 */
  --accent-soft: #fff8e6;    /* アクセントカラー（選択時等） */
}
```

---

## 10.4 デザインの基本方針

### カラーパレット
- **メイン**: モノクロ（#1a1a1a 〜 #ffffff のグレースケール）
- **アクセント**: 黄系（#fff8e6、限定バッジは #fef3e0）
- **エラー/解除**: 赤系（#c33）

### タイポグラフィ
- **数字専用フォント**: Inter（合計カロリー、栄養素値などすべての数値）
- **見出し用**: Space Grotesk（Calorie Checker.ロゴ）
- **本文用**: Noto Sans JP（OS標準フォントスタック）

### レスポンシブブレイクポイント
| 幅 | レイアウト |
|---|---|
| 900px以上 | PC: 2カラム（左メニュー + 右280pxサイドバー） |
| 900px未満 | モバイル: 1カラム、下部固定カード |
| 760px未満 | コンパクト調整（タイトルサイズ等） |

### アニメーション
- ホバー: `transition: all 0.15s`（控えめで素早く）
- モーダル: フェードイン + スライドアップ（0.15-0.2s）
- 数値変化: `requestAnimationFrame` で滑らかに（AnimatedNumber）
- ページ全体: `pageFadeInUp`（globals.cssで定義）

### 操作感の設計思想
- **クリック可能領域は広めに**（行全体）
- **状態変化は視覚的にすぐ分かるように**（背景色変化、チェックマーク）
- **モバイルでも片手で操作可能**（下部固定カード）
- **削除動作は2タップで確実に**（×ボタン or 「選択をクリア」）

---

## 10.5 くら寿司の特殊実装（補足）

くら寿司は標準テンプレートに加えて、以下の特殊実装があります:

### 1. PFC非表示
```javascript
// PFC（たんぱく質・脂質・炭水化物）の表示部分を削除
// 代わりにアレルゲン情報を表示
```

### 2. アレルゲンパース
```javascript
function parseAllergens(allergensStr) {
  if (!allergensStr) return { contains: [], sameLine: [] };
  try {
    const obj = JSON.parse(allergensStr);
    return {
      contains: obj.contains || [],   // ●印 含む
      sameLine: obj.sameLine || [],   // ▲印 同ライン
    };
  } catch {
    return { contains: [], sameLine: [] };
  }
}
```

### 3. 商品行にアレルゲンタグ表示
```jsx
<div className={styles.allergenLine}>
  {containsCount === 0 ? (
    <span className={styles.allergenNone}>特定アレルゲンなし</span>
  ) : (
    <>
      <span className={styles.allergenLabel}>含む:</span>
      {allergens.contains.slice(0, 5).map((a) => (
        <span key={a} className={styles.allergenTag}>{a}</span>
      ))}
      {allergens.contains.length > 5 && (
        <span className={styles.allergenMore}>+{allergens.contains.length - 5}</span>
      )}
    </>
  )}
</div>
```

### 4. 警告バナー
```jsx
<div className={styles.allergyNotice}>
  <strong>⚠️ アレルゲン情報について</strong>
  本サービスのアレルゲン情報は参考値です。アレルギーをお持ちの方は、必ず
  <a href="https://www.kurasushi.co.jp/" target="_blank" rel="noopener">くら寿司公式サイト</a>
  の最新情報をご確認ください。
</div>
```

### 5. 合計アレルゲン集計
```javascript
const selectedAllergens = useMemo(() => {
  const allContains = new Set();
  const allSameLine = new Set();
  menus.forEach((m) => {
    if (selectedIds.has(m.id)) {
      const a = parseAllergens(m.allergens);
      a.contains.forEach((x) => allContains.add(x));
      a.sameLine.forEach((x) => allSameLine.add(x));
    }
  });
  return {
    contains: Array.from(allContains).sort(),
    sameLine: Array.from(allSameLine).sort(),
  };
}, [selectedIds, menus]);
```

### 6. 専用CSS（page.module.css に追加）
```css
.allergyNotice {
  background: #fff8e6;
  border: 1px solid #f4d97a;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 12px;
  line-height: 1.6;
  color: #6b4e00;
  margin-bottom: 28px;
}
.allergenTag {
  display: inline-block;
  font-size: 10px;
  color: #b8741b;
  background: #fef3e0;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 500;
}
.allergenTagSub {
  display: inline-block;
  font-size: 10px;
  color: var(--muted);
  background: var(--bg-alt);
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px dashed var(--line-strong);
}
.allergenNone {
  font-size: 11px;
  color: #2a7a4c;
  font-weight: 500;
}
```

---

## 10.6 スタバの特殊実装（補足）

スタバはミルク変更機能があり、以下の仕組み:

### 1. ミルク変更の19項目（`lib/starbucks-customizations.js`）
```javascript
export const MILK_VARIATIONS = [
  { name: "ホワイトモカシロップ", calorieDiff: 75 },
  { name: "オーツミルク", calorieDiff: 20 },
  // ... 19項目
];
```

### 2. milkVariations フィールドの形式（microCMS）
```json
[
  {"name": "通常", "calorie": 145},
  {"name": "オーツミルク", "calorie": 165},
  {"name": "豆乳", "calorie": 130}
]
```

### 3. クライアント側で動的計算
```javascript
if (item.hasMilkOption && milkName && item.milkVariations) {
  const variations = JSON.parse(item.milkVariations);
  const selected = variations.find((v) => v.name === milkName);
  if (selected) kcal = selected.calorie;
}
```

---

## 10.7 新チェーン追加時のチェックリスト

新しいチェーンを追加するときは、このテンプレートをコピーして以下を変更:

### page.js の変更箇所
- [ ] `metadata.title` のチェーン名
- [ ] `metadata.description` の説明文
- [ ] `metadata.keywords` のキーワード
- [ ] `getMenusByChain("チェーン名")` のチェーン名
- [ ] `import 〇〇Client from "./〇〇Client"` のコンポーネント名

### XXXClient.js の変更箇所
- [ ] コンポーネント名 `export default function 〇〇Client`
- [ ] `GROUPS` 定数のサブカテゴリ構成
- [ ] パンくず `<Link href="/category/〇〇">〇〇</Link>`
- [ ] ページタイトル `<h1>〇〇</h1>`
- [ ] subtitle 文言
- [ ] `getDefaultSize` のデフォルトサイズ（M / 並盛 / レギュラー 等）
- [ ] フッターの公式URL `https://www.〇〇.〇〇/`
- [ ] 限定バッジの文言（「店舗限定」「限定」など）

### page.module.css の変更箇所
- [ ] 基本的にそのままコピーでOK
- [ ] 特殊バッジが必要な場合のみ追加（例: `.limitedBadge`）

### lib/chains.js の変更箇所
- [ ] 該当カテゴリの `chains` 配列に追加
- [ ] `href: "/calorie-checker-〇〇"`、`available: true`

### app/sitemap.js の変更箇所
- [ ] `staticPages` 配列に新URLを追加

---

# 第11部: SEO・分析

## 11.1 実装済みSEO対策

- メタデータ最適化（全ページ）
- `app/sitemap.js`（15+ページ自動生成）
- `app/robots.js`
- Google Search Console登録（DNSドメインプロパティ）
- サイトマップ送信完了
- トップページ即インデックス済み
- 主要4URLインデックスリクエスト済み
- 各チェーンページに適切な`title`、`description`、`keywords`

## 11.2 Google Analytics

- **トラッキングID**: G-015Z1SVFSW
- **環境変数**: `NEXT_PUBLIC_GA_ID`
- **読み込み**: `app/layout.js` で全ページに自動適用

---

# 第12部: 完成済み作業一覧

## 12.1 インフラ・基盤
- [x] ドメイン取得（calorie-check.com）
- [x] Vercel ホスティング設定
- [x] microCMS セットアップ
- [x] GitHub リポジトリ設定
- [x] Google Analytics 4 設定
- [x] Search Console 登録・サイトマップ送信

## 12.2 サイト構造
- [x] ホームページ（7カテゴリカード化）
- [x] カテゴリ詳細ページ（7カテゴリ）
- [x] About / Privacy / Contact ページ
- [x] ブログ一覧 / 詳細 / カテゴリページ
- [x] GlobalNav 実装

## 12.3 チェーン追加（公開順）
- [x] マクドナルド（201件）
- [x] スターバックス（204件、ミルク変更対応）
- [x] 吉野家（116件、サイズ展開対応）
- [x] モスバーガー（106件）
- [x] バーガーキング（83件）
- [x] ゼッテリア（100件、店舗限定対応）
- [x] くら寿司（303件、アレルゲン対応）

## 12.4 機能拡張
- [x] サイズ展開機能（hasSizeOption / sizeVariations）
- [x] ミルク変更機能（スタバ用）
- [x] 選択中メニュー機能（PC + モバイル）
- [x] アレルゲン表示機能（くら寿司）
- [x] パンくずリストのカテゴリリンク化
- [x] ページフェードインアニメーション
- [x] UI統一（全7チェーン）

## 12.5 ブログ機能
- [x] 目次自動生成
- [x] 読み進めバー
- [x] 読了時間表示
- [x] シェアボタン
- [x] 著者プロフィールカード
- [x] 関連記事カード
- [x] PCサイドバー
- [x] モバイル目次
- [x] カテゴリ別ページ

## 12.6 開発環境
- [x] Windows環境セットアップ完了
- [ ] Mac環境セットアップ（夜にやる）

---

# 第13部: 今後の作業

## 13.1 直近（夜にやる）

### Mac環境セットアップ完了
1. Macでターミナル起動
2. `cd ~/Documents/calorie-checker`
3. VS Code起動: `open -a "Visual Studio Code" .`
4. `.env.local` に中身を貼り付け（3行）:
   ```
   MICROCMS_SERVICE_DOMAIN=calorie-checker
   MICROCMS_API_KEY=（Windows側のキー）
   NEXT_PUBLIC_GA_ID=G-015Z1SVFSW
   ```
5. `Cmd + S` で保存
6. ターミナルで `npm run dev`
7. http://localhost:3000 で動作確認

## 13.2 優先度高（候補）

### 新店舗追加（ユーザーの次回作業予定）
店舗を選んで追加。候補:

#### 牛丼系（吉野家パターン流用）
- すき家
- 松屋
- なか卯

#### 寿司系（くら寿司パターン流用、アレルゲン対応）
- スシロー
- はま寿司
- かっぱ寿司

#### カフェ系（スタバパターン流用、ミルク変更）
- ドトール
- タリーズ
- コメダ珈琲店
- サンマルクカフェ

#### バーガー系
- フレッシュネスバーガー

#### ピザ系（新規）
- ピザハット
- ドミノ・ピザ
- ピザーラ

#### ラーメン系（新規）
- 一蘭
- 幸楽苑

#### 定食系（新規）
- やよい軒
- 大戸屋
- ガスト

### 記事執筆
記事候補:
- マクドナルドで太らない食べ方
- スタバの低カロリーカスタマイズ徹底ガイド
- 外食ダイエット5選
- 吉野家ダイエットメニュー比較
- くら寿司でアレルギー対応する方法

### 既存記事のサムネ画像追加
- 現在の記事「ご挨拶」にサムネを追加するとカード一覧が映える

## 13.3 優先度中

- ブログ検索機能
- タグページ
- GA4 ダッシュボードのカスタマイズ
- 各チェーンページのOGP画像

## 13.4 優先度低

- コメント機能（Disqus等）
- ユーザー登録機能
- お気に入りメニュー機能

---

# 第14部: トラブルシューティング

## 14.1 開発環境エラー

| エラー | 原因 | 解決策 |
|---|---|---|
| `Port 3000 is in use` | 別のNext.jsが動いている | 他のターミナルを閉じる または `npm run dev -- -p 3001` |
| `MICROCMS_API_KEY is not defined` | `.env.local` 未保存 or サーバー再起動が必要 | 保存して再起動（Ctrl+C → npm run dev） |
| メニューが0件 | APIキー間違い | `.env.local`を見直して再コピー |
| `Cannot find module ...` | パッケージ不足 | `npm install` を再実行 |
| `command not found: code`（Mac） | VS Codeのコマンド未登録 | `Cmd+Shift+P` → "Shell Command: Install 'code' command in PATH" |

## 14.2 デプロイエラー

| エラー | 原因 | 解決策 |
|---|---|---|
| 404 NOT_FOUND | ビルド失敗 or ドメイン設定 | Vercel直URLで確認、ビルドキャッシュ無しで再デプロイ |
| ビルド失敗 | コード文法エラー | `npm run build` でローカル確認 |
| 環境変数エラー | Vercel設定漏れ | Settings → Environment Variables を確認 |

## 14.3 Git関連

| エラー | 原因 | 解決策 |
|---|---|---|
| `Permission denied` | GitHub認証失敗 | HTTPS URLでcloneし直す、Personal Access Token使用 |
| マージコンフリクト | 同じファイルを両OSで編集 | `git pull --rebase`、手動マージ |
| `LF will be replaced by CRLF` | 改行コード違い | 無視してOK |

## 14.4 microCMS関連

| エラー | 原因 | 解決策 |
|---|---|---|
| CSVインポート失敗 | BOMあり、列数違い | BOMなしUTF-8、列をスキーマに合わせる |
| 文字化け | Excelで開いた | VS Codeで開く、Excelは使わない |
| 文字化け（インポート時） | UTF-8 with BOM | `encoding="utf-8"` で再保存 |
| 必須フィールドエラー | 値がNULL | スキーマで必須を外す or 値を入れる |

## 14.5 セキュリティ対応

### APIキー漏洩時の対応
1. microCMS管理画面でキーをリジェネレート
2. Windows `.env.local` 更新
3. Mac `.env.local` 更新
4. Vercel環境変数更新
5. 再デプロイ
6. 本番動作確認

### APIキー権限の確認
理想は「読み取り専用」:
- ✅ GET（取得）: オン
- ❌ POST（作成）: オフ
- ❌ PUT/PATCH（更新）: オフ
- ❌ DELETE（削除）: オフ

---

# 第15部: コマンド早見表

## 15.1 開発コマンド

```bash
npm run dev          # 開発サーバー起動（http://localhost:3000）
npm run build        # 本番ビルド
npm run start        # 本番モード起動
npm run lint         # ESLintチェック
```

## 15.2 Gitコマンド

```bash
# 基本フロー
git status              # 変更ファイル確認
git add .               # 全ファイルをステージング
git commit -m "..."     # コミット
git push                # GitHubへプッシュ
git pull                # GitHubから最新取得

# 詳細
git log --oneline       # コミット履歴
git diff                # 変更内容確認
git checkout -- file    # ファイルの変更を取り消し
git reset HEAD file     # ステージング取り消し

# ブランチ
git branch              # ブランチ一覧
git branch -a           # リモート含む
git switch [branch]     # ブランチ切り替え
```

## 15.3 npmコマンド

```bash
npm install             # パッケージ全インストール
npm install [pkg]       # 個別追加
npm install -D [pkg]    # 開発依存
npm update              # 更新
npm outdated            # 更新可能パッケージ確認
npm audit               # セキュリティチェック
npm audit fix           # 自動修正
```

## 15.4 Mac固有

```bash
open .                              # Finderで現在フォルダ開く
open -a "Visual Studio Code" .      # VS Codeで開く
pwd                                 # 現在の場所
ls -la                              # 隠しファイル含む一覧
```

## 15.5 Windows固有（PowerShell）

```powershell
Get-ChildItem        # ls 相当
Set-Location         # cd 相当
Get-Location         # pwd 相当
explorer .           # エクスプローラーで開く
code .               # VS Codeで開く
```

---

# 第16部: 重要URL・リンク集

## 16.1 本番・開発URL

| 種類 | URL |
|---|---|
| 本番サイト | https://www.calorie-check.com |
| ローカル | http://localhost:3000 |
| Vercel管理 | https://vercel.com/dashboard |
| GitHub | https://github.com/chama-dai4/calorie-checker |
| microCMS | https://calorie-checker.microcms.io/ |
| サイトマップ | https://www.calorie-check.com/sitemap.xml |

## 16.2 公式サイト(データ参照元)

| チェーン | URL |
|---|---|
| マクドナルド | https://www.mcdonalds.co.jp/ |
| スターバックス | https://www.starbucks.co.jp/ |
| 吉野家 | https://www.yoshinoya.com/ |
| モスバーガー | https://www.mos.jp/ |
| バーガーキング | https://burgerking.co.jp/ |
| ゼッテリア | https://www.zetteria.jp/ |
| くら寿司 | https://www.kurasushi.co.jp/ |

## 16.3 開発ツール・ドキュメント

| ツール | URL |
|---|---|
| Next.js Docs | https://nextjs.org/docs |
| microCMS Docs | https://document.microcms.io/ |
| Vercel Docs | https://vercel.com/docs |
| Value Domain | https://www.value-domain.com/ |
| Google Analytics | https://analytics.google.com/ |
| Search Console | https://search.google.com/search-console |

---

# 第17部: 新しいAIチャットでの作業再開ガイド

## 17.1 新セッションでの最初のメッセージ例

```
カロリーチェッカー（calorie-check.com）の運営者CHAMANOです。
Next.js + microCMS でサイトを構築・運営しています。
以下の引継ぎドキュメントを読んで、続きの作業をお願いします。

[このドキュメントを添付 or 貼り付け]

今日やりたいこと: 〇〇
```

## 17.2 確認すべき事項

新セッション開始時に確認:
1. **localhostが動いているか**: `npm run dev` で確認
2. **デプロイ済みか**: 本番URLで動作確認
3. **今日のタスク**: ユーザーから明確に伝える
4. **環境**: Windows or Mac

## 17.3 セッション継続時のコンテキスト復元

過去のセッションでやったことを思い出したい場合:
- このドキュメントの **第11部「完成済み作業一覧」** を参照
- 各チェーンの実装パターンは **第9部「設計パターン」** を参照
- トラブル時は **第13部「トラブルシューティング」** を参照

---

# 第18部: メモ・補足情報

## 18.1 Claude（AIアシスタント）使用について

- **プラン**: Maxプラン使用中
- **Claudeプロジェクト**: 「カロリーチェッカー運営」
- **執筆ガイド**: プロジェクトに登録済み

## 18.2 過去の引継ぎドキュメント

履歴として残しておくと便利:
- `カロリーチェッカー_引き継ぎ.md`（v1: 404エラー時）
- `カロリーチェッカー_引き継ぎ2.md`（v2: ブログ機能強化後）
- `handover-document-v2.md`（v3: 吉野家・モス追加後）
- `handover-mac-setup-v1.md`（v4: Mac環境セットアップ）
- `MASTER-handover-v1.md`（v5: 統合版）
- `MASTER-handover-v2.md`（v6: コード例追加、このドキュメント）

## 18.3 開発スタイルのコツ

- **長時間集中せず、適度に休憩**（効率落ちる）
- **「分からない」「教えて」と素直に伝える**（プログラミング初心者でも全然OK）
- **一気にやらず、ステップごとに確認**（コピペミス防止）
- **VS Codeのコピペは「Ctrl+A → Delete → 貼り付け」**（部分編集は重複しやすい）
- **コードの全置き換え時はファイル単位で**（手戻り少ない）

## 18.4 重要な気づき・学び

### microCMS活用のコツ
- スキーマは最小限から始めて、必要に応じて拡張
- セレクトフィールドは配列で保存される
- CSVインポートが超強力（一括登録可能）
- Sensitive変数は保存後に空欄表示されるのが正常

### Next.js App Routerのポイント
- Server Component（page.js）でデータ取得
- Client Component（XXXClient.js）でインタラクティブUI
- `revalidate = 3600` で1時間キャッシュ
- メタデータは `export const metadata`

### Vercelデプロイのコツ
- GitHub pushで自動デプロイ
- 環境変数変更後はビルドキャッシュ無しで再デプロイ
- Webhook設定でmicroCMS更新時も自動デプロイ

---

# 第19部: 進捗サマリー

## 19.1 数値で見る現状

| 項目 | 数値 |
|---|---|
| 公開チェーン数 | **7** |
| 登録メニュー総数 | **約1,119件** |
| 公開記事数 | 1 |
| カテゴリページ | 7 |
| 主要URL | 14+ |

## 19.2 マイルストーン

- ✅ **Phase 1**: 基盤構築（ドメイン取得、Next.js + microCMS）
- ✅ **Phase 2**: 最初のチェーン公開（マクドナルド）
- ✅ **Phase 3**: ブログ機能フル実装
- ✅ **Phase 4**: スタバ追加（カスタマイズ対応）
- ✅ **Phase 5**: 牛丼・バーガー系拡張（吉野家・モス・バーキン・ゼッテリア）
- ✅ **Phase 6**: 寿司系開始 + アレルゲン機能（くら寿司）
- 🔄 **Phase 7**: Mac開発環境構築（進行中）
- ⏳ **Phase 8**: さらに店舗追加 + 記事執筆強化（次回）

---

**🎉 ここまでお疲れさまでした！**

このドキュメントがあれば、いつでもどこでもプロジェクトを再開できます。
気軽に「これやりたい」「これ確認したい」と AI に伝えてくださいね 🙌

---

**作成者**: CHAMANO & Claude
**最終更新**: 2026年5月15日
**バージョン**: v1（統合版）


---

# 📌 v3 追記内容（2026年5月18日 - スタバ大規模リニューアル後）

このセクションは、v2 作成後の **2026年5月15-18日の超ロングセッション** で得られた知見を追加するものです。
スタバページのサイズ × ミルク × 温度の完全対応、PATCH API活用、業務フロー詳細などを含みます。

---

# 第20部: スタバページ完全データ対応（Phase 7）

## 20.1 達成したこと（2026/5/15-18 セッション）

### 完了内容

| 項目 | 値 |
|---|---|
| 対象商品数 | **153品** |
| サイズ対応 | 70品が複数サイズ選択可能に |
| 温度対応 | 商品名で自動判定（ホット/アイス） |
| ミルク × サイズ × 温度の完全データ | **2,518行のCSV から生成** |
| カロリー計算 | 公式値そのまま（近似計算なし） |
| 最大バリエ数 | 32件/商品（ほうじ茶クラシックティー ラテ） |
| 平均バリエ数 | 9.8件/商品 |
| データ精度 | **日本一精度の高いスタバカロリーサイト** ⭐ |

### 新フィールド `tempSizeVariations`

microCMS menu API に追加（テキストエリア、JSON文字列）:

```json
[
  {"temperature":"ホット","size":"ショート","milk":"ミルク","calorie":162,"protein":...},
  {"temperature":"ホット","size":"ショート","milk":"低脂肪タイプ","calorie":151,...},
  {"temperature":"ホット","size":"ショート","milk":"無脂肪乳","calorie":141,...},
  ...全28パターン（コーヒー フラペチーノの場合）
]
```

### UI設計（3ステップモーダル）

```
[Step 1: サイズ選択]   (hasSizeOption=trueのみ)
    ↓
[Step 2: ミルク選択]   (hasMilkOption=trueのみ、サイズ選択を反映)
    ↓
[Step 3: カスタマイズ]
    ↓
完了
```

各ステップで「← 前へ」ボタンで戻れる。フード商品はモーダルなしで即選択。

## 20.2 ミルク表記の正規化ルール

CSV内の半角カナ混在を、microCMSでは下記のように正規化:

| CSV表記 | 正規化後 |
|---|---|
| 変更しない | ミルク |
| 低脂肪ﾀｲﾌﾟに変更 | 低脂肪タイプ |
| 無脂肪乳に変更 | 無脂肪乳 |
| 豆乳(調製豆乳)に変更 | 豆乳(調製豆乳) |
| ｱｰﾓﾝﾄﾞﾐﾙｸに変更 | アーモンドミルク |
| ｵｰﾂﾐﾙｸに変更 | オーツミルク |
| ﾌﾞﾚﾍﾞに変更 | ブレベ |
| ｽﾀｰﾊﾞｯｸｽﾐﾙｸに変更 | スターバックスミルク |

ミルク表示順: ミルク → 低脂肪タイプ → 無脂肪乳 → 豆乳(調製豆乳) → アーモンドミルク → オーツミルク → スターバックスミルク → ブレベ

サイズ表示順: ショート → トール → グランデ → ベンティ

---

# 第21部: PATCH API 活用方法（microCMS）

## 21.1 PATCH APIの基本

microCMSではコンテンツの部分更新が可能。**Hobbyプランでも使える**:

```
PATCH https://calorie-checker.microcms.io/api/v1/menu/{content_id}
Headers:
  X-MICROCMS-API-KEY: <key>
  Content-Type: application/json
Body:
  {"tempSizeVariations": "[...]"}  ← 更新したいフィールドだけ
```

### 重要な仕様
- ✅ 既存の milkVariations 等は**保持**される（指定したフィールドのみ更新）
- ✅ Hobbyプランでも利用可能
- ✅ レスポンス: HTTP 200 / 422 / 404 / 401

### Hobbyプランの制約
- ❌ CSVインポート: 全件置き換えか追加のみ（差分更新不可）
- ❌ CSVエクスポート: 不可（Teamプラン以上）
- ❌ APIキー: 1個のみ
- ❌ 過去バージョン復元: 不可（Business以上）

→ 結論: **大量データの部分更新は PATCH API 一択** 🎯

## 21.2 PATCH API用スクリプト（恒久保管推奨）

`scripts/update_starbucks.py` として開発した汎用スクリプト。

### 安全機能
- ✅ getpass方式でAPIキー入力（画面非表示、履歴に残らない）
- ✅ ドライランモード（DRY_RUN = True）で事前確認
- ✅ 本番実行前に `yes` 入力で最終確認
- ✅ 5秒カウントダウン中に Ctrl+C で中断可能
- ✅ 連続3件失敗で自動停止
- ✅ レート制限対策（0.5秒間隔、1秒2件のペース）

### 使い方
```bash
# 1. patch_data.json と update_starbucks.py を同じディレクトリに配置
# 2. 実行
python update_starbucks.py
# 3. プロンプトでAPIキーを貼り付け（画面に表示されない）
# 4. yes と入力 → 5秒カウント → 処理開始
```

### 構造
- `scripts/update_starbucks.py` - 本体スクリプト（汎用）
- `scripts/patch_data.json` - 商品ごとの更新データ

データ構造の例:
```json
[
  {
    "id": "microCMSのコンテンツID",
    "name": "商品名",
    "old_calorie": 234,
    "new_calorie": 234,
    "patch_body": {
      "calorie": 234,
      "tempSizeVariations": "[...JSON文字列...]"
    }
  }
]
```

## 21.3 PATCH権限の運用ルール 🛡️

```
通常運用: GET のみ ON
↓
データ一括更新時のみ: PATCH を ON にする
↓
作業完了後: 必ず PATCH を OFF に戻す
```

**理由**:
- 通常運用にPATCH不要（本番Vercelは GET のみ使用）
- 万一APIキーが漏洩した時、書き換え攻撃を防げる
- 最小権限の原則

## 21.4 やってはいけないこと

- ❌ APIキーをスクリプトにハードコード
- ❌ APIキーを環境変数で指定（コマンド履歴に残る）
- ❌ スクショ・コードブロックにAPIキーを含める
- ✅ getpass方式で実行時に入力（このスクリプトの方式）

---

# 第22部: 業務フロー詳細（ユーザー作業ガイド）

## 22.1 CHAMANO の作業スタイル

### 基本情報
- **一人称**: 僕（記事・UI文言で使用）
- **二人称**: みなさん
- **プログラミング経験**: 初心者
- **得意**: 手動でのデータ収集（地道で正確）
- **苦手**: コマンドライン操作（特にPowerShellの環境変数記法）
- **環境**: Windows（日中、`C:\dev\calorie-checker`）+ Mac（夜、`/Users/tamanodaiki/Documents/calorie-checker`）

### コミュニケーションスタイル
- スクリーンショット添付が多い
- ターミナル出力をそのまま貼り付け
- 簡潔なメッセージで進める
- 段階リニューアルを好む（一気に変えない）

## 22.2 AIアシスタント（Claude）への依頼方法

### 効果的な伝え方の例

❌ あまり良くない例:
> 「スタバページを直したい」

✅ 良い例:
> 「コーヒー フラペチーノ ショートを選んだ時、ミルク画面でも172キロカロリーで表示されてほしい。今は185になってる」

→ **具体的な現象** + **期待する動作** をセットで伝えると、的確な修正に繋がる。

### ファイル受け渡し
- **ドラッグ&ドロップ**: 最も確実（PowerShellのmove系コマンドは避ける）
- エクスプローラー/Finder経由が安全
- コマンドで一発移動するときは、`$env:USERPROFILE`（PowerShell）等の環境変数記法に注意

### コード提供形式
- 会話内コード ＋ ファイル添付の両方
- 全文ペーストOK（重要なコードは要素しないこと）
- AIが直接修正できるよう、複雑なファイルは一発で書き換え版を渡す

## 22.3 大規模変更時の標準フロー

### 段階的な進め方（CHAMANO哲学）

1. **データ収集**: CHAMANO が手動で公式サイトからCSV作成（最も時間がかかる、最も正確）
2. **AI側で分析**: マッチング、データ整形、JSON化
3. **ドライラン**: 必ず DRY_RUN = True で確認
4. **小サンプル検証**: 5〜10件で動作確認
5. **本番実行**: 全件処理
6. **目視確認**: microCMS管理画面で1〜2品チェック
7. **ローカル確認**: `npm run dev` で動作確認
8. **デプロイ**: `git push` で本番反映
9. **PATCH権限OFF**: セキュリティ復旧

各ステップで「次に進む?」と確認を入れる。**疲れている時の大規模変更は避ける**。

## 22.4 セキュリティルール（漏洩防止）

### 過去の漏洩事例（2026/5/15 セッション）
- スクショ撮影時に APIキーが映り込んだ（2回）
- コマンドライン引数で渡したキーがログに残った

### 対策（学習済み）
- ✅ getpass方式でAPIキー入力
- ✅ 漏洩確認後、即座に microCMS でキー無効化＆再発行
- ✅ Vercel環境変数も同時更新
- ✅ Vercel管理画面で再デプロイ

### APIキー再発行時の手順
```
1. microCMS → 権限管理 → APIキー → 既存キー削除
2. 新APIキー発行（GET+PATCH権限）
3. Vercelダッシュボード → Settings → Environment Variables → MICROCMS_API_KEY 更新
4. Deployments → 最新の右側 ⋯ → Redeploy
5. ローカルの .env.local も更新
6. 作業完了後、PATCH権限を OFF に戻す
```

---

# 第23部: 環境固有の知見

## 23.1 PowerShell使用時の注意

### 環境変数記法
- ❌ `%USERPROFILE%`（cmd風、PowerShellでは展開されない）
- ✅ `$env:USERPROFILE`（PowerShell風）

### ファイルエンコーディング
- ❌ `Set-Content`（デフォルトでShift-JIS的なエンコーディングに変換される）
- ✅ `Set-Content -Encoding UTF8`
- ✅ `[System.IO.File]::WriteAllText("file.py", $text, [System.Text.Encoding]::UTF8)`

### Pythonの実行
- Windowsでは `python`（`python3` ではない）
- Macでは `python3` を推奨

### よくあるエラー
```
SyntaxError: Non-UTF-8 code starting with '\xe3' in file ...
```
→ Set-Content でエンコーディング崩れ。`-Encoding UTF8` を指定するか、ファイル再ダウンロードで解決。

## 23.2 Mac使用時の注意

### git push し忘れ問題
Mac で作業 → git commit はしたが push してない → Windows で続きを始めると、変更が見えない。

**対策**:
- 作業終了時は必ず `git status` で確認
- 切り替え時は必ず `git pull` を最初に実行
- 万一忘れた場合、Mac を再起動して push できる、もしくは同じ作業を Windows で再現

### Mac側の文体設定
- bash → zsh への移行推奨（標準だが任意）
- 標準で Python 3 利用可能（`python3` コマンド）
- `getpass` モジュール標準搭載

---

# 第24部: スタバページのコード詳細

## 24.1 重要なヘルパー関数（StarbucksClient.js）

### `detectTempFromName(name)`
商品名から温度を判定:
- 「○○（ホット）」→ "ホット"
- 「○○（アイス）」→ "アイス"
- どちらでもなければ null

### `parseTempSizeVariations(jsonStr)`
microCMS の文字列を JSON 配列にパース。失敗時は `[]`。

### `getAvailableSizes(item)`
商品の `tempSizeVariations` から選択可能なサイズリストを取得。
SIZE_ORDER の順序で返す。

### `getAvailableMilks(item)`
同じく、選択可能なミルクリストを取得。
MILK_ORDER の順序で返す。

### `findVariation(item, size, temp, milk)`
サイズ × 温度 × ミルクの組み合わせで該当バリエーションを検索。

**フォールバック順序**:
1. 完全一致
2. size + temp 一致（milk 無視）
3. size のみ一致
4. milk のみ一致
5. 最初の1件

## 24.2 カロリー計算ロジック

```javascript
const calcItemNutrition = (item, selectedSize, milkType, customizations) => {
  // 1) tempSizeVariations から直接取得（近似なし）
  const fixedTemp = detectTempFromName(item.name);
  const targetMilk = milkType || (item.hasMilkOption ? 'ミルク' : null);
  const targetSize = selectedSize || (item.hasSizeOption ? 'トール' : null);
  const variation = findVariation(item, targetSize, fixedTemp, targetMilk);
  
  let { kcal, protein, fat, carb } = variation || { ... };
  
  // 2) カスタマイズ加算（サイズ無関係）
  if (customizations) {
    Object.entries(customizations).forEach(([id, count]) => {
      const c = STARBUCKS_CUSTOMIZATIONS.find(x => x.id === id);
      if (c) kcal += c.kcal * count;
      // protein, fat, carb も同様
    });
  }
  return { kcal, protein, fat, carb };
};
```

## 24.3 モーダルのステップ管理

`modalState.step` が以下のいずれか:
- `'size'`: サイズ選択
- `'milk'`: ミルク選択
- `'custom'`: カスタマイズ

ステップ遷移:
- 開始: hasSizeOption あれば 'size'、なければ 'milk'、それもなければ 'custom'
- 「次へ」: size → milk → custom
- 「← 戻る」: custom → milk → size

## 24.4 決定ボタンのスタイル

ボタンのタップしやすさを向上:
```javascript
const bigBtnStyle = {
  padding: '14px 28px',
  fontSize: '16px',
  fontWeight: '600',
  minWidth: '120px',
  minHeight: '52px',
};
```

→ 標準的なボタン（〜40px）より 30% 程度大きく、モバイル含めて押しやすい。

---

# 第25部: 今後の改善候補

## 25.1 残課題（明日以降）

### 短期
1. ✅ 本番デプロイ（git push）
2. ✅ microCMS APIキーから PATCH権限を OFF に戻す
3. 「バニラアイスクリーム」を microCMS に新規追加（CSVにあるがmicroCMS未登録）
4. Family Friendly Store 2品の対応検討

### 中期
1. 他チェーン（モス、バーキン）へのサイズ対応波及
2. アレルゲン情報をスタバにも追加（くら寿司方式を参考に）
3. カフェイン量フィルター（CSVには取得済み）
4. ホット/アイス商品の自動マージ（現在は別商品扱い）

### 長期
1. PWA化（オフライン対応）
2. ユーザーお気に入り機能
3. 食事日記機能
4. 他カフェチェーン（ドトール、タリーズ、コメダ）

## 25.2 スキップ済み（将来検討）

### `starbucksSizeNote` キー
dictionary.js に注記キーが残っているが、UI上不要（サイズ選択UI自体が実装されたため）。
削除しても問題なし、害もないので残置。

### html lang動的化
過去に試行（Phase 9）したが、Next.js 16 の middleware 仕様の問題で諦め。
現状: `<html lang="ja">` 固定。

---

# 第26部: 第19部の更新（進捗サマリー v3）

## 26.1 数値で見る現状（2026/5/18 時点）

| 項目 | 数値（v2時点） | 数値（v3時点） |
|---|---|---|
| 公開チェーン数 | 7 | **8**（フレッシュネスバーガー追加） |
| 登録メニュー総数 | 約1,119件 | **約1,203件**（FB 84品追加） |
| スタバの精度 | サイズ未対応 | **完全データ対応** ⭐ |
| 公開記事数 | 1 | 1 |

## 26.2 マイルストーン

- ✅ **Phase 1**: 基盤構築
- ✅ **Phase 2**: 最初のチェーン公開（マクドナルド）
- ✅ **Phase 3**: ブログ機能フル実装
- ✅ **Phase 4**: スタバ追加（カスタマイズ対応）
- ✅ **Phase 5**: 牛丼・バーガー系拡張（吉野家・モス・バーキン・ゼッテリア）
- ✅ **Phase 6**: 寿司系開始 + アレルゲン機能（くら寿司）
- ✅ **Phase 7-A**: Mac開発環境構築（完了）
- ✅ **Phase 7-B**: フレッシュネスバーガー追加
- ✅ **Phase 7-C**: スタバページ完全データ対応（2026/5/15-18）⭐
- ⏳ **Phase 8**: さらに店舗追加 + 他チェーンのサイズ対応波及

---

# 第27部: AIアシスタント引き継ぎ用 即時参照ガイド

## 27.1 新しいチャットで作業再開する時のテンプレート

```
このプロジェクトは「カロリーチェッカー（calorie-check.com）」です。
過去の引き継ぎ書（MASTER-handover-v3.md）を読んでから作業をお願いします。

今やりたいこと：
[ここに具体的な依頼内容]
```

## 27.2 直近作業の状態（2026/5/18 時点）

### microCMSの状態
- スタバ 204品 のうち 153品 に `tempSizeVariations` フィールドが完全データで設定済み
- フード49品、Family Friendly 2品 は対象外
- APIキーは PATCH権限が ON のまま（要確認&OFFに戻す）

### コードの状態
- Windows側: 最新（StarbucksClient.js v3、dictionary.js に backToSize あり）
- Mac側: コミットしたが push し忘れ → 明朝 git pull で同期予定
- 本番（Vercel）: まだ Phase 6 状態（git push 後に Phase 7 反映）

### 次のアクション候補
1. 本番デプロイ（git push origin main）
2. 他チェーンへのサイズ対応波及
3. 新商品追加（バニラアイスクリーム等）

## 27.3 「ハマりやすいポイント」事前案内

### スタバページ関連
- カスタマイズ対応は STARBUCKS_CUSTOMIZATIONS（lib/starbucks-customizations.js）を編集
- サイズバリエは tempSizeVariations のJSON文字列
- 計算ロジックは `calcItemNutrition()` 関数

### 環境差
- Windows: `python`、`$env:VAR_NAME`、PowerShell では Set-Content にエンコーディング指定
- Mac: `python3`、bash/zsh、特に問題なし

### microCMS
- Hobbyプランは APIキー1個まで
- 過去バージョン復元なし → 一度更新したら戻せない
- CSVインポートは「全件置き換え」か「追加のみ」、差分更新は PATCH API で

### よくある質問への即答
- 「ミルクの種類が違う」→ MILK_NORMALIZE で正規化
- 「ホット/アイス商品が別になってる」→ 商品名に「（ホット）」「（アイス）」付き、自動判定
- 「カロリー合わない」→ calcItemNutrition でデータ取得経路を確認

---

# 第28部: セッション履歴ログ

## 28.1 2026年5月15-18日 超ロングセッション

### 達成内容（時系列）
1. dictionary.js の構文エラー修正
2. Mac環境への移行作業
3. スタバページのサイズ対応を計画
4. CHAMANO による CSV データ収集（手動、178品ベース → 2,518行の完全データ）
5. microCMS に `tempSizeVariations` フィールド追加
6. PATCH スクリプト作成（v1: 環境変数版）
7. APIキー漏洩（1回目）→ 無効化＆再発行
8. PATCH スクリプト v2作成（getpass方式）
9. APIキー漏洩（2回目）→ 無効化＆再発行
10. microCMS 153品 PATCH 一括更新（1回目: 簡易データ）
11. StarbucksClient.js を3ステップモーダル化
12. 動作確認→デプロイ準備
13. CHAMANO が完全データCSV を取得（2,518行）
14. patch_data.json を完全データで再生成
15. microCMS 153品 PATCH 一括更新（2回目: 完全データ）
16. StarbucksClient.js を完全データ対応版に書き換え
17. 動作確認OK → 本引き継ぎ書 v3 作成

### 学んだこと
- **段階リニューアルの価値**: 1度に大きく変えず、段階で進めることでリスク低減
- **APIキーセキュリティ**: getpass方式が圧倒的に安全（プロンプトで非表示入力）
- **PATCH APIの強み**: Hobbyプランでも部分更新可能、既存データを保持しつつフィールド追加
- **手動データ収集の価値**: AIがクローラーを書けない代わりに、CHAMANO の正確な手作業が日本一の精度を作った

---

**v3 引き継ぎ書 終了**

---

**作成者**: CHAMANO & Claude
**最終更新**: 2026年5月18日
**バージョン**: v3（スタバ完全データ対応 + 業務フロー詳細追加）

---

# 🎯 統合版エピローグ

## このマニュアルの位置づけ

このドキュメント `MASTER-handover-merged-v6.md` は、以下の2ファイルを統合したものです:

| 元ファイル | 内容 | 当ドキュメント内の位置 |
|---|---|---|
| `MASTER-handover-v3.md`(2026/5/15-18 作成) | プロジェクトの完全リファレンス・実装サンプル・業務フロー | **第II部** |
| `MASTER-handover-v5.md`(2026/5/18 夜 作成) | SEO Phase完了・ブログブロック大幅拡張・Phase B/C残タスク | **第I部** |

## 章番号の重複について

第I部(v5由来)と第II部(v3由来)で章番号「1〜」がそれぞれ独立して付いています。  
区別する際は **「第I部 1.」「第II部 第1部」** のように呼称してください。

## 次セッション開始時の推奨フロー

```
1. ✅ この統合版 v6 を最初に読み込む
2. ✅ 第I部のサマリーで「現在地」と「次のタスク候補」を把握
3. ✅ 必要に応じて第II部から該当セクションを参照
   - 新店舗追加 → 第II部 第9部「設計パターン」+ 第10部「実装サンプル」
   - microCMS変更 → 第II部 第5部「microCMS詳細」
   - SEO関連  → 第I部 2.「SEOの現状」+ 第II部 第11部
   - ブログ記事執筆 → 第I部 3.「ブログブロックシステム」+ 別紙ガイド
4. ✅ CHAMANO哲学「段階的に進める」を維持
```

## 既知の重複・補足

統合過程で v3 と v5 の間に以下の情報の重複・更新があります:

- **チェーン数**: v3本文の「7チェーン」表記 → v3 第26部および v5 で「8チェーン(フレッシュネスバーガー追加)」に更新済み
- **メニュー総数**: v3本文「約1,119件」 → v3 第26部および v5 で「約1,203件」に更新済み
- **html lang動的化**: v3 第25部では「Phase 9 諦め」と記載 → **v5 で proxy.js 方式で完了** に更新
- **公開記事数**: v3「1記事」 → v5 時点では Phase A/C-1/C-2 対応のため、新ブロックを使った記事が今後追加予定

**最新の事実は常に第I部(v5由来)を優先してください。** 第II部は実装方法・運用ルールの詳細リファレンスとして参照する位置づけです。

---

**統合版 終了**

**統合作成**: CHAMANO & Claude  
**統合日**: 2026年5月18日  
**統合バージョン**: MASTER-handover-merged-v6 (v3 + v5)

🚀 このマニュアル1本で、いつでもどこでもプロジェクトを再開できます。CHAMANOさん、引き続きよろしくお願いします!
