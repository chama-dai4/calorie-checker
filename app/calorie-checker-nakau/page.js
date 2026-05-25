import { getMenusByChain } from "@/lib/microcms";
import NakauClient from "./NakauClient";

export const metadata = {
  title: "なか卯のカロリー計算【丼・うどん・サイズ別・PFC対応】| 2026年最新・アレルゲン情報付き",
  description:
    "なか卯の全メニューから選ぶだけで、合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出。親子丼、牛丼、京風うどん、定食などのカロリー・栄養成分・アレルゲン情報が一目で分かる無料ツール。サイズ選択対応。2026年最新版。",
  keywords: [
    "なか卯 カロリー 計算",
    "なか卯 カロリー",
    "なか卯 PFC",
    "なか卯 親子丼 カロリー",
    "なか卯 うどん カロリー",
    "なか卯 たんぱく質",
    "なか卯 アレルギー",
    "なか卯 メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-nakau",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-nakau",
      en: "https://www.calorie-check.com/en/calorie-checker-nakau",
      "x-default": "https://www.calorie-check.com/calorie-checker-nakau",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "なか卯のカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-nakau",
      description:
        "なか卯の全メニューから選ぶだけで合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出する無料ツール。サイズ選択・アレルゲン情報付き。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "丼", item: "https://www.calorie-check.com/category/gyudon" },
        { "@type": "ListItem", position: 3, name: "なか卯", item: "https://www.calorie-check.com/calorie-checker-nakau" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function NakauPage() {
  const data = await getMenusByChain("なか卯");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NakauClient menus={menus} locale="ja" />
    </>
  );
}
