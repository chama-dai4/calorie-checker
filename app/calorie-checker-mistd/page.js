import { getMenusByChain } from "@/lib/microcms";
import MistdClient from "./MistdClient";

export const metadata = {
  title: "ミスタードーナツのカロリー計算【個数選択・PFC対応】| 2026年最新・アレルゲン情報付き",
  description:
    "ミスタードーナツの全メニューから選ぶだけで、合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出。個数を変えれば合計も自動計算。ポン・デ・リング、オールドファッションなど人気ドーナツのカロリー・栄養成分・アレルゲン情報が一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "ミスタードーナツ カロリー 計算",
    "ミスド カロリー",
    "ミスド PFC",
    "ポン・デ・リング カロリー",
    "ミスド ドーナツ カロリー",
    "ミスド たんぱく質",
    "ミスド アレルギー",
    "ミスド メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-mistd",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-mistd",
      en: "https://www.calorie-check.com/en/calorie-checker-mistd",
      "x-default": "https://www.calorie-check.com/calorie-checker-mistd",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "ミスタードーナツのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-mistd",
      description:
        "ミスタードーナツの全メニューから選ぶだけで合計カロリーとPFCを瞬時に算出する無料ツール。個数選択・アレルゲン情報付き。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "スイーツ", item: "https://www.calorie-check.com/category/sweets" },
        { "@type": "ListItem", position: 3, name: "ミスタードーナツ", item: "https://www.calorie-check.com/calorie-checker-mistd" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function MistdPage() {
  const data = await getMenusByChain("ミスタードーナツ");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MistdClient menus={menus} locale="ja" />
    </>
  );
}
