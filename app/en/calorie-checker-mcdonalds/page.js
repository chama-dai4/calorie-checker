import { getMenusByChain } from "@/lib/microcms";
import McdonaldsClient from "@/app/calorie-checker-mcdonalds/McdonaldsClient";

export const metadata = {
  title: "McDonald's Japan Calorie Calculator | Calorie Checker",
  description:
    "Calculate calories for all McDonald's Japan menu items. Instantly see total calories, protein, fat, and carbs for popular items like the Big Mac, fries, and shakes at McDonald's in Japan. Free tool for visitors to Japan.",
  keywords: [
    "McDonald's Japan calorie",
    "Big Mac Japan calorie",
    "McDonald's Japan menu",
    "Japan fast food calorie",
    "McCafé Japan",
    "Japan McDonald's nutrition",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-mcdonalds",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-mcdonalds",
      "en": "https://www.calorie-check.com/en/calorie-checker-mcdonalds",
      "x-default": "https://www.calorie-check.com/calorie-checker-mcdonalds",
    },
  },
};

export const revalidate = 3600;

export default async function McdonaldsEnPage() {
  const data = await getMenusByChain("マクドナルド");
  const menus = data.contents;
  return <McdonaldsClient menus={menus} locale="en" />;
}
