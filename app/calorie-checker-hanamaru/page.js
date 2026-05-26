import { getMenusByChain } from "@/lib/microcms";
import HanamaruClient from "./HanamaruClient";

export const metadata = {
  title: "はなまるうどんのカロリー計算【サイズ・トッピング・PFC対応】| 2026年最新・アレルゲン情報付き",
  description:
    "はなまるうどんの全メニューから選ぶだけで、合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出。うどんは小・中・大のサイズを選べ、トッピングやおでんは個数も選べます。かけうどん、かま玉、天ぷらなどのカロリー・栄養成分・アレルゲン情報が一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "はなまるうどん カロリー 計算","はなまるうどん カロリー","はなまるうどん PFC","はなまる うどん カロリー",
    "はなまるうどん かけ カロリー","はなまるうどん 天ぷら カロリー","はなまるうどん たんぱく質","はなまるうどん アレルギー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-hanamaru",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-hanamaru",
      en: "https://www.calorie-check.com/en/calorie-checker-hanamaru",
      "x-default": "https://www.calorie-check.com/calorie-checker-hanamaru",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "はなまるうどんのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-hanamaru",
      description: "はなまるうどんの全メニューから選ぶだけで合計カロリーとPFCを瞬時に算出する無料ツール。うどんのサイズ選択・トッピングの個数選択・アレルゲン情報付き。",
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
        { "@type": "ListItem", position: 3, name: "はなまるうどん", item: "https://www.calorie-check.com/calorie-checker-hanamaru" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function HanamaruPage() {
  const data = await getMenusByChain("はなまるうどん");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HanamaruClient menus={menus} locale="ja" />
    </>
  );
}
