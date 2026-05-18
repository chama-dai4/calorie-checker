import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
// ▼ 変更点1: headers をインポート(追加)
import { headers } from "next/headers";

export const metadata = {
  title: "カロリーチェッカー | 外食チェーンのカロリー計算サイト",
  description:
    "マクドナルド、スターバックス、サイゼリヤなど、外食チェーンのメニューを選ぶだけで合計カロリーと栄養素(たんぱく質・脂質・炭水化物)が分かるサービスです。",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// ▼ 変更点2: function → async function(変更)
export default async function RootLayout({ children }) {
  // ▼ 変更点3: proxy.js が付与した x-pathname を読み取って lang を判定(追加)
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const lang = pathname.startsWith("/en") ? "en" : "ja";

  return (
    // ▼ 変更点4: <html lang="ja"> → <html lang={lang}>(変更)
    <html lang={lang}>
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
