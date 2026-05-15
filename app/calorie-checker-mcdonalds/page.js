import { getMenusByChain } from "@/lib/microcms";
import McdonaldsClient from "./McdonaldsClient";

export const metadata = {
  title: "【全メニュー対応】マクドナルドのカロリー計算・一覧表 | カロリーチェッカー",
  description:
    "マクドナルドの全200メニューから選ぶだけで、合計カロリー・たんぱく質・脂質・炭水化物を瞬時に計算。ビッグマック、ポテト、シェイクなど人気メニューのカロリーが一目で分かる無料ツールです。",
  keywords: ["マクドナルド カロリー", "マック カロリー", "ビッグマック カロリー", "マクドナルド 栄養成分", "マクドナルド カロリー 計算"],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-mcdonalds",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-mcdonalds",
      "en": "https://www.calorie-check.com/en/calorie-checker-mcdonalds",
      "x-default": "https://www.calorie-check.com/calorie-checker-mcdonalds",
    },
  },
};

export const revalidate = 3600;

export default async function McdonaldsPage() {
  const data = await getMenusByChain("マクドナルド");
  const menus = data.contents;

  return <McdonaldsClient menus={menus} locale="ja" />;
}