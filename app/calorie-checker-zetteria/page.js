import { getMenusByChain } from "@/lib/microcms";
import ZetteriaClient from "./ZetteriaClient";

export const metadata = {
  title: "ゼッテリア カロリー計算|全メニューPFC・低カロリー順も",
  description:
    "ゼッテリアの全メニューのカロリー・PFCをワンタップで合計。絶品チーズバーガーなど人気メニューを低カロリー順に並び替えも可能。ダイエット中の食事選びに役立つ無料ツール。",
  keywords: [
    "ゼッテリア カロリー 計算",
    "ゼッテリア カロリー",
    "絶品チーズバーガー カロリー",
    "ゼッテリア ダイエット",
    "ロッテリア カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-zetteria",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-zetteria",
      en: "https://www.calorie-check.com/en/calorie-checker-zetteria",
      "x-default": "https://www.calorie-check.com/calorie-checker-zetteria",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "ゼッテリアのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-zetteria",
      description:
        "ゼッテリアの全メニューから選ぶだけで合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出する無料ツール。",
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
        { "@type": "ListItem", position: 3, name: "ゼッテリア", item: "https://www.calorie-check.com/calorie-checker-zetteria" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function ZetteriaPage() {
  const data = await getMenusByChain("ゼッテリア");
  const menus = data.contents;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ZetteriaClient menus={menus} locale="ja" />
    </>
  );
}