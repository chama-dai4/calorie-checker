import { getMenusByChain } from "@/lib/microcms";
import SaizeriyaClient from "@/app/calorie-checker-saizeriya/SaizeriyaClient";

export const metadata = {
  title: "Saizeriya Calorie & Allergen Calculator | Calorie Checker",
  description:
    "Calculate calories and check allergen information for all Saizeriya menu items. Instantly see total calories, plus which of the major allergens (egg, milk, wheat, etc.) are in your selection. Essential tool for visitors to Japan's most popular Italian family restaurant.",
  keywords: [
    "Saizeriya calorie",
    "Saizeriya allergen",
    "Saizeriya allergy",
    "Saizeriya menu",
    "Japan Italian restaurant calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-saizeriya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-saizeriya",
      en: "https://www.calorie-check.com/en/calorie-checker-saizeriya",
      "x-default": "https://www.calorie-check.com/calorie-checker-saizeriya",
    },
  },
};

export const revalidate = 3600;

export default async function SaizeriyaEnPage() {
  const data = await getMenusByChain("サイゼリヤ");
  const menus = data.contents;
  return <SaizeriyaClient menus={menus} locale="en" />;
}
