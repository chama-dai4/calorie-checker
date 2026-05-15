import { getMenusByChain } from "@/lib/microcms";
import ZetteriaClient from "./ZetteriaClient";

export const metadata = {
  title: "【サイズ別対応】ゼッテリアのカロリー計算ツール | カロリーチェッカー",
  description:
    "ゼッテリア（旧ロッテリア）の全メニュー・サイズ別（S/M/L）のカロリーをすぐに計算。絶品チーズバーガー、ハンバーガー、サイド、ドリンクのカロリーや脂質・たんぱく質・炭水化物を選ぶだけで合計表示。ZOZOマリン・千里中央など店舗限定メニューにも対応。",
  keywords: ["ゼッテリア カロリー", "Zetteria カロリー", "絶品チーズバーガー カロリー", "ロッテリア カロリー", "ZOZOマリン メニュー カロリー"],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-zetteria",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-zetteria",
      "en": "https://www.calorie-check.com/en/calorie-checker-zetteria",
      "x-default": "https://www.calorie-check.com/calorie-checker-zetteria",
    },
  },
};

export const revalidate = 3600;

export default async function ZetteriaPage() {
  const data = await getMenusByChain("ゼッテリア");
  const menus = data.contents;

  return <ZetteriaClient menus={menus} locale="ja" />;
}