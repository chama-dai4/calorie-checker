import { getMenusByChain } from "@/lib/microcms";
import YoshinoyaClient from "./YoshinoyaClient";

export const metadata = {
  title: "吉野家のカロリー計算【牛丼・サイズ別対応】| 2026年最新・全メニュー合計",
  description:
    "吉野家の全メニューから選ぶだけで、合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出。牛丼、唐揚げ定食などのカロリーが一目で分かる無料ツール。2026年最新版。",
  keywords: [
    "吉野家 カロリー 計算",
    "吉野家 カロリー",
    "牛丼 カロリー",
    "吉野家 牛丼 カロリー",
    "吉野家 ダイエット",
    "吉野家 セット カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-yoshinoya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-yoshinoya",
      en: "https://www.calorie-check.com/en/calorie-checker-yoshinoya",
      "x-default": "https://www.calorie-check.com/calorie-checker-yoshinoya",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "吉野家のカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-yoshinoya",
      description:
        "吉野家の全メニューから選ぶだけで合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出する無料ツール。牛丼サイズ別対応。",
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
        { "@type": "ListItem", position: 3, name: "吉野家", item: "https://www.calorie-check.com/calorie-checker-yoshinoya" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function YoshinoyaPage() {
  const data = await getMenusByChain("吉野家");
  const menus = data.contents;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <YoshinoyaClient menus={menus} locale="ja" />
    </>
  );
}