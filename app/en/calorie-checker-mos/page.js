import { getMenusByChain } from "@/lib/microcms";
import MosClient from "@/app/calorie-checker-mos/MosClient";

export const metadata = {
  title: "Mos Burger Japan Calorie Calculator | Calorie Checker",
  description:
    "Calculate calories for all Mos Burger Japan menu items by size (S, M, L). Instantly see total calories, protein, fat, and carbs for the original Mos Burger, Tobikiri Burger, Soy Patty, Mos Natsumi, sides, and drinks. Free tool for visitors to Japan.",
  keywords: [
    "Mos Burger Japan calorie",
    "Mos Burger calorie",
    "Soy Patty Mos Burger",
    "Mos Natsumi calorie",
    "Tobikiri Burger calorie",
    "Japan burger nutrition",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-mos",
    languages: {
      "ja": "https://www.calorie-check.com/calorie-checker-mos",
      "en": "https://www.calorie-check.com/en/calorie-checker-mos",
      "x-default": "https://www.calorie-check.com/calorie-checker-mos",
    },
  },
};

export const revalidate = 3600;

export default async function MosEnPage() {
  const data = await getMenusByChain("モスバーガー");
  const menus = data.contents;
  return <MosClient menus={menus} locale="en" />;
}
