import { getMenusByChain } from "@/lib/microcms";
import FreshnessClient from "./FreshnessClient";

export const metadata = {
  title: "フレッシュネスバーガーのカロリー計算【グルメバーガー対応】| 2026年最新・全84品",
description:
  "フレッシュネスバーガー全84品のカロリー・栄養素を瞬時に計算。クラシックバーガー、フレッシュネスバーガー、期間限定のパクチーチキンバーガー、サイドメニュー、フレバル、ドリンクの合計カロリーや脂質・たんぱく質・炭水化物を表示。2026年最新版。",
keywords: ["フレッシュネスバーガー カロリー 計算", "フレッシュネス カロリー 計算", "フレッシュネスバーガー カロリー", "フレッシュネス カロリー", "クラシックバーガー カロリー", "パクチーチキン カロリー", "フレバル カロリー"],
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