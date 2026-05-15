// =====================================================
// URLパスから現在の言語(locale)を判定するユーティリティ
// =====================================================
// このプロジェクトのURL設計:
//   /                            → ja
//   /calorie-checker-mcdonalds   → ja
//   /en                          → en
//   /en/calorie-checker-mcdonalds → en
//
// 「/enで始まるURL = 英語版」というシンプルなルールです。

import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./dictionary";

// =====================================================
// パス文字列からlocaleを判定
// =====================================================
// 使い方:
//   getLocaleFromPath("/calorie-checker-mcdonalds")    → "ja"
//   getLocaleFromPath("/en/calorie-checker-mcdonalds") → "en"
//   getLocaleFromPath("/en")                            → "en"
//   getLocaleFromPath("/")                              → "ja"
export function getLocaleFromPath(pathname) {
  if (!pathname) return DEFAULT_LOCALE;

  // 先頭の / を取り除いて最初のセグメントを取得
  const segments = pathname.replace(/^\/+/, "").split("/");
  const firstSegment = segments[0];

  // 最初のセグメントがサポート言語に含まれていればそれを返す
  // ただし "ja" は URL に含めない設計なので、"en" のみがマッチする
  if (firstSegment === "en") return "en";

  return DEFAULT_LOCALE; // 日本語がデフォルト
}

// =====================================================
// 「英語版URL」⇄「日本語版URL」を相互変換
// =====================================================
// 言語切り替えボタンで使います。
// 例:
//   getAlternateUrl("/calorie-checker-mcdonalds", "en") → "/en/calorie-checker-mcdonalds"
//   getAlternateUrl("/en/calorie-checker-mcdonalds", "ja") → "/calorie-checker-mcdonalds"
//   getAlternateUrl("/", "en") → "/en"
//   getAlternateUrl("/en", "ja") → "/"
export function getAlternateUrl(currentPath, targetLocale) {
  if (!currentPath) return targetLocale === "en" ? "/en" : "/";

  const currentLocale = getLocaleFromPath(currentPath);

  // 既に目的の言語のURLならそのまま返す
  if (currentLocale === targetLocale) return currentPath;

  if (targetLocale === "en") {
    // ja → en: パスの先頭に "/en" を付ける
    // "/" → "/en"
    if (currentPath === "/") return "/en";
    return "/en" + currentPath;
  } else {
    // en → ja: パスの先頭の "/en" を取り除く
    // "/en" → "/"
    // "/en/calorie-checker-mcdonalds" → "/calorie-checker-mcdonalds"
    if (currentPath === "/en") return "/";
    if (currentPath.startsWith("/en/")) {
      return currentPath.replace(/^\/en/, "");
    }
    return currentPath; // 念のためのフォールバック
  }
}

// =====================================================
// localeに対応するパスプレフィックスを返す
// =====================================================
// Linkコンポーネントで使う:
//   <Link href={`${getLocalePrefix(locale)}/calorie-checker-mcdonalds`}>
// 
//   locale = "ja" → ""
//   locale = "en" → "/en"
export function getLocalePrefix(locale) {
  if (locale === "en") return "/en";
  return "";
}

// =====================================================
// URLに使うhref生成のヘルパー
// =====================================================
// 例:
//   localizedHref("/calorie-checker-mcdonalds", "en") → "/en/calorie-checker-mcdonalds"
//   localizedHref("/calorie-checker-mcdonalds", "ja") → "/calorie-checker-mcdonalds"
//   localizedHref("/", "en") → "/en"
export function localizedHref(path, locale) {
  if (!path) return getLocalePrefix(locale) || "/";
  if (path === "/") {
    return locale === "en" ? "/en" : "/";
  }
  return getLocalePrefix(locale) + path;
}

// =====================================================
// 言語コードのバリデーション
// =====================================================
// 不正な値が来たときに DEFAULT_LOCALE にフォールバックします。
export function validateLocale(locale) {
  if (SUPPORTED_LOCALES.includes(locale)) return locale;
  return DEFAULT_LOCALE;
}
