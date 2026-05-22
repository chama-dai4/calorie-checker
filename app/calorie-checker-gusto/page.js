import { getMenusByChain } from "@/lib/microcms";
import GustoClient from "./GustoClient";

export const metadata = {
  title: "ガストのカロリー計算【全メニュー対応】| 2026年最新・アレルゲン情報付き",
  description:
    "ガストの全メニューから選ぶだけで、合計カロリーを瞬時に算出。ハンバーグ、ステーキ、パスタ、和膳、モーニング、デザートなどのカロリー・アレルゲン情報が一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "ガスト カロリー 計算",
    "ガスト カロリー",
    "ガスト ハンバーグ カロリー",
    "ガスト モーニング カロリー",
    "ガスト アレルギー",
    "ガスト メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-gusto",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-gusto",
      en: "https://www.calorie-check.com/en/calorie-checker-gusto",
      "x-default": "https://www.calorie-check.com/calorie-checker-gusto",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "ガストのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-gusto",
      description:
        "ガストの全メニューから選ぶだけで合計カロリーを瞬時に算出する無料ツール。アレルゲン情報付き。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "ファミレス", item: "https://www.calorie-check.com/category/famires" },
        { "@type": "ListItem", position: 3, name: "ガスト", item: "https://www.calorie-check.com/calorie-checker-gusto" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function GustoPage() {
  const data = await getMenusByChain("ガスト");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GustoClient menus={menus} locale="ja" />
    </>
  );
}
