"use client";

import { useMemo } from "react";
import { useItineraryStore } from "@/stores/itinerary-store";
import { useQuizStore } from "@/stores/quiz-store";
import { getActivitiesForDestination, type CatalogActivity } from "@/lib/data/seed-activities";
import { getMovementTime } from "@/lib/data/movement-times";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { findRoute, TRANSPORT_ROUTES } from "@/lib/data/transport-routes";
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
  Train,
  MapPin,
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
  const setDayTrip = useItineraryStore((s) => s.setDayTrip);
  const quizInterests = useQuizStore((s) => s.interests);
  const quizEveningPref = useQuizStore((s) => s.eveningPreference);
  const quizFirstTime = useQuizStore((s) => s.firstTime);
  const storeInterests = useItineraryStore((s) => s.interests);
  const storeEveningPref = useItineraryStore((s) => s.eveningPreference);
  const budget = useItineraryStore((s) => s.budget);
  const eveningPreference = storeEveningPref ?? quizEveningPref ?? "moderate";

  const interests = storeInterests.length > 0 ? storeInterests : quizInterests;

  const baseSlug = day?.destinationSlug ?? "";
  const dayTripSlug = day?.dayTripSlug ?? null;
  const activeSlug = dayTripSlug ?? baseSlug;

  const catalog = useMemo(
    () => {
      const all = getActivitiesForDestination(activeSlug);
      const map = new Map<string, CatalogActivity>();
      for (const a of all) map.set(a.id, a);
      return map;
    },
    [activeSlug]
  );

  const destination = useMemo(
    () => SEED_DESTINATIONS.find((d) => d.slug === activeSlug),
    [activeSlug]
  );

  // Day trip transport route
  const dayTripRoute = useMemo(
    () => (dayTripSlug ? findRoute(baseSlug, dayTripSlug) : null),
    [baseSlug, dayTripSlug]
  );

  // Nearby destinations for day trip selector (reachable within ~2 hours, exclude flights)
  const nearbyDestinations = useMemo(() => {
    return TRANSPORT_ROUTES.filter((r) => {
      const isFrom = r.from_slug === baseSlug;
      const isTo = r.to_slug === baseSlug;
      if (!isFrom && !isTo) return false;
      // Parse duration to filter reasonable day trips
      const durMatch = r.duration.match(/(\d+)h/);
      const hours = durMatch ? parseInt(durMatch[1]) : 0;
      if (hours > 2) return false;
      // Exclude flights
      if (r.primary_method.toLowerCase().includes("flight")) return false;
      return true;
    }).map((r) => {
      const slug = r.from_slug === baseSlug ? r.to_slug : r.from_slug;
      const name = r.from_slug === baseSlug ? r.to_name : r.from_name;
      return { slug, name, route: r };
    });
  }, [baseSlug]);

  const addedIds = useMemo(
    () => new Set(day?.activities.map((a) => a.catalogId) ?? []),
    [day?.activities]
  );

  // Calculate time slots respecting best_time_of_day and nightlife ordering
  const activitiesWithTime = useMemo(() => {
    if (!day) return [];

    const toTimeStr = (m: number) =>
      `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

    // Group by time-of-day preference; nightlife goes into a separate late-evening bucket
    const morning: typeof day.activities = [];
    const afternoon: typeof day.activities = [];
    const evening: typeof day.activities = [];
    const lateEvening: typeof day.activities = [];

    for (const a of day.activities) {
      const activity = catalog.get(a.catalogId);
      const tod = activity?.best_time_of_day ?? "anytime";
      const isNightlife = activity?.type === "nightlife";

      if (isNightlife) {
        lateEvening.push(a); // Always scheduled after dinner
      } else if (tod === "evening") {
        evening.push(a);
      } else if (tod === "afternoon") {
        afternoon.push(a);
      } else {
        morning.push(a); // morning + anytime default to morning
      }
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
      isMovement?: boolean;
      movementMethod?: string;
    };

    const results: TimelineItem[] = [];

    // Parse day trip travel duration (e.g., "45m", "1h 30m")
    let dayTripDurationMin = 0;
    if (dayTripRoute) {
      const hMatch = dayTripRoute.duration.match(/(\d+)h/);
      const mMatch = dayTripRoute.duration.match(/(\d+)m/);
      dayTripDurationMin = (hMatch ? parseInt(hMatch[1]) * 60 : 0) + (mMatch ? parseInt(mMatch[1]) : 0);
    }

    // If day trip, depart early and shift morning start
    let morningTime = 9 * 60;   // 09:00
    if (dayTripRoute) {
      const departTime = 8 * 60; // 08:00 departure
      results.push({
        catalogId: "transport-depart",
        customName: `Train to ${dayTripRoute.to_slug === dayTripSlug ? dayTripRoute.to_name : dayTripRoute.from_name}`,
        customDescription: `${dayTripRoute.primary_method} (${dayTripRoute.duration}, ${dayTripRoute.cost_display}${dayTripRoute.jr_pass_covered ? ", JR Pass covered" : ""})`,
        notes: "",
        time: toTimeStr(departTime),
        catalogActivity: undefined,
        isMovement: true,
        movementMethod: dayTripRoute.primary_method,
      });
      morningTime = departTime + dayTripDurationMin + 15; // arrival + buffer
    }

    let afternoonTime = 13 * 60; // 13:00
    let eveningTime = 18 * 60;   // 18:00

    let prevMorningActivity: CatalogActivity | undefined;
    let prevAfternoonActivity: CatalogActivity | undefined;
    let prevEveningActivity: CatalogActivity | undefined;

    for (const a of ordered) {
      const activity = catalog.get(a.catalogId);
      const tod = activity?.best_time_of_day ?? "anytime";
      const duration = activity?.duration_minutes ?? 60;

      let startMinutes: number;
      if (tod === "evening") {
        const move = prevEveningActivity
          ? getMovementTime(activeSlug, prevEveningActivity.area, activity?.area).minutes
          : 0;
        startMinutes = eveningTime;
        eveningTime += duration + move;
        prevEveningActivity = activity;
      } else if (tod === "afternoon") {
        const move = prevAfternoonActivity
          ? getMovementTime(activeSlug, prevAfternoonActivity.area, activity?.area).minutes
          : 0;
        startMinutes = afternoonTime;
        afternoonTime += duration + move;
        prevAfternoonActivity = activity;
      } else {
        const move = prevMorningActivity
          ? getMovementTime(activeSlug, prevMorningActivity.area, activity?.area).minutes
          : 0;
        startMinutes = morningTime;
        morningTime += duration + move;
        prevMorningActivity = activity;
      }

      results.push({ ...a, time: toTimeStr(startMinutes), catalogActivity: activity });
    }

    // Insert lunch and dinner meal slots
    const hasLunchActivity = results.some((r) => r.catalogActivity?.type === "food" && r.time >= "11:30" && r.time <= "14:30");
    const hasDinnerActivity = results.some((r) => r.catalogActivity?.type === "food" && r.time >= "17:00");

    if (!hasLunchActivity && results.length > 0) {
      const lunchTime = Math.max(11 * 60 + 30, Math.min(morningTime, 14 * 60 + 30));
      results.push({
        catalogId: "meal-lunch",
        customName: "Lunch",
        customDescription: "Explore local restaurants or try the area's specialty.",
        notes: "",
        time: toTimeStr(lunchTime),
        catalogActivity: undefined,
        isMealSlot: true,
      });
    }

    // Dinner timing shifts with evening preference
    const dinnerMin = eveningPreference === "early" ? 17 * 60 : eveningPreference === "nightowl" ? 19 * 60 : 18 * 60;
    const dinnerMax = eveningPreference === "early" ? 19 * 60 : eveningPreference === "nightowl" ? 21 * 60 : 20 * 60;
    let dinnerTime = dinnerMin;

    if (!hasDinnerActivity && results.length > 0) {
      dinnerTime = Math.max(dinnerMin, Math.min(Math.max(afternoonTime, eveningTime - 30), dinnerMax));
      results.push({
        catalogId: "meal-dinner",
        customName: "Dinner",
        customDescription: lateEvening.length > 0
          ? "Refuel before heading out for the night."
          : "End the day with a local dining experience.",
        notes: "",
        time: toTimeStr(dinnerTime),
        catalogActivity: undefined,
        isMealSlot: true,
      });
    } else {
      // If there's a dinner food activity, find its end time for late evening scheduling
      const dinnerActivity = results.find((r) => r.catalogActivity?.type === "food" && r.time >= "17:00");
      if (dinnerActivity) {
        const dStart = parseInt(dinnerActivity.time.split(":")[0]) * 60 + parseInt(dinnerActivity.time.split(":")[1]);
        dinnerTime = dStart + (dinnerActivity.catalogActivity?.duration_minutes ?? 60);
      }
    }

    // Schedule late evening (nightlife) activities after dinner
    if (lateEvening.length > 0) {
      let lateTime = dinnerTime + 90; // 90 min for dinner + transition
      for (const a of lateEvening) {
        const activity = catalog.get(a.catalogId);
        const duration = activity?.duration_minutes ?? 60;
        results.push({ ...a, time: toTimeStr(lateTime), catalogActivity: activity });
        lateTime += duration + 20; // Shorter buffer between bars
      }
    }

    // Add return trip for day trips
    if (dayTripRoute && results.length > 0) {
      // Find the latest non-transport activity time
      const lastActivity = results
        .filter((r) => r.catalogId !== "transport-depart")
        .sort((a, b) => b.time.localeCompare(a.time))[0];
      if (lastActivity) {
        const lastTime = parseInt(lastActivity.time.split(":")[0]) * 60 + parseInt(lastActivity.time.split(":")[1]);
        const lastDuration = lastActivity.catalogActivity?.duration_minutes ?? (lastActivity.isMealSlot ? 60 : 30);
        const returnTime = lastTime + lastDuration + 15; // buffer to station
        const tripDest = dayTripRoute.to_slug === dayTripSlug ? dayTripRoute.from_name : dayTripRoute.to_name;
        results.push({
          catalogId: "transport-return",
          customName: `Train back to ${tripDest}`,
          customDescription: `${dayTripRoute.primary_method} (${dayTripRoute.duration})`,
          notes: "",
          time: toTimeStr(returnTime),
          catalogActivity: undefined,
          isMovement: true,
          movementMethod: dayTripRoute.primary_method,
        });
      }
    }

    // Sort everything by time
    results.sort((a, b) => a.time.localeCompare(b.time));

    return results;
  }, [day, catalog, eveningPreference, dayTripRoute, dayTripSlug]);

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
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Your Day</h3>
          {nearbyDestinations.length > 0 && (
            <div className="flex items-center gap-2">
              {dayTripSlug ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setDayTrip(dayNumber, null)}
                >
                  <X className="mr-1 h-3 w-3" />
                  Cancel Day Trip
                </Button>
              ) : (
                <select
                  className="h-7 rounded-md border bg-background px-2 text-xs"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) setDayTrip(dayNumber, e.target.value);
                  }}
                >
                  <option value="">Day Trip...</option>
                  {nearbyDestinations.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name} ({d.route.duration})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
        {dayTripSlug && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-blue-50/50 border border-blue-200 px-3 py-1.5 text-xs text-blue-700">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>Day trip to <strong>{SEED_DESTINATIONS.find((d) => d.slug === dayTripSlug)?.name ?? dayTripSlug}</strong></span>
          </div>
        )}

        {activitiesWithTime.length === 0 ? (
          <div className="mt-4 rounded-lg border-2 border-dashed p-8 text-center">
            <Plus className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              Add activities from the panel or use a Quick Start template.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-0">
            {activitiesWithTime.map((item, index) => {
              const a = item.catalogActivity;
              const name = item.customName ?? a?.name ?? "Custom Activity";
              const desc = item.customDescription ?? a?.description;
              const isMeal = item.isMealSlot;

              // Movement indicator between activities
              const prev = index > 0 ? activitiesWithTime[index - 1] : null;
              let movementIndicator: React.ReactNode = null;
              if (prev && !item.isMovement && !prev.isMovement) {
                const prevEnd = parseInt(prev.time.split(":")[0]) * 60 + parseInt(prev.time.split(":")[1]) + (prev.catalogActivity?.duration_minutes ?? (prev.isMealSlot ? 60 : 30));
                const curStart = parseInt(item.time.split(":")[0]) * 60 + parseInt(item.time.split(":")[1]);
                const gap = curStart - prevEnd;
                if (gap > 0 && prev.catalogActivity && a) {
                  const move = getMovementTime(activeSlug, prev.catalogActivity.area, a.area);
                  movementIndicator = (
                    <div className="flex items-center gap-2 py-1 pl-14 text-[11px] text-muted-foreground/60">
                      <div className="h-3 border-l border-dashed border-muted-foreground/30" />
                      <span>{move.method === "walk" ? "🚶" : "🚃"} {move.minutes} min {move.method}</span>
                    </div>
                  );
                }
              }

              // Transport slot — day trip travel, not removable
              if (item.isMovement) {
                return (
                  <div key={item.catalogId}>
                    {movementIndicator}
                    <div className="flex items-center gap-3 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 px-3 py-2">
                      <div className="w-12 shrink-0 text-right">
                        <span className="text-sm font-semibold text-blue-600">
                          {item.time}
                        </span>
                      </div>
                      <Train className="h-4 w-4 shrink-0 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-800">{name}</p>
                        <p className="text-xs text-blue-600/80">{desc}</p>
                      </div>
                    </div>
                  </div>
                );
              }

              // Meal slot — simple row, not removable
              if (isMeal) {
                return (
                  <div key={item.catalogId}>
                    {movementIndicator}
                    <div className="flex items-center gap-3 rounded-lg border border-dashed border-amber-200 bg-amber-50/50 px-3 py-2">
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
                  </div>
                );
              }

              return (
                <div key={item.catalogId}>
                  {movementIndicator}
                  <Card size="sm">
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
                </div>
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
          destinationSlug={activeSlug}
          addedActivityIds={addedIds}
          userInterests={interests}
          isFirstTimer={quizFirstTime ?? false}
          onAddActivity={(id) => addActivity(dayNumber, id)}
          onApplyTemplate={(ids) => applyTemplate(dayNumber, ids)}
          showTemplates={day.activities.length === 0}
        />
      </div>
    </div>
  );
}
