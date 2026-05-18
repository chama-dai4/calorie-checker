import { getMenusByChain } from "@/lib/microcms";
import YoshinoyaClient from "./YoshinoyaClient";

export const metadata = {
  title: "吉野家のカロリー計算【牛丼・サイズ別対応】| 2026年最新・全メニュー合計",
description:
  "吉野家の全メニュー・サイズ別(小盛・並盛・大盛・特盛・超特盛)のカロリーをすぐに計算。牛丼、定食、から揚げ、黒カレー、朝定食の合計カロリーや脂質・たんぱく質・炭水化物を瞬時に表示。ダイエット中の方に。2026年最新版。",
keywords: ["吉野家 カロリー 計算", "牛丼 カロリー 計算", "吉野家 カロリー", "牛丼 カロリー", "吉野家 大盛 カロリー", "吉野家 特盛 カロリー", "吉野家 ダイエット"],
  alternates: {
    canonical: "https://www.calorie-check.com/calorie-checker-yoshinoya",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-yoshinoya",
      "en": "https://www.calorie-check.com/en/calorie-checker-yoshinoya",
      "x-default": "https://www.calorie-check.com/calorie-checker-yoshinoya",
    },
  },
};

export const revalidate = 3600;

export default async function YoshinoyaPage() {
  const data = await getMenusByChain("吉野家");
  const menus = data.contents;
  return <YoshinoyaClient menus={menus} locale="ja" />;
}