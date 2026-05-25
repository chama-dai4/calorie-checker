import { getMenusByChain } from "@/lib/microcms";
import TenyaClient from "../../calorie-checker-tenya/TenyaClient";

export const metadata = {
  title: "Tenya Calorie Calculator [Tendon, Tempura, Sets & PFC] | 2026 Latest with Allergen Info",
  description:
    "Calculate total calories and PFC (protein, fat, carbs) for Tenya's full menu just by selecting items. Choose quantity for tempura à la carte and sides. Instantly see calories, nutrition, and allergen info for tendon, tempura platters and more. Updated for 2026.",
  keywords: [
    "Tenya calorie","Tenya calories","Tenya PFC","Tenya tendon calories",
    "Tenya tempura calories","Tenya protein","Tenya allergens","Tenya menu calories",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-tenya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-tenya",
      en: "https://www.calorie-check.com/en/calorie-checker-tenya",
      "x-default": "https://www.calorie-check.com/calorie-checker-tenya",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Tenya Calorie Calculator",
      url: "https://www.calorie-check.com/en/calorie-checker-tenya",
      description: "Free tool to instantly calculate total calories and PFC for Tenya's full menu. Quantity selection and allergen info included.",
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
        { "@type": "ListItem", position: 3, name: "Tenya", item: "https://www.calorie-check.com/en/calorie-checker-tenya" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function TenyaPageEn() {
  const data = await getMenusByChain("天丼てんや");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TenyaClient menus={menus} locale="en" />
    </>
  );
}
