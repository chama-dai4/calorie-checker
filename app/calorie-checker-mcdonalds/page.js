import { getMenusByChain } from "@/lib/microcms";
import McdonaldsClient from "./McdonaldsClient";

export const metadata = {
  title: "マック・マクドナルドのカロリー計算【2026年最新】| 全メニュー合計を瞬時に算出",
  description:
    "マクドナルドの全メニューから選ぶだけで、合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出。ビッグマック、ポテト、シェイクなどのカロリーが一目で分かる無料ツール。ダイエット・セット計算・栄養管理に。2026年最新版。",
  keywords: [
    "マック カロリー 計算",
    "マクドナルド カロリー 計算",
    "マック カロリー",
    "マクドナルド カロリー",
    "ビッグマック カロリー",
    "マック ダイエット",
    "マック セット カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-mcdonalds",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-mcdonalds",
      en: "https://www.calorie-check.com/en/calorie-checker-mcdonalds",
      "x-default": "https://www.calorie-check.com/calorie-checker-mcdonalds",
    },
  },
};

// 構造化データ(JSON-LD)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "マクドナルドのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-mcdonalds",
      description:
        "マクドナルドの全メニューから選ぶだけで合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出する無料ツール。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
      },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: "https://www.calorie-check.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "ハンバーガー",
          item: "https://www.calorie-check.com/category/burger",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "マクドナルド",
          item: "https://www.calorie-check.com/calorie-checker-mcdonalds",
        },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function McdonaldsPage() {
  const data = await getMenusByChain("マクドナルド");
  const menus = data.contents;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <McdonaldsClient menus={menus} locale="ja" />
    </>
  );
}