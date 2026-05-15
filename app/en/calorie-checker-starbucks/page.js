import { getMenusByChain } from "@/lib/microcms";
import StarbucksClient from "@/app/calorie-checker-starbucks/StarbucksClient";

export const metadata = {
  title: "Starbucks Japan Calorie Calculator | Calorie Checker",
  description:
    "Calculate calories for all Starbucks Japan menu items, including 7 milk options and customizations. Instantly see total calories, protein, fat, and carbs for Frappuccino, Latte, and food items. Find low-calorie options like soy milk, oat milk, and non-fat milk. Free tool for visitors to Japan.",
  keywords: [
    "Starbucks Japan calorie",
    "Starbucks Japan Frappuccino",
    "Starbucks Japan customization",
    "Japan Starbucks milk",
    "Starbucks Japan menu",
    "Frappuccino calorie Japan",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-starbucks",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-starbucks",
      "en": "https://www.calorie-check.com/en/calorie-checker-starbucks",
      "x-default": "https://www.calorie-check.com/calorie-checker-starbucks",
    },
  },
};

export const revalidate = 3600;

export default async function StarbucksEnPage() {
  const data = await getMenusByChain("スターバックス");
  const menus = data.contents;
  return <StarbucksClient menus={menus} locale="en" />;
}
