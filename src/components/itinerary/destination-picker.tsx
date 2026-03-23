"use client";

import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { REGIONS, INTEREST_TAGS } from "@/lib/constants";
import { useItineraryStore } from "@/stores/itinerary-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Plus, Minus, X, MapPin, Search } from "lucide-react";

export function DestinationPicker() {
  const { destinations, addDestination, removeDestination, updateDays } =
    useItineraryStore();
  const [search, setSearch] = useState("");

  const totalDays = destinations.reduce((sum, d) => sum + d.days, 0);

  const available = useMemo(() => {
    const selectedSlugs = new Set(destinations.map((d) => d.slug));
    return SEED_DESTINATIONS.filter((d) => {
      if (selectedSlugs.has(d.slug)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q) ||
          d.tags.some((t) => t.includes(q))
        );
      }
      return true;
    });
  }, [destinations, search]);

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
                className="flex items-center gap-3 rounded-lg border px-4 py-3"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
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

      {/* Search + add destinations */}
      <div>
        <h3 className="font-semibold">Add Destinations</h3>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {available.slice(0, 12).map((d) => {
            const region = REGIONS.find((r) => r.value === d.region);
            return (
              <Card
                key={d.slug}
                size="sm"
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() =>
                  addDestination({ slug: d.slug, name: d.name, days: 2 })
                }
              >
                <CardContent className="flex items-center gap-3 p-3">
                  <Plus className="h-4 w-4 shrink-0 text-rose-500" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{d.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {region?.label}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {d.tags.slice(0, 2).map((tag) => {
                      const meta = INTEREST_TAGS.find((t) => t.value === tag);
                      return (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] px-1.5"
                        >
                          {meta?.icon ?? tag}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {available.length > 12 && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {available.length - 12} more — use search to find them
          </p>
        )}
        {available.length === 0 && destinations.length > 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            All destinations added! Adjust days above, then generate your
            itinerary.
          </p>
        )}
      </div>
    </div>
  );
}
