import { getMenusByChain } from "@/lib/microcms";
import FreshnessClient from "./FreshnessClient";

export const metadata = {
  title: "【グルメバーガー】フレッシュネスバーガーのカロリー計算ツール | カロリーチェッカー",
  description:
    "フレッシュネスバーガーの全メニューのカロリー・栄養素を計算。クラシックバーガー、フレッシュネスバーガー、期間限定のパクチーチキンバーガー、サイドメニュー、フレバル、ドリンクのカロリーや脂質・たんぱく質・炭水化物を選ぶだけで合計表示。",
  keywords: ["フレッシュネスバーガー カロリー", "フレッシュネス カロリー", "クラシックバーガー カロリー", "パクチーチキン カロリー", "フレバル カロリー"],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-freshness",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-freshness",
      "en": "https://www.calorie-check.com/en/calorie-checker-freshness",
      "x-default": "https://www.calorie-check.com/calorie-checker-freshness",
    },
  },
};

export const revalidate = 3600;

export default async function FreshnessPage() {
  const data = await getMenusByChain("フレッシュネスバーガー");
  const menus = data.contents;
  return <FreshnessClient menus={menus} locale="ja" />;
}