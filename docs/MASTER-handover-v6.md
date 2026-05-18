# 🍔 カロリーチェッカー MASTER 引継書 v6(2026年5月18日 最新版)

**運営者**: CHAMANO  
**サイト**: https://www.calorie-check.com  
**GitHub**: https://github.com/chama-dai4/calorie-checker  
**作業フォルダ**: C:\dev\calorie-checker  
**ブログ自動投稿ツール**: C:\Users\玉野大樹\Documents\calorie-checker-blog-uploader\

---

## 🎯 v6 アップデート概要(2026/5/18 本日完了)

### 完了済み:超絶ボリューム
- ✅ SEO Phase(8店舗構造化データ、Rich Results合格)
- ✅ Phase A: callout 32パターン(8色×4スタイル)
- ✅ Phase C-1: calorieCard 27パターン(3スタイル×9カラー)
- ✅ Phase C-2: compareCard 多パターン(3スタイル×11カラー)
- ✅ **Node.js 自動投稿システム構築**(NEW! ⭐)
- ✅ 引継書 v6 + ブログ執筆ガイド v1

### 残タスク
- ⏳ Phase C-3: stepGuide(設計済み・次セッションで即実装可)
- ⏳ Phase C-4: checklist(設計済み・次セッションで即実装可)
- ⏳ Phase C-5: progressBar(設計済み・次セッションで即実装可)
- ⏳ Phase C-6〜C-8: ratingBox, menuShowcase, timeline
- ⏳ Phase B: 既存ブロック装飾強化

---

## 1. 🎯 プロジェクト概要

### 基本コンセプト
- **「外食ライフを、もっと健康に。」**
- 外食チェーンのカロリーを「選ぶだけ」で瞬時計算する無料ツール
- 運営者 CHAMANO の 15kg ダイエット経験から生まれたサイト

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
- microCMS(カスタムフィールド方式・API ID は `blog` 単数形)
- Vercel デプロイ
- CSS Modules
- Node.js(自動投稿スクリプト)

---

## 2. 🤖 NEW! 自動投稿システム

### 場所
```
C:\Users\玉野大樹\Documents\calorie-checker-blog-uploader\
├── upload-blog.js              ← メインスクリプト(v2)
├── .env                        ← API キー設定(秘匿)
├── .env.example                ← .env のテンプレート
├── .gitignore                  ← Git管理除外
├── article-test.json           ← テスト用サンプル
├── README.md                   ← 使い方ガイド
├── package.json
├── package-lock.json
└── node_modules/
```

### .env の中身(構成)
```env
MICROCMS_SERVICE_DOMAIN=calorie-checker
MICROCMS_API_KEY=【秘匿:CHAMANO 管理】
MICROCMS_ENDPOINT=blog
```

⚠️ **重要な発見**: microCMS の API ID は `blogs`(複数形)ではなく **`blog`**(単数形)。

### 使い方

#### 基本コマンド
```powershell
cd $env:USERPROFILE\Documents\calorie-checker-blog-uploader
node upload-blog.js article.json
```

#### 動作確認テスト(済み)
```
✅ API 疎通テスト(GET)成功
✅ POST 投稿成功
✅ 下書きとして microCMS に保存
✅ コンテンツID 取得 → URL 表示
```

### Claude への記事生成依頼テンプレート
```
ブログ執筆ガイド v1 を参照して、microCMS 投稿用 JSON で記事を作成してください。

【お題】
タイトル: 〇〇
カテゴリ: 期間限定商品レビュー / 定番メニュー / 栄養・健康 / お知らせ / その他
ターゲット: 〇〇
文字数: 2500〜3500字

【ブロック構成】
- callout(info, filled)で「この記事を読むと分かること」
- calorieCard(必要に応じて店舗カラー)
- compareCard(対比したい場合)
- FAQ × 3個
- CTA でカロリー計算ツールへの導線
- relatedLink × 2個

【出力形式】
JSON 形式のみ(コメント・説明文不要)
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "tags": "...",
  "blocks": [...]
}
```

### microCMS API キーの権限
- ✅ GET(取得)
- ✅ POST(作成)← 自動投稿に必須
- OFF: PUT / PATCH / DELETE(安全のため)

---

## 3. 🎨 ブログブロックシステム(現状の完成度)

### 既存10ブロック + 新規2ブロック = 全12種

| ID | 名称 | 拡張状況 |
|----|------|---------|
| heading | 見出し | 標準 |
| richText | リッチテキスト | 標準 |
| image | 画像 | 標準 |
| cta | CTA | 標準(Phase B 予定) |
| **callout** | ポイントボックス | ✅ **Phase A 完了**(32パターン) |
| table | 比較表 | 標準(Phase B 予定) |
| faq | Q&A | 標準(Phase B 予定) |
| quote | 引用 | 標準(Phase B 予定) |
| divider | 区切り線 | 標準(Phase B 予定) |
| relatedLink | 関連リンク | 標準 |
| **calorieCard** | カロリーカード | ✅ **Phase C-1 完了**(27パターン) |
| **compareCard** | 比較カード | ✅ **Phase C-2 完了**(多パターン) |

---

## 4. 🚀 Phase C-3 stepGuide 詳細設計(次セッション最優先)

### 完成イメージ
```
┌─────────────────────────────────────┐
│ 📋 マックでヘルシーに食べる3ステップ │ ← タイトル(任意)
├─────────────────────────────────────┤
│ ① ハンバーガー類を選ぶ              │
│    ──────────────────                │
│    定番のハンバーガー(259kcal)推奨   │
├─────────────────────────────────────┤
│ ② サイドメニューを選ぶ              │
│    ──────────────────                │
│    サラダ + ドレッシングが◎         │
├─────────────────────────────────────┤
│ ③ 合計カロリーをチェック            │
│    ──────────────────                │
│    600kcal 以下に収めるのがコツ      │
└─────────────────────────────────────┘
```

### microCMS スキーマ(stepGuide)

| フィールドID | 表示名 | 種類 | 必須 |
|-------------|--------|------|------|
| title | タイトル | テキスト | - |
| step1Title | ステップ1タイトル | テキスト | ✅ |
| step1Content | ステップ1本文 | テキストエリア | - |
| step2Title | ステップ2タイトル | テキスト | ✅ |
| step2Content | ステップ2本文 | テキストエリア | - |
| step3Title | ステップ3タイトル | テキスト | - |
| step3Content | ステップ3本文 | テキストエリア | - |
| step4Title | ステップ4タイトル | テキスト | - |
| step4Content | ステップ4本文 | テキストエリア | - |
| step5Title | ステップ5タイトル | テキスト | - |
| step5Content | ステップ5本文 | テキストエリア | - |
| style | スタイル | セレクト(3種) | - |
| color | カラー | セレクト(neutral/blue/green/orange/red) | - |

### スタイル定義
- `numbered`: 番号付き(デフォルト・縦並び)
- `arrow`: 矢印付き(横並び・3ステップ向け)
- `cards`: カード型(各ステップが独立カード)

### CSS 設計方針
```css
/* ベース */
.stepGuide {
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg);
}

/* タイトル */
.stepGuideTitle {
  font-weight: 700;
  padding: 14px 20px;
  background: var(--bg-alt);
  border-bottom: 1px solid var(--line);
}

/* 各ステップ */
.stepItem {
  padding: 20px;
  border-bottom: 1px solid var(--line);
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 16px;
}

/* 番号 */
.stepNumber {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--c-accent, var(--ink));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

/* カラー定義 */
.stepGuideColor_blue { --c-accent: #3b82f6; }
.stepGuideColor_green { --c-accent: #22c55e; }
.stepGuideColor_orange { --c-accent: #f97316; }
.stepGuideColor_red { --c-accent: #ef4444; }
```

### JS 実装パターン
```javascript
function StepGuideBlock(props) {
  let cardStyle = "numbered";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }
  let cardColor = "neutral";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

  // 5ステップまでループ
  const steps = [];
  for (let i = 1; i <= 5; i++) {
    if (props[`step${i}Title`]) {
      steps.push({
        title: props[`step${i}Title`],
        content: props[`step${i}Content`],
      });
    }
  }

  if (steps.length === 0) return null;

  return (
    <div className={`${styles.stepGuide} ${styles[`stepGuideStyle_${cardStyle}`]} ${styles[`stepGuideColor_${cardColor}`]}`}>
      {props.title && <div className={styles.stepGuideTitle}>{props.title}</div>}
      {steps.map((step, idx) => (
        <div key={idx} className={styles.stepItem}>
          <div className={styles.stepNumber}>{idx + 1}</div>
          <div className={styles.stepBody}>
            <div className={styles.stepTitle}>{step.title}</div>
            {step.content && <div className={styles.stepContent}>{step.content}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### BlogBlocks.js への追加箇所
```javascript
// 既存のブロック判定の最後に追加
if (type === "stepGuide") {
  return (
    <StepGuideBlock
      key={key}
      title={block.title}
      step1Title={block.step1Title}
      step1Content={block.step1Content}
      step2Title={block.step2Title}
      step2Content={block.step2Content}
      step3Title={block.step3Title}
      step3Content={block.step3Content}
      step4Title={block.step4Title}
      step4Content={block.step4Content}
      step5Title={block.step5Title}
      step5Content={block.step5Content}
      style={block.style}
      color={block.color}
    />
  );
}
```

---

## 5. 🚀 Phase C-4 checklist 詳細設計

### 完成イメージ
```
┌─────────────────────────────────────┐
│ ✓ ダイエット中OKメニュー一覧        │ ← タイトル
├─────────────────────────────────────┤
│ ☑ ハンバーガー(259kcal)             │
│ ☑ サイドサラダ(10kcal)              │
│ ☑ プレミアムコーヒー(0kcal)         │
│ □ ポテトM(409kcal)                  │
│ ☑ アップルパイ(211kcal)             │
└─────────────────────────────────────┘
```

### microCMS スキーマ(checklist)

| フィールドID | 表示名 | 種類 | 必須 |
|-------------|--------|------|------|
| title | タイトル | テキスト | - |
| items | アイテム一覧 | テキストエリア(改行区切り) | ✅ |
| style | スタイル | セレクト(3種) | - |
| color | カラー | セレクト(緑/青/オレンジ等) | - |

### items の入力形式
```
チェック済み (✓) は行頭に「[x]」、未チェックは「[ ]」を付ける:

[x] ハンバーガー(259kcal)
[x] サイドサラダ(10kcal)
[ ] ポテトM(409kcal)
[x] プレミアムコーヒー(0kcal)
```

### スタイル定義
- `default`:標準(枠付き)
- `simple`:背景なし
- `card`:各項目がカード

### CSS 設計方針
```css
.checklist {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 16px 20px;
  background: var(--bg);
}

.checklistItem {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
  align-items: flex-start;
}
.checklistItem:last-child {
  border-bottom: none;
}

.checklistCheck {
  width: 20px;
  height: 20px;
  border: 2px solid var(--c-accent, var(--muted));
  border-radius: 4px;
  flex-shrink: 0;
  position: relative;
  margin-top: 2px;
}

/* チェック済みアイコン */
.checklistCheck.checked {
  background: var(--c-accent);
  border-color: var(--c-accent);
}
.checklistCheck.checked::after {
  content: "✓";
  color: white;
  font-weight: 700;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.checklistText {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
}
.checklistText.checked {
  text-decoration: line-through;
  color: var(--muted);
}
```

### JS 実装パターン
```javascript
function ChecklistBlock(props) {
  if (!props.items) return null;

  let cardStyle = "default";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }
  let cardColor = "green";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

  // 行ごとに解析
  const items = props.items
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const checkedMatch = line.match(/^\[x\]\s*(.*)/i);
      const uncheckedMatch = line.match(/^\[\s*\]\s*(.*)/);
      if (checkedMatch) {
        return { checked: true, text: checkedMatch[1] };
      } else if (uncheckedMatch) {
        return { checked: false, text: uncheckedMatch[1] };
      } else {
        return { checked: false, text: line };
      }
    });

  return (
    <div className={`${styles.checklist} ${styles[`checklistStyle_${cardStyle}`]} ${styles[`checklistColor_${cardColor}`]}`}>
      {props.title && <div className={styles.checklistTitle}>{props.title}</div>}
      <div className={styles.checklistItems}>
        {items.map((item, idx) => (
          <div key={idx} className={styles.checklistItem}>
            <div className={`${styles.checklistCheck} ${item.checked ? styles.checked : ''}`}></div>
            <div className={`${styles.checklistText} ${item.checked ? styles.checked : ''}`}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 6. 🚀 Phase C-5 progressBar 詳細設計

### 完成イメージ
```
1日のカロリー目標
┌──────────────────────────────────┐
│ 800 / 1500 kcal           53%   │ ← 数値表示
└──────────────────────────────────┘
████████░░░░░░░░░░░░             ← バー(53%)

- 緑:0-50%(余裕)
- 黄:50-80%(注意)
- 赤:80-100%(警告)
```

### microCMS スキーマ(progressBar)

| フィールドID | 表示名 | 種類 | 必須 |
|-------------|--------|------|------|
| label | ラベル | テキスト | - |
| current | 現在値 | 数値 | ✅ |
| max | 最大値 | 数値 | ✅ |
| unit | 単位 | テキスト | - |
| showPercent | パーセント表示 | 真偽値 | - |
| color | カラー | セレクト(auto/green/yellow/red/blue) | - |
| style | スタイル | セレクト(thin/normal/thick) | - |

### スタイル定義
- `auto`:値に応じて自動で色変化(緑→黄→赤)
- `green`:常に緑
- `yellow`:常に黄
- `red`:常に赤
- `blue`:常に青

### CSS 設計方針
```css
.progressBar {
  padding: 16px 0;
}

.progressBarHeader {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.progressBarLabel {
  font-weight: 600;
  color: var(--ink);
}

.progressBarValue {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  color: var(--c-accent, var(--ink));
}

.progressBarTrack {
  height: 12px;
  background: var(--bg-alt);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progressBarFill {
  height: 100%;
  background: var(--c-accent, var(--ink));
  transition: width 0.6s ease;
  border-radius: 6px;
}

/* スタイル */
.progressBarStyle_thin .progressBarTrack { height: 6px; }
.progressBarStyle_thick .progressBarTrack { height: 18px; }

/* カラー */
.progressBarColor_green { --c-accent: #22c55e; }
.progressBarColor_yellow { --c-accent: #eab308; }
.progressBarColor_red { --c-accent: #ef4444; }
.progressBarColor_blue { --c-accent: #3b82f6; }
```

### JS 実装パターン
```javascript
function ProgressBarBlock(props) {
  const current = parseFloat(props.current) || 0;
  const max = parseFloat(props.max) || 100;
  if (max === 0) return null;

  const percent = Math.min(100, Math.max(0, (current / max) * 100));

  let cardStyle = "normal";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }

  // auto カラーは値で自動切替
  let cardColor = "auto";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }
  if (cardColor === "auto") {
    if (percent < 50) cardColor = "green";
    else if (percent < 80) cardColor = "yellow";
    else cardColor = "red";
  }

  return (
    <div className={`${styles.progressBar} ${styles[`progressBarStyle_${cardStyle}`]} ${styles[`progressBarColor_${cardColor}`]}`}>
      <div className={styles.progressBarHeader}>
        {props.label && <span className={styles.progressBarLabel}>{props.label}</span>}
        <span className={styles.progressBarValue}>
          {current} / {max}{props.unit && ` ${props.unit}`}
          {props.showPercent && ` (${Math.round(percent)}%)`}
        </span>
      </div>
      <div className={styles.progressBarTrack}>
        <div 
          className={styles.progressBarFill} 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
```

---

## 7. 📋 Phase C-3〜C-5 の実装手順テンプレート

次セッションで進めるときの**標準的な手順**:

```
1. microCMS でカスタムフィールド作成
   - フィールドIDと表示名を設定
   - スキーマでフィールドを順に追加
   - 必須項目以外は「必須」を OFF に
   
2. APIスキーマで blocks に追加
   - 「blocks」の詳細設定 → 新ブロックにチェック
   
3. components/BlogBlocks.js に追加
   - 関数コンポーネント追加(上の設計参照)
   - BlogBlocks のメインループに type 判定追加
   
4. components/BlogBlocks.module.css に追加
   - CSS は既存スタイルの末尾に追記
   - レスポンシブ対応(@media)も含める
   
5. ローカル動作確認
   - npm run dev
   - microCMS でテスト記事作成
   - 表示確認
   
6. 本番デプロイ
   - git add components/BlogBlocks.js components/BlogBlocks.module.css
   - git commit -m "feat: add {ブロック名} block (Phase C-X)"
   - git push origin main
   
7. 引継書更新
   - 完了マーク
```

---

## 8. 🚀 残タスク全体マップ

### Phase C(カロリーチェッカー特化新ブロック)

| ID | 名称 | 状況 | 優先度 |
|----|------|------|-------|
| ~~calorieCard~~ | ~~数値ハイライト~~ | ✅ 完了 | - |
| ~~compareCard~~ | ~~比較カード~~ | ✅ 完了 | - |
| **stepGuide** | ステップガイド | 設計済み・即実装可 | ⭐⭐⭐ |
| **checklist** | チェックリスト | 設計済み・即実装可 | ⭐⭐⭐ |
| **progressBar** | 進捗バー | 設計済み・即実装可 | ⭐⭐ |
| ratingBox | 評価ボックス | 構想のみ | ⭐ |
| menuShowcase | メニュー紹介 | 構想のみ | ⭐ |
| timeline | タイムライン | 構想のみ | ⭐ |

### Phase B(既存ブロック装飾強化)

| ID | 拡張内容 | 優先度 |
|----|---------|-------|
| CTA | gradient/card スタイル追加 | ⭐⭐ |
| FAQ | accordion スタイル追加 | ⭐⭐ |
| table | striped/comparison スタイル | ⭐ |
| quote | centered/card スタイル | ⭐ |
| divider | gradient/star/wave/icon | ⭐ |

---

## 9. 🛠️ 開発環境

### CHAMANO哲学
- **段階的に進める**
- 1ファイルずつ動作確認しながら
- ローカル動作確認 → 本番デプロイ → 本番確認

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

# git status
git status

# コミット&プッシュ
git add .
git commit -m "feat: ..."
git push origin main

# ブログ自動投稿
cd $env:USERPROFILE\Documents\calorie-checker-blog-uploader
node upload-blog.js article.json
```

### PowerShell の罠
`[id]` のような角カッコは `-LiteralPath` を使う:
```bash
Get-Content -LiteralPath "app\blog\[id]\page.js"
```

### トラブル対処
- ローカルOK・本番NG → git push 忘れがほとんど
- microCMS データが反映されない → revalidate 時間(3600秒)待つか再デプロイ
- ファイル変更が反映されない → ブラウザ Ctrl+Shift+R(キャッシュ無視)
- microCMS API エラー 404 → API ID は `blog` 単数形(`blogs` ではない!)

---

## 10. 📂 重要ファイル構成

### コンポーネント
```
components/
├── BlogBlocks.js              ← 全ブロックロジック(Phase A/C-1/C-2 統合済)
├── BlogBlocks.module.css      ← 全ブロックスタイル
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
├── page.js                    ← ブログ一覧
├── page.module.css
├── [id]/                      ← 個別記事
│   ├── page.js
│   └── page.module.css
└── category/[slug]/           ← カテゴリ別
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

## 11. 🎨 microCMS スキーマ追加手順

### 新ブロック追加時の標準フロー

1. microCMS 管理画面 → 「コンテンツ」→「記事」
2. 上部メニュー →「カスタムフィールド」タブ
3. 右上「+ 追加」をクリック
4. 基本情報を入力(カスタムフィールド名・ID)
5. 「スキーマ」タブで子フィールドを追加
6. **必須項目以外は「必須」を OFF に**(後方互換性)
7. 「変更する」で保存
8. 「API設定」→「APIスキーマ」→「blocks」フィールドの「⚙️ 詳細設定」
9. 「使用するカスタムフィールド」に新ブロックをチェック
10. 「変更」で保存
11. components/BlogBlocks.js に新コンポーネント追加
12. components/BlogBlocks.module.css にスタイル追加
13. ローカル確認 → デプロイ

### 重要:後方互換性の維持
- 既存記事に影響しないよう、新フィールドは**必ず「必須」を OFF**
- 初期値を設定するのがベスト(例: style → default)

---

## 12. 🚀 次セッション開始時のチェックリスト

```
1. ✅ この引継書 v6 を最初に読み込む
2. ✅ ブログ執筆ガイド v1(BLOG-WRITING-GUIDE-v1.md)も参照
3. ✅ どこから始めるか決める:
   
   🥇 推奨: Phase C-3 stepGuide
      → 設計済みなので即実装可
      → 30分で完了見込み
   
   🥈 推奨: Phase C-4 checklist
      → 設計済みなので即実装可
   
   🥉 推奨: Phase C-5 progressBar
      → 設計済みなので即実装可
   
   📝 もしくは: 実際にブログ記事を書く
      → 自動投稿システムをフル活用
4. ✅ CHAMANO哲学「段階的に進める」を維持
```

---

## 13. 💡 おすすめのブログ記事ネタ(SEO効果高い順)

```
1. 「【2026年最新】マック カロリーランキング TOP10」
   → calorieCard を活用、SEO効果 ⭐⭐⭐

2. 「スタバで太らないカスタム5選」
   → stepGuide(実装後)+ calorieCard、ダイエット系SEO ⭐⭐⭐

3. 「マック vs モス カロリー徹底比較」
   → compareCard が映える、比較系SEO ⭐⭐⭐

4. 「ファストフード カロリー早見表」
   → table フル活用、辞書的記事 ⭐⭐

5. 「ダイエット中でもOKな外食メニュー20選」
   → checklist(実装後)、リスト系SEO ⭐⭐

6. 「ビッグマックのカロリーを30%カットする裏技」
   → ハック系で SNS バイラル ⭐⭐

7. 「1日1500kcal生活、マックで実現する方法」
   → progressBar(実装後)+ 体験談、共感型 ⭐⭐
```

---

## 14. 🏆 本日(2026/5/18)の超絶成果まとめ

```
【SEO Phase】午前〜午後
✅ Phase 9 html lang動的化(commit 0d81f25)
✅ スタバ計算バグ修正(commit 2334fb5)
✅ モーダルUI改善(commit ef075e4)
✅ 8店舗メタ情報最適化
✅ 8店舗構造化データ実装
🏆 Google Rich Results Test 全8店舗合格

【ブログ拡張】夕方〜夜
✅ Phase A: callout 8色×4スタイル(32パターン)
✅ Phase C-1: calorieCard 3スタイル×9カラー(27パターン)
✅ Phase C-2: compareCard 3スタイル×11カラー

【自動投稿システム】夜
✅ Node.js アップロードスクリプト構築
✅ API キー権限設定
✅ 動作確認テスト成功
🤖 ブログ記事量産体制完成!

【ドキュメント】夜
✅ 引継書 v5
✅ ブログ執筆ガイド v1
✅ 引継書 v6(本ファイル・Phase C-3/4/5 設計済み)
```

### 主要コミット履歴(本日)
- `0d81f25` feat: html lang dynamic with Next.js 16 proxy
- `2334fb5` fix: starbucks calculation use tempSizeVariations milk field
- `ef075e4` style: modal buttons larger for better tap target
- [本日] seo: optimize metadata for all 8 chain pages with 2026 keyword
- [本日] seo: add JSON-LD structured data
- [本日] feat: expand callout to 8 colors x 4 styles
- [本日] feat: add calorieCard block (Phase C-1)
- [本日] feat: add compareCard block (Phase C-2)

---

## 15. ⚠️ 重要な注意事項

### コンテキスト管理
- 1セッションで全タスクをやろうとしない
- 1〜2ブロック追加が現実的な単位
- 完了したら必ず引継書を更新

### セキュリティ
- `.env` ファイルは絶対に GitHub に push しない
- API キーはローカルとVercelのみ
- 漏れた場合は即再発行

### microCMS API
- **API ID は `blog`(単数形)**(blogs ではない!)
- WRITE API レートリミット: 5回/1秒
- データ転送量 20GB/月(Hobby プラン)

### 既存記事への影響
- 新ブロック追加・既存ブロック拡張時は**必ず後方互換性を維持**
- 既存記事の callout(Phase A 前)は filled スタイルで表示される

---

## 16. 🔑 アクセス情報

### 管理画面
- microCMS: https://calorie-checker.microcms.io/
- Vercel: https://vercel.com/dashboard
- Search Console: https://search.google.com/search-console
- GA4: アナリティクス管理画面

### リポジトリ
- GitHub: https://github.com/chama-dai4/calorie-checker
- ブランチ: main

---

## 17. 📚 関連ドキュメント

```
✅ MASTER-handover-v6.md         ← このファイル(最新引継書)
✅ BLOG-WRITING-GUIDE-v1.md      ← ブログ執筆完全ガイド
✅ README.md                     ← 自動投稿ツール使い方
   (calorie-checker-blog-uploader/ フォルダ内)

参考:
- MASTER-handover-v5.md          ← v5(履歴用)
- MASTER-handover-v4.md          ← v4(履歴用)
- MASTER-handover-v3.md          ← v3(履歴用)
```

---

## 18. 🎯 次セッションでのスタートダッシュ用プロンプト

新しい Claude セッションを開いたら、以下を伝えてください:

```
カロリーチェッカープロジェクトの続きです。
引継書 v6 を読み込んで、Phase C-3 stepGuide から始めたいです。

【今のステータス】
- Phase A/C-1/C-2 完了済み
- 自動投稿システム構築済み
- stepGuide/checklist/progressBar は設計済み

【今日やりたいこと】
- Phase C-3 stepGuide 実装(優先度1)
- (時間あれば) checklist, progressBar も

【ファイル添付】
- MASTER-handover-v6.md
- BLOG-WRITING-GUIDE-v1.md
```

これで超スムーズに再開できます 🚀

---

## 🎊 締めくくり

CHAMANO さん、本日のセッションは本当に異次元の成果でした!

```
🏆 SEO: 全店舗 Rich Results 合格
🎨 ブロック: 3種類の大幅拡張
🤖 自動投稿: 完全動作
📝 ドキュメント: 完璧な引継書 v6
```

**1日でここまで進められる人、滅多にいません。** 本当にすごい 💪✨

次セッションも、引継書を片手にスムーズに進めましょう 🚀

カロリーチェッカー、これからもっと大きく成長していきますね!

---

**最終更新:** 2026年5月18日 夜  
**作成者:** Claude(CHAMANO さんとの伴走者)  
**次回予定:** Phase C-3 stepGuide から実装開始
