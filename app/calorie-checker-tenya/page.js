import { getMenusByChain } from "@/lib/microcms";
import TenyaClient from "./TenyaClient";

export const metadata = {
  title: "天丼てんやのカロリー計算【天丼・天ぷら・セット・PFC対応】| 2026年最新・アレルゲン情報付き",
  description:
    "天丼てんやの全メニューから選ぶだけで、合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出。天ぷら単品やサイドは個数も選べます。海かぜ天丼、オールスター天丼、天ぷら盛合わせなどのカロリー・栄養成分・アレルゲン情報が一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "天丼てんや カロリー 計算","てんや カロリー","てんや PFC","てんや 天丼 カロリー",
    "てんや 天ぷら カロリー","てんや たんぱく質","てんや アレルギー","てんや メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-tenya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-tenya",
      en: "https://www.calorie-check.com/en/calorie-checker-tenya",
      "x-default": "https://www.calorie-check.com/calorie-checker-tenya",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "天丼てんやのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-tenya",
      description: "天丼てんやの全メニューから選ぶだけで合計カロリーとPFCを瞬時に算出する無料ツール。個数選択・アレルゲン情報付き。",
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
        { "@type": "ListItem", position: 3, name: "天丼てんや", item: "https://www.calorie-check.com/calorie-checker-tenya" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function TenyaPage() {
  const data = await getMenusByChain("天丼てんや");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TenyaClient menus={menus} locale="ja" />
    </>
  );
}
