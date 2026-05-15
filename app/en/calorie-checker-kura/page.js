import { getMenusByChain } from "@/lib/microcms";
import KuraClient from "@/app/calorie-checker-kura/KuraClient";

export const metadata = {
  title: "Kura Sushi Japan Calorie & Allergen Calculator | Calorie Checker",
  description:
    "Calculate calories and check allergen information for all Kura Sushi Japan menu items. Instantly see total calories, plus which of the 27 major allergens (egg, milk, wheat, shrimp, crab, etc.) are in your selection. Essential tool for visitors with food allergies.",
  keywords: [
    "Kura Sushi Japan calorie",
    "Kura Sushi allergen",
    "Kura Sushi allergy",
    "Kura Sushi menu",
    "Japan sushi calorie",
    "conveyor belt sushi Japan",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-kura",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-kura",
      "en": "https://www.calorie-check.com/en/calorie-checker-kura",
      "x-default": "https://www.calorie-check.com/calorie-checker-kura",
    },
  },
};

export const revalidate = 3600;

export default async function KuraEnPage() {
  const data = await getMenusByChain("くら寿司");
  const menus = data.contents;
  return <KuraClient menus={menus} locale="en" />;
}
