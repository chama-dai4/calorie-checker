import { getMenusByChain } from "@/lib/microcms";
import SukiyaClient from "./SukiyaClient";

export const metadata = {
  title: "すき家のカロリー計算【牛丼・サイズ別・PFC対応】| 2026年最新・アレルゲン情報付き",
  description:
    "すき家の全メニューから選ぶだけで、合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出。牛丼、カレー、定食などのカロリー・栄養成分・アレルゲン情報が一目で分かる無料ツール。盛りサイズ選択対応。2026年最新版。",
  keywords: [
    "すき家 カロリー 計算",
    "すき家 カロリー",
    "すき家 PFC",
    "すき家 牛丼 カロリー",
    "すき家 たんぱく質",
    "すき家 アレルギー",
    "すき家 メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-sukiya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-sukiya",
      en: "https://www.calorie-check.com/en/calorie-checker-sukiya",
      "x-default": "https://www.calorie-check.com/calorie-checker-sukiya",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "すき家のカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-sukiya",
      description:
        "すき家の全メニューから選ぶだけで合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出する無料ツール。盛りサイズ選択・アレルゲン情報付き。",
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
        { "@type": "ListItem", position: 3, name: "すき家", item: "https://www.calorie-check.com/calorie-checker-sukiya" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function SukiyaPage() {
  const data = await getMenusByChain("すき家");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SukiyaClient menus={menus} locale="ja" />
    </>
  );
}
