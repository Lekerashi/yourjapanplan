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
  UtensilsCrossed,
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

  // Calculate time slots respecting best_time_of_day
  const activitiesWithTime = useMemo(() => {
    if (!day) return [];

    // Group by time-of-day preference
    const morning: typeof day.activities = [];
    const afternoon: typeof day.activities = [];
    const evening: typeof day.activities = [];

    for (const a of day.activities) {
      const activity = catalog.get(a.catalogId);
      const tod = activity?.best_time_of_day ?? "anytime";
      if (tod === "evening") evening.push(a);
      else if (tod === "afternoon") afternoon.push(a);
      else morning.push(a); // morning + anytime default to morning
    }

    const ordered = [...morning, ...afternoon, ...evening];

    type TimelineItem = {
      catalogId: string;
      customName: string | null;
      customDescription: string | null;
      notes: string;
      time: string;
      catalogActivity: CatalogActivity | undefined;
      isMealSlot?: boolean;
    };

    const results: TimelineItem[] = [];

    let morningTime = 9 * 60;   // 09:00
    let afternoonTime = 13 * 60; // 13:00
    let eveningTime = 18 * 60;   // 18:00

    for (const a of ordered) {
      const activity = catalog.get(a.catalogId);
      const tod = activity?.best_time_of_day ?? "anytime";
      const duration = activity?.duration_minutes ?? 60;

      let startMinutes: number;
      if (tod === "evening") {
        startMinutes = eveningTime;
        eveningTime += duration + 30;
      } else if (tod === "afternoon") {
        startMinutes = afternoonTime;
        afternoonTime += duration + 30;
      } else {
        startMinutes = morningTime;
        morningTime += duration + 30;
      }

      const time = `${String(Math.floor(startMinutes / 60)).padStart(2, "0")}:${String(startMinutes % 60).padStart(2, "0")}`;
      results.push({ ...a, time, catalogActivity: activity });
    }

    // Insert lunch and dinner meal slots between activities
    const hasLunchActivity = results.some((r) => r.catalogActivity?.type === "food" && r.time >= "11:30" && r.time <= "14:30");
    const hasDinnerActivity = results.some((r) => r.catalogActivity?.type === "food" && r.time >= "17:00");

    if (!hasLunchActivity && results.length > 0) {
      // Find a natural lunch gap: after the last morning activity ends, clamp to 11:30-14:30
      const lunchTime = Math.max(11 * 60 + 30, Math.min(morningTime, 14 * 60 + 30));
      const lunchStr = `${String(Math.floor(lunchTime / 60)).padStart(2, "0")}:${String(lunchTime % 60).padStart(2, "0")}`;
      results.push({
        catalogId: "meal-lunch",
        customName: "Lunch",
        customDescription: "Explore local restaurants or try the area's specialty.",
        notes: "",
        time: lunchStr,
        catalogActivity: undefined,
        isMealSlot: true,
      });
    }
    if (!hasDinnerActivity && results.length > 0) {
      // Dinner after afternoon activities, clamp to 17:00-20:00
      const dinnerTime = Math.max(17 * 60, Math.min(Math.max(afternoonTime, eveningTime - 30), 20 * 60));
      const dinnerStr = `${String(Math.floor(dinnerTime / 60)).padStart(2, "0")}:${String(dinnerTime % 60).padStart(2, "0")}`;
      results.push({
        catalogId: "meal-dinner",
        customName: "Dinner",
        customDescription: "End the day with a local dining experience.",
        notes: "",
        time: dinnerStr,
        catalogActivity: undefined,
        isMealSlot: true,
      });
    }

    // Sort everything by time
    results.sort((a, b) => a.time.localeCompare(b.time));

    return results;
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
              const isMeal = item.isMealSlot;

              // Meal slot — simple row, not removable
              if (isMeal) {
                return (
                  <div
                    key={item.catalogId}
                    className="flex items-center gap-3 rounded-lg border border-dashed border-amber-200 bg-amber-50/50 px-3 py-2"
                  >
                    <div className="w-12 shrink-0 text-right">
                      <span className="text-sm font-semibold text-amber-600">
                        {item.time}
                      </span>
                    </div>
                    <UtensilsCrossed className="h-4 w-4 shrink-0 text-amber-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-800">{name}</p>
                      <p className="text-xs text-amber-600/80">{desc}</p>
                    </div>
                  </div>
                );
              }

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
