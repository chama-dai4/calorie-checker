import Link from "next/link";
import { getMenusByChain } from "@/lib/microcms";
import McdonaldsClient from "./McdonaldsClient";

export const metadata = {
  title: "マクドナルドのカロリー計算 | カロリーチェッカー",
  description: "マクドナルドのメニューを選ぶだけで、合計カロリー・たんぱく質・脂質・炭水化物が分かります。",
};

export const revalidate = 3600;

export default async function McdonaldsPage() {
  const data = await getMenusByChain("マクドナルド");
  const menus = data.contents;

  return <McdonaldsClient menus={menus} />;
}