"use client";

import { useItineraryStore } from "@/stores/itinerary-store";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { findRoute } from "@/lib/data/transport-routes";
import { DayBuilder } from "./day-builder";
import { TripSummary } from "./trip-summary";
import { cn } from "@/lib/utils";

function getDayDate(startDate: string | null, dayNumber: number): Date | null {
  if (!startDate) return null;
  const d = new Date(startDate + "T00:00:00");
  d.setDate(d.getDate() + dayNumber - 1);
  return d;
}

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ItineraryBuilder() {
  const builderDays = useItineraryStore((s) => s.builderDays);
  const activeDay = useItineraryStore((s) => s.activeDay);
  const setActiveDay = useItineraryStore((s) => s.setActiveDay);
  const destinations = useItineraryStore((s) => s.destinations);
  const startDate = useItineraryStore((s) => s.startDate);

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
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center gap-2">
        {dayGroups.map((group, i) => {
          const showTransport = group.isNewDestination && i > 0;
          const prevSlug = i > 0 ? dayGroups[i - 1].slug : null;
          const route =
            showTransport && prevSlug ? findRoute(prevSlug, group.slug) : null;
          const on = activeDay === group.dayNumber;
          const dateOfDay = startDate
            ? getDayDate(startDate, group.dayNumber)
            : null;

          return (
            <div key={group.dayNumber} className="flex items-center gap-2">
              {showTransport && (
                <div className="flex items-center gap-1.5 border border-border bg-background px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  <svg
                    viewBox="0 0 16 16"
                    width="10"
                    height="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                  {route ? route.duration : "transfer"}
                </div>
              )}
              <button
                type="button"
                onClick={() => setActiveDay(group.dayNumber)}
                className={cn(
                  "flex items-center gap-2 border px-3 py-2 text-[13px] font-medium transition-colors",
                  on
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card text-ink-2 hover:border-foreground hover:text-foreground",
                )}
              >
                <span className="font-display text-[13px] font-semibold">
                  Day {group.dayNumber}
                </span>
                {dateOfDay && (
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-[0.1em]",
                      on ? "text-accent-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {SHORT_DAYS[dateOfDay.getDay()]}
                  </span>
                )}
                <span
                  className={cn(
                    "text-[12px]",
                    on ? "text-accent-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {group.name}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {activeDest && activeDayData && (
        <div className="border-t border-border pt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Day {activeDay} · {activeDest.name}
            {startDate &&
              (() => {
                const d = getDayDate(startDate, activeDay);
                return d
                  ? ` · ${d.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}`
                  : "";
              })()}
          </p>
          <h2 className="mt-2 font-display text-[clamp(26px,3vw,36px)] font-medium leading-[1.05] tracking-[-0.015em] text-foreground">
            {activeDest.name} in one day.
          </h2>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.6] text-ink-2">
            {activeDest.description.split(".")[0]}.
          </p>
        </div>
      )}

      {activeDayData && <DayBuilder dayNumber={activeDay} />}

      <TripSummary />
    </div>
  );
}
