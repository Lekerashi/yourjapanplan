"use client";

import { useMemo } from "react";
import { useItineraryStore } from "@/stores/itinerary-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { JapanMap } from "./japan-map";

export function DestinationPicker() {
  const { destinations, addDestination, removeDestination, updateDays, reorderDestinations } =
    useItineraryStore();
  const startDate = useItineraryStore((s) => s.startDate);
  const setStartDate = useItineraryStore((s) => s.setStartDate);

  const totalDays = destinations.reduce((sum, d) => sum + d.days, 0);

  const selectedSlugs = useMemo(
    () => new Set(destinations.map((d) => d.slug)),
    [destinations]
  );

  const handleMapSelect = (slug: string, name: string) => {
    if (selectedSlugs.has(slug)) {
      removeDestination(slug);
    } else {
      addDestination({ slug, name, days: 2 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected destinations */}
      {destinations.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Your Route ({destinations.length} destinations, {totalDays} days)
            </h3>
          </div>
          <div className="mt-3 space-y-2">
            {destinations.map((d, i) => (
              <div
                key={d.slug}
                className="flex items-center gap-2 rounded-lg border px-3 py-3"
              >
                <div className="flex flex-col gap-0.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    disabled={i === 0}
                    onClick={() => {
                      const items = [...destinations];
                      [items[i - 1], items[i]] = [items[i], items[i - 1]];
                      reorderDestinations(items);
                    }}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    disabled={i === destinations.length - 1}
                    onClick={() => {
                      const items = [...destinations];
                      [items[i], items[i + 1]] = [items[i + 1], items[i]];
                      reorderDestinations(items);
                    }}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600 shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 font-medium">{d.name}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => updateDays(d.slug, Math.max(1, d.days - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-12 text-center text-sm">
                    {d.days} {d.days === 1 ? "day" : "days"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => updateDays(d.slug, d.days + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground"
                  onClick={() => removeDestination(d.slug)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Travel dates */}
      {destinations.length > 0 && (
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Travel Dates
            <span className="font-normal text-sm text-muted-foreground">(optional)</span>
          </h3>
          <div className="mt-2 flex items-center gap-3">
            <Input
              type="date"
              value={startDate ?? ""}
              onChange={(e) => setStartDate(e.target.value || null)}
              className="w-44"
            />
            {startDate && (
              <span className="text-sm text-muted-foreground">
                to{" "}
                {new Date(
                  new Date(startDate).getTime() + (totalDays - 1) * 86400000
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
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground"
                onClick={() => setStartDate(null)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Map */}
      <div>
        <h3 className="font-semibold">
          {destinations.length === 0
            ? "Click a destination on the map to add it"
            : "Add more destinations"}
        </h3>
        <div className="mt-3">
          <JapanMap
            selectedSlugs={selectedSlugs}
            onSelect={handleMapSelect}
          />
        </div>
      </div>
    </div>
  );
}
