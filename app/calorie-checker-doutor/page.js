import { getMenusByChain } from "@/lib/microcms";
import DoutorClient from "./DoutorClient";

export const metadata = {
  title: "ドトールコーヒーショップのカロリー計算【サイズ別対応】| 2026年最新・全メニュー対応",
  description:
    "ドトールコーヒーショップの全メニューから選ぶだけで、合計カロリー・PFC・カフェイン・アレルゲンを瞬時に算出。ミラノサンド、ホットドック、サンドイッチ、ケーキなどのフード・デザートと、ブレンドコーヒー・カフェラテ・抹茶ラテなどのドリンク（S/M(R)/L各サイズ別）に対応した無料ツール。2026年最新版。",
  keywords: [
    "ドトール カロリー 計算",
    "ドトールコーヒー カロリー",
    "ドトール ミラノサンド カロリー",
    "ドトール カフェラテ カロリー",
    "ドトール カフェイン",
    "ドトール メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-doutor",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-doutor",
      en: "https://www.calorie-check.com/en/calorie-checker-doutor",
      "x-default": "https://www.calorie-check.com/calorie-checker-doutor",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "ドトールコーヒーショップのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-doutor",
      description:
        "ドトールコーヒーショップの全メニューから選ぶだけで合計カロリー・PFC・カフェイン・アレルゲンを瞬時に算出する無料ツール。S/M(R)/Lのサイズ別に対応。",
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
        { "@type": "ListItem", position: 3, name: "ドトールコーヒーショップ", item: "https://www.calorie-check.com/calorie-checker-doutor" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function DoutorPage() {
  const data = await getMenusByChain("ドトールコーヒーショップ");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DoutorClient menus={menus} locale="ja" />
    </>
  );
}
