import { getMenusByChain } from "@/lib/microcms";
import TullysClient from "@/app/calorie-checker-tullys/TullysClient";

export const metadata = {
  title: "Tully's Coffee Calorie & Allergen Calculator | Calorie Checker",
  description:
    "Calculate calories and check allergen information for all Tully's Coffee menu items. Size (Short/Tall/Grande), milk change (soy), and customization supported. Instantly see total calories. Essential tool for visitors managing diet or with food allergies.",
  keywords: [
    "Tully's Coffee calorie",
    "Tully's calorie",
    "Tully's Coffee allergen",
    "Tully's latte calorie",
    "Tully's menu calorie",
    "Japan cafe calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-tullys",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-tullys",
      en: "https://www.calorie-check.com/en/calorie-checker-tullys",
      "x-default": "https://www.calorie-check.com/calorie-checker-tullys",
    },
  },
};

export const revalidate = 3600;

export default async function TullysEnPage() {
  const data = await getMenusByChain("タリーズコーヒー");
  const menus = data.contents;

  return <TullysClient menus={menus} locale="en" />;
}
