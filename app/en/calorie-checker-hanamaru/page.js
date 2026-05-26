import { getMenusByChain } from "@/lib/microcms";
import HanamaruClient from "../../calorie-checker-hanamaru/HanamaruClient";

export const metadata = {
  title: "Hanamaru Udon Calorie Calculator [Sizes, Toppings & PFC] | 2026 Latest with Allergen Info",
  description:
    "Calculate total calories and PFC (protein, fat, carbs) for Hanamaru Udon's full menu just by selecting items. Choose small/medium/large size for udon, and quantity for toppings and oden. Instantly see calories, nutrition, and allergen info for kake udon, kamatama, tempura and more. Updated for 2026.",
  keywords: [
    "Hanamaru Udon calorie","Hanamaru Udon calories","Hanamaru Udon PFC","Hanamaru udon size calories",
    "Hanamaru kake udon calories","Hanamaru tempura calories","Hanamaru Udon protein","Hanamaru Udon allergens",
  ],
  alternates: {
    canonical: "https://www.calorie-check.com/en/calorie-checker-hanamaru",
    languages: {
      ja: "https://www.calorie-check.com/calorie-checker-hanamaru",
      en: "https://www.calorie-check.com/en/calorie-checker-hanamaru",
      "x-default": "https://www.calorie-check.com/calorie-checker-hanamaru",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Hanamaru Udon Calorie Calculator",
      url: "https://www.calorie-check.com/en/calorie-checker-hanamaru",
      description: "Free tool to instantly calculate total calories and PFC for Hanamaru Udon's full menu. Size selection for udon, quantity selection for toppings, and allergen info included.",
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
        { "@type": "ListItem", position: 3, name: "Hanamaru Udon", item: "https://www.calorie-check.com/en/calorie-checker-hanamaru" },
      ],
    },
  ],
};

export const revalidate = 3600;

export default async function HanamaruPageEn() {
  const data = await getMenusByChain("はなまるうどん");
  const menus = data.contents;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HanamaruClient menus={menus} locale="en" />
    </>
  );
}
