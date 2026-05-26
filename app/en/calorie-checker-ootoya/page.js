import { getMenusByChain } from "@/lib/microcms";
import OotoyaClient from "../../calorie-checker-ootoya/OotoyaClient";

export const metadata = {
  title: "Ootoya Calorie Calculator [Set Meals, Rice Choice & PFC] | 2026 Latest with Allergen Info",
  description:
    "Calculate total calories and PFC (protein, fat, carbs) for Ootoya's full menu just by selecting items. Choose rice (white/multigrain x4 sizes) for set meals, and quantity for sides and drinks. Instantly see calories, nutrition, and allergen info. Updated for 2026.",
  keywords: [
    "Ootoya calorie","Ootoya calories","Ootoya PFC","Ootoya set meal calories",
    "Ootoya lunch calories","Ootoya protein","Ootoya allergens","Ootoya menu calories",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-ootoya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-ootoya",
      en: "https://www.calorie-check.com/en/calorie-checker-ootoya",
      "x-default": "https://www.calorie-check.com/calorie-checker-ootoya",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Ootoya Calorie Calculator",
      url: "https://www.calorie-check.com/en/calorie-checker-ootoya",
      description: "Free tool to instantly calculate total calories and PFC for Ootoya's full menu. Rice selection for set meals, quantity selection, and allergen info included.",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.calorie-check.com/en" },
        { "@type": "ListItem", position: 2, name: "Set Meal", item: "https://www.calorie-check.com/en/category/teishoku" },
        { "@type": "ListItem", position: 3, name: "Ootoya", item: "https://www.calorie-check.com/en/calorie-checker-ootoya" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function OotoyaPageEn() {
  const data = await getMenusByChain("大戸屋");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <OotoyaClient menus={menus} locale="en" />
    </>
  );
}
