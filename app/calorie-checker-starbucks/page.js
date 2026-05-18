import { getMenusByChain } from "@/lib/microcms";
import StarbucksClient from "./StarbucksClient";

export const metadata = {
  title: "スタバのカロリー計算【ミルク変更・カスタマイズ対応】| 2026年最新・全メニュー",
description:
  "スタバの全メニュー・ミルク7種類・カスタマイズに完全対応したカロリー計算ツール。フラペチーノ、ラテ、フードの合計カロリーや脂質を瞬時に算出。豆乳・オーツミルク・無脂肪乳など低カロリーな選び方も。ダイエット中の方に。2026年最新版。",
keywords: ["スタバ カロリー 計算", "スターバックス カロリー 計算", "スタバ カロリー", "スタバ カスタマイズ カロリー", "フラペチーノ カロリー", "スタバ ミルク 種類", "スタバ ダイエット"],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-starbucks",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-starbucks",
      "en": "https://www.calorie-check.com/en/calorie-checker-starbucks",
      "x-default": "https://www.calorie-check.com/calorie-checker-starbucks",
    },
  },
};

export const revalidate = 3600;

export default async function StarbucksPage() {
  const data = await getMenusByChain("スターバックス");
  const menus = data.contents;
  return <StarbucksClient menus={menus} locale="ja" />;
}
