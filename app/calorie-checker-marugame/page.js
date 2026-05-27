import { getMenusByChain } from "@/lib/microcms";
import MarugameClient from "./MarugameClient";

export const metadata = {
  title: "丸亀製麺のカロリー計算【温度・サイズ・PFC対応】| 2026年最新・アレルゲン情報付き",
  description:
    "丸亀製麺の全メニューから選ぶだけで、合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出。うどんは温度（温・冷）とサイズ（小・並・大・得）を選べ、天ぷらや薬味は個数も選べます。釜揚げうどん、ぶっかけうどん、かしわ天などのカロリー・栄養成分・アレルゲン情報が一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "丸亀製麺 カロリー 計算","丸亀製麺 カロリー","丸亀製麺 PFC","丸亀 うどん カロリー",
    "丸亀製麺 釜揚げ カロリー","丸亀製麺 天ぷら カロリー","丸亀製麺 たんぱく質","丸亀製麺 アレルギー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-marugame",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-marugame",
      en: "https://www.calorie-check.com/en/calorie-checker-marugame",
      "x-default": "https://www.calorie-check.com/calorie-checker-marugame",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "丸亀製麺のカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-marugame",
      description: "丸亀製麺の全メニューから選ぶだけで合計カロリーとPFCを瞬時に算出する無料ツール。うどんの温度・サイズ選択、天ぷら・薬味の個数選択、アレルゲン情報付き。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "うどん・そば", item: "https://www.calorie-check.com/category/udon" },
        { "@type": "ListItem", position: 3, name: "丸亀製麺", item: "https://www.calorie-check.com/calorie-checker-marugame" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function MarugamePage() {
  const data = await getMenusByChain("丸亀製麺");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MarugameClient menus={menus} locale="ja" />
    </>
  );
}
