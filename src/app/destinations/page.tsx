import type { Metadata } from "next";
import { DestinationFilters } from "@/components/destination/destination-filters";
import { SectionHead } from "@/components/home/section-head";
import { JsonLd } from "@/components/seo/json-ld";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";

const SITE_URL = "https://www.yourjapanplan.com";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Destinations",
      item: `${SITE_URL}/destinations`,
    },
  ],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Destinations in Japan",
  numberOfItems: SEED_DESTINATIONS.length,
  itemListElement: SEED_DESTINATIONS.map((d, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/destinations/${d.slug}`,
    name: d.name,
  })),
};

export const metadata: Metadata = {
  title: "Best Places to Visit in Japan — Destinations Guide",
  description:
    "Explore curated destinations across Japan from Tokyo to Okinawa. Filter by region, interests like onsen, temples, food, and nightlife, and find the best season to visit.",
  keywords: [
    "best places to visit in Japan",
    "Japan destinations",
    "where to go in Japan",
    "Japan regions guide",
    "Japan travel destinations",
  ],
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  const count = SEED_DESTINATIONS.length;
  return (
    <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-[clamp(48px,8vw,96px)]">
      <JsonLd data={[breadcrumbSchema, itemListSchema]} />
      <SectionHead
        as="h1"
        eyebrow="Destinations"
        title={
          <>
            {count} curated cities,{" "}
            <span className="font-display italic font-normal text-accent">
              every region.
            </span>
          </>
        }
        lede="Browse by region, interest, or season. Every pick is one we'd send a friend to."
      />

      <div className="mt-10">
        <DestinationFilters />
      </div>
    </div>
  );
}
