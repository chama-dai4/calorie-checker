import { getMenusByChain } from "@/lib/microcms";
import SanmarcClient from "@/app/calorie-checker-sanmarc/SanmarcClient";

export const metadata = {
  title: "St. Marc Cafe Calorie & Allergen Calculator | Calorie Checker",
  description:
    "Calculate calories and check allergen information for all St. Marc Cafe (サンマルクカフェ) menu items. Instantly see total calories, protein, fat, carbs, plus which of the major allergens (egg, milk, wheat, etc.) are in your selection. Essential tool for visitors with food allergies.",
  keywords: [
    "St. Marc Cafe calorie",
    "Saint Marc Cafe allergen",
    "Sanmarc Cafe allergy",
    "St. Marc Cafe menu",
    "Japan cafe calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-sanmarc",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-sanmarc",
      en: "https://www.calorie-check.com/en/calorie-checker-sanmarc",
      "x-default": "https://www.calorie-check.com/calorie-checker-sanmarc",
    },
  },
};

export const revalidate = 3600;

export default async function SanmarcEnPage() {
  const data = await getMenusByChain("サンマルクカフェ");
  const menus = data.contents;
  return <SanmarcClient menus={menus} locale="en" />;
}
