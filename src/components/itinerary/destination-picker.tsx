"use client";

import { useMemo } from "react";
import { useItineraryStore } from "@/stores/itinerary-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ArrowUp, ArrowDown } from "lucide-react";
import { JapanMap } from "./japan-map";

function Stepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="inline-flex items-stretch border border-border">
      <button
        type="button"
        aria-label="Decrease days"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg
          viewBox="0 0 16 16"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden
        >
          <path d="M3 8h10" />
        </svg>
      </button>
      <span className="flex w-14 items-center justify-center border-x border-border text-[13px] font-medium tabular-nums text-foreground">
        {value}
        <span className="ml-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {value === 1 ? "d" : "d"}
        </span>
      </span>
      <button
        type="button"
        aria-label="Increase days"
        onClick={() => onChange(value + 1)}
        className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg
          viewBox="0 0 16 16"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden
        >
          <path d="M8 3v10M3 8h10" />
        </svg>
      </button>
    </div>
  );
}

export function DestinationPicker() {
  const {
    destinations,
    addDestination,
    removeDestination,
    updateDays,
    reorderDestinations,
  } = useItineraryStore();
  const startDate = useItineraryStore((s) => s.startDate);
  const setStartDate = useItineraryStore((s) => s.setStartDate);

  const totalDays = destinations.reduce((sum, d) => sum + d.days, 0);

  const selectedSlugs = useMemo(
    () => new Set(destinations.map((d) => d.slug)),
    [destinations],
  );

  const handleMapSelect = (slug: string, name: string) => {
    if (selectedSlugs.has(slug)) {
      removeDestination(slug);
    } else {
      addDestination({ slug, name, days: 2 });
    }
  };

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Japan
        </p>
        <h2 className="mt-2 font-display text-[22px] font-medium tracking-[-0.01em] text-foreground">
          {destinations.length === 0
            ? "Click cities to add them."
            : "Add more or rearrange."}
        </h2>
        <div className="mt-4">
          <JapanMap selectedSlugs={selectedSlugs} onSelect={handleMapSelect} />
        </div>
      </div>

      <div>
        {destinations.length === 0 ? (
          <div className="border border-dashed border-border bg-card/60 p-8 text-center">
            <p className="font-display text-[20px] font-medium tracking-[-0.005em] text-foreground">
              Nothing picked yet.
            </p>
            <p className="mt-2 text-[14px] text-ink-2">
              Tap cities on the map to start your route.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Your route
                </p>
                <h3 className="mt-1 font-display text-[22px] font-medium tracking-[-0.01em] text-foreground">
                  {destinations.length}{" "}
                  {destinations.length === 1 ? "city" : "cities"} · {totalDays}{" "}
                  {totalDays === 1 ? "day" : "days"}
                </h3>
              </div>
            </div>

            <ul className="mt-3 flex flex-col">
              {destinations.map((d, i) => (
                <li
                  key={d.slug}
                  className="flex items-center gap-3 border-b border-border py-3"
                >
                  <div className="flex flex-col">
                    <button
                      type="button"
                      aria-label="Move up"
                      disabled={i === 0}
                      onClick={() => {
                        const items = [...destinations];
                        [items[i - 1], items[i]] = [items[i], items[i - 1]];
                        reorderDestinations(items);
                      }}
                      className="inline-flex h-4 w-5 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      disabled={i === destinations.length - 1}
                      onClick={() => {
                        const items = [...destinations];
                        [items[i], items[i + 1]] = [items[i + 1], items[i]];
                        reorderDestinations(items);
                      }}
                      className="inline-flex h-4 w-5 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="inline-grid h-8 w-8 shrink-0 place-items-center border border-border bg-background font-display text-[13px] font-semibold text-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-display text-[17px] font-medium tracking-[-0.005em] text-foreground">
                    {d.name}
                  </span>
                  <Stepper
                    value={d.days}
                    onChange={(n) => updateDays(d.slug, n)}
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${d.name}`}
                    onClick={() => removeDestination(d.slug)}
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Travel dates (optional)
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Input
                  type="date"
                  value={startDate ?? ""}
                  onChange={(e) => setStartDate(e.target.value || null)}
                  className="w-44"
                />
                {startDate && (
                  <span className="text-[13px] text-ink-2">
                    through{" "}
                    {new Date(
                      new Date(startDate).getTime() +
                        (totalDays - 1) * 86400000,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
                {startDate && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setStartDate(null)}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
