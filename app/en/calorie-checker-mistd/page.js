import { getMenusByChain } from "@/lib/microcms";
import MistdClient from "../../calorie-checker-mistd/MistdClient";

export const metadata = {
  title: "Mister Donut Calorie Calculator [Quantity & PFC] | 2026 Latest with Allergen Info",
  description:
    "Calculate total calories and PFC (protein, fat, carbs) for Mister Donut's full menu just by selecting items. Adjust quantity and totals update automatically. Instantly see calories, nutrition, and allergen info for Pon de Ring, Old Fashioned and more. Updated for 2026.",
  keywords: [
    "Mister Donut calorie",
    "Mister Donut calories",
    "Mister Donut PFC",
    "Pon de Ring calories",
    "Mister Donut protein",
    "Mister Donut allergens",
    "Mister Donut menu calories",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-mistd",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-mistd",
      en: "https://www.calorie-check.com/en/calorie-checker-mistd",
      "x-default": "https://www.calorie-check.com/calorie-checker-mistd",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Mister Donut Calorie Calculator",
      url: "https://www.calorie-check.com/en/calorie-checker-mistd",
      description:
        "Free tool to instantly calculate total calories and PFC for Mister Donut's full menu just by selecting items. Quantity selection and allergen info included.",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.calorie-check.com/en" },
        { "@type": "ListItem", position: 2, name: "Sweets", item: "https://www.calorie-check.com/en/category/sweets" },
        { "@type": "ListItem", position: 3, name: "Mister Donut", item: "https://www.calorie-check.com/en/calorie-checker-mistd" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function MistdPageEn() {
  const data = await getMenusByChain("ミスタードーナツ");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MistdClient menus={menus} locale="en" />
    </>
  );
}
