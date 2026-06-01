import { getMenusByChain } from "@/lib/microcms";
import BurgerKingClient from "./BurgerKingClient";

export const metadata = {
title: "バーガーキング カロリー計算|ワッパー全メニュー&PFC",
  description:
    "バーガーキングの全メニューのカロリー・PFCをワンタップで合計。ワッパーやチーズワッパーなど人気メニューを低カロリー順に並び替えも可能。ダイエット中の食事選びにも役立つ無料ツール。",
  keywords: [
    "バーガーキング カロリー 計算",
    "バーキン カロリー 計算",
    "バーガーキング カロリー",
    "ワッパー カロリー",
    "バーガーキング ダイエット",
    "BK カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-burgerking",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-burgerking",
      en: "https://www.calorie-check.com/en/calorie-checker-burgerking",
      "x-default": "https://www.calorie-check.com/calorie-checker-burgerking",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "バーガーキングのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-burgerking",
      description:
        "バーガーキングの全メニューから選ぶだけで合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出する無料ツール。",
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
        { "@type": "ListItem", position: 3, name: "バーガーキング", item: "https://www.calorie-check.com/calorie-checker-burgerking" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function BurgerKingPage() {
  const data = await getMenusByChain("バーガーキング");
  const menus = data.contents;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BurgerKingClient menus={menus} locale="ja" />
    </>
  );
}