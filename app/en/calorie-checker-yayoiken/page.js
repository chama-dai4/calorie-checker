import { getMenusByChain } from "@/lib/microcms";
import YayoikenClient from "@/app/calorie-checker-yayoiken/YayoikenClient";

export const metadata = {
  title: "Yayoiken Calorie Calculator | Calorie Checker",
  description:
    "Calculate calories for all Yayoiken (やよい軒) menu items. Instantly see total calories, protein, fat, and carbs for set meals, rice bowls, breakfast, and sides. Choose your rice option (white rice, barley rice, large portion) to get accurate numbers. A handy tool for Japanese teishoku restaurants.",
  keywords: [
    "Yayoiken calorie",
    "Yayoiken menu calorie",
    "Yayoiken set meal calorie",
    "Japan teishoku calorie",
    "Yayoiken nutrition",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-yayoiken",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-yayoiken",
      en: "https://www.calorie-check.com/en/calorie-checker-yayoiken",
      "x-default": "https://www.calorie-check.com/calorie-checker-yayoiken",
    },
  },
};

export const revalidate = 3600;

export default async function YayoikenEnPage() {
  const data = await getMenusByChain("やよい軒");
  const menus = data.contents;
  return <YayoikenClient menus={menus} locale="en" />;
}
