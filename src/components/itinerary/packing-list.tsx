"use client";

import { useMemo, useState } from "react";
import { useItineraryStore } from "@/stores/itinerary-store";
import { getActivitiesForDestination } from "@/lib/data/seed-activities";
import { generatePackingList, type PackingItem } from "@/lib/data/packing-rules";
import { Card, CardContent } from "@/components/ui/card";
import { Backpack, Check } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  essentials: "Essentials",
  clothing: "Clothing",
  gear: "Gear",
  toiletries: "Toiletries",
  tech: "Tech",
};

export function PackingList() {
  const season = useItineraryStore((s) => s.season);
  const builderDays = useItineraryStore((s) => s.builderDays);
  const destinations = useItineraryStore((s) => s.destinations);

  // Collect all unique activity tags from the itinerary
  const activityTags = useMemo(() => {
    const tags = new Set<string>();
    for (const dest of destinations) {
      for (const a of getActivitiesForDestination(dest.slug)) {
        // Check if this activity is actually in the itinerary
        const isUsed = builderDays.some((d) =>
          d.activities.some((act) => act.catalogId === a.id)
        );
        if (isUsed) {
          for (const t of a.tags) tags.add(t);
          tags.add(a.type); // also use activity type as a tag
        }
      }
    }
    return Array.from(tags);
  }, [destinations, builderDays]);

  const packingItems = useMemo(
    () => generatePackingList(season ?? "spring", activityTags),
    [season, activityTags]
  );

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, PackingItem[]> = {};
    for (const item of packingItems) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [packingItems]);

  // Checked state — persisted in localStorage
  const storageKey = "yjp-packing-checked";
  const [checked, setChecked] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set<string>();
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const toggle = (name: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      localStorage.setItem(storageKey, JSON.stringify([...next]));
      return next;
    });
  };

  if (packingItems.length === 0) return null;

  const totalChecked = packingItems.filter((i) => checked.has(i.name)).length;

  return (
    <Card size="sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Backpack className="h-5 w-5 text-rose-500" />
            <h4 className="text-sm font-semibold">Packing List</h4>
          </div>
          <span className="text-xs text-muted-foreground">
            {totalChecked}/{packingItems.length} packed
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {CATEGORY_LABELS[category] ?? category}
              </h5>
              <ul className="space-y-0.5">
                {items.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => toggle(item.name)}
                      className="flex items-start gap-2 w-full text-left rounded px-1 py-0.5 hover:bg-muted/50 transition-colors"
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          checked.has(item.name)
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {checked.has(item.name) && (
                          <Check className="h-3 w-3" />
                        )}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`text-sm ${checked.has(item.name) ? "line-through text-muted-foreground" : ""}`}
                        >
                          {item.name}
                        </span>
                        <span className="block text-[11px] text-muted-foreground/70 line-clamp-1">
                          {item.reason}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
