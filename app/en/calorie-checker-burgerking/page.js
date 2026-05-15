import { getMenusByChain } from "@/lib/microcms";
import BurgerKingClient from "@/app/calorie-checker-burgerking/BurgerKingClient";

export const metadata = {
  title: "Burger King Japan Calorie Calculator | Calorie Checker",
  description:
    "Calculate calories for all Burger King Japan menu items by size (Junior, Regular, S/M/L). Instantly see total calories, protein, fat, and carbs for the Whopper, beef burgers, chicken burgers, sides, and drinks. Free tool for visitors to Japan.",
  keywords: [
    "Burger King Japan calorie",
    "Whopper calorie",
    "Whopper Junior calorie",
    "Burger King menu Japan",
    "Japan Whopper",
    "Japan burger nutrition",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-burgerking",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-burgerking",
      "en": "https://www.calorie-check.com/en/calorie-checker-burgerking",
      "x-default": "https://www.calorie-check.com/calorie-checker-burgerking",
    },
  },
};

export const revalidate = 3600;

export default async function BurgerKingEnPage() {
  const data = await getMenusByChain("バーガーキング");
  const menus = data.contents;
  return <BurgerKingClient menus={menus} locale="en" />;
}
