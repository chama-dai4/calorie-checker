import { getMenusByChain } from "@/lib/microcms";
import MatsuyaClient from "./MatsuyaClient";

export const metadata = {
  title: "松屋のカロリー計算【牛めし・サイズ別・PFC対応】| 2026年最新・アレルゲン情報付き",
  description:
    "松屋の全メニューから選ぶだけで、合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出。牛めし、カレー、定食などのカロリー・栄養成分・アレルゲン情報が一目で分かる無料ツール。盛りサイズ選択対応。2026年最新版。",
  keywords: [
    "松屋 カロリー 計算",
    "松屋 カロリー",
    "松屋 PFC",
    "松屋 牛めし カロリー",
    "松屋 たんぱく質",
    "松屋 アレルギー",
    "松屋 メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-matsuya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-matsuya",
      en: "https://www.calorie-check.com/en/calorie-checker-matsuya",
      "x-default": "https://www.calorie-check.com/calorie-checker-matsuya",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "松屋のカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-matsuya",
      description:
        "松屋の全メニューから選ぶだけで合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出する無料ツール。盛りサイズ選択・アレルゲン情報付き。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "牛丼", item: "https://www.calorie-check.com/category/gyudon" },
        { "@type": "ListItem", position: 3, name: "松屋", item: "https://www.calorie-check.com/calorie-checker-matsuya" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function MatsuyaPage() {
  const data = await getMenusByChain("松屋");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MatsuyaClient menus={menus} locale="ja" />
    </>
  );
}
