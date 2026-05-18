import { getMenusByChain } from "@/lib/microcms";
import FreshnessClient from "./FreshnessClient";

export const metadata = {
  title: "フレッシュネスバーガーのカロリー計算【グルメバーガー対応】| 2026年最新・全84品",
  description:
    "フレッシュネスバーガーの全84品から選ぶだけで、合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出。クラシックバーガー、アボカドバーガーなどのカロリーが一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "フレッシュネスバーガー カロリー 計算",
    "フレッシュネス カロリー",
    "フレッシュネスバーガー カロリー",
    "グルメバーガー カロリー",
    "フレッシュネス ダイエット",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-freshness",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-freshness",
      en: "https://www.calorie-check.com/en/calorie-checker-freshness",
      "x-default": "https://www.calorie-check.com/calorie-checker-freshness",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "フレッシュネスバーガーのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-freshness",
      description:
        "フレッシュネスバーガーの全84品から選ぶだけで合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出する無料ツール。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "ハンバーガー", item: "https://www.calorie-check.com/category/burger" },
        { "@type": "ListItem", position: 3, name: "フレッシュネスバーガー", item: "https://www.calorie-check.com/calorie-checker-freshness" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function FreshnessPage() {
  const data = await getMenusByChain("フレッシュネスバーガー");
  const menus = data.contents;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FreshnessClient menus={menus} locale="ja" />
    </>
  );
}