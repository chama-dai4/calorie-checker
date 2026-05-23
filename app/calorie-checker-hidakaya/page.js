import { getMenusByChain } from "@/lib/microcms";
import HidakayaClient from "./HidakayaClient";

export const metadata = {
  title: "日高屋のカロリー計算【全メニュー対応】| 2026年最新・アレルゲン情報付き",
  description:
    "日高屋の全メニューから選ぶだけで、合計カロリーを瞬時に算出。中華そば、餃子、チャーハン、定食、ネギタワーなどのカロリー・アレルゲン情報が一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "日高屋 カロリー 計算",
    "日高屋 カロリー",
    "日高屋 中華そば カロリー",
    "日高屋 餃子 カロリー",
    "日高屋 アレルギー",
    "日高屋 メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-hidakaya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-hidakaya",
      en: "https://www.calorie-check.com/en/calorie-checker-hidakaya",
      "x-default": "https://www.calorie-check.com/calorie-checker-hidakaya",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "日高屋のカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-hidakaya",
      description:
        "日高屋の全メニューから選ぶだけで合計カロリーを瞬時に算出する無料ツール。アレルゲン情報付き。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "中華", item: "https://www.calorie-check.com/category/ramen" },
        { "@type": "ListItem", position: 3, name: "日高屋", item: "https://www.calorie-check.com/calorie-checker-hidakaya" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function HidakayaPage() {
  const data = await getMenusByChain("日高屋");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HidakayaClient menus={menus} locale="ja" />
    </>
  );
}
