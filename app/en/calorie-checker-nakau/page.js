import { getMenusByChain } from "@/lib/microcms";
import NakauClient from "../../calorie-checker-nakau/NakauClient";

export const metadata = {
  title: "Nakau Calorie Calculator [Donburi, Udon, Size & PFC] | 2026 Latest with Allergen Info",
  description:
    "Calculate total calories and PFC (protein, fat, carbs) for Nakau's full menu just by selecting items. Instantly see calories, nutrition, and allergen info for oyakodon, gyudon, Kyoto-style udon, set meals and more. Size selection supported. Updated for 2026.",
  keywords: [
    "Nakau calorie",
    "Nakau calories",
    "Nakau PFC",
    "Nakau oyakodon calories",
    "Nakau udon calories",
    "Nakau protein",
    "Nakau allergens",
    "Nakau menu calories",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-nakau",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-nakau",
      en: "https://www.calorie-check.com/en/calorie-checker-nakau",
      "x-default": "https://www.calorie-check.com/calorie-checker-nakau",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Nakau Calorie Calculator",
      url: "https://www.calorie-check.com/en/calorie-checker-nakau",
      description:
        "Free tool to instantly calculate total calories and PFC (protein, fat, carbs) for Nakau's full menu just by selecting items. Size selection and allergen info included.",
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
        { "@type": "ListItem", position: 3, name: "Nakau", item: "https://www.calorie-check.com/en/calorie-checker-nakau" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function NakauPageEn() {
  const data = await getMenusByChain("なか卯");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NakauClient menus={menus} locale="en" />
    </>
  );
}
