import { getMenusByChain } from "@/lib/microcms";
import ZetteriaClient from "@/app/calorie-checker-zetteria/ZetteriaClient";

export const metadata = {
  title: "Zetteria Japan Calorie Calculator (with Size Options) | Calorie Checker",
  description:
    "Calculate calories for all Zetteria Japan menu items by size (S/M/L). Instantly check calories, protein, fat, and carbs for the Zeppin Cheeseburger, hamburgers, sides, and drinks at this Japanese chain. Includes store-exclusive menus like ZOZO Marine and Senri-Chuo.",
  keywords: [
    "Zetteria Japan calorie",
    "Zetteria calorie",
    "Zeppin Cheeseburger calorie",
    "Lotteria Japan calorie",
    "ZOZO Marine menu calorie",
    "Japan burger chain calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-zetteria",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-zetteria",
      "en": "https://www.calorie-check.com/en/calorie-checker-zetteria",
      "x-default": "https://www.calorie-check.com/calorie-checker-zetteria",
    },
  },
};

export const revalidate = 3600;

export default async function ZetteriaEnPage() {
  const data = await getMenusByChain("ゼッテリア");
  const menus = data.contents;
  return <ZetteriaClient menus={menus} locale="en" />;
}
