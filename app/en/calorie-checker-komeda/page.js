import { getMenusByChain } from "@/lib/microcms";
import KomedaClient from "@/app/calorie-checker-komeda/KomedaClient";

export const metadata = {
  title: "Komeda Coffee Calorie & Allergen Calculator | Calorie Checker",
  description:
    "Calculate calories and check allergen information for all Komeda Coffee menu items. Instantly see total calories, plus which of the major allergens (egg, milk, wheat, etc.) are in your selection. Includes Shironoir, sandwiches, morning sets, and more. Essential tool for visitors with food allergies.",
  keywords: [
    "Komeda Coffee calorie",
    "Komeda Coffee allergen",
    "Komeda Coffee allergy",
    "Komeda Coffee menu",
    "Shironoir calorie",
    "Komeda morning set",
    "Japan cafe calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-komeda",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-komeda",
      "en": "https://www.calorie-check.com/en/calorie-checker-komeda",
      "x-default": "https://www.calorie-check.com/calorie-checker-komeda",
    },
  },
};

export const revalidate = 3600;

export default async function KomedaEnPage() {
  const data = await getMenusByChain("コメダ珈琲店");
  const menus = data.contents;
  return <KomedaClient menus={menus} locale="en" />;
}
