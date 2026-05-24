import { getMenusByChain } from "@/lib/microcms";
import DennysClient from "./DennysClient";

export const metadata = {
  title: "デニーズのカロリー計算【PFC・全メニュー対応】| 2026年最新・アレルゲン情報付き",
  description:
    "デニーズの全メニューから選ぶだけで、合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出。ハンバーグ、パスタ、モーニング、デザートなどのカロリー・栄養成分・アレルゲン情報が一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "デニーズ カロリー 計算",
    "デニーズ カロリー",
    "デニーズ PFC",
    "デニーズ ハンバーグ カロリー",
    "デニーズ たんぱく質",
    "デニーズ アレルギー",
    "デニーズ メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-dennys",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-dennys",
      en: "https://www.calorie-check.com/en/calorie-checker-dennys",
      "x-default": "https://www.calorie-check.com/calorie-checker-dennys",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "デニーズのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-dennys",
      description:
        "デニーズの全メニューから選ぶだけで合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出する無料ツール。アレルゲン情報付き。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "ファミレス", item: "https://www.calorie-check.com/category/famires" },
        { "@type": "ListItem", position: 3, name: "デニーズ", item: "https://www.calorie-check.com/calorie-checker-dennys" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function DennysPage() {
  const data = await getMenusByChain("デニーズ");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DennysClient menus={menus} locale="ja" />
    </>
  );
}
