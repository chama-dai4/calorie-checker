import { getMenusByChain } from "@/lib/microcms";
import FreshnessClient from "@/app/calorie-checker-freshness/FreshnessClient";

export const metadata = {
  title: "Freshness Burger Japan Calorie Calculator | Calorie Checker",
  description:
    "Calculate calories for all Freshness Burger Japan menu items. Instantly see total calories, protein, fat, and carbs for the Classic Burger, Coriander Chicken Burger (Khao Man Gai/Bánh Mì/Green Curry), sides, FREBAR menu, and drinks. Free tool for visitors to Japan.",
  keywords: [
    "Freshness Burger Japan calorie",
    "Freshness Burger menu",
    "Classic Burger Japan",
    "Coriander Chicken Burger calorie",
    "FREBAR menu",
    "Japan gourmet burger calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-freshness",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-freshness",
      "en": "https://www.calorie-check.com/en/calorie-checker-freshness",
      "x-default": "https://www.calorie-check.com/calorie-checker-freshness",
    },
  },
};

export const revalidate = 3600;

export default async function FreshnessEnPage() {
  const data = await getMenusByChain("フレッシュネスバーガー");
  const menus = data.contents;
  return <FreshnessClient menus={menus} locale="en" />;
}