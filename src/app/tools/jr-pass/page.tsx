import type { Metadata } from "next";
import { JRPassCalculator } from "@/components/tools/jr-pass-calculator";
import { SectionHead } from "@/components/home/section-head";
import { JsonLd } from "@/components/seo/json-ld";

const SITE_URL = "https://www.yourjapanplan.com";

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JR Pass Calculator",
  url: `${SITE_URL}/tools/jr-pass`,
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  description:
    "Compare Shinkansen fares against the 7, 14, and 21-day Japan Rail Pass to see if the pass pays off for your route.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "JR Pass calculator",
      item: `${SITE_URL}/tools/jr-pass`,
    },
  ],
};

export const metadata: Metadata = {
  title: "JR Pass Calculator 2026 — Is the Japan Rail Pass Worth It?",
  description:
    "Calculate if the Japan Rail Pass is worth it for your trip. Compare Shinkansen ticket prices vs JR Pass costs for routes like Tokyo to Osaka, Kyoto, Hiroshima, and more.",
  keywords: [
    "JR Pass calculator",
    "Japan Rail Pass worth it",
    "JR Pass 2026 price",
    "Shinkansen cost calculator",
    "Japan train pass",
  ],
  alternates: { canonical: "/tools/jr-pass" },
};

export default function JRPassPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-[clamp(48px,8vw,96px)]">
      <JsonLd data={[webAppSchema, breadcrumbSchema]} />
      <SectionHead
        eyebrow="JR Pass calculator"
        title={
          <>
            Worth it?{" "}
            <span className="font-display italic font-normal text-accent">
              Find out in thirty seconds.
            </span>
          </>
        }
        lede="The JR Pass price doubled in 2023 — it's still a bargain on some itineraries and a money pit on others. Put your real route in and we'll show you the break-even."
      />

      <div className="mt-10">
        <JRPassCalculator />
      </div>
    </div>
  );
}
