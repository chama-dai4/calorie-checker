import { getMenusByChain } from "@/lib/microcms";
import MosClient from "./MosClient";

export const metadata = {
  title: "モスバーガーのカロリー計算【サイズ別対応】| 2026年最新・全メニュー合計",
description:
  "モスバーガーの全メニュー・サイズ別(S・M・L)のカロリーをすぐに計算。モスバーガー、とびきりバーガー、ソイパティ、モスの菜摘、サイドメニュー、ドリンクの合計カロリーや脂質・たんぱく質・炭水化物を瞬時に表示。2026年最新版。",
keywords: ["モスバーガー カロリー 計算", "モス カロリー 計算", "モスバーガー カロリー", "モス カロリー", "ソイパティ カロリー", "モスの菜摘 カロリー", "とびきりバーガー カロリー"],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-mos",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-mos",
      "en": "https://www.calorie-check.com/en/calorie-checker-mos",
      "x-default": "https://www.calorie-check.com/calorie-checker-mos",
    },
  },
};

export const revalidate = 3600;

export default async function MosPage() {
  const data = await getMenusByChain("モスバーガー");
  const menus = data.contents;
  return <MosClient menus={menus} locale="ja" />;
}
