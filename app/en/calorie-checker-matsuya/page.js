import { getMenusByChain } from "@/lib/microcms";
import MatsuyaClient from "../../calorie-checker-matsuya/MatsuyaClient";

export const metadata = {
  title: "Matsuya Calorie Calculator [Gyumeshi, Size & PFC] | 2026 Latest with Allergen Info",
  description:
    "Calculate total calories and PFC (protein, fat, carbs) for Matsuya's full menu just by selecting items. Instantly see calories, nutrition, and allergen info for gyumeshi, curry, set meals and more. Size selection supported. Updated for 2026.",
  keywords: [
    "Matsuya calorie",
    "Matsuya calories",
    "Matsuya PFC",
    "Matsuya gyumeshi calories",
    "Matsuya protein",
    "Matsuya allergens",
    "Matsuya menu calories",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-matsuya",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-matsuya",
      en: "https://www.calorie-check.com/en/calorie-checker-matsuya",
      "x-default": "https://www.calorie-check.com/calorie-checker-matsuya",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Matsuya Calorie Calculator",
      url: "https://www.calorie-check.com/en/calorie-checker-matsuya",
      description:
        "Free tool to instantly calculate total calories and PFC (protein, fat, carbs) for Matsuya's full menu just by selecting items. Size selection and allergen info included.",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.calorie-check.com/en" },
        { "@type": "ListItem", position: 2, name: "Gyudon", item: "https://www.calorie-check.com/en/category/gyudon" },
        { "@type": "ListItem", position: 3, name: "Matsuya", item: "https://www.calorie-check.com/en/calorie-checker-matsuya" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function MatsuyaPageEn() {
  const data = await getMenusByChain("松屋");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MatsuyaClient menus={menus} locale="en" />
    </>
  );
}
