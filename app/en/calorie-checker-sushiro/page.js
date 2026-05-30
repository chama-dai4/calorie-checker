import { getMenusByChain } from "@/lib/microcms";
import SushiroClient from "@/app/calorie-checker-sushiro/SushiroClient";

export const metadata = {
  title: "Sushiro Calorie Calculator | Calorie Checker",
  description:
    "Calculate calories for all Sushiro (スシロー) menu items. Sushi, side menu, drinks, and desserts. Instantly see total calories and 28-item allergen information. Updated for 2026.",
  keywords: [
    "Sushiro calorie",
    "Sushiro menu",
    "Sushiro sushi calorie",
    "kaiten sushi calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-sushiro",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-sushiro",
      en: "https://www.calorie-check.com/en/calorie-checker-sushiro",
      "x-default": "https://www.calorie-check.com/calorie-checker-sushiro",
    },
  },
};

export const revalidate = 3600;

export default async function SushiroEnPage() {
  const data = await getMenusByChain("スシロー");
  const menus = data.contents;
  return <SushiroClient menus={menus} locale="en" />;
}
