import { getMenusByChain } from "@/lib/microcms";
import BurgerKingClient from "./BurgerKingClient";

export const metadata = {
  title: "バーガーキングのカロリー計算【ワッパー・サイズ別対応】| 2026年最新・全メニュー",
description:
  "バーガーキングの全メニュー・サイズ別(ジュニア・レギュラー・S/M/L)のカロリーをすぐに計算。ワッパー、ビーフバーガー、チキンバーガー、サイド、ドリンクの合計カロリーや脂質・たんぱく質・炭水化物を瞬時に表示。2026年最新版。",
keywords: ["バーガーキング カロリー 計算", "バーキン カロリー 計算", "バーガーキング カロリー", "ワッパー カロリー", "ワッパーチーズ カロリー", "バーキン カロリー", "ワッパージュニア カロリー"],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-burgerking",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-burgerking",
      "en": "https://www.calorie-check.com/en/calorie-checker-burgerking",
      "x-default": "https://www.calorie-check.com/calorie-checker-burgerking",
    },
  },
};

export const revalidate = 3600;

export default async function BurgerKingPage() {
  const data = await getMenusByChain("バーガーキング");
  const menus = data.contents;
  return <BurgerKingClient menus={menus} locale="ja" />;
}
