import { getMenusByChain } from "@/lib/microcms";
import YoshinoyaClient from "@/app/calorie-checker-yoshinoya/YoshinoyaClient";

export const metadata = {
  title: "Yoshinoya Japan Calorie Calculator | Calorie Checker",
  description:
    "Calculate calories for all Yoshinoya Japan menu items by size (small, regular, large, extra large, super extra large). Instantly see total calories, protein, fat, and carbs for gyudon (beef bowl), set meals, karaage, and morning sets. Free tool for visitors to Japan.",
  keywords: [
    "Yoshinoya Japan calorie",
    "Gyudon calorie",
    "Beef bowl Japan",
    "Yoshinoya beef bowl",
    "Japan gyudon nutrition",
    "Yoshinoya menu Japan",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-yoshinoya",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-yoshinoya",
      "en": "https://www.calorie-check.com/en/calorie-checker-yoshinoya",
      "x-default": "https://www.calorie-check.com/calorie-checker-yoshinoya",
    },
  },
};

export const revalidate = 3600;

export default async function YoshinoyaEnPage() {
  const data = await getMenusByChain("吉野家");
  const menus = data.contents;
  return <YoshinoyaClient menus={menus} locale="en" />;
}
