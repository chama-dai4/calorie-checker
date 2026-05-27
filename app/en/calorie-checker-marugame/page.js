import { getMenusByChain } from "@/lib/microcms";
import MarugameClient from "../../calorie-checker-marugame/MarugameClient";

export const metadata = {
  title: "Marugame Seimen Calorie Calculator [Temp, Size & PFC] | 2026 Latest with Allergen Info",
  description:
    "Calculate total calories and PFC (protein, fat, carbs) for Marugame Seimen's full menu just by selecting items. Choose temperature (hot/cold) and size (S/regular/L/XL) for udon, and quantity for tempura and toppings. Instantly see calories, nutrition, and allergen info for kamaage udon, bukkake udon, chicken tempura and more. Updated for 2026.",
  keywords: [
    "Marugame Seimen calorie","Marugame calories","Marugame Seimen PFC","Marugame udon calories",
    "Marugame kamaage udon calories","Marugame tempura calories","Marugame Seimen protein","Marugame Seimen allergens",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-marugame",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-marugame",
      en: "https://www.calorie-check.com/en/calorie-checker-marugame",
      "x-default": "https://www.calorie-check.com/calorie-checker-marugame",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Marugame Seimen Calorie Calculator",
      url: "https://www.calorie-check.com/en/calorie-checker-marugame",
      description: "Free tool to instantly calculate total calories and PFC for Marugame Seimen's full menu. Temperature and size selection for udon, quantity selection for tempura and toppings, and allergen info included.",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.calorie-check.com/en" },
        { "@type": "ListItem", position: 2, name: "Udon & Soba", item: "https://www.calorie-check.com/en/category/udon" },
        { "@type": "ListItem", position: 3, name: "Marugame Seimen", item: "https://www.calorie-check.com/en/calorie-checker-marugame" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function MarugamePageEn() {
  const data = await getMenusByChain("丸亀製麺");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MarugameClient menus={menus} locale="en" />
    </>
  );
}
