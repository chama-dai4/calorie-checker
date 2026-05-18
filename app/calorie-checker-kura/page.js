import { getMenusByChain } from "@/lib/microcms";
import KuraClient from "./KuraClient";

export const metadata = {
  title: "くら寿司のカロリー計算【アレルゲン対応】| 2026年最新・全メニュー対応",
description:
  "くら寿司の全メニューのカロリーとアレルゲン情報がすぐに分かる計算ツール。定番寿司、限定商品、サイドメニュー、デザート、ドリンクの合計カロリーを瞬時に表示。卵・小麦・乳・えび・かになど特定原材料27品目に対応。2026年最新版。",
keywords: ["くら寿司 カロリー 計算", "くら寿司 カロリー", "くら寿司 アレルゲン", "くら寿司 アレルギー", "くら寿司 メニュー", "回転寿司 カロリー", "回転寿司 カロリー 計算"],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-kura",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-kura",
      "en": "https://www.calorie-check.com/en/calorie-checker-kura",
      "x-default": "https://www.calorie-check.com/calorie-checker-kura",
    },
  },
};

export const revalidate = 3600;

export default async function KuraPage() {
  const data = await getMenusByChain("くら寿司");
  const menus = data.contents;
  return <KuraClient menus={menus} locale="ja" />;
}
