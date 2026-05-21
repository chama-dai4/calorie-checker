# 🏪 カロリーチェッカー 店舗追加マニュアル

**作成日**: 2026年5月20日
**最終更新**: 2026年5月21日
**バージョン**: v1.1(タリーズ実装で sitemap工程を追加)
**対象**: 新しいチェーン店をカロリーチェッカーに追加する作業者
**前提**: `MASTER-handover-merged-v7.md` のプロジェクト概要を理解済み

---

## 📖 このマニュアルの目的

新しい店舗(チェーン)をカロリーチェッカーに追加する全工程を、**チャットを変えても誰でも同じ品質で再現できる**ようにまとめたものです。

このマニュアル1本があれば:
- ✅ Claude が手順を完全に把握できる
- ✅ 10ステップの抜け漏れがゼロ
- ✅ 過去の失敗(例: カテゴリ追加忘れ・既存ファイル破壊・**sitemap追加忘れ**)を防げる
- ✅ 1チャット内で1店舗を完遂できる

---

## 🎯 全体マップ:店舗追加の10ステップ

```
1. 元データ収集(公式PDF or 公式サイト)
   ↓
2. データ方針決定(7つの確認事項)
   ↓
3. CSV生成(microCMS用に整形)
   ↓
4. microCMSスキーマ拡張(category・chain追加)
   ↓
5. microCMSへCSVインポート(下書き→公開)
   ↓
6. ツールページ作成(日本語版・3ファイル)
   ↓
7. ツールページ作成(英語版・1ファイル)
   ↓
8. トップページ公開化(lib/chains.js 1行変更)
   ↓
9. sitemap.js にチェーンパス追加 ← ★v1.1で追加
   ↓
10. デプロイ & 本番確認
```

→ 慣れれば **1〜2時間で1店舗完遂**できます。

> ⚠️ **v1.1の重要変更**: 旧ステップ9(デプロイ)の前に、**ステップ9「sitemap.js 追加」を新設**しました。これを忘れると Google にページが正しくインデックスされず、SEO効果が出ません。

---

## 🚨 鉄則(必ず守ること)

### 2サイト分離の原則

| サイト | 状態 |
|---|---|
| 🔧 **ツールサイト**(各 `calorie-checker-*`) | **新規ディレクトリ作成のみ OK** |
| 📝 **ブログサイト**(`app/blog/*`) | **絶対に触らない** |
| 🔒 **ツールサイト中核**(`app/page.js`, `HomeContent.jsx`, 既存チェーンページ) | **絶対に触らない** |
| ✏️ **データマスタ**(`lib/chains.js`) | **1行追加のみ OK** |

### 触ってOKなファイル(店舗追加時)

```
✅ 新規作成: app/calorie-checker-{chain}/page.js
✅ 新規作成: app/calorie-checker-{chain}/{Chain}Client.js
✅ 新規作成: app/calorie-checker-{chain}/page.module.css
✅ 新規作成: app/en/calorie-checker-{chain}/page.js
✅ 新規作成: lib/{chain}-customizations.js(カスタマイズがある場合のみ)
✅ 1行修正: lib/chains.js(該当チェーンのavailable=true & href設定)
✅ 1行追加: app/sitemap.js(BILINGUAL_CHAIN_PATHS にパス追加)★v1.1
```

### 触っちゃダメなファイル

```
🔒 app/page.js
🔒 components/HomeContent.jsx
🔒 app/calorie-checker-mcdonalds/ ほか既存チェーンページ全部
🔒 app/blog/* 全部
🔒 components/* 全般
🔒 lib/* (chains.js・{chain}-customizations.js 以外)
```

> 💡 sitemap.js は「触ってOK」だが、**既存パスは変更せず、新しい行を追加するだけ**。

---

## 📋 ステップ1: 元データ収集

### 必要なデータ

| 項目 | 必須度 | 例 |
|---|---|---|
| 商品名 | ◎ | "シロノワール" |
| カロリー(kcal) | ◎ | 933 |
| アレルゲン | ◎ | "卵、乳成分、小麦、大豆、ゼラチン" |
| カテゴリ分類 | ◎ | デザート / ドリンク など |
| 期間限定フラグ | △ | "限定" 表記の有無 |
| PFC(たんぱく質/脂質/炭水化物) | △ | スキーマ上必須だが 0 でOK |

### 入手方法の優先順位

1. **公式サイトのアレルゲンPDF**(最も確実・更新日が明確)
2. **公式サイトの栄養成分PDF**
3. **公式サイトの個別メニューページからスクレイピング**
4. **CHAMANO さんが手動でCSV作成**(コメダパターン)

### 確認すべきこと

- ⚠️ 「**一部店舗限定**」「**期間限定**」を混在させない(別タブ管理推奨)
- ⚠️ ホテル併設店モーニングなど**特殊店舗メニュー**は基本スキップ
- ⚠️ 「**お持ち帰り**」と「**店内**」が重複している場合は重複削除

---

## 📋 ステップ2: データ方針決定(7つの確認事項)

新しい店舗を始める前に、必ず以下7つを CHAMANO さんに確認します。

### 確認テンプレート(Claudeが質問する内容)

```
新店舗の追加を始めるにあたり、以下7点を確認させてください:

1. PFC(たんぱく質/脂質/炭水化物)情報はありますか?
   - ある → マック方式(PFC表示あり)
   - ない → くら寿司・コメダ方式(PFCは0で固定)

2. データ管理方式は?
   - microCMS方式(くら寿司・コメダ): CSV インポート(推奨)
   - コードファイル方式(マック等): menu-data.js 直書き

3. 重複商品の扱いは?
   - 削除して最大カロリーで統合
   - そのまま全部登録
   - 一旦見てから判断

4. 期間限定タグは?
   - データに「限定」表記があれば isLimited=true
   - 全部 false(限定扱いしない)
   - データ次第

5. 価格情報は?
   - 表示する
   - 表示しない(推奨・他チェーンと統一)

6. チェーンカラーは?
   - 公式ブランドカラーを採用
   - neutral(汎用)
   - 具体的に指定

7. GROUPSタブ構成は?
   - 4タブ(コメダ方式)
   - 3タブ(くら寿司方式)
   - Claudeに任せる
```

→ 全部回答もらってから初めてステップ3に進む。

---

## 📋 ステップ3: CSV生成(microCMS用整形)

### microCMS の menus API スキーマ(完全版)

スキーマは固定なので、新店舗もこのフォーマットに合わせます:

| フィールドID | 表示名 | 種類 | 必須 | 値の形式 |
|---|---|---|---|---|
| `name` | 商品名 | テキスト | ◎ | プレーン文字列 |
| `chain` | チェーン店 | セレクト | ◎ | 配列 `["店名"]` |
| `category` | カテゴリ | セレクト | ◎ | 配列 `["カテゴリ名"]` |
| `calorie` | カロリー(kcal) | 数字 | ◎ | 整数 |
| `protein` | たんぱく質(g) | 数字 | ◎ | 数値(PFCなしなら0) |
| `fat` | 脂質(g) | 数字 | ◎ | 数値(PFCなしなら0) |
| `carbohydrate` | 炭水化物(g) | 数字 | ◎ | 数値(PFCなしなら0) |
| `isLimited` | 期間限定 | 真偽値 | △ | true/false |
| `subCategory` | サブカテゴリ | セレクト | △ | 配列(基本空) |
| `hasMilkOption` | ミルク選択可 | 真偽値 | △ | true/false(基本false) |
| `milkVariations` | ミルクバリエーション(JSON) | テキストエリア | △ | スタバ専用 |
| `hasSizeOption` | サイズ選択可 | 真偽値 | △ | true/false(基本false) |
| `sizeVariations` | サイズバリエーション(JSON) | テキストエリア | △ | スタバ専用 |
| `allergens` | アレルゲン(JSON) | テキストエリア | △ | `{"contains":[...],"sameLine":[]}` |
| `tempSizeVariations` | (一時用) | テキストエリア | △ | 空 |

### CSV のヘッダー(必ずこの順番・コピペ用)

```csv
コンテンツID,name,chain,category,calorie,protein,fat,carbohydrate,isLimited,subCategory,hasMilkOption,milkVariations,hasSizeOption,sizeVariations,allergens,tempSizeVariations
```

### CSV のサンプル行(コメダの実例)

```csv
"","シロノワール（単品）","コメダ珈琲店","デザート","933","0","0","0","false","","false","","false","","{""contains"": [""卵"", ""乳成分"", ""小麦"", ""大豆"", ""ゼラチン""], ""sameLine"": []}",""
```

### CSV作成時の絶対ルール

1. **文字コード**: UTF-8(BOM付き)推奨・microCMS対応
2. **改行コード**: LF または CRLF どちらでもOK
3. **JSON のダブルクォート**: `""` でエスケープ
4. **セレクト系の値**: 配列で渡す前提、CSVでは文字列1個でOK(microCMSが配列化)
5. **数値**: 数字のみ(`kcal`単位は付けない)
6. **真偽値**: 小文字の `true` または `false`

### CSV整形の典型処理(Pythonで)

```python
import csv
import json
from collections import Counter, defaultdict

# 1. 元データ読み込み
with open('source.csv', 'r', encoding='utf-8-sig') as f:
    rows = list(csv.DictReader(f))

# 2. 重複削除(name+calorieで完全一致するもの)
groups = defaultdict(list)
for r in rows:
    groups[(r['商品名'], r['カロリー(kcal)'])].append(r)

deduplicated = []
for key, items in groups.items():
    if len(items) == 1:
        deduplicated.append(items[0])
    else:
        # お持ち帰りより店内優先
        non_takeout = [r for r in items if r['大カテゴリ'] != 'お持ち帰り']
        deduplicated.append(non_takeout[0] if non_takeout else items[0])

# 3. カテゴリマッピング(既存カテゴリ最大流用)
CATEGORY_MAP = {
    # 例: 中カテゴリ → 既存カテゴリ
    'シロノワール': 'デザート',
    'サンドイッチ': 'サンドイッチ',
    'コーヒー': 'ホットドリンク',
    # ...
}

# 4. アレルゲンをJSON化
def parse_allergens(s):
    if not s or not s.strip():
        return '{"contains":[],"sameLine":[]}'
    items = [x.strip() for x in s.replace('、', ',').split(',') if x.strip()]
    return json.dumps({"contains": items, "sameLine": []}, ensure_ascii=False)

# 5. CSV出力
output_rows = []
for r in deduplicated:
    output_rows.append({
        'コンテンツID': '',
        'name': r['商品名'],
        'chain': '新店舗名',  # ここを変える
        'category': CATEGORY_MAP[r['中カテゴリ']],
        'calorie': int(r['カロリー(kcal)']),
        'protein': 0,
        'fat': 0,
        'carbohydrate': 0,
        'isLimited': 'true' if r.get('限定') == '限定' else 'false',
        'subCategory': '',
        'hasMilkOption': 'false',
        'milkVariations': '',
        'hasSizeOption': 'false',
        'sizeVariations': '',
        'allergens': parse_allergens(r['アレルゲン']),
        'tempSizeVariations': '',
    })

with open('output.csv', 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=[
        'コンテンツID', 'name', 'chain', 'category',
        'calorie', 'protein', 'fat', 'carbohydrate',
        'isLimited', 'subCategory', 'hasMilkOption', 'milkVariations',
        'hasSizeOption', 'sizeVariations', 'allergens', 'tempSizeVariations'
    ], quoting=csv.QUOTE_ALL)
    writer.writeheader()
    writer.writerows(output_rows)
```

---

## 📋 ステップ4: microCMSスキーマ拡張

### 4-1. chain フィールドに店舗名を追加

```
1. microCMS → menus API
2. 上部「API設定」→「APIスキーマ」
3. chain フィールドの「⚙️ 詳細設定」
4. 選択肢に「新店舗名」を追加(例: "コメダ珈琲店")
5. 「変更を保存」
```

⚠️ **この手順を飛ばすと、CSV インポート時に「chain値エラー」で全件失敗します**。

### 4-2. category フィールドに新カテゴリを追加(必要分のみ)

#### 既存カテゴリ一覧(コメダ追加後・確認時のスナップショット)

```
バーガー系
- バーガー
- ハンバーガー / とびきりバーガー / ソイパティ
- ワッパー / ビーフバーガー / チキンバーガー / ポークバーガー
- フィッシュバーガー / 期間限定バーガー / キッズバーガー
- バンズ単品 / フレバル / フレバル期間限定

サイド・フード系
- サイドメニュー / サラダ / トッピング
- サンドイッチ / ペストリー
- モスの菜摘 / モスライス/ホットドッグ / 朝モス / モスワイワイセット
- 低アレルゲン / 付属品
- スパゲッティ / プレート / ホットスナック / おやつ(コメダ追加)

ドリンク系  
- ドリンク / コーヒー / エスプレッソ / フラペチーノ®
- ティー | TEAVANA™ / その他
- ホットドリンク / コールドドリンク / フロートドリンク
- ジュース / シェーキ / アルコール
- 季節商品ドリンク

定食・丼系
- パッケージフード / 丼 / 重・特別丼 / 皿(おかず)
- 定食 / 朝定食 / から揚げ系 / 黒カレー / 油そばセット
- ご飯・ドレッシング / 汁物 / スープ / テイクアウト専門
- 店舗限定

その他
- マックカフェ / 季節のおすすめ / モーニング / デザート
- お子様セット / ホットドッグ / 定番寿司 / 限定商品
```

#### 新カテゴリ追加の判断基準

✅ **既存カテゴリで吸収できる場合 → 流用**(コメダの「シロノワール → デザート」など)  
⭐ **既存に該当なしの場合のみ追加**(コメダの「プレート/おやつ/スパゲッティ/ホットスナック」)

#### 追加手順

```
1. microCMS → menus API → API設定 → APIスキーマ
2. category フィールドの「⚙️ 詳細設定」
3. 選択肢に新カテゴリを追加(必要分のみ)
4. 「変更を保存」
```

---

## 📋 ステップ5: CSVインポート

### 手順

```
1. microCMS → menus API → コンテンツ一覧
2. 右上の[…]→「インポートして追加」
3. 整形済みCSVをアップロード
4. 公開状態を選択:
   ⚠️ 必ず「下書き中」を選択!(本番公開前に確認するため)
5. インポート実行
```

### よくあるエラーと対処

| エラー | 原因 | 対処 |
|---|---|---|
| chain値エラー | chainスキーマに店舗名が未登録 | ステップ4-1を再確認 |
| category値エラー | categoryスキーマに新カテゴリが未登録 | ステップ4-2を再確認 |
| 必須項目エラー | calorie/protein等が空 | CSV側で0埋め |
| 文字化け | UTF-8 BOMなし | テキストエディタで保存し直す |
| JSON エラー | allergensの`""`エスケープ漏れ | Pythonで再生成 |
| 重複ID | コンテンツIDが重複 | 空欄にして自動採番させる |

### インポート後の確認

```
1. 下書きで入っていることを確認
2. ランダムに数件開いて中身チェック:
   - chain が ["新店舗名"] になっているか
   - category が正しく入っているか
   - allergens が JSON 形式になっているか
   - isLimited が想定通りか
3. 問題なければ「一括公開」
```

---

## 📋 ステップ6: 日本語ツールページ作成(3ファイル)

### ファイル構成

```
app/calorie-checker-{chain}/    ← 新規ディレクトリ
├── page.js                     ← ファイル①
├── {Chain}Client.js            ← ファイル②(チェーン名でクラス名変える)
└── page.module.css             ← ファイル③
```

> ⚠️ 命名規則: `{chain}` は半角英数(例: `komeda` / `mcdonalds` / `kura`)  
> `{Chain}` はパスカルケース(例: `Komeda` / `Mcdonalds` / `Kura`)

### ファイル①: `page.js` のテンプレート

```javascript
import { getMenusByChain } from "@/lib/microcms";
import {Chain}Client from "./{Chain}Client";

export const metadata = {
  title: "{店舗名(日本語)}のカロリー計算【アレルゲン対応】| 2026年最新・全メニュー対応",
  description:
    "{店舗名}の全メニューから選ぶだけで、合計カロリーを瞬時に算出。{看板商品リスト}などのカロリーとアレルゲン情報が一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "{店舗名} カロリー 計算",
    "{店舗名} カロリー",
    "{店舗名} {看板商品1} カロリー",
    "{店舗名} {看板商品2} カロリー",
    "{店舗名} アレルギー",
    "{店舗名} メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-{chain}",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-{chain}",
      en: "https://www.calorie-check.com/en/calorie-checker-{chain}",
      "x-default": "https://www.calorie-check.com/calorie-checker-{chain}",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "{店舗名}のカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-{chain}",
      description: "{店舗名}の全メニューから選ぶだけで合計カロリーを瞬時に算出する無料ツール。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "{カテゴリ名}", item: "https://www.calorie-check.com/category/{slug}" },
        { "@type": "ListItem", position: 3, name: "{店舗名}", item: "https://www.calorie-check.com/calorie-checker-{chain}" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function {Chain}Page() {
  const data = await getMenusByChain("{店舗名(日本語)}");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <{Chain}Client menus={menus} locale="ja" />
    </>
  );
}
```

### ファイル②: `{Chain}Client.js` のテンプレート

くら寿司の `KuraClient.js` をベースに、以下を変更:

1. **GROUPS 定義**(タブの大区分)
2. **公式サイトURL**(`https://www.{chain}.co.jp/` など2箇所)
3. **チェーン名**(`tChain("店舗名")`)
4. **デフォルトの activeGroup**(最初に表示するタブ)
5. **「コメダ珈琲店 」 → "{店舗名}"** の表示部分

#### GROUPS 構造の例

```javascript
// コメダ方式(4タブ)
const GROUPS = [
  {
    id: "food",
    labelKey: "group.food",
    categories: ["サンドイッチ", "ハンバーガー", "プレート", "スパゲッティ", "ホットスナック", "サラダ"],
  },
  {
    id: "drink",
    labelKey: "group.drink",
    categories: ["ホットドリンク", "コールドドリンク", "ジュース"],
  },
  {
    id: "dessert",
    labelKey: "group.dessert",
    categories: ["デザート", "おやつ"],
  },
  {
    id: "morning",
    labelKey: "group.morning",
    categories: ["モーニング", "お子様セット"],
  },
];

// くら寿司方式(3タブ)
const GROUPS = [
  { id: "main", labelKey: "group.main", categories: ["定番寿司", "限定商品"] },
  { id: "side", labelKey: "group.side", categories: ["サイドメニュー", "デザート"] },
  { id: "drink", labelKey: "group.drink", categories: ["ドリンク"] },
];
```

### ファイル③: `page.module.css` のテンプレート

**くら寿司の `page.module.css` をベースにコピー** → 色だけ置換。

#### 置換すべき色(8パターン)

| 用途 | くら寿司の色 | 新店舗で置き換える色の例(コメダ) |
|---|---|---|
| アレルギー注意背景 | `#fff8e6` | ブランド薄色(例: `#f5efe8`) |
| アレルギー注意ボーダー | `#f4d97a` | 中間色(例: `#d4b896`) |
| アレルギー注意文字 | `#6b4e00` | ブランドメイン(例: `#5d4037`) |
| リンク色 | `#5c3d00` | 濃いめ(例: `#4e342e`) |
| strong文字 | `#3d2700` | さらに濃い(例: `#3e2723`) |
| アレルゲンタグ | `#b8741b` | 中間茶(例: `#8d6e63`) |
| タグ背景 | `#fef3e0` | 淡いベージュ(例: `#efebe9`) |
| アレルゲンなし(緑) | `#2a7a4c` | **変更しない**(機能色なので維持) |

#### macOS での sed コマンド(例: コメダ)

```bash
sed -i '' \
  -e 's/#fff8e6/#f5efe8/g' \
  -e 's/#f4d97a/#d4b896/g' \
  -e 's/#6b4e00/#5d4037/g' \
  -e 's/#5c3d00/#4e342e/g' \
  -e 's/#3d2700/#3e2723/g' \
  -e 's/#b8741b/#8d6e63/g' \
  -e 's/#fef3e0/#efebe9/g' \
  page.module.css
```

---

## 📋 ステップ7: 英語版ツールページ作成(1ファイルのみ)

### ファイル構成

```
app/en/calorie-checker-{chain}/   ← 新規ディレクトリ
└── page.js                       ← 1ファイルのみ
```

> ⚠️ **重要**: 英語版は **`{Chain}Client.js` を新規作成しない**。日本語版のクライアントを `locale="en"` で呼び出すだけ。

### テンプレート

```javascript
import { getMenusByChain } from "@/lib/microcms";
import {Chain}Client from "@/app/calorie-checker-{chain}/{Chain}Client";

export const metadata = {
  title: "{店舗名(英語)} Calorie & Allergen Calculator | Calorie Checker",
  description:
    "Calculate calories and check allergen information for all {店舗名(英語)} menu items. Instantly see total calories, plus which of the major allergens (egg, milk, wheat, etc.) are in your selection. Essential tool for visitors with food allergies.",
  keywords: [
    "{店舗名(英語)} calorie",
    "{店舗名(英語)} allergen",
    "{店舗名(英語)} allergy",
    "{店舗名(英語)} menu",
    "Japan {カテゴリ(英語)} calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-{chain}",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-{chain}",
      "en": "https://www.calorie-check.com/en/calorie-checker-{chain}",
      "x-default": "https://www.calorie-check.com/calorie-checker-{chain}",
    },
  },
};

export const revalidate = 3600;

export default async function {Chain}EnPage() {
  const data = await getMenusByChain("{店舗名(日本語)}");
  const menus = data.contents;
  return <{Chain}Client menus={menus} locale="en" />;
}
```

---

## 📋 ステップ8: トップページ公開化(`lib/chains.js`)

### 変更内容(たった1行)

`lib/chains.js` を開いて、該当チェーンを探す。

#### Before
```javascript
{ name: '店舗名', href: null, available: false },
```

#### After
```javascript
{ name: '店舗名', href: '/calorie-checker-{chain}', available: true },
```

### 既にチェーンがリストにある場合(コメダパターン)

`available: false` を `true` に変えて `href` を設定するだけ。

### 新規チェーンの場合

該当カテゴリ(burger/cafe/pizza/gyudon/sushi/ramen/teishoku)の `chains` 配列に新しい要素を追加:

```javascript
chains: [
  // ... 既存の店舗
  { name: '新店舗名', href: '/calorie-checker-{chain}', available: true },
],
```

### sedコマンドでの一発置換(macOS)

```bash
sed -i '' \
  "s|{ name: '店舗名', href: null, available: false }|{ name: '店舗名', href: '/calorie-checker-{chain}', available: true }|" \
  lib/chains.js
```

---

## 📋 ステップ9: sitemap.js にチェーンパスを追加 ★v1.1で新設

トップページ公開化(ステップ8)だけでは、Google にページが認識されません。
**`app/sitemap.js` にチェーンのパスを追加**して、検索エンジンにインデックスさせます。

### 9-1. ファイルを開く

```
app/sitemap.js
```

### 9-2. 日英両対応チェーンの場合(基本これ)

`BILINGUAL_CHAIN_PATHS` 配列にチェーンのパスを追加するだけ:

```javascript
const BILINGUAL_CHAIN_PATHS = [
  "/calorie-checker-mcdonalds",
  "/calorie-checker-mos",
  "/calorie-checker-burgerking",
  "/calorie-checker-zetteria",
  "/calorie-checker-starbucks",
  "/calorie-checker-komeda",
  "/calorie-checker-tullys",
  "/calorie-checker-{新チェーン}",   // ← ここに1行追加
  "/calorie-checker-yoshinoya",
  "/calorie-checker-kura",
  "/calorie-checker-freshness",
];
```

→ この1行だけで、以下が**自動的に**サイトマップに含まれます:
- 日本語版URL(`/calorie-checker-{chain}`)
- 英語版URL(`/en/calorie-checker-{chain}`)
- hreflang alternates(ja / en / x-default)

> 💡 配置順は「同じカテゴリのチェーンの近く」に置くと管理しやすい
> (例: カフェ系ならスタバ・コメダ・タリーズの並びに)

### 9-3. 日本語のみのチェーンの場合(例外)

英語版ページ(`/en/calorie-checker-{chain}`)を**作っていない**場合は、
`BILINGUAL_CHAIN_PATHS` ではなく `jaOnlyPages` 配列に手動で追加:

```javascript
const jaOnlyPages = [
  // ...既存...
  {
    url: `${SITE_URL}/calorie-checker-{chain}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
];
```

> ⚠️ 存在しない英語版URLを `BILINGUAL_CHAIN_PATHS` に入れると、
> 404ページがサイトマップに載ってしまう。英語版の有無を必ず確認。

### 9-4. 確認

```bash
npm run dev
# ブラウザで開く:
# http://localhost:3000/sitemap.xml
# → 追加したチェーンのURL(日・英)が含まれているか確認
```

> 🚨 **このステップを忘れると**: ページは存在するが Google にインデックスされず、
> 検索流入がゼロになる。SEOが命のサイトなので**絶対に飛ばさないこと**。

---

## 📋 ステップ10: デプロイ & 本番確認

### ローカル確認

```bash
cd ~/Documents/calorie-checker
npm run dev
```

#### チェックリスト

| URL | 期待結果 |
|---|---|
| `http://localhost:3000/` | カテゴリの「公開中」カウントが増えている |
| `http://localhost:3000/category/{slug}` | 新店舗が緑表示で「公開中」 |
| `http://localhost:3000/calorie-checker-{chain}` | 日本語版が完全動作 |
| `http://localhost:3000/en/calorie-checker-{chain}` | 英語版が完全動作 |
| 既存チェーン全部(マック/くら寿司など) | 今までと完全に同じ動作 |

#### 動作確認の必須項目

- [ ] タブが表示される(4タブ or 3タブ)
- [ ] 各タブで件数が表示されている
- [ ] メニューをクリック → 右側のカロリーが動く
- [ ] アレルゲンタグが表示される
- [ ] 「期間限定」バッジが正しく付いている
- [ ] 検索バーが動く
- [ ] モバイルでもボトムシートが動く
- [ ] パンくず: ホーム / カテゴリ / 店舗名
- [ ] 言語切替で英語版に遷移できる
- [ ] **他チェーンが何も壊れていない**

### デプロイ

```bash
cd ~/Documents/calorie-checker

git status
# 変更ファイルが想定通りか確認:
#   - lib/chains.js (modified)
#   - app/sitemap.js (modified) ← ★v1.1で追加
#   - app/calorie-checker-{chain}/page.js (new)
#   - app/calorie-checker-{chain}/{Chain}Client.js (new)
#   - app/calorie-checker-{chain}/page.module.css (new)
#   - app/en/calorie-checker-{chain}/page.js (new)
#   - lib/{chain}-customizations.js (new・カスタマイズがある場合)

git add .
git commit -m "feat: add {店舗名} calorie checker

- Add Japanese page at /calorie-checker-{chain}
- Add English page at /en/calorie-checker-{chain}
- Add to sitemap.js for SEO indexing
- Enable on homepage cafe category
- Import {件数} menu items to microCMS"

git push origin main
```

### 本番確認(Vercel デプロイ完了後 1〜2分)

| URL | 確認内容 |
|---|---|
| `https://www.calorie-check.com/` | 公開中カウント増加 |
| `https://www.calorie-check.com/category/{slug}` | 新店舗が表示 |
| `https://www.calorie-check.com/calorie-checker-{chain}` | ツールページが動く |
| `https://www.calorie-check.com/en/calorie-checker-{chain}` | 英語版が動く |

### SEO 設定

```
1. Google Search Console を開く
2. 上部の URL検査バーに新店舗のURLを入力
3. 「インデックス登録をリクエスト」をクリック
4. 英語版URLも同様に
```

---

## 🎨 チェーンカラー早見表(参考)

新店舗のCSSカラー設計時に参考にしてください:

| チェーン | メインカラー | 副カラー |
|---|---|---|
| マクドナルド | `#FFC72C`(黄) | `#DA291C`(赤) |
| バーガーキング | `#D62300`(赤) | `#F5EBDC`(クリーム) |
| モスバーガー | `#006A4D`(緑) | `#FDB913`(黄) |
| ゼッテリア | `#1A1A1A`(黒) | `#E60012`(赤) |
| スターバックス | `#006241`(緑) | `#1E3932`(濃緑) |
| フレッシュネス | `#7BAA2A`(緑) | `#FFA600`(オレンジ) |
| 吉野家 | `#FF6600`(オレンジ) | `#000000`(黒) |
| くら寿司 | `#FFD700`(黄) | `#B8741B`(オレンジ茶) |
| コメダ珈琲店 | `#5D4037`(茶) | `#D4B896`(ベージュ) |

---

## 📐 GROUPS タブ構成の判断基準

新店舗のタブ数を決めるときの目安:

| メニュー総数 | 推奨タブ数 | 例 |
|---|---|---|
| 〜50品 | **2タブ** | フード / ドリンク |
| 50〜150品 | **3タブ**(くら寿司方式) | メイン / サイド / ドリンク |
| 150〜250品 | **4タブ**(コメダ方式) | フード / ドリンク / デザート / モーニング |
| 250品以上 | **5タブ** or **絞り込みUI改善** | フード / ドリンク / デザート / モーニング / その他 |

### タブごとの件数バランス(理想)

各タブの件数が**最低10件以上、最大100件以内**になるように調整。極端な偏りは UX を悪化させる。

---

## 🚨 よくあるトラブルと対処

### トラブル①: microCMSインポートで全件エラー

```
原因: chain or category スキーマに値が未登録
対処: ステップ4を再確認
```

### トラブル②: ローカルで「Module not found」エラー

```
原因: ファイルのパスが間違い(@/app/calorie-checker-... が違う)
対処: ファイル名・ディレクトリ名の大文字小文字を確認
```

### トラブル③: ローカルで「getMenusByChain is not a function」

```
原因: lib/microcms.js のexport不備
対処: lib/microcms.js を確認(基本既存のものをそのまま使えるはず)
```

### トラブル④: 日本語ページOK・英語ページが404

```
原因: app/en/calorie-checker-{chain}/page.js が無い or import先がおかしい
対処: ステップ7を再実施
```

### トラブル⑤: トップページに公開バッジが出ない

```
原因: lib/chains.js のavailable: false のまま
対処: ステップ8を再確認
```

### トラブル⑥: 既存チェーンが壊れた

```
原因: 既存ファイルを誤って編集した
対処: git diff で差分確認 → git checkout で元に戻す
```

---

## 📋 1チャットで店舗追加を完遂する流れ

Claude とのチャットを変えても、以下のメッセージを最初に投げれば再現可能:

### 依頼テンプレート(コピペ用)

```
新しい店舗をカロリーチェッカーに追加したいです。

【店舗情報】
- 店舗名: ◯◯◯◯◯
- カテゴリ: バーガー / カフェ / ピザ / 牛丼 / 寿司 / ラーメン / 定食(該当のもの)
- データソース: 公式PDF / 公式サイト / 自作CSV
- 想定メニュー数: 約◯◯品

【参照ドキュメント】
- MASTER-handover-merged-v7.md(プロジェクト引継書)
- BLOG-DESIGN-GUIDE-v1.1.md(ブログマニュアル・参考用)
- STORE-ADDITION-GUIDE-v1.1.md(このファイル・店舗追加マニュアル)

【依頼】
このマニュアルに従って、10ステップで完遂してください。
ステップ2の7つの確認事項から始めてください。
※ ステップ9(sitemap.js追加)とステップ10(デプロイ)を忘れずに。
```

---

## 📚 関連ドキュメント

- **MASTER-handover-merged-v7.md**: プロジェクト全体の引継書
- **BLOG-DESIGN-GUIDE-v1.1.md**: ブログマニュアル(記事執筆向け)
- **STORE-ADDITION-GUIDE-v1.1.md**: このファイル(店舗追加マニュアル)

---

## 🎉 過去の実装履歴(参考)

このマニュアルが基にした実装パターン:

| 店舗 | 実装日 | 件数 | PFC | データ方式 |
|---|---|---|---|---|
| マクドナルド | 〜2025 | ~200 | あり | コードファイル |
| スターバックス | 〜2025 | ~150 | あり | コードファイル |
| モスバーガー | 〜2025 | ~120 | あり | コードファイル |
| バーガーキング | 〜2025 | ~100 | あり | コードファイル |
| ゼッテリア | 〜2025 | ~80 | あり | コードファイル |
| 吉野家 | 〜2025 | ~90 | あり | コードファイル |
| フレッシュネスバーガー | 〜2025 | ~100 | あり | コードファイル |
| くら寿司 | 〜2025 | ~70 | なし | microCMS |
| **コメダ珈琲店** | **2026/5/20** | **216** | **なし** | **microCMS** ← この実装で本マニュアル確立 |

---

**作成者**: CHAMANO & Claude  
**最終更新**: 2026年5月20日  
**バージョン**: v1.0(コメダ実装で確立)

このマニュアル1本で、誰がチャットを引き継いでも同じ品質で店舗追加ができます。
新店舗の追加、お楽しみください ☕✨
