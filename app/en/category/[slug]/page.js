import { CATEGORIES, getCategoryBySlug } from "@/lib/chains";
import CategoryContent from "@/components/CategoryContent";

// 静的ビルド対象のスラッグ一覧を生成
export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

// 動的にメタデータを生成
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: "Page Not Found | Calorie Checker" };
  }

  const categoryNameEn = category.nameEn;
  const descriptionEn = category.descriptionEn || `${categoryNameEn} chains in Japan`;

  return {
    title: `${categoryNameEn} Chains in Japan | Calorie Checker`,
    description: `Calculate calories and nutrition for menu items at ${categoryNameEn} chain restaurants in Japan. ${descriptionEn}.`,
    alternates: {
      canonical: `https://www.calorie-check.com/en/category/${slug}`,
      languages: {
        "ja": `https://www.calorie-check.com/category/${slug}`,
        "en": `https://www.calorie-check.com/en/category/${slug}`,
        "x-default": `https://www.calorie-check.com/category/${slug}`,
      },
    },
  };
}

export default async function CategoryEnPage({ params }) {
  const { slug } = await params;
  return <CategoryContent slug={slug} locale="en" />;
}
