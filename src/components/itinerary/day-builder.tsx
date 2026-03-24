"use client";

import { useMemo } from "react";
import { useItineraryStore } from "@/stores/itinerary-store";
import { useQuizStore } from "@/stores/quiz-store";
import { getActivitiesForDestination, type CatalogActivity } from "@/lib/data/seed-activities";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { ActivityPicker } from "./activity-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  X,
  Clock,
  Bookmark,
  Lightbulb,
  Bed,
  Plus,
} from "lucide-react";

interface DayBuilderProps {
  dayNumber: number;
}

export function DayBuilder({ dayNumber }: DayBuilderProps) {
  const day = useItineraryStore((s) =>
    s.builderDays.find((d) => d.dayNumber === dayNumber)
  );
  const addActivity = useItineraryStore((s) => s.addActivity);
  const removeActivity = useItineraryStore((s) => s.removeActivity);
  const reorderActivities = useItineraryStore((s) => s.reorderActivities);
  const applyTemplate = useItineraryStore((s) => s.applyTemplate);
  const setAccommodation = useItineraryStore((s) => s.setAccommodation);
  const quizInterests = useQuizStore((s) => s.interests);
  const storeInterests = useItineraryStore((s) => s.interests);
  const budget = useItineraryStore((s) => s.budget);

  const interests = storeInterests.length > 0 ? storeInterests : quizInterests;

  const destinationSlug = day?.destinationSlug ?? "";

  const catalog = useMemo(
    () => {
      const all = getActivitiesForDestination(destinationSlug);
      const map = new Map<string, CatalogActivity>();
      for (const a of all) map.set(a.id, a);
      return map;
    },
    [destinationSlug]
  );

  const destination = useMemo(
    () => SEED_DESTINATIONS.find((d) => d.slug === destinationSlug),
    [destinationSlug]
  );

  const addedIds = useMemo(
    () => new Set(day?.activities.map((a) => a.catalogId) ?? []),
    [day?.activities]
  );

  // Calculate time slots
  const activitiesWithTime = useMemo(() => {
    if (!day) return [];
    let currentMinutes = 9 * 60; // Start at 09:00
    return day.activities.map((a) => {
      const activity = catalog.get(a.catalogId);
      const time = `${String(Math.floor(currentMinutes / 60)).padStart(2, "0")}:${String(currentMinutes % 60).padStart(2, "0")}`;
      currentMinutes += (activity?.duration_minutes ?? 60) + 30; // activity + 30min buffer
      return { ...a, time, catalogActivity: activity };
    });
  }, [day, catalog]);

  // Auto-select accommodation
  const suggestedAccommodation = useMemo(() => {
    if (!destination || day?.accommodation) return null;
    const zones = destination.accommodation_zones;
    if (!zones.length) return null;
    // Match by budget/style
    const budgetTag = budget === "luxury" ? "luxury" : budget === "budget" ? "budget" : "first-timers";
    const match = zones.find((z) => z.best_for.some((b) => b.includes(budgetTag)));
    const zone = match ?? zones[0];
    return {
      zone: zone.name,
      type: budget === "luxury" ? "ryokan" : budget === "budget" ? "hostel" : "hotel",
      reasoning: zone.description,
    };
  }, [destination, day?.accommodation, budget]);

  if (!day) return null;

  const moveActivity = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= day.activities.length) return;
    const items = [...day.activities];
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    reorderActivities(dayNumber, items);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
      {/* Left — Your Day */}
      <div>
        <h3 className="font-semibold">Your Day</h3>

        {activitiesWithTime.length === 0 ? (
          <div className="mt-4 rounded-lg border-2 border-dashed p-8 text-center">
            <Plus className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              Add activities from the panel or use a Quick Start template.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {activitiesWithTime.map((item, index) => {
              const a = item.catalogActivity;
              const name = item.customName ?? a?.name ?? "Custom Activity";
              const desc = item.customDescription ?? a?.description;

              return (
                <Card key={item.catalogId} size="sm">
                  <CardContent className="flex items-start gap-3 p-3">
                    {/* Time */}
                    <div className="w-12 shrink-0 pt-0.5 text-right">
                      <span className="text-sm font-semibold text-rose-600">
                        {item.time}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{name}</p>
                      {desc && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {desc}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        {a && (
                          <>
                            <span className="flex items-center gap-0.5">
                              <Clock className="h-3 w-3" />
                              {a.duration_minutes}m
                            </span>
                            <span>{a.cost_estimate}</span>
                          </>
                        )}
                        {a?.reservation_required && (
                          <span className="flex items-center gap-0.5 text-amber-600">
                            <Bookmark className="h-3 w-3" />
                            Reserve
                          </span>
                        )}
                      </div>
                      {a?.insider_tip && (
                        <div className="mt-1 flex items-start gap-1 text-[11px] text-muted-foreground">
                          <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                          <span className="line-clamp-1">{a.insider_tip}</span>
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        disabled={index === 0}
                        onClick={() => moveActivity(index, -1)}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        disabled={index === activitiesWithTime.length - 1}
                        onClick={() => moveActivity(index, 1)}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground"
                        onClick={() =>
                          removeActivity(dayNumber, item.catalogId)
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Accommodation */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Where to Stay
          </h4>
          {(day.accommodation ?? suggestedAccommodation) && (
            <Card size="sm" className="mt-2">
              <CardContent className="flex items-start gap-3 p-3">
                <Bed className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <div>
                  <p className="text-sm font-medium">
                    {(day.accommodation ?? suggestedAccommodation)!.zone}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(day.accommodation ?? suggestedAccommodation)!.type} ·{" "}
                    {(day.accommodation ?? suggestedAccommodation)!.reasoning}
                  </p>
                </div>
                {!day.accommodation && suggestedAccommodation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-7 text-xs"
                    onClick={() =>
                      setAccommodation(dayNumber, suggestedAccommodation)
                    }
                  >
                    Confirm
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Right — Activity Picker */}
      <div className="lg:max-h-[70vh] lg:overflow-y-auto lg:rounded-lg lg:border lg:p-3">
        <h3 className="mb-3 font-semibold text-sm">Add Activities</h3>
        <ActivityPicker
          destinationSlug={destinationSlug}
          addedActivityIds={addedIds}
          userInterests={interests}
          onAddActivity={(id) => addActivity(dayNumber, id)}
          onApplyTemplate={(ids) => applyTemplate(dayNumber, ids)}
          showTemplates={day.activities.length === 0}
        />
      </div>
    </div>
  );
}
