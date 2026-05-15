import HomeContent from "@/components/HomeContent";

// 日本語版ホームのmetadata
export const metadata = {
  title: "カロリーチェッカー | 外食チェーンのカロリー計算サイト",
  description:
    "マクドナルド、スターバックスなど、外食チェーンのメニューを選ぶだけで合計カロリーと栄養素(たんぱく質・脂質・炭水化物)が分かるサービスです。",
  alternates: {
    canonical: "https://www.calorie-check.com/",
    languages: {
      "ja": "https://www.calorie-check.com/",
      "en": "https://www.calorie-check.com/en",
      "x-default": "https://www.calorie-check.com/",
    },
  },
};

export default function Home() {
  return <HomeContent locale="ja" />;
}