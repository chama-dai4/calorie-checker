import { getMenusByChain } from "@/lib/microcms";
import MosClient from "./MosClient";

export const metadata = {
  title: "【サイズ別対応】モスバーガーのカロリー計算ツール | カロリーチェッカー",
  description:
    "モスバーガーの全メニュー・サイズ別（S・M・L）のカロリーをすぐに計算。モスバーガー、とびきりバーガー、ソイパティ、モスの菜摘、サイドメニュー、ドリンクのカロリーや脂質・たんぱく質・炭水化物を選ぶだけで合計表示。",
  keywords: ["モスバーガー カロリー", "モス カロリー", "ソイパティ カロリー", "モスの菜摘 カロリー", "とびきりバーガー カロリー"],
};

export const revalidate = 3600;

export default async function MosPage() {
  const data = await getMenusByChain("モスバーガー");
  const menus = data.contents;

  return <MosClient menus={menus} />;
}