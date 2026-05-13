import { getMenusByChain } from "@/lib/microcms";
import YoshinoyaClient from "./YoshinoyaClient";

export const metadata = {
  title: "【サイズ別対応】吉野家のカロリー計算ツール | カロリーチェッカー",
  description:
    "吉野家の全メニュー・サイズ別（小盛・並盛・大盛・特盛・超特盛）のカロリーをすぐに計算。牛丼、定食、から揚げ、黒カレー、朝定食のカロリーや脂質・たんぱく質・炭水化物を選ぶだけで合計表示。",
  keywords: ["吉野家 カロリー", "牛丼 カロリー", "吉野家 大盛 カロリー", "吉野家 特盛 カロリー", "牛丼 サイズ カロリー"],
};

export const revalidate = 3600;

export default async function YoshinoyaPage() {
  const data = await getMenusByChain("吉野家");
  const menus = data.contents;

  return <YoshinoyaClient menus={menus} />;
}