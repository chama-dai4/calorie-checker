import { getMenusByChain } from "@/lib/microcms";
import StarbucksClient from "./StarbucksClient";

export const metadata = {
  title: "スターバックスのカロリー計算 | カロリーチェッカー",
  description: "スターバックスのメニューを選んで、ミルクの種類やカスタマイズを指定するだけで、合計カロリー・たんぱく質・脂質・炭水化物が分かります。",
};

export const revalidate = 3600;

export default async function StarbucksPage() {
  const data = await getMenusByChain("スターバックス");
  const menus = data.contents;

  return <StarbucksClient menus={menus} />;
}