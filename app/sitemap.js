import { CATEGORIES } from "@/lib/chains";
import { getBlogPosts } from "@/lib/microcms";

const SITE_URL = "https://www.calorie-check.com";

export default async function sitemap() {
  // 固定ページ
  const staticPages = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/calorie-checker-mcdonalds`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/calorie-checker-starbucks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/calorie-checker-yoshinoya`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
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

  // カテゴリページ（/category/burger など）
  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // ブログ記事ページ（microCMSから取得）
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

  return [...staticPages, ...categoryPages, ...blogPages];
}