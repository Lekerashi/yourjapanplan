"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getActivitiesForDestination } from "@/lib/data/seed-activities";
import { getTemplatesForDestination } from "@/lib/data/day-templates";

const TYPE_LABELS: Record<string, string> = {
  sight: "Sight",
  food: "Food",
  experience: "Experience",
  shopping: "Shopping",
  nightlife: "Nightlife",
  nature: "Nature",
};

const TIME_LABELS = ["morning", "afternoon", "evening", "anytime"] as const;

interface ActivityPickerProps {
  destinationSlug: string;
  addedActivityIds: Set<string>;
  userInterests: string[];
  isFirstTimer?: boolean;
  onAddActivity: (catalogId: string) => void;
  onApplyTemplate: (activityIds: string[]) => void;
  showTemplates: boolean;
}

export function ActivityPicker({
  destinationSlug,
  addedActivityIds,
  userInterests,
  isFirstTimer,
  onAddActivity,
  onApplyTemplate,
  showTemplates,
}: ActivityPickerProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string | null>(null);

  const allActivities = useMemo(
    () => getActivitiesForDestination(destinationSlug),
    [destinationSlug],
  );

  const templates = useMemo(
    () => getTemplatesForDestination(destinationSlug),
    [destinationSlug],
  );

  const filtered = useMemo(() => {
    let result = allActivities;

    if (!isFirstTimer) {
      result = result.filter((a) => !a.first_timer);
    }
    if (typeFilter) {
      result = result.filter((a) => a.type === typeFilter);
    }
    if (timeFilter) {
      result = result.filter(
        (a) =>
          a.best_time_of_day === timeFilter ||
          a.best_time_of_day === "anytime",
      );
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q),
      );
    }

    const interestSet = new Set(userInterests);
    result.sort((a, b) => {
      if (isFirstTimer) {
        const aFirst = a.first_timer ?? false;
        const bFirst = b.first_timer ?? false;
        if (aFirst && !bFirst) return -1;
        if (!aFirst && bFirst) return 1;
      }
      const aMatch = a.tags.some((t) => interestSet.has(t));
      const bMatch = b.tags.some((t) => interestSet.has(t));
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [
    allActivities,
    typeFilter,
    timeFilter,
    search,
    userInterests,
    isFirstTimer,
  ]);

  return (
    <div className="flex flex-col gap-4">
      {showTemplates && templates.length > 0 && (
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Quick start templates
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onApplyTemplate(t.activity_ids)}
                className="border border-border bg-background p-3 text-left transition-colors hover:border-foreground"
              >
                <p className="font-display text-[15px] font-medium tracking-[-0.005em] text-foreground">
                  {t.name}
                </p>
                <p className="mt-1 text-[12px] text-ink-2">{t.description}</p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {t.suggested_pace} pace · {t.activity_ids.length} activities
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search activities…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 pl-10 text-[13px]"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Object.entries(TYPE_LABELS).map(([type, label]) => {
          const on = typeFilter === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(on ? null : type)}
              className={cn(
                "border px-2.5 py-1 text-[11px] font-medium transition-colors",
                on
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TIME_LABELS.map((time) => {
          const on = timeFilter === time;
          return (
            <button
              key={time}
              type="button"
              onClick={() => setTimeFilter(on ? null : time)}
              className={cn(
                "border px-2.5 py-1 text-[11px] font-medium capitalize transition-colors",
                on
                  ? "border-accent bg-accent/5 text-foreground ring-1 ring-inset ring-accent"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
              )}
            >
              {time}
            </button>
          );
        })}
      </div>

      <ul className="flex flex-col border-t border-border">
        {filtered.map((activity) => {
          const isAdded = addedActivityIds.has(activity.id);
          const typeLabel = TYPE_LABELS[activity.type] ?? activity.type;
          return (
            <li
              key={activity.id}
              className={cn(
                "flex items-start gap-3 border-b border-border py-3",
                isAdded && "opacity-40",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-[15px] font-medium tracking-[-0.005em] text-foreground">
                    {activity.name}
                  </p>
                  <span className="border border-border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {typeLabel}
                  </span>
                  {activity.first_timer && (
                    <span className="border border-accent/40 bg-accent/5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-accent">
                      Must-do
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[12.5px] leading-[1.5] text-ink-2 line-clamp-2">
                  {activity.description}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span>
                    {activity.duration_minutes >= 60
                      ? `${Math.floor(activity.duration_minutes / 60)}h${activity.duration_minutes % 60 ? ` ${activity.duration_minutes % 60}m` : ""}`
                      : `${activity.duration_minutes}m`}
                  </span>
                  <span>{activity.cost_estimate}</span>
                  {activity.reservation_required && <span>Reserve</span>}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={isAdded}
                onClick={() => onAddActivity(activity.id)}
                aria-label={isAdded ? "Already added" : "Add activity"}
              >
                {isAdded ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </li>
          );
        })}

        {filtered.length === 0 && (
          <li className="py-6 text-center text-[13px] text-muted-foreground">
            No activities match your filters.
          </li>
        )}
      </ul>
    </div>
  );
}
