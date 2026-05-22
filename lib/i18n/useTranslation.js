// =====================================================
// 翻訳フック・ユーティリティ
// =====================================================
// このファイルは「Client Componentで使う翻訳関数」を提供します。
// 
// Server Component (page.js) では useTranslation を呼ぶ必要はありません。
// 代わりに直接 getDictionary(locale) を使ってください:
//   import { getDictionary } from "@/lib/i18n/dictionary";
//   const dict = getDictionary(locale);
//   dict.common.backToHome
//
// Client Component (XXXClient.js) では2通りの使い方があります:
//   方法1: propsで受け取った辞書を直接使う（推奨）
//     export default function ZetteriaClient({ menus, dict, locale }) {
//       return <button>{dict.common.backToHome}</button>;
//     }
//
//   方法2: useTranslation フックを使う
//     const { t } = useTranslation(locale);
//     <button>{t("common.backToHome")}</button>;
// =====================================================

import { getDictionary, translate } from "./dictionary";

// =====================================================
// useTranslation フック (Client Component用)
// =====================================================
// 使い方:
//   const { t, tCategory, tChain, dict, locale } = useTranslation(locale);
//
//   t("common.backToHome")        // → "← Back to Home"
//   t("chain.total")              // → "Total"
//   tCategory("ハンバーガー")      // → "Burger / ハンバーガー"
//   tChain("マクドナルド")         // → "McDonald's Japan / マクドナルド"
//   dict.common.backToHome        // → "← Back to Home" (直接辞書アクセス)
//   locale                        // → "en" or "ja"
//
// 注: これはReactのフックっぽい名前にしていますが、useState/useEffect等は
// 使っていないので、Server Component でも安全に呼び出せます。
export function useTranslation(locale = "ja") {
  const dict = getDictionary(locale);

  // ドット記法のキー（例: "common.backToHome"）で辞書から値を取得
  const t = (key) => {
    if (!key) return "";
    const parts = key.split(".");
    let value = dict;
    for (const part of parts) {
      if (value === undefined || value === null) return key;
      value = value[part];
    }
    if (typeof value !== "string") return key;
    return value;
  };

  // サブカテゴリの翻訳（microCMSのcategory値をそのまま渡す）
  // tCategory("ハンバーガー") → "Burger / ハンバーガー"
  const tCategory = (categoryName) => {
    return translate("category", categoryName, locale);
  };

  // チェーン名の翻訳
  // tChain("マクドナルド") → "McDonald's Japan / マクドナルド"
  const tChain = (chainName) => {
    return translate("chainName", chainName, locale);
  };

  // カテゴリslugの翻訳（"burger" → "Burger / ハンバーガー"）
  const tCategorySlug = (slug) => {
    return translate("categorySlug", slug, locale);
  };

  // 商品名の翻訳（"ビッグマック" → "Big Mac"）。辞書に無ければ元の名前を返す
  const tName = (productName) => {
    return translate("productName", productName, locale);
  };
  // 選択肢の翻訳（"トール" → "Tall"、"ホイップクリーム" → "Whipped Cream"）
  const tOption = (optionName) => {
    return translate("optionName", optionName, locale);
  };

  return {
    t,
    tCategory,
    tChain,
    tCategorySlug,
    tName,
    tOption,
    dict,
    locale,
  };
}
