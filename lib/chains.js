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
      { name: 'タリーズコーヒー', href: '/calorie-checker-tullys', available: true },
      { name: 'コメダ珈琲店', href: '/calorie-checker-komeda', available: true },
      { name: 'サンマルクカフェ', href: '/calorie-checker-sanmarc', available: true },
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
      { name: 'ピザハット', href: '/calorie-checker-pizzahut', available: true },
      { name: 'ドミノ・ピザ', href: null, available: false },
      { name: 'ピザーラ', href: null, available: false },
    ],
  },
  {
    slug: 'gyudon',
    name: '丼',
    nameEn: 'Donburi',
    iconName: 'Soup',
    description: '牛丼・丼ものチェーン',
    descriptionEn: 'Donburi (rice bowl) chains in Japan',
    chains: [
      { name: '吉野家', href: '/calorie-checker-yoshinoya', available: true },
      { name: 'すき家', href: '/calorie-checker-sukiya', available: true },
      { name: '松屋', href: '/calorie-checker-matsuya', available: true },
      { name: 'なか卯', href: '/calorie-checker-nakau', available: true },
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
    name: '中華',
    nameEn: 'Chinese',
    iconName: 'Soup',
    description: '中華・ラーメンチェーン',
    descriptionEn: 'Chinese food and ramen chains in Japan',
    chains: [
      { name: '日高屋', href: '/calorie-checker-hidakaya', available: true },
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
    description: '定食レストラン',
    descriptionEn: 'Set meal restaurants in Japan',
    chains: [
      { name: 'やよい軒', href: '/calorie-checker-yayoiken', available: true },
      { name: '大戸屋', href: null, available: false },
    ],
  },
  {
    slug: 'famires',
    name: 'ファミレス',
    nameEn: 'Family Restaurant',
    iconName: 'Users',
    description: 'ファミリーレストランチェーン',
    descriptionEn: 'Family restaurant chains in Japan',
    chains: [
      { name: 'サイゼリヤ', href: '/calorie-checker-saizeriya', available: true },
      { name: 'ガスト', href: '/calorie-checker-gusto', available: true },
      { name: 'ジョナサン', href: null, available: false },
      { name: 'デニーズ', href: '/calorie-checker-dennys', available: true },
    ],
  },
  {
    slug: 'sweets',
    name: 'スイーツ',
    nameEn: 'Sweets',
    iconName: 'Donut',
    description: 'ドーナツ・スイーツチェーン',
    descriptionEn: 'Donut and sweets chains in Japan',
    chains: [
      { name: 'ミスタードーナツ', href: '/calorie-checker-mistd', available: true },
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