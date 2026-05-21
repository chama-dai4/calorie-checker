import { getMenusByChain } from "@/lib/microcms";
import PizzahutClient from "@/app/calorie-checker-pizzahut/PizzahutClient";

export const metadata = {
  title: "Pizza Hut Japan Calorie Calculator | Calorie Checker",
  description:
    "Calculate calories for all Pizza Hut Japan (ピザハット) menu items. Instantly see total calories for pizzas, with 7 crust types (Hand Toss, Special Crispy, Pan Pizza and more) and the number of slices you eat. S size, MY BOX, pasta, and sides supported. M size = 8 slices, L size = 12 slices.",
  keywords: [
    "Pizza Hut Japan calorie",
    "Pizza Hut menu calorie",
    "Pizza Hut Margherita calorie",
    "Pizza Hut crust calorie",
    "Pizza Hut slice calorie",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-pizzahut",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-pizzahut",
      en: "https://www.calorie-check.com/en/calorie-checker-pizzahut",
      "x-default": "https://www.calorie-check.com/calorie-checker-pizzahut",
    },
  },
};

export const revalidate = 3600;

export default async function PizzahutEnPage() {
  const data = await getMenusByChain("ピザハット");
  const menus = data.contents;
  return <PizzahutClient menus={menus} locale="en" />;
}
