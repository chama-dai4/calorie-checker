import { getMenusByChain } from "@/lib/microcms";
import KomedaClient from "./KomedaClient";

export const metadata = {
  title: "コメダ珈琲店のカロリー計算【アレルゲン対応】| 2026年最新・全メニュー対応",
  description:
    "コメダ珈琲店の全メニューから選ぶだけで、合計カロリーを瞬時に算出。シロノワール、サンドイッチ、モーニング、コメダブレンドなどのカロリーとアレルゲン情報が一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "コメダ珈琲店 カロリー 計算",
    "コメダ カロリー",
    "コメダ シロノワール カロリー",
    "コメダ モーニング カロリー",
    "コメダ アレルギー",
    "コメダ メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-komeda",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-komeda",
      en: "https://www.calorie-check.com/en/calorie-checker-komeda",
      "x-default": "https://www.calorie-check.com/calorie-checker-komeda",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "コメダ珈琲店のカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-komeda",
      description:
        "コメダ珈琲店の全メニューから選ぶだけで合計カロリーを瞬時に算出する無料ツール。アレルゲン情報にも対応。",
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
        { "@type": "ListItem", position: 3, name: "コメダ珈琲店", item: "https://www.calorie-check.com/calorie-checker-komeda" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function KomedaPage() {
  const data = await getMenusByChain("コメダ珈琲店");
  const menus = data.contents;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <KomedaClient menus={menus} locale="ja" />
    </>
  );
}
