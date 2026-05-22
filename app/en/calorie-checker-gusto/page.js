import { getMenusByChain } from "@/lib/microcms";
import GustoClient from "@/app/calorie-checker-gusto/GustoClient";

export const metadata = {
  title: "Gusto Calorie & Allergen Calculator | Calorie Checker",
  description:
    "Calculate calories and check allergen information for all Gusto menu items. Instantly see total calories, plus which of the major allergens (egg, milk, wheat, etc.) are in your selection. Essential tool for visitors to Japan's most popular family restaurant.",
  keywords: [
    "Gusto calorie",
    "Gusto allergen",
    "Gusto allergy",
    "Gusto menu",
    "Japan family restaurant calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-gusto",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-gusto",
      en: "https://www.calorie-check.com/en/calorie-checker-gusto",
      "x-default": "https://www.calorie-check.com/calorie-checker-gusto",
    },
  },
};

export const revalidate = 3600;

export default async function GustoEnPage() {
  const data = await getMenusByChain("ガスト");
  const menus = data.contents;
  return <GustoClient menus={menus} locale="en" />;
}
