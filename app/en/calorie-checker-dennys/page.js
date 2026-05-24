import { getMenusByChain } from "@/lib/microcms";
import DennysClient from "@/app/calorie-checker-dennys/DennysClient";

export const metadata = {
  title: "Denny's Japan Calorie, PFC & Allergen Calculator | Calorie Checker",
  description:
    "Calculate calories and PFC (protein, fat, carbs) for all Denny's Japan menu items. Instantly see total calories, macros, and allergen information for hamburgs, pasta, morning sets, desserts and more. Essential tool for visitors to Japan's popular family restaurant.",
  keywords: [
    "Dennys Japan calorie",
    "Dennys PFC",
    "Dennys protein",
    "Dennys allergen",
    "Dennys menu",
    "Japan family restaurant calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-dennys",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-dennys",
      en: "https://www.calorie-check.com/en/calorie-checker-dennys",
      "x-default": "https://www.calorie-check.com/calorie-checker-dennys",
    },
  },
};

export const revalidate = 3600;

export default async function DennysEnPage() {
  const data = await getMenusByChain("デニーズ");
  const menus = data.contents;
  return <DennysClient menus={menus} locale="en" />;
}
