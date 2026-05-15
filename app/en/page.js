// =====================================================
// 英語版ホーム (app/en/page.js)
// =====================================================
// 共通の HomeContent コンポーネントに locale="en" を渡すだけ。
// 日本語版 (app/page.js) と同じコンポーネントを使うので、
// UIの変更は HomeContent.jsx の修正だけで両言語に反映されます。
// =====================================================

import HomeContent from "@/components/HomeContent";

// 英語版ホームの metadata（SEO用）
export const metadata = {
  title: "Calorie Checker | Calorie Calculator for Japan's Chain Restaurants",
  description:
    "Select menu items from major Japanese chain restaurants like McDonald's Japan, Starbucks Japan, Mos Burger Japan and Yoshinoya Japan. Instantly see total calories and nutrition (protein, fat, carbs). Useful for visitors to Japan and dieters.",
  keywords: [
    "Japan calorie",
    "McDonald's Japan calorie",
    "Starbucks Japan calorie",
    "Yoshinoya calorie",
    "Mos Burger calorie",
    "Burger King Japan calorie",
    "Kura Sushi calorie",
    "Japan chain restaurant nutrition",
    "Japan fast food calories",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en",
    languages: {
      "ja": "https://www.calorie-check.com/",
      "en": "https://www.calorie-check.com/en",
      "x-default": "https://www.calorie-check.com/",
    },
  },
  openGraph: {
    title: "Calorie Checker | Calorie Calculator for Japan's Chain Restaurants",
    description:
      "Select menu items from major Japanese chain restaurants and instantly see total calories and nutrition.",
    locale: "en_US",
    type: "website",
  },
};

export default function EnHome() {
  return <HomeContent locale="en" />;
}
