import { getMenusByChain } from "@/lib/microcms";
import SanmarcClient from "./SanmarcClient";

export const metadata = {
  title: "サンマルクカフェのカロリー計算【アレルゲン対応】| 2026年最新・全メニュー対応",
  description:
    "サンマルクカフェの全メニューから選ぶだけで、合計カロリーを瞬時に算出。チョコクロ、デニブラン、各種ドリンクのカロリー・たんぱく質・脂質・炭水化物とアレルゲン情報が一目で分かる無料ツール。S/M/Lサイズ別対応。2026年最新版。",
  keywords: [
    "サンマルクカフェ カロリー 計算",
    "サンマルクカフェ カロリー",
    "サンマルクカフェ チョコクロ カロリー",
    "サンマルクカフェ デニブラン カロリー",
    "サンマルクカフェ アレルギー",
    "サンマルクカフェ メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-sanmarc",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-sanmarc",
      en: "https://www.calorie-check.com/en/calorie-checker-sanmarc",
      "x-default": "https://www.calorie-check.com/calorie-checker-sanmarc",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "サンマルクカフェのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-sanmarc",
      description:
        "サンマルクカフェの全メニューから選ぶだけで合計カロリーを瞬時に算出する無料ツール。",
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
        { "@type": "ListItem", position: 3, name: "サンマルクカフェ", item: "https://www.calorie-check.com/calorie-checker-sanmarc" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function SanmarcPage() {
  const data = await getMenusByChain("サンマルクカフェ");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SanmarcClient menus={menus} locale="ja" />
    </>
  );
}
