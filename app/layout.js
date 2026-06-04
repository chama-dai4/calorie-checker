import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { headers } from "next/headers";
import { Inter, Noto_Sans_JP, Space_Grotesk } from "next/font/google";

// Inter: 英数字用(本文・UI)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

// Noto Sans JP: 日本語用(本文)
const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
  preload: false,
});

// Space Grotesk: 見出し・ブランド用
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "カロリーチェッカー | 外食チェーンのカロリー計算サイト",
  description:
    "マクドナルド、スターバックス、サイゼリヤなど、外食チェーンのメニューを選ぶだけで合計カロリーと栄養素(たんぱく質・脂質・炭水化物)が分かるサービスです。",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const lang = pathname.startsWith("/en") ? "en" : "ja";

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${notoSansJP.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="theme-color" content="#ffffff" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2863577913372338"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        {children}
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}