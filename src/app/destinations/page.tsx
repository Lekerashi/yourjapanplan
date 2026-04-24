import type { Metadata } from "next";
import { DestinationFilters } from "@/components/destination/destination-filters";
import { SectionHead } from "@/components/home/section-head";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";

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
};

export default function DestinationsPage() {
  const count = SEED_DESTINATIONS.length;
  return (
    <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-[clamp(48px,8vw,96px)]">
      <SectionHead
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
