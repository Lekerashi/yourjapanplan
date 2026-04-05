"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Check,
  Clock,
  Bookmark,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { getActivitiesForDestination } from "@/lib/data/seed-activities";
import { getTemplatesForDestination } from "@/lib/data/day-templates";

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  sight: { label: "Sight", color: "bg-blue-100 text-blue-700" },
  food: { label: "Food", color: "bg-orange-100 text-orange-700" },
  experience: { label: "Experience", color: "bg-purple-100 text-purple-700" },
  shopping: { label: "Shopping", color: "bg-pink-100 text-pink-700" },
  nightlife: { label: "Nightlife", color: "bg-indigo-100 text-indigo-700" },
  nature: { label: "Nature", color: "bg-emerald-100 text-emerald-700" },
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
    [destinationSlug]
  );

  const templates = useMemo(
    () => getTemplatesForDestination(destinationSlug),
    [destinationSlug]
  );

  const filtered = useMemo(() => {
    let result = allActivities;

    // Hide first-timer-only activities for returning visitors
    if (!isFirstTimer) {
      result = result.filter((a) => !a.first_timer);
    }

    if (typeFilter) {
      result = result.filter((a) => a.type === typeFilter);
    }
    if (timeFilter) {
      result = result.filter(
        (a) => a.best_time_of_day === timeFilter || a.best_time_of_day === "anytime"
      );
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    // Sort: first-timer picks first (if first-timer), then matching interests, then alphabetical
    const interestSet = new Set(userInterests);
    result.sort((a, b) => {
      // First-timer picks to the top for first-time visitors
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
  }, [allActivities, typeFilter, timeFilter, search, userInterests, isFirstTimer]);

  return (
    <div className="space-y-4">
      {/* Quick Start Templates */}
      {showTemplates && templates.length > 0 && (
        <div>
          <h4 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Quick Start
          </h4>
          <div className="mt-2 space-y-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => onApplyTemplate(t.activity_ids)}
                className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted"
              >
                <p className="text-sm font-medium">{t.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.description}
                </p>
                <Badge variant="secondary" className="mt-1.5 text-[10px]">
                  {t.suggested_pace} pace · {t.activity_ids.length} activities
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(TYPE_LABELS).map(([type, { label }]) => (
          <button
            key={type}
            onClick={() => setTypeFilter(typeFilter === type ? null : type)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              typeFilter === type
                ? "bg-rose-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TIME_LABELS.map((time) => (
          <button
            key={time}
            onClick={() => setTimeFilter(timeFilter === time ? null : time)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              timeFilter === time
                ? "bg-rose-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Activity list */}
      <div className="space-y-2">
        {filtered.map((activity) => {
          const isAdded = addedActivityIds.has(activity.id);
          const typeInfo = TYPE_LABELS[activity.type];
          return (
            <Card
              key={activity.id}
              size="sm"
              className={`transition-opacity ${isAdded ? "opacity-50" : ""}`}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {activity.name}
                      </p>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${typeInfo?.color ?? ""}`}
                      >
                        {typeInfo?.label ?? activity.type}
                      </span>
                      {activity.first_timer && (
                        <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700">
                          Must-do
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        {activity.duration_minutes >= 60
                          ? `${Math.floor(activity.duration_minutes / 60)}h${activity.duration_minutes % 60 ? ` ${activity.duration_minutes % 60}m` : ""}`
                          : `${activity.duration_minutes}m`}
                      </span>
                      <span>{activity.cost_estimate}</span>
                      {activity.reservation_required && (
                        <span className="flex items-center gap-0.5 text-amber-600">
                          <Bookmark className="h-3 w-3" />
                          Reserve
                        </span>
                      )}
                    </div>
                    {activity.insider_tip && (
                      <div className="mt-1.5 flex items-start gap-1 text-[11px] text-muted-foreground">
                        <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                        <span className="line-clamp-1">{activity.insider_tip}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant={isAdded ? "ghost" : "outline"}
                    size="sm"
                    className="h-8 w-8 shrink-0 p-0"
                    disabled={isAdded}
                    onClick={() => onAddActivity(activity.id)}
                  >
                    {isAdded ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No activities match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
