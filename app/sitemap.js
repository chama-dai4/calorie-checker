import { CATEGORIES } from "@/lib/chains";
import { getBlogPosts } from "@/lib/microcms";

const SITE_URL = "https://www.calorie-check.com";

// 日本語/英語両対応のチェーン店パス
const BILINGUAL_CHAIN_PATHS = [
  "/calorie-checker-mcdonalds",
  "/calorie-checker-mos",
  "/calorie-checker-burgerking",
  "/calorie-checker-zetteria",
  "/calorie-checker-starbucks",
  "/calorie-checker-komeda",
  "/calorie-checker-tullys",
  "/calorie-checker-sanmarc",
  "/calorie-checker-yayoiken",
  "/calorie-checker-yoshinoya",
  "/calorie-checker-kura",
  "/calorie-checker-freshness",
  "/calorie-checker-pizzahut",
  "calorie-checker-domino",
  "/calorie-checker-gusto",
  "/calorie-checker-saizeriya",
  "/calorie-checker-hidakaya",
  "/calorie-checker-dennys",
  "/calorie-checker-matsuya",
  "/calorie-checker-sukiya",
  "/calorie-checker-nakau",
  "/calorie-checker-mistd",
  "/calorie-checker-tenya",
  "/calorie-checker-ootoya",
  "/calorie-checker-hanamaru",
  "/calorie-checker-marugame",
  "/calorie-checker-veloce",
];

// 日本語/英語両対応の言語マップを生成するヘルパー
function buildLanguagesMap(pathSegment) {
  return {
    ja: `${SITE_URL}${pathSegment}`,
    en: `${SITE_URL}/en${pathSegment}`,
    "x-default": `${SITE_URL}${pathSegment}`,
  };
}

export default async function sitemap() {
  // ===== 固定ページ =====

  // ホーム（日本語版）
  const homeJa = {
    url: `${SITE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
    alternates: { languages: buildLanguagesMap("/") },
  };

  // ホーム（英語版）
  const homeEn = {
    url: `${SITE_URL}/en`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
    alternates: { languages: buildLanguagesMap("/") },
  };

  // チェーン店（日本語版）— alternates付き
  const chainPagesJa = BILINGUAL_CHAIN_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
    alternates: { languages: buildLanguagesMap(path) },
  }));

  // チェーン店（英語版）— alternates付き
  const chainPagesEn = BILINGUAL_CHAIN_PATHS.map((path) => ({
    url: `${SITE_URL}/en${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
    alternates: { languages: buildLanguagesMap(path) },
  }));

  // 日本語のみのページ（about / privacy / contact / blog一覧）
  const jaOnlyPages = [
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ===== カテゴリページ（日本語版）— alternates付き =====
  const categoryPagesJa = CATEGORIES.map((cat) => {
    const path = `/category/${cat.slug}`;
    return {
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: buildLanguagesMap(path) },
    };
  });

  // ===== カテゴリページ（英語版）— alternates付き =====
  const categoryPagesEn = CATEGORIES.map((cat) => {
    const path = `/category/${cat.slug}`;
    return {
      url: `${SITE_URL}/en${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: buildLanguagesMap(path) },
    };
  });

  // ===== ブログ記事ページ（日本語のみ） =====
  let blogPages = [];
  try {
    const blogData = await getBlogPosts();
    blogPages = blogData.contents.map((post) => ({
      url: `${SITE_URL}/blog/${post.id}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (e) {
    console.error("Failed to fetch blog posts for sitemap:", e);
  }

  return [
    homeJa,
    homeEn,
    ...chainPagesJa,
    ...chainPagesEn,
    ...jaOnlyPages,
    ...categoryPagesJa,
    ...categoryPagesEn,
    ...blogPages,
  ];
}
