import { getMenusByChain } from "@/lib/microcms";
import DominoClient from "./DominoClient";

export const metadata = {
  title: "ドミノ・ピザのカロリー計算【生地・サイズ・枚数対応】| 2026年最新・全メニュー対応",
  description:
    "ドミノ・ピザの全メニューから選ぶだけで、合計カロリーを瞬時に算出。マルゲリータ、ドミノ・デラックス、各種ピザのカロリーが、生地5種（ハンドトス・ウルトラクリスピー・パンピザ・ミルフィーユ・チーズンロール）とサイズ（S/M/L）・食べた枚数別に分かる無料ツール。サイドメニューも対応。2026年最新版。",
  keywords: [
    "ドミノピザ カロリー 計算",
    "ドミノ・ピザ カロリー",
    "ドミノピザ マルゲリータ カロリー",
    "ドミノピザ ハンドトス カロリー",
    "ドミノピザ 1ピース カロリー",
    "ドミノピザ メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-domino",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-domino",
      en: "https://www.calorie-check.com/en/calorie-checker-domino",
      "x-default": "https://www.calorie-check.com/calorie-checker-domino",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "ドミノ・ピザのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-domino",
      description:
        "ドミノ・ピザの全メニューから選ぶだけで合計カロリーを瞬時に算出する無料ツール。生地5種・サイズ・食べた枚数別に対応。",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.calorie-check.com/" },
        { "@type": "ListItem", position: 2, name: "ピザ", item: "https://www.calorie-check.com/category/pizza" },
        { "@type": "ListItem", position: 3, name: "ドミノ・ピザ", item: "https://www.calorie-check.com/calorie-checker-domino" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function DominoPage() {
  const data = await getMenusByChain("ドミノ・ピザ");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DominoClient menus={menus} locale="ja" />
    </>
  );
}
