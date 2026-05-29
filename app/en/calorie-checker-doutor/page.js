import { getMenusByChain } from "@/lib/microcms";
import DoutorClient from "@/app/calorie-checker-doutor/DoutorClient";

export const metadata = {
  title: "Doutor Coffee Shop Calorie Calculator | Calorie Checker",
  description:
    "Calculate calories for all Doutor Coffee Shop (ドトールコーヒーショップ) menu items. Instantly see total calories, PFC, caffeine and allergens for Milano sandwiches, hot dogs, cakes, and drinks in S/M(R)/L sizes. Updated for 2026.",
  keywords: [
    "Doutor calorie",
    "Doutor coffee menu",
    "Doutor Milano sandwich calorie",
    "Doutor caffe latte calorie",
    "Doutor caffeine",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-doutor",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-doutor",
      en: "https://www.calorie-check.com/en/calorie-checker-doutor",
      "x-default": "https://www.calorie-check.com/calorie-checker-doutor",
    },
  },
};

export const revalidate = 3600;

export default async function DoutorEnPage() {
  const data = await getMenusByChain("ドトールコーヒーショップ");
  const menus = data.contents;
  return <DoutorClient menus={menus} locale="en" />;
}
