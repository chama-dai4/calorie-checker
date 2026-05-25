import { getMenusByChain } from "@/lib/microcms";
import SukiyaClient from "../../calorie-checker-sukiya/SukiyaClient";

export const metadata = {
  title: "Sukiya Calorie Calculator [Gyudon, Size & PFC] | 2026 Latest with Allergen Info",
  description:
    "Calculate total calories and PFC (protein, fat, carbs) for Sukiya's full menu just by selecting items. Instantly see calories, nutrition, and allergen info for gyudon, curry, set meals and more. Size selection supported. Updated for 2026.",
  keywords: [
    "Sukiya calorie",
    "Sukiya calories",
    "Sukiya PFC",
    "Sukiya gyudon calories",
    "Sukiya protein",
    "Sukiya allergens",
    "Sukiya menu calories",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-sukiya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-sukiya",
      en: "https://www.calorie-check.com/en/calorie-checker-sukiya",
      "x-default": "https://www.calorie-check.com/calorie-checker-sukiya",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Sukiya Calorie Calculator",
      url: "https://www.calorie-check.com/en/calorie-checker-sukiya",
      description:
        "Free tool to instantly calculate total calories and PFC (protein, fat, carbs) for Sukiya's full menu just by selecting items. Size selection and allergen info included.",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.calorie-check.com/en" },
        { "@type": "ListItem", position: 2, name: "Donburi", item: "https://www.calorie-check.com/en/category/gyudon" },
        { "@type": "ListItem", position: 3, name: "Sukiya", item: "https://www.calorie-check.com/en/calorie-checker-sukiya" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function SukiyaPageEn() {
  const data = await getMenusByChain("すき家");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SukiyaClient menus={menus} locale="en" />
    </>
  );
}
