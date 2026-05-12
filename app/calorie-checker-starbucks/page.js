import { getMenusByChain } from "@/lib/microcms";
import StarbucksClient from "./StarbucksClient";

export const metadata = {
  title: "【ミルク・カスタマイズ対応】スタバのカロリー計算ツール | カロリーチェッカー",
  description:
    "スターバックスの全メニュー・ミルク7種類・カスタマイズに対応。フラペチーノ、ラテ、フードのカロリーや脂質を選ぶだけで計算。豆乳・オーツミルク・無脂肪乳など低カロリーな選び方も。",
  keywords: ["スタバ カロリー", "スターバックス カロリー", "スタバ カスタマイズ カロリー", "フラペチーノ カロリー", "スタバ ミルク 種類"],
};

export const revalidate = 3600;

export default async function StarbucksPage() {
  const data = await getMenusByChain("スターバックス");
  const menus = data.contents;

  return <StarbucksClient menus={menus} />;
}