import { getMenusByChain } from "@/lib/microcms";
import DominoClient from "@/app/calorie-checker-domino/DominoClient";

export const metadata = {
  title: "Domino's Pizza Japan Calorie Calculator | Calorie Checker",
  description:
    "Calculate calories for all Domino's Pizza Japan (ドミノ・ピザ) menu items. Instantly see total calories for pizzas, with 5 crust types (Hand Toss, Ultra Crispy, Pan Pizza, Mille-feuille, Cheese 'n Roll), 3 sizes (S/M/L), and the number of slices you eat. Sides supported.",
  keywords: [
    "Domino's Pizza Japan calorie",
    "Domino's Pizza menu calorie",
    "Domino's Margherita calorie",
    "Domino's crust calorie",
    "Domino's slice calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-domino",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-domino",
      en: "https://www.calorie-check.com/en/calorie-checker-domino",
      "x-default": "https://www.calorie-check.com/calorie-checker-domino",
    },
  },
};

export const revalidate = 3600;

export default async function DominoEnPage() {
  const data = await getMenusByChain("ドミノ・ピザ");
  const menus = data.contents;
  return <DominoClient menus={menus} locale="en" />;
}
