import { getMenusByChain } from "@/lib/microcms";
import KuraClient from "./KuraClient";

export const metadata = {
  title: "くら寿司のカロリー計算【アレルゲン対応】| 2026年最新・全メニュー対応",
  description:
    "くら寿司の全メニューから選ぶだけで、合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出。寿司、サイドメニュー、デザートなどのカロリーが一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "くら寿司 カロリー 計算",
    "くら寿司 カロリー",
    "くら寿司 寿司 カロリー",
    "くら寿司 ダイエット",
    "回転寿司 カロリー",
    "くら寿司 メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-kura",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-kura",
      en: "https://www.calorie-check.com/en/calorie-checker-kura",
      "x-default": "https://www.calorie-check.com/calorie-checker-kura",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "くら寿司のカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-kura",
      description:
        "くら寿司の全メニューから選ぶだけで合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出する無料ツール。",
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
        { "@type": "ListItem", position: 3, name: "くら寿司", item: "https://www.calorie-check.com/calorie-checker-kura" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function KuraPage() {
  const data = await getMenusByChain("くら寿司");
  const menus = data.contents;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <KuraClient menus={menus} locale="ja" />
    </>
  );
}