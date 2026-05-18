import { getMenusByChain } from "@/lib/microcms";
import McdonaldsClient from "./McdonaldsClient";

export const metadata = {
  title: "マック・マクドナルドのカロリー計算【2026年最新】| 全メニュー合計を瞬時に算出",
description:
  "マクドナルドの全メニューから選ぶだけで、合計カロリー・たんぱく質・脂質・炭水化物を瞬時に算出。ビッグマック、ポテト、シェイクなどのカロリーが一目で分かる無料ツール。ダイエット・セット計算・栄養管理に。2026年最新版。",
keywords: ["マック カロリー 計算", "マクドナルド カロリー 計算", "マック カロリー", "マクドナルド カロリー", "ビッグマック カロリー", "マック ダイエット", "マック セット カロリー"],
    canonical: "https://www.calorie-check.com/calorie-checker-mcdonalds",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-mcdonalds",
      "en": "https://www.calorie-check.com/en/calorie-checker-mcdonalds",
      "x-default": "https://www.calorie-check.com/calorie-checker-mcdonalds",
    },
};

export const revalidate = 3600;

export default async function McdonaldsPage() {
  const data = await getMenusByChain("マクドナルド");
  const menus = data.contents;

  return <McdonaldsClient menus={menus} locale="ja" />;
}