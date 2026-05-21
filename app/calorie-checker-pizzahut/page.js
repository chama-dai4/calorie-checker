import { getMenusByChain } from "@/lib/microcms";
import PizzahutClient from "./PizzahutClient";

export const metadata = {
  title: "ピザハットのカロリー計算【生地・枚数対応】| 2026年最新・全メニュー対応",
  description:
    "ピザハットの全メニューから選ぶだけで、合計カロリーを瞬時に算出。マルゲリータ、ペパロニ、各種ピザのカロリーが、生地7種（ハンドトス・スペシャルクリスピー・鉄鍋パンピザほか）と食べた枚数別に分かる無料ツール。Sサイズ・MY BOX・パスタ・サイドも対応。2026年最新版。",
  keywords: [
    "ピザハット カロリー 計算",
    "ピザハット カロリー",
    "ピザハット マルゲリータ カロリー",
    "ピザハット ハンドトス カロリー",
    "ピザハット 1ピース カロリー",
    "ピザハット メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-pizzahut",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-pizzahut",
      en: "https://www.calorie-check.com/en/calorie-checker-pizzahut",
      "x-default": "https://www.calorie-check.com/calorie-checker-pizzahut",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "ピザハットのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-pizzahut",
      description:
        "ピザハットの全メニューから選ぶだけで合計カロリーを瞬時に算出する無料ツール。生地7種と食べた枚数別に対応。",
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
        { "@type": "ListItem", position: 3, name: "ピザハット", item: "https://www.calorie-check.com/calorie-checker-pizzahut" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function PizzahutPage() {
  const data = await getMenusByChain("ピザハット");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PizzahutClient menus={menus} locale="ja" />
    </>
  );
}
