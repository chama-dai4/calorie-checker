import { getMenusByChain } from "@/lib/microcms";
import HidakayaClient from "@/app/calorie-checker-hidakaya/HidakayaClient";

export const metadata = {
  title: "Hidakaya Calorie & Allergen Calculator | Calorie Checker",
  description:
    "Calculate calories and check allergen information for all Hidakaya menu items. Instantly see total calories, plus which of the major allergens (egg, milk, wheat, etc.) are in your selection. Essential tool for visitors to Japan's popular Chinese noodle chain.",
  keywords: [
    "Hidakaya calorie",
    "Hidakaya allergen",
    "Hidakaya allergy",
    "Hidakaya menu",
    "Japan Chinese restaurant calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-hidakaya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-hidakaya",
      en: "https://www.calorie-check.com/en/calorie-checker-hidakaya",
      "x-default": "https://www.calorie-check.com/calorie-checker-hidakaya",
    },
  },
};

export const revalidate = 3600;

export default async function HidakayaEnPage() {
  const data = await getMenusByChain("日高屋");
  const menus = data.contents;
  return <HidakayaClient menus={menus} locale="en" />;
}
