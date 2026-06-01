import { getMenusByChain } from "@/lib/microcms";
import SaizeriyaClient from "./SaizeriyaClient";

export const metadata = {
  title: "サイゼリヤ カロリー計算|全メニューPFC・アレルゲン対応",
  description:
    "サイゼリヤの全メニューのカロリー・PFC・アレルゲンをワンタップで合計。ミラノ風ドリアやパスタを低カロリー順に並び替えも可能。ダイエット中・アレルギー対応の食事選びに役立つ無料ツール。",
  keywords: [
    "サイゼリヤ カロリー 計算",
    "サイゼリヤ カロリー",
    "サイゼリヤ ミラノ風ドリア カロリー",
    "サイゼリヤ パスタ カロリー",
    "サイゼリヤ アレルギー",
    "サイゼリヤ メニュー カロリー",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-saizeriya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-saizeriya",
      en: "https://www.calorie-check.com/en/calorie-checker-saizeriya",
      "x-default": "https://www.calorie-check.com/calorie-checker-saizeriya",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "サイゼリヤのカロリー計算ツール",
      url: "https://www.calorie-check.com/calorie-checker-saizeriya",
      description:
        "サイゼリヤの全メニューから選ぶだけで合計カロリーを瞬時に算出する無料ツール。アレルゲン情報付き。",
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
        { "@type": "ListItem", position: 3, name: "サイゼリヤ", item: "https://www.calorie-check.com/calorie-checker-saizeriya" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function SaizeriyaPage() {
  const data = await getMenusByChain("サイゼリヤ");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SaizeriyaClient menus={menus} locale="ja" />
    </>
  );
}
