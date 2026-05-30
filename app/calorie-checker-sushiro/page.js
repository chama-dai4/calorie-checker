import { getMenusByChain } from "@/lib/microcms";
import SushiroClient from "./SushiroClient";

export const metadata = {
  title: "スシローのカロリー計算【アレルゲン対応】| 2026年最新・全メニュー対応",
  description:
    "スシローの全メニューから選ぶだけで、合計カロリーが瞬時に分かる無料ツール。にぎり、軍艦・巻物、サイドメニュー、ドリンク、デザートのカロリーとアレルゲン情報に対応。2026年最新版。",
  keywords: [
    "スシロー カロリー 計算",
    "スシロー カロリー",
    "スシロー 寿司 カロリー",
    "スシロー ダイエット",
    "回転寿司 カロリー",
    "スシロー メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-sushiro",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-sushiro",
      en: "https://www.calorie-check.com/en/calorie-checker-sushiro",
      "x-default": "https://www.calorie-check.com/calorie-checker-sushiro",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "スシローのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-sushiro",
      description:
        "スシローの全メニューから選ぶだけで合計カロリーが瞬時に分かる無料ツール。アレルゲン28品目対応。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "寿司", item: "https://www.calorie-check.com/category/sushi" },
        { "@type": "ListItem", position: 3, name: "スシロー", item: "https://www.calorie-check.com/calorie-checker-sushiro" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function SushiroPage() {
  const data = await getMenusByChain("スシロー");
  const menus = data.contents;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SushiroClient menus={menus} locale="ja" />
    </>
  );
}
