// カテゴリとチェーン店のデータ定義
// slug は URL に使う識別子（半角英数）
// available: 公開中のチェーン店は href を持ち、リンクが有効になる
//
// 多言語対応:
//   nameEn         : カテゴリの英語名（既存）
//   descriptionEn  : カテゴリ説明の英語訳（Phase 3で追加）

export const CATEGORIES = [
  {
    slug: 'burger',
    name: 'ハンバーガー',
    nameEn: 'Burger',
    iconName: 'Beef',
    description: '人気のバーガーチェーン',
    descriptionEn: 'Popular burger chains in Japan',
    chains: [
      { name: 'マクドナルド', href: '/calorie-checker-mcdonalds', available: true },
      { name: 'モスバーガー', href: '/calorie-checker-mos', available: true },
      { name: 'バーガーキング', href: '/calorie-checker-burgerking', available: true },
      { name: 'ゼッテリア', href: '/calorie-checker-zetteria', available: true },
      { name: 'フレッシュネスバーガー', href: '/calorie-checker-freshness', available: true },
    ],
  },
  {
    slug: 'cafe',
    name: 'カフェ',
    nameEn: 'Cafe',
    iconName: 'Coffee',
    description: 'コーヒーチェーン・カフェ',
    descriptionEn: 'Coffee chains and cafes in Japan',
    chains: [
      { name: 'スターバックス', href: '/calorie-checker-starbucks', available: true },
      { name: 'ドトール', href: null, available: false },
      { name: 'タリーズ', href: null, available: false },
      { name: 'コメダ珈琲店', href: '/calorie-checker-komeda', available: true },
      { name: 'サンマルクカフェ', href: null, available: false },
    ],
  },
  {
    slug: 'pizza',
    name: 'ピザ',
    nameEn: 'Pizza',
    iconName: 'Pizza',
    description: 'デリバリー・宅配ピザ',
    descriptionEn: 'Pizza delivery chains in Japan',
    chains: [
      { name: 'ピザハット', href: null, available: false },
      { name: 'ドミノ・ピザ', href: null, available: false },
      { name: 'ピザーラ', href: null, available: false },
    ],
  },
  {
    slug: 'gyudon',
    name: '牛丼',
    nameEn: 'Beef Bowl',
    iconName: 'Soup',
    description: '牛丼・丼ものチェーン',
    descriptionEn: 'Gyudon (beef bowl) chains in Japan',
    chains: [
      { name: '吉野家', href: '/calorie-checker-yoshinoya', available: true },
      { name: 'すき家', href: null, available: false },
      { name: '松屋', href: null, available: false },
      { name: 'なか卯', href: null, available: false },
    ],
  },
  {
    slug: 'sushi',
    name: '寿司',
    nameEn: 'Sushi',
    iconName: 'Fish',
    description: '回転寿司チェーン',
    descriptionEn: 'Conveyor belt sushi chains in Japan',
    chains: [
      { name: 'くら寿司', href: '/calorie-checker-kura', available: true },
      { name: 'スシロー', href: null, available: false },
      { name: 'はま寿司', href: null, available: false },
      { name: 'かっぱ寿司', href: null, available: false },
    ],
  },
  {
    slug: 'ramen',
    name: 'ラーメン',
    nameEn: 'Ramen',
    iconName: 'Soup',
    description: 'ラーメンチェーン',
    descriptionEn: 'Ramen chains in Japan',
    chains: [
      { name: '一蘭', href: null, available: false },
      { name: '幸楽苑', href: null, available: false },
      { name: '丸源ラーメン', href: null, available: false },
      { name: 'ラーメン二郎', href: null, available: false },
      { name: '家系ラーメン', href: null, available: false },
    ],
  },
  {
    slug: 'teishoku',
    name: '定食',
    nameEn: 'Set Meal',
    iconName: 'UtensilsCrossed',
    description: '定食・ファミレス',
    descriptionEn: 'Set meal restaurants and family restaurants in Japan',
    chains: [
      { name: 'やよい軒', href: null, available: false },
      { name: '大戸屋', href: null, available: false },
      { name: 'ガスト', href: null, available: false },
    ],
  },
];

// カテゴリ内の公開中件数を計算するヘルパー
export function getAvailableCount(category) {
  return category.chains.filter((c) => c.available).length;
}

// slug からカテゴリを取得（カテゴリ詳細ページで使用）
export function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}