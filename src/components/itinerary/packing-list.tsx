"use client";

import { useMemo, useState } from "react";
import { useItineraryStore } from "@/stores/itinerary-store";
import { getActivitiesForDestination } from "@/lib/data/seed-activities";
import {
  generatePackingList,
  type PackingItem,
} from "@/lib/data/packing-rules";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const activityTags = useMemo(() => {
    const tags = new Set<string>();
    for (const dest of destinations) {
      for (const a of getActivitiesForDestination(dest.slug)) {
        const isUsed = builderDays.some((d) =>
          d.activities.some((act) => act.catalogId === a.id),
        );
        if (isUsed) {
          for (const t of a.tags) tags.add(t);
          tags.add(a.type);
        }
      }
    }
    return Array.from(tags);
  }, [destinations, builderDays]);

  const packingItems = useMemo(
    () => generatePackingList(season ?? "spring", activityTags),
    [season, activityTags],
  );

  const grouped = useMemo(() => {
    const groups: Record<string, PackingItem[]> = {};
    for (const item of packingItems) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [packingItems]);

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
    <section className="border border-border bg-card p-6">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Packing list
        </p>
        <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {totalChecked}/{packingItems.length} packed
        </span>
      </div>

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h5 className="font-display text-[14px] font-medium tracking-[-0.005em] text-foreground">
              {CATEGORY_LABELS[category] ?? category}
            </h5>
            <ul className="mt-2 flex flex-col gap-1">
              {items.map((item) => {
                const on = checked.has(item.name);
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => toggle(item.name)}
                      className="group flex w-full items-start gap-3 py-1 text-left transition-colors"
                    >
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
                          on
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border group-hover:border-foreground",
                        )}
                        aria-hidden
                      >
                        {on && <Check className="h-3 w-3" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-[13px]",
                            on
                              ? "text-muted-foreground line-through"
                              : "text-foreground",
                          )}
                        >
                          {item.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-muted-foreground line-clamp-1">
                          {item.reason}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
