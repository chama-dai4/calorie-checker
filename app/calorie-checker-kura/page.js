import { getMenusByChain } from "@/lib/microcms";
import KuraClient from "./KuraClient";

export const metadata = {
  title: "【アレルゲン対応】くら寿司のカロリー計算ツール | カロリーチェッカー",
  description:
    "くら寿司の全メニューのカロリーとアレルゲン情報がすぐに分かる計算ツール。定番寿司、限定商品、サイドメニュー、デザート、ドリンクのカロリーを選んで合計表示。卵・小麦・乳・えび・かになど特定原材料27品目に対応。",
  keywords: ["くら寿司 カロリー", "くら寿司 アレルゲン", "くら寿司 アレルギー", "くら寿司 メニュー", "回転寿司 カロリー"],
};

export const revalidate = 3600;

export default async function KuraPage() {
  const data = await getMenusByChain("くら寿司");
  const menus = data.contents;

  return <KuraClient menus={menus} />;
}