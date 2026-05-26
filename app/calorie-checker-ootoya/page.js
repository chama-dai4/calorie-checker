import { getMenusByChain } from "@/lib/microcms";
import OotoyaClient from "./OotoyaClient";

export const metadata = {
  title: "大戸屋のカロリー計算【定食・ご飯選択・PFC対応】| 2026年最新・アレルゲン情報付き",
  description:
    "大戸屋の全メニューから選ぶだけで、合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出。定食はご飯（白米・五穀×4段階）を選べ、サイドやドリンクは個数も選べます。大戸屋ランチ、チキン南蛮などのカロリー・栄養成分・アレルゲン情報が一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "大戸屋 カロリー 計算","大戸屋 カロリー","大戸屋 PFC","大戸屋 定食 カロリー",
    "大戸屋ランチ カロリー","大戸屋 五穀ご飯 カロリー","大戸屋 たんぱく質","大戸屋 アレルギー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-ootoya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-ootoya",
      en: "https://www.calorie-check.com/en/calorie-checker-ootoya",
      "x-default": "https://www.calorie-check.com/calorie-checker-ootoya",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "大戸屋のカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-ootoya",
      description: "大戸屋の全メニューから選ぶだけで合計カロリーとPFCを瞬時に算出する無料ツール。定食のご飯選択・個数選択・アレルゲン情報付き。",
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
        { "@type": "ListItem", position: 3, name: "大戸屋", item: "https://www.calorie-check.com/calorie-checker-ootoya" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function OotoyaPage() {
  const data = await getMenusByChain("大戸屋");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <OotoyaClient menus={menus} locale="ja" />
    </>
  );
}
