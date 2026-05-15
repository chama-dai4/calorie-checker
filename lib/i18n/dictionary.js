// =====================================================
// 翻訳辞書（日英対応の全文言を一元管理）
// =====================================================
// 使い方:
//   import { getDictionary } from "@/lib/i18n/dictionary";
//   const dict = getDictionary("en");
//   dict.common.backToHome  // → "← Back to Home"
//
// 新しい文言を追加するときは、ja と en の両方を必ず記述してください。
// 英訳が決まっていない場合は、暫定で日本語を入れておけば動作はします。
// =====================================================

const dictionary = {
  // ===== 共通 =====
  common: {
    backToHome: {
      ja: "← ホームに戻る",
      en: "← Back to Home",
    },
    home: {
      ja: "ホーム",
      en: "Home",
    },
    language: {
      ja: "言語",
      en: "Language",
    },
    japanese: {
      ja: "日本語",
      en: "日本語",
    },
    english: {
      ja: "English",
      en: "English",
    },
  },

  // ===== メタデータ（SEO用） =====
  meta: {
    siteTitle: {
      ja: "カロリーチェッカー | 外食チェーンのカロリー計算サイト",
      en: "Calorie Checker | Calorie Calculator for Japan's Chain Restaurants",
    },
    siteDescription: {
      ja: "マクドナルド、スターバックスなど、外食チェーンのメニューを選ぶだけで合計カロリーと栄養素(たんぱく質・脂質・炭水化物)が分かるサービスです。",
      en: "Select menu items from major Japanese chain restaurants like McDonald's Japan and Starbucks Japan, and instantly see total calories and nutrition (protein, fat, carbs).",
    },
  },

  // ===== ホームページ =====
  home: {
    heroLine1: {
      ja: "外食前に、",
      en: "Before eating out in Japan,",
    },
    heroLine2: {
      ja: "カロリーをサッと確認。",
      en: "check the calories instantly.",
    },
    heroDescription: {
      ja: "チェーン店のメニューを選ぶだけで、合計カロリー・たんぱく質・脂質・炭水化物が一目で分かります。",
      en: "Just select menu items from major chain restaurants in Japan, and see total calories, protein, fat, and carbs at a glance.",
    },
    browseByCategory: {
      ja: "カテゴリから探す",
      en: "Browse by Category",
    },
    chainsLabel: {
      ja: "店舗",
      en: "chains",
    },
    availableLabel: {
      ja: "公開中",
      en: "available",
    },
  },

  // ===== カテゴリページ（/category/[slug]） =====
  categoryPage: {
    availableSectionTitle: {
      ja: "公開中",
      en: "Available",
    },
    comingSoonSectionTitle: {
      ja: "公開準備中",
      en: "Coming Soon",
    },
    chainsCount: {
      ja: "店舗",
      en: "chains",
    },
    availableBadge: {
      ja: "公開中",
      en: "Available",
    },
    comingSoonBadge: {
      ja: "Coming soon",
      en: "Coming soon",
    },
  },

  // ===== チェーンページ共通UI =====
  chain: {
    subtitleWithSize: {
      ja: "メニューを選んでサイズを指定。合計カロリーが分かります。",
      en: "Select items and choose a size. See your total calories instantly.",
    },
    subtitleDefault: {
      ja: "メニューを選ぶだけで合計カロリーが分かります。",
      en: "Just select menu items to see total calories instantly.",
    },
    subtitleAllergen: {
      ja: "メニューを選ぶと合計カロリーとアレルゲンが分かります。",
      en: "Select items to see total calories and allergen information.",
    },
    searchPlaceholder: {
      ja: "メニュー名で検索",
      en: "Search menu items",
    },
    noResults: {
      ja: "該当するメニューがありません",
      en: "No menu items found",
    },
    all: {
      ja: "すべて",
      en: "All",
    },
    // 栄養素
    protein: {
      ja: "たんぱく質",
      en: "Protein",
    },
    fat: {
      ja: "脂質",
      en: "Fat",
    },
    carbs: {
      ja: "炭水化物",
      en: "Carbs",
    },
    // バッジ
    sizeLabel: {
      ja: "サイズ:",
      en: "Size:",
    },
    sizeOptionsAvailable: {
      ja: "サイズ選択あり",
      en: "Size options available",
    },
    storeExclusive: {
      ja: "店舗限定",
      en: "Store exclusive",
    },
    limitedItem: {
      ja: "期間限定",
      en: "Limited time",
    },
    // 合計カード
    total: {
      ja: "合計",
      en: "Total",
    },
    itemsSelected: {
      ja: "品 選択中",
      en: "items selected",
    },
    clearSelection: {
      ja: "選択をクリア",
      en: "Clear all",
    },
    selectedItems: {
      ja: "選択中のメニュー",
      en: "Selected items",
    },
    noSelectedItems: {
      ja: "選択されたメニューはありません",
      en: "No items selected",
    },
    tapForDetails: {
      ja: " · タップで詳細",
      en: " · Tap for details",
    },
    // モーダル
    chooseSize: {
      ja: "サイズを選択してください",
      en: "Choose a size",
    },
    cancel: {
      ja: "キャンセル",
      en: "Cancel",
    },
    done: {
      ja: "完了",
      en: "Done",
    },
    removeSelection: {
      ja: "選択を解除",
      en: "Remove",
    },
    close: {
      ja: "閉じる",
      en: "Close",
    },
    removeAria: {
      // 「{name}を解除」の {name} 部分を埋める形で使う
      ja: "を解除",
      en: " - remove",
    },
    // フッター注意書き
    disclaimerPrefix: {
      ja: "数値は",
      en: "Nutritional values reference the ",
    },
    disclaimerSuffix: {
      ja: "の成分情報を参照した参考値です。",
      en: " official website.",
    },
    disclaimerAffiliation: {
      // 「本サービスは{チェーン名}と提携・関係ありません」
      ja: "本サービスは",
      en: "This service is not affiliated with ",
    },
    disclaimerAffiliationSuffix: {
      ja: "と提携・関係ありません。最新かつ正確な情報は公式サイトをご確認ください。",
      en: ". Please check the official website for the latest and most accurate information.",
    },
    officialSite: {
      ja: "公式サイト",
      en: "official website",
    },
    // ===== スタバ専用 =====
    subtitleStarbucks: {
      ja: "メニューを選んでミルクとカスタマイズを指定。合計カロリーが分かります。",
      en: "Select items, then choose milk and customizations. See your total calories instantly.",
    },
    starbucksSizeNote: {
      ja: "カロリーはトール（Tall）サイズの値を表示しています。サイズによってカロリーは異なります。",
      en: "Calorie values shown are for Tall size. Calories vary by size.",
    },
    milkLabel: {
      ja: "ミルク:",
      en: "Milk:",
    },
    customCount: {
      // 「カスタム X点」「カスタム X items」
      ja: "カスタム",
      en: "Custom",
    },
    customCountUnit: {
      ja: "点",
      en: "items",
    },
    chooseMilk: {
      ja: "ミルクを選択してください",
      en: "Choose your milk",
    },
    chooseCustom: {
      ja: "カスタマイズを追加（任意・最大10個まで）",
      en: "Add customizations (optional, up to 10)",
    },
    next: {
      ja: "次へ",
      en: "Next",
    },
    backToMilk: {
      ja: "← ミルクに戻る",
      en: "← Back to Milk",
    },
    // ===== くら寿司専用 =====
    subtitleKura: {
      ja: "メニューを選んで合計カロリーをチェック。アレルゲン情報も確認できます。",
      en: "Select items to see total calories. Allergen information is also displayed.",
    },
    limited: {
      ja: "限定",
      en: "Limited",
    },
    // ===== アレルゲン関連 =====
    allergenNotice: {
      // 注意書き本文
      ja: "本サービスのアレルゲン情報は参考値です。アレルギーをお持ちの方は、必ず",
      en: "The allergen information shown here is for reference only. If you have food allergies, please always check the latest information on the ",
    },
    allergenNoticeSuffix: {
      ja: "の最新情報をご確認ください。",
      en: " official website.",
    },
    allergenNoticeTitle: {
      ja: "⚠️ アレルゲン情報について",
      en: "⚠️ About allergen information",
    },
    allergenContainsLabel: {
      // 「含む:」（短いラベル、メニュー行用）
      ja: "含む:",
      en: "Contains:",
    },
    allergenContainsHeading: {
      // 「含まれるアレルゲン」（合計サマリー用）
      ja: "含まれるアレルゲン",
      en: "Contains",
    },
    allergenSameLineHeading: {
      // 「同ライン製造」
      ja: "同ライン製造",
      en: "May contain (same production line)",
    },
    allergenNone: {
      // 「特定アレルゲンなし」
      ja: "特定アレルゲンなし",
      en: "No major allergens",
    },
    allergenNoneShort: {
      // サマリー内の「なし」
      ja: "なし",
      en: "None",
    },
    allergenContainsPreview: {
      // モバイル下部 「含む:」
      ja: "含む:",
      en: "Contains:",
    },
    kuraDisclaimerAffiliation: {
      // くら寿司の特殊免責文
      ja: "本サービスはくら寿司と提携・関係ありません。アレルギーをお持ちの方は、必ず公式サイトで最新かつ正確な情報をご確認ください。",
      en: "This service is not affiliated with Kura Sushi. If you have food allergies, please always check the official website for the latest and most accurate information.",
    },
  },

  // ===== 大区分（GROUPS） =====
  group: {
    main: {
      ja: "主要メニュー",
      en: "Main / 主要メニュー",
    },
    side: {
      ja: "サイド",
      en: "Side / サイド",
    },
    drink: {
      ja: "ドリンク",
      en: "Drink / ドリンク",
    },
    takeout: {
      ja: "テイクアウト",
      en: "Takeout / テイクアウト",
    },
  },

  // ===== サブカテゴリ（microCMSのcategoryセレクト値と完全一致） =====
  // 英語版では「英語 / 日本語」の併記スタイル
  // 注: useTranslation.js の tCategory() がこの section名を参照しています
  category: {
    "ハンバーガー": { ja: "ハンバーガー", en: "Burger / ハンバーガー" },
    "サイドメニュー": { ja: "サイドメニュー", en: "Side / サイドメニュー" },
    "デザート": { ja: "デザート", en: "Dessert / デザート" },
    "ドリンク": { ja: "ドリンク", en: "Drink / ドリンク" },
    "マックカフェ": { ja: "マックカフェ", en: "McCafé / マックカフェ" },
    "季節のおすすめ": { ja: "季節のおすすめ", en: "Seasonal / 季節のおすすめ" },
    "コーヒー": { ja: "コーヒー", en: "Coffee / コーヒー" },
    "エスプレッソ": { ja: "エスプレッソ", en: "Espresso / エスプレッソ" },
    "フラペチーノ®": { ja: "フラペチーノ®", en: "Frappuccino® / フラペチーノ®" },
    "ティー｜TEAVANA™": { ja: "ティー｜TEAVANA™", en: "Tea | TEAVANA™ / ティー" },
    "ティー": { ja: "ティー", en: "Tea / ティー" },
    "その他": { ja: "その他", en: "Other / その他" },
    "ペストリー": { ja: "ペストリー", en: "Pastry / ペストリー" },
    "フード": { ja: "フード", en: "Food / フード" },
    "サンドイッチ": { ja: "サンドイッチ", en: "Sandwich / サンドイッチ" },
    "パッケージフード": { ja: "パッケージフード", en: "Packaged Food / パッケージフード" },
    "丼": { ja: "丼", en: "Bowl / 丼" },
    "重・特別丼": { ja: "重・特別丼", en: "Special Bowl / 重・特別丼" },
    "皿(おかず)": { ja: "皿(おかず)", en: "Side Dish / 皿（おかず）" },
    "定食": { ja: "定食", en: "Set Meal / 定食" },
    "朝定食": { ja: "朝定食", en: "Morning Set / 朝定食" },
    "から揚げ系": { ja: "から揚げ系", en: "Karaage / から揚げ系" },
    "黒カレー": { ja: "黒カレー", en: "Black Curry / 黒カレー" },
    "油そばセット": { ja: "油そばセット", en: "Abura Soba Set / 油そばセット" },
    "お子様セット": { ja: "お子様セット", en: "Kids Set / お子様セット" },
    "テイクアウト専門": { ja: "テイクアウト専門", en: "Takeout Only / テイクアウト専門" },
    "サラダ": { ja: "サラダ", en: "Salad / サラダ" },
    "汁物": { ja: "汁物", en: "Soup / 汁物" },
    "トッピング": { ja: "トッピング", en: "Topping / トッピング" },
    "ご飯・ドレッシング": { ja: "ご飯・ドレッシング", en: "Rice & Dressing / ご飯・ドレッシング" },
    "とびきりバーガー": { ja: "とびきりバーガー", en: "Tobikiri Burger / とびきりバーガー" },
    "ソイパティ": { ja: "ソイパティ", en: "Soy Patty / ソイパティ" },
    "モスの菜摘": { ja: "モスの菜摘", en: "Mos Natsumi / モスの菜摘" },
    "モスライス/ホットドッグ": { ja: "モスライス/ホットドッグ", en: "Mos Rice/Hot Dog / モスライス・ホットドッグ" },
    "朝モス": { ja: "朝モス", en: "Morning Mos / 朝モス" },
    "モスワイワイセット": { ja: "モスワイワイセット", en: "Mos Wai-Wai Set / モスワイワイセット" },
    "低アレルゲン": { ja: "低アレルゲン", en: "Low Allergen / 低アレルゲン" },
    "ドリンク・スープ": { ja: "ドリンク・スープ", en: "Drink & Soup / ドリンク・スープ" },
    "ワッパー": { ja: "ワッパー", en: "Whopper / ワッパー" },
    "ビーフバーガー": { ja: "ビーフバーガー", en: "Beef Burger / ビーフバーガー" },
    "チキンバーガー": { ja: "チキンバーガー", en: "Chicken Burger / チキンバーガー" },
    "ポークバーガー": { ja: "ポークバーガー", en: "Pork Burger / ポークバーガー" },
    "フィッシュバーガー": { ja: "フィッシュバーガー", en: "Fish Burger / フィッシュバーガー" },
    "ホットドッグ": { ja: "ホットドッグ", en: "Hot Dog / ホットドッグ" },
    "コールドドリンク": { ja: "コールドドリンク", en: "Cold Drink / コールドドリンク" },
    "フロートドリンク": { ja: "フロートドリンク", en: "Float Drink / フロートドリンク" },
    "付属品": { ja: "付属品", en: "Accessory / 付属品" },
    "ホットドリンク": { ja: "ホットドリンク", en: "Hot Drink / ホットドリンク" },
    "モーニング": { ja: "モーニング", en: "Morning / モーニング" },
    "ジュース": { ja: "ジュース", en: "Juice / ジュース" },
    "シェーキ": { ja: "シェーキ", en: "Shake / シェーキ" },
    "アルコール": { ja: "アルコール", en: "Alcohol / アルコール" },
    "店舗限定": { ja: "店舗限定", en: "Store Exclusive / 店舗限定" },
    "牛丼": { ja: "牛丼", en: "Beef Bowl / 牛丼" },
    "定番寿司": { ja: "定番寿司", en: "Standard Sushi / 定番寿司" },
    "限定商品": { ja: "限定商品", en: "Limited Item / 限定商品" },
    "バンズ単品": { ja: "バンズ単品", en: "Buns / バンズ単品" },
    "期間限定バーガー": { ja: "期間限定バーガー", en: "Seasonal Burger / 期間限定バーガー" },
    "キッズバーガー": { ja: "キッズバーガー", en: "Kids Burger / キッズバーガー" },
    "フレバル": { ja: "フレバル", en: "FREBAR / フレバル" },
    "フレバル期間限定": { ja: "フレバル期間限定", en: "FREBAR Seasonal / フレバル期間限定" },
    "スープ": { ja: "スープ", en: "Soup / スープ" },
    "季節商品ドリンク": { ja: "季節商品ドリンク", en: "Seasonal Drink / 季節商品ドリンク" },
  },

  // ===== チェーン名（パンくず・タイトル表示用） =====
  chainName: {
    // 公開中チェーン
    "マクドナルド": { ja: "マクドナルド", en: "McDonald's Japan / マクドナルド" },
    "スターバックス": { ja: "スターバックス", en: "Starbucks Japan / スターバックス" },
    "吉野家": { ja: "吉野家", en: "Yoshinoya Japan / 吉野家" },
    "モスバーガー": { ja: "モスバーガー", en: "Mos Burger Japan / モスバーガー" },
    "バーガーキング": { ja: "バーガーキング", en: "Burger King Japan / バーガーキング" },
    "ゼッテリア": { ja: "ゼッテリア", en: "Zetteria Japan / ゼッテリア" },
    "くら寿司": { ja: "くら寿司", en: "Kura Sushi Japan / くら寿司" },
    // Coming soon のチェーン名（カテゴリページでチェーン店名表示に使用）
    "フレッシュネスバーガー": { ja: "フレッシュネスバーガー", en: "Freshness Burger Japan / フレッシュネスバーガー" },
    "ドトール": { ja: "ドトール", en: "Doutor Japan / ドトール" },
    "タリーズ": { ja: "タリーズ", en: "Tully's Japan / タリーズ" },
    "コメダ珈琲店": { ja: "コメダ珈琲店", en: "Komeda's Coffee / コメダ珈琲店" },
    "サンマルクカフェ": { ja: "サンマルクカフェ", en: "Saint Marc Cafe / サンマルクカフェ" },
    "ピザハット": { ja: "ピザハット", en: "Pizza Hut Japan / ピザハット" },
    "ドミノ・ピザ": { ja: "ドミノ・ピザ", en: "Domino's Pizza Japan / ドミノ・ピザ" },
    "ピザーラ": { ja: "ピザーラ", en: "Pizza-La / ピザーラ" },
    "すき家": { ja: "すき家", en: "Sukiya / すき家" },
    "松屋": { ja: "松屋", en: "Matsuya / 松屋" },
    "なか卯": { ja: "なか卯", en: "Nakau / なか卯" },
    "スシロー": { ja: "スシロー", en: "Sushiro / スシロー" },
    "はま寿司": { ja: "はま寿司", en: "Hama Sushi / はま寿司" },
    "かっぱ寿司": { ja: "かっぱ寿司", en: "Kappa Sushi / かっぱ寿司" },
    "一蘭": { ja: "一蘭", en: "Ichiran / 一蘭" },
    "幸楽苑": { ja: "幸楽苑", en: "Kourakuen / 幸楽苑" },
    "丸源ラーメン": { ja: "丸源ラーメン", en: "Marugen Ramen / 丸源ラーメン" },
    "ラーメン二郎": { ja: "ラーメン二郎", en: "Ramen Jiro / ラーメン二郎" },
    "家系ラーメン": { ja: "家系ラーメン", en: "Iekei Ramen / 家系ラーメン" },
    "やよい軒": { ja: "やよい軒", en: "Yayoiken / やよい軒" },
    "大戸屋": { ja: "大戸屋", en: "Ootoya / 大戸屋" },
    "ガスト": { ja: "ガスト", en: "Gusto / ガスト" },
  },

  // ===== カテゴリ（カテゴリ詳細ページ用） =====
  // chains.jsのslugと一致させる
  categorySlug: {
    "burger": { ja: "ハンバーガー", en: "Burger / ハンバーガー" },
    "cafe": { ja: "カフェ", en: "Cafe / カフェ" },
    "pizza": { ja: "ピザ", en: "Pizza / ピザ" },
    "gyudon": { ja: "牛丼", en: "Beef Bowl / 牛丼" },
    "sushi": { ja: "寿司", en: "Sushi / 寿司" },
    "ramen": { ja: "ラーメン", en: "Ramen / ラーメン" },
    "teishoku": { ja: "定食", en: "Set Meal / 定食" },
  },

  // カテゴリの説明文（lib/chains.jsのdescription相当）
  categoryDescription: {
    "burger": {
      ja: "人気のバーガーチェーン",
      en: "Popular burger chains in Japan",
    },
    "cafe": {
      ja: "コーヒーチェーン・カフェ",
      en: "Coffee chains and cafes in Japan",
    },
    "pizza": {
      ja: "デリバリー・宅配ピザ",
      en: "Pizza delivery chains in Japan",
    },
    "gyudon": {
      ja: "牛丼・丼ものチェーン",
      en: "Gyudon (beef bowl) chains in Japan",
    },
    "sushi": {
      ja: "回転寿司チェーン",
      en: "Conveyor belt sushi chains in Japan",
    },
    "ramen": {
      ja: "ラーメンチェーン",
      en: "Ramen chains in Japan",
    },
    "teishoku": {
      ja: "定食・ファミレス",
      en: "Set meal restaurants and family restaurants in Japan",
    },
  },

  // ===== フッター =====
  footer: {
    siteFooterText: {
      ja: "数値は各社の公式情報を参照した参考値です。本サービスは各チェーン店と提携・関係ありません。",
      en: "Nutritional values reference official information from each chain. This service is not affiliated with any chain restaurant.",
    },
    blog: {
      ja: "ブログ",
      en: "Blog",
    },
    about: {
      ja: "運営者情報",
      en: "About",
    },
    privacy: {
      ja: "プライバシーポリシー",
      en: "Privacy Policy",
    },
    contact: {
      ja: "お問い合わせ",
      en: "Contact",
    },
    copyright: {
      ja: "© 2026 CHAMANO. All rights reserved.",
      en: "© 2026 CHAMANO. All rights reserved.",
    },
  },
};

// =====================================================
// 言語別の辞書を取得する関数
// =====================================================
// 使い方:
//   const dict = getDictionary("en");
//   dict.common.backToHome  // → "← Back to Home"
//
// ネストされたオブジェクトを言語別の文字列に変換します。
export function getDictionary(locale = "ja") {
  const result = {};
  for (const [section, entries] of Object.entries(dictionary)) {
    result[section] = {};
    for (const [key, translations] of Object.entries(entries)) {
      // 該当の言語がなければ ja にフォールバック
      result[section][key] = translations[locale] || translations.ja;
    }
  }
  return result;
}

// =====================================================
// 単一キーを取得する関数（fallback付き）
// =====================================================
// 使い方:
//   translate("category", "ハンバーガー", "en")  // → "Burger / ハンバーガー"
//   translate("chainName", "マクドナルド", "en")  // → "McDonald's Japan / マクドナルド"
//
// 辞書にキーがない場合は、入力されたkeyをそのまま返します（安全装置）。
export function translate(section, key, locale = "ja") {
  const sectionDict = dictionary[section];
  if (!sectionDict) return key;
  const entry = sectionDict[key];
  if (!entry) return key;
  return entry[locale] || entry.ja || key;
}

// 辞書オブジェクト全体を直接エクスポート（必要に応じて）
export { dictionary };

// サポートされている言語のリスト
export const SUPPORTED_LOCALES = ["ja", "en"];

// デフォルト言語
export const DEFAULT_LOCALE = "ja";