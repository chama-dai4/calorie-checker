import { getMenusByChain } from "@/lib/microcms";
import MosClient from "./MosClient";

export const metadata = {
  title: "モスバーガーのカロリー計算【サイズ別対応】| 2026年最新・全メニュー合計",
  description:
    "モスバーガーの全メニューから選ぶだけで、合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出。モスチーズバーガー、ロースカツバーガーなどのカロリーが一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "モスバーガー カロリー 計算",
    "モス カロリー 計算",
    "モスバーガー カロリー",
    "モスチーズバーガー カロリー",
    "モス ダイエット",
    "モス セット カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-mos",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-mos",
      en: "https://www.calorie-check.com/en/calorie-checker-mos",
      "x-default": "https://www.calorie-check.com/calorie-checker-mos",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "モスバーガーのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-mos",
      description:
        "モスバーガーの全メニューから選ぶだけで合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出する無料ツール。",
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
        { "@type": "ListItem", position: 3, name: "モスバーガー", item: "https://www.calorie-check.com/calorie-checker-mos" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function MosPage() {
  const data = await getMenusByChain("モスバーガー");
  const menus = data.contents;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MosClient menus={menus} locale="ja" />
    </>
  );
}