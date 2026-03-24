import type { Metadata } from "next";
import { DestinationFilters } from "@/components/destination/destination-filters";

export const metadata: Metadata = {
  title: "Best Places to Visit in Japan — Destinations Guide",
  description:
    "Explore 26 curated destinations across Japan from Tokyo to Okinawa. Filter by region, interests like onsen, temples, food, and nightlife, and find the best season to visit.",
  keywords: ["best places to visit in Japan", "Japan destinations", "where to go in Japan", "Japan regions guide", "Japan travel destinations"],
};

export default function DestinationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Explore Destinations
        </h1>
        <p className="mt-3 text-muted-foreground">
          28 curated destinations across all regions of Japan
        </p>
      </div>

      <div className="mt-8">
        <DestinationFilters />
      </div>
    </div>
  );
}
