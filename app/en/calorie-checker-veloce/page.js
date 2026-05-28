import { getMenusByChain } from "@/lib/microcms";
import VeloceClient from "../../calorie-checker-veloce/VeloceClient";

export const metadata = {
  title: "Cafe Veloce Calorie Calculator [Temp, Size & Region] | 2026 Latest with Allergen Info",
  description:
    "Calculate total calories and PFC (protein, fat, carbs) for Cafe Veloce's full menu just by selecting items. Choose temperature (hot/iced) and size for drinks, region for region-specific sandwiches, and quantity for breads and sweets. Instantly see calories, nutrition, and allergen info for blended coffee, cafe au lait, egg sandwiches and more. Updated for 2026.",
  keywords: [
    "Cafe Veloce calorie","Cafe Veloce calories","Cafe Veloce PFC","Veloce coffee calories",
    "Veloce sandwich calories","Veloce cake calories","Cafe Veloce allergens","Cafe Veloce nutrition",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-veloce",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-veloce",
      en: "https://www.calorie-check.com/en/calorie-checker-veloce",
      "x-default": "https://www.calorie-check.com/calorie-checker-veloce",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Cafe Veloce Calorie Calculator",
      url: "https://www.calorie-check.com/en/calorie-checker-veloce",
      description: "Free tool to instantly calculate total calories and PFC for Cafe Veloce's full menu. Temperature and size selection for drinks, region selection for region-specific sandwiches, quantity selection for breads and sweets, and allergen info included.",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.calorie-check.com/en" },
        { "@type": "ListItem", position: 2, name: "Cafe", item: "https://www.calorie-check.com/en/category/cafe" },
        { "@type": "ListItem", position: 3, name: "Cafe Veloce", item: "https://www.calorie-check.com/en/calorie-checker-veloce" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function VelocePageEn() {
  const data = await getMenusByChain("カフェベローチェ");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VeloceClient menus={menus} locale="en" />
    </>
  );
}
