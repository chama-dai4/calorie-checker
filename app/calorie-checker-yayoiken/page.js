import { getMenusByChain } from "@/lib/microcms";
import YayoikenClient from "./YayoikenClient";

export const metadata = {
  title: "やよい軒のカロリー計算【ごはん選択対応】| 2026年最新・全メニュー対応",
  description:
    "やよい軒の全メニューから選ぶだけで、合計カロリーを瞬時に算出。しょうが焼定食、から揚げ定食、各種定食・丼のカロリー・たんぱく質・脂質・炭水化物が一目で分かる無料ツール。白米・もち麦ごはん・大盛などごはんの種類別に対応。2026年最新版。",
  keywords: [
    "やよい軒 カロリー 計算",
    "やよい軒 カロリー",
    "やよい軒 しょうが焼定食 カロリー",
    "やよい軒 から揚げ定食 カロリー",
    "やよい軒 もち麦ごはん カロリー",
    "やよい軒 メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-yayoiken",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-yayoiken",
      en: "https://www.calorie-check.com/en/calorie-checker-yayoiken",
      "x-default": "https://www.calorie-check.com/calorie-checker-yayoiken",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "やよい軒のカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-yayoiken",
      description:
        "やよい軒の全メニューから選ぶだけで合計カロリーを瞬時に算出する無料ツール。ごはんの種類別に対応。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "定食", item: "https://www.calorie-check.com/category/teishoku" },
        { "@type": "ListItem", position: 3, name: "やよい軒", item: "https://www.calorie-check.com/calorie-checker-yayoiken" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function YayoikenPage() {
  const data = await getMenusByChain("やよい軒");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <YayoikenClient menus={menus} locale="ja" />
    </>
  );
}
