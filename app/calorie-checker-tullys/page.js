import { getMenusByChain } from "@/lib/microcms";
import TullysClient from "./TullysClient";

export const metadata = {
  title: "タリーズのカロリー計算【サイズ・ミルク変更・カスタマイズ対応】| 2026年最新・全メニュー",
  description:
    "タリーズコーヒーの全ドリンク・フードから選ぶだけで合計カロリーを瞬時に算出。サイズ(ショート/トール/グランデ)・ミルク変更(豆乳)・カスタマイズ対応の無料ツール。ダイエット・カロリー管理に。2026年最新版。",
  keywords: [
    "タリーズ カロリー 計算",
    "タリーズコーヒー カロリー 計算",
    "タリーズ カロリー",
    "タリーズ 豆乳 カロリー",
    "タリーズ ラテ カロリー",
    "タリーズ ダイエット",
    "スワークル カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-tullys",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-tullys",
      en: "https://www.calorie-check.com/en/calorie-checker-tullys",
      "x-default": "https://www.calorie-check.com/calorie-checker-tullys",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "タリーズコーヒーのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-tullys",
      description:
        "タリーズコーヒーの全ドリンク・フードから選ぶだけで合計カロリーを瞬時に算出する無料ツール。サイズ・ミルク変更・カスタマイズ対応。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "カフェ", item: "https://www.calorie-check.com/category/cafe" },
        { "@type": "ListItem", position: 3, name: "タリーズコーヒー", item: "https://www.calorie-check.com/calorie-checker-tullys" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function TullysPage() {
  const data = await getMenusByChain("タリーズコーヒー");
  const menus = data.contents;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TullysClient menus={menus} locale="ja" />
    </>
  );
}
