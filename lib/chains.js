// カテゴリとチェーン店のデータ定義
// slug は URL に使う識別子（半角英数）
// available: 公開中のチェーン店は href を持ち、リンクが有効になる

export const CATEGORIES = [
  {
    slug: 'burger',
    name: 'ハンバーガー',
    iconName: 'Beef',
    description: '人気のバーガーチェーン',
    chains: [
      { name: 'マクドナルド', href: '/calorie-checker-mcdonalds', available: true },
      { name: 'モスバーガー', href: null, available: false },
      { name: 'ロッテリア', href: null, available: false },
      { name: 'バーガーキング', href: null, available: false },
      { name: 'フレッシュネスバーガー', href: null, available: false },
    ],
  },
  {
    slug: 'cafe',
    name: 'カフェ',
    iconName: 'Coffee',
    description: 'コーヒーチェーン・カフェ',
    chains: [
      { name: 'スターバックス', href: '/calorie-checker-starbucks', available: true },
      { name: 'ドトール', href: null, available: false },
      { name: 'タリーズ', href: null, available: false },
      { name: 'コメダ珈琲店', href: null, available: false },
      { name: 'サンマルクカフェ', href: null, available: false },
    ],
  },
  {
    slug: 'pizza',
    name: 'ピザ',
    iconName: 'Pizza',
    description: 'デリバリー・宅配ピザ',
    chains: [
      { name: 'ピザハット', href: null, available: false },
      { name: 'ドミノ・ピザ', href: null, available: false },
      { name: 'ピザーラ', href: null, available: false },
    ],
  },
  {
    slug: 'gyudon',
    name: '牛丼',
    iconName: 'Soup',
    description: '牛丼・丼ものチェーン',
    chains: [
      { name: 'すき家', href: null, available: false },
      { name: '吉野家', href: null, available: false },
      { name: '松屋', href: null, available: false },
      { name: 'なか卯', href: null, available: false },
    ],
  },
  {
    slug: 'sushi',
    name: '寿司',
    iconName: 'Fish',
    description: '回転寿司チェーン',
    chains: [
      { name: 'スシロー', href: null, available: false },
      { name: 'くら寿司', href: null, available: false },
      { name: 'はま寿司', href: null, available: false },
      { name: 'かっぱ寿司', href: null, available: false },
    ],
  },
  {
    slug: 'ramen',
    name: 'ラーメン',
    iconName: 'Wheat',
    description: 'ラーメンチェーン',
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
    iconName: 'UtensilsCrossed',
    description: '定食・ファミレス',
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