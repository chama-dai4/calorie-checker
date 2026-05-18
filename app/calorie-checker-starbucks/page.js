import { getMenusByChain } from "@/lib/microcms";
import StarbucksClient from "./StarbucksClient";

export const metadata = {
  title: "スタバのカロリー計算【ミルク変更・カスタマイズ対応】| 2026年最新・全メニュー",
  description:
    "スターバックスの全ドリンク・フードから選ぶだけで合計カロリーを瞬時に算出。ミルク変更(豆乳・オーツ・無脂肪)・サイズ・カスタマイズ対応の無料ツール。ダイエット・カロリー管理に。2026年最新版。",
  keywords: [
    "スタバ カロリー 計算",
    "スターバックス カロリー 計算",
    "スタバ カロリー",
    "スタバ ミルク変更 カロリー",
    "スタバ 豆乳 カロリー",
    "スタバ ダイエット",
    "フラペチーノ カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-starbucks",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-starbucks",
      en: "https://www.calorie-check.com/en/calorie-checker-starbucks",
      "x-default": "https://www.calorie-check.com/calorie-checker-starbucks",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "スターバックスのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-starbucks",
      description:
        "スターバックスの全ドリンク・フードから選ぶだけで合計カロリーを瞬時に算出する無料ツール。ミルク変更・サイズ・カスタマイズ対応。",
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
        { "@type": "ListItem", position: 3, name: "スターバックス", item: "https://www.calorie-check.com/calorie-checker-starbucks" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function StarbucksPage() {
  const data = await getMenusByChain("スターバックス");
  const menus = data.contents;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StarbucksClient menus={menus} locale="ja" />
    </>
  );
}