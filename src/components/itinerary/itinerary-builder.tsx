"use client";

import { useItineraryStore } from "@/stores/itinerary-store";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { findRoute } from "@/lib/data/transport-routes";
import { DayBuilder } from "./day-builder";
import { TripSummary } from "./trip-summary";
import { Badge } from "@/components/ui/badge";
import { Train } from "lucide-react";

export function ItineraryBuilder() {
  const builderDays = useItineraryStore((s) => s.builderDays);
  const activeDay = useItineraryStore((s) => s.activeDay);
  const setActiveDay = useItineraryStore((s) => s.setActiveDay);
  const destinations = useItineraryStore((s) => s.destinations);

  // Group days by destination for the navigator
  const dayGroups: {
    dayNumber: number;
    slug: string;
    name: string;
    isNewDestination: boolean;
  }[] = builderDays.map((d, i) => {
    const dest = destinations.find((dest) => dest.slug === d.destinationSlug);
    const prev = i > 0 ? builderDays[i - 1] : null;
    return {
      dayNumber: d.dayNumber,
      slug: d.destinationSlug,
      name: dest?.name ?? d.destinationSlug,
      isNewDestination: !prev || prev.destinationSlug !== d.destinationSlug,
    };
  });

  const activeDayData = builderDays.find((d) => d.dayNumber === activeDay);
  const activeDest = activeDayData
    ? SEED_DESTINATIONS.find((d) => d.slug === activeDayData.destinationSlug)
    : null;

  return (
    <div className="space-y-6">
      {/* Day navigator */}
      <div className="flex flex-wrap items-center gap-1.5">
        {dayGroups.map((group, i) => {
          // Show transport indicator between different destinations
          const showTransport =
            group.isNewDestination && i > 0;
          const prevSlug = i > 0 ? dayGroups[i - 1].slug : null;
          const route =
            showTransport && prevSlug
              ? findRoute(prevSlug, group.slug)
              : null;

          return (
            <div key={group.dayNumber} className="flex items-center gap-1.5">
              {showTransport && (
                <div className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[10px] text-blue-600">
                  <Train className="h-3 w-3" />
                  {route ? route.duration : "→"}
                </div>
              )}
              <button
                onClick={() => setActiveDay(group.dayNumber)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeDay === group.dayNumber
                    ? "bg-rose-600 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <span className="font-semibold">D{group.dayNumber}</span>
                <span className="text-xs opacity-80">{group.name}</span>
                {activeDayData &&
                  group.dayNumber === activeDay &&
                  activeDayData.activities.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-0.5 h-4 text-[10px] px-1"
                    >
                      {activeDayData.activities.length}
                    </Badge>
                  )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Active day header */}
      {activeDest && activeDayData && (
        <div>
          <h2 className="text-xl font-bold">
            Day {activeDay}: {activeDest.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeDest.description.split(".")[0]}.
          </p>
        </div>
      )}

      {/* Day builder */}
      {activeDayData && <DayBuilder dayNumber={activeDay} />}

      {/* Trip summary */}
      <TripSummary />
    </div>
  );
}
