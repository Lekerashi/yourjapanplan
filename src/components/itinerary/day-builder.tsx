"use client";

import { useMemo } from "react";
import { useItineraryStore } from "@/stores/itinerary-store";
import { useQuizStore } from "@/stores/quiz-store";
import {
  getActivitiesForDestination,
  type CatalogActivity,
} from "@/lib/data/seed-activities";
import { getMovementTime } from "@/lib/data/movement-times";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { findRoute, TRANSPORT_ROUTES } from "@/lib/data/transport-routes";
import { ActivityPicker } from "./activity-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, X, Plus } from "lucide-react";

interface DayBuilderProps {
  dayNumber: number;
}

export function DayBuilder({ dayNumber }: DayBuilderProps) {
  const day = useItineraryStore((s) =>
    s.builderDays.find((d) => d.dayNumber === dayNumber),
  );
  const addActivity = useItineraryStore((s) => s.addActivity);
  const removeActivity = useItineraryStore((s) => s.removeActivity);
  const reorderActivities = useItineraryStore((s) => s.reorderActivities);
  const applyTemplate = useItineraryStore((s) => s.applyTemplate);
  const setAccommodation = useItineraryStore((s) => s.setAccommodation);
  const setDayTrip = useItineraryStore((s) => s.setDayTrip);
  const setActivityTime = useItineraryStore((s) => s.setActivityTime);
  const toggleBooked = useItineraryStore((s) => s.toggleBooked);
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

  const catalog = useMemo(() => {
    const all = getActivitiesForDestination(activeSlug);
    const map = new Map<string, CatalogActivity>();
    for (const a of all) map.set(a.id, a);
    return map;
  }, [activeSlug]);

  const destination = useMemo(
    () => SEED_DESTINATIONS.find((d) => d.slug === activeSlug),
    [activeSlug],
  );

  const dayTripRoute = useMemo(
    () => (dayTripSlug ? findRoute(baseSlug, dayTripSlug) : null),
    [baseSlug, dayTripSlug],
  );

  const nearbyDestinations = useMemo(() => {
    return TRANSPORT_ROUTES.filter((r) => {
      const isFrom = r.from_slug === baseSlug;
      const isTo = r.to_slug === baseSlug;
      if (!isFrom && !isTo) return false;
      const durMatch = r.duration.match(/(\d+)h/);
      const hours = durMatch ? parseInt(durMatch[1]) : 0;
      if (hours > 2) return false;
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
    [day?.activities],
  );

  const activitiesWithTime = useMemo(() => {
    if (!day) return [];

    const toTimeStr = (m: number) =>
      `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

    const morning: typeof day.activities = [];
    const afternoon: typeof day.activities = [];
    const evening: typeof day.activities = [];
    const lateEvening: typeof day.activities = [];
    const lunchFood: typeof day.activities = [];

    for (const a of day.activities) {
      const activity = catalog.get(a.catalogId);
      const tod = activity?.best_time_of_day ?? "anytime";
      const isNightlife = activity?.type === "nightlife";
      const isFood = activity?.type === "food";

      if (isNightlife) lateEvening.push(a);
      else if (tod === "evening") evening.push(a);
      else if (tod === "afternoon") afternoon.push(a);
      else if (isFood && tod === "anytime") lunchFood.push(a);
      else morning.push(a);
    }

    const ordered = [...morning, ...lunchFood, ...afternoon, ...evening];

    type TimelineItem = {
      catalogId: string;
      customName: string | null;
      customDescription: string | null;
      notes: string;
      time: string;
      customStartTime: string | null;
      booked: boolean;
      catalogActivity: CatalogActivity | undefined;
      isMealSlot?: boolean;
      isMovement?: boolean;
      movementMethod?: string;
    };

    const results: TimelineItem[] = [];

    let dayTripDurationMin = 0;
    if (dayTripRoute) {
      const hMatch = dayTripRoute.duration.match(/(\d+)h/);
      const mMatch = dayTripRoute.duration.match(/(\d+)m/);
      dayTripDurationMin =
        (hMatch ? parseInt(hMatch[1]) * 60 : 0) +
        (mMatch ? parseInt(mMatch[1]) : 0);
    }

    let morningTime = 9 * 60;
    if (dayTripRoute) {
      const departTime = 8 * 60;
      results.push({
        catalogId: "transport-depart",
        customName: `Train to ${dayTripRoute.to_slug === dayTripSlug ? dayTripRoute.to_name : dayTripRoute.from_name}`,
        customDescription: `${dayTripRoute.primary_method} (${dayTripRoute.duration}, ${dayTripRoute.cost_display}${dayTripRoute.jr_pass_covered ? ", JR Pass covered" : ""})`,
        notes: "",
        time: toTimeStr(departTime),
        customStartTime: null,
        booked: false,
        catalogActivity: undefined,
        isMovement: true,
        movementMethod: dayTripRoute.primary_method,
      });
      morningTime = departTime + dayTripDurationMin + 15;
    }

    let lunchTime = 11 * 60 + 30;
    let afternoonTime = 13 * 60;
    let eveningTime = 18 * 60;

    const lunchFoodSet = new Set(lunchFood.map((a) => a.catalogId));
    let prevMorningActivity: CatalogActivity | undefined;
    let prevLunchActivity: CatalogActivity | undefined;
    let prevAfternoonActivity: CatalogActivity | undefined;
    let prevEveningActivity: CatalogActivity | undefined;

    for (const a of ordered) {
      const activity = catalog.get(a.catalogId);
      const tod = activity?.best_time_of_day ?? "anytime";
      const duration = activity?.duration_minutes ?? 60;
      const isLunchSlot = lunchFoodSet.has(a.catalogId);

      let startMinutes: number;
      if (tod === "evening") {
        const move = prevEveningActivity
          ? getMovementTime(
              activeSlug,
              prevEveningActivity.area,
              activity?.area,
            ).minutes
          : 0;
        startMinutes = eveningTime;
        eveningTime += duration + move;
        prevEveningActivity = activity;
      } else if (tod === "afternoon") {
        const move = prevAfternoonActivity
          ? getMovementTime(
              activeSlug,
              prevAfternoonActivity.area,
              activity?.area,
            ).minutes
          : 0;
        startMinutes = afternoonTime;
        afternoonTime += duration + move;
        prevAfternoonActivity = activity;
      } else if (isLunchSlot) {
        const move = prevLunchActivity
          ? getMovementTime(
              activeSlug,
              prevLunchActivity.area,
              activity?.area,
            ).minutes
          : 0;
        startMinutes = lunchTime;
        lunchTime += duration + move;
        afternoonTime = Math.max(afternoonTime, lunchTime + 15);
        prevLunchActivity = activity;
      } else {
        const move = prevMorningActivity
          ? getMovementTime(
              activeSlug,
              prevMorningActivity.area,
              activity?.area,
            ).minutes
          : 0;
        startMinutes = morningTime;
        morningTime += duration + move;
        prevMorningActivity = activity;
      }

      const effectiveTime = a.customStartTime ?? toTimeStr(startMinutes);
      results.push({ ...a, time: effectiveTime, catalogActivity: activity });
    }

    const hasLunchActivity = results.some(
      (r) =>
        r.catalogActivity?.type === "food" &&
        r.time >= "11:30" &&
        r.time <= "14:30",
    );
    const hasDinnerActivity = results.some(
      (r) => r.catalogActivity?.type === "food" && r.time >= "17:00",
    );

    if (!hasLunchActivity && results.length > 0) {
      const lunchSlot = Math.max(
        11 * 60 + 30,
        Math.min(morningTime, 14 * 60 + 30),
      );
      results.push({
        catalogId: "meal-lunch",
        customName: "Lunch",
        customDescription:
          "Explore local restaurants or try the area's specialty.",
        notes: "",
        time: toTimeStr(lunchSlot),
        customStartTime: null,
        booked: false,
        catalogActivity: undefined,
        isMealSlot: true,
      });
    }

    const dinnerMin =
      eveningPreference === "early"
        ? 17 * 60
        : eveningPreference === "nightowl"
          ? 19 * 60
          : 18 * 60;
    const dinnerMax =
      eveningPreference === "early"
        ? 19 * 60
        : eveningPreference === "nightowl"
          ? 21 * 60
          : 20 * 60;
    let dinnerTime = dinnerMin;

    if (!hasDinnerActivity && results.length > 0) {
      dinnerTime = Math.max(
        dinnerMin,
        Math.min(Math.max(afternoonTime, eveningTime - 30), dinnerMax),
      );
      results.push({
        catalogId: "meal-dinner",
        customName: "Dinner",
        customDescription:
          lateEvening.length > 0
            ? "Refuel before heading out for the night."
            : "End the day with a local dining experience.",
        notes: "",
        time: toTimeStr(dinnerTime),
        customStartTime: null,
        booked: false,
        catalogActivity: undefined,
        isMealSlot: true,
      });
    } else {
      const dinnerActivity = results.find(
        (r) => r.catalogActivity?.type === "food" && r.time >= "17:00",
      );
      if (dinnerActivity) {
        const dStart =
          parseInt(dinnerActivity.time.split(":")[0]) * 60 +
          parseInt(dinnerActivity.time.split(":")[1]);
        dinnerTime =
          dStart + (dinnerActivity.catalogActivity?.duration_minutes ?? 60);
      }
    }

    if (lateEvening.length > 0) {
      let lateTime = dinnerTime + 90;
      for (const a of lateEvening) {
        const activity = catalog.get(a.catalogId);
        const duration = activity?.duration_minutes ?? 60;
        const effectiveTime = a.customStartTime ?? toTimeStr(lateTime);
        results.push({ ...a, time: effectiveTime, catalogActivity: activity });
        lateTime += duration + 20;
      }
    }

    if (dayTripRoute && results.length > 0) {
      const lastActivity = results
        .filter((r) => r.catalogId !== "transport-depart")
        .sort((a, b) => b.time.localeCompare(a.time))[0];
      if (lastActivity) {
        const lastTime =
          parseInt(lastActivity.time.split(":")[0]) * 60 +
          parseInt(lastActivity.time.split(":")[1]);
        const lastDuration =
          lastActivity.catalogActivity?.duration_minutes ??
          (lastActivity.isMealSlot ? 60 : 30);
        const returnTime = lastTime + lastDuration + 15;
        const tripDest =
          dayTripRoute.to_slug === dayTripSlug
            ? dayTripRoute.from_name
            : dayTripRoute.to_name;
        results.push({
          catalogId: "transport-return",
          customName: `Train back to ${tripDest}`,
          customDescription: `${dayTripRoute.primary_method} (${dayTripRoute.duration})`,
          notes: "",
          time: toTimeStr(returnTime),
          customStartTime: null,
          booked: false,
          catalogActivity: undefined,
          isMovement: true,
          movementMethod: dayTripRoute.primary_method,
        });
      }
    }

    results.sort((a, b) => a.time.localeCompare(b.time));
    return results;
  }, [day, catalog, eveningPreference, dayTripRoute, dayTripSlug, activeSlug]);

  const suggestedAccommodation = useMemo(() => {
    if (!destination || day?.accommodation) return null;
    const zones = destination.accommodation_zones;
    if (!zones.length) return null;
    const budgetTag =
      budget === "luxury"
        ? "luxury"
        : budget === "budget"
          ? "budget"
          : "first-timers";
    const match = zones.find((z) =>
      z.best_for.some((b) => b.includes(budgetTag)),
    );
    const zone = match ?? zones[0];
    return {
      zone: zone.name,
      type:
        budget === "luxury"
          ? "ryokan"
          : budget === "budget"
            ? "hostel"
            : "hotel",
      reasoning: zone.description,
    };
  }, [destination, day?.accommodation, budget]);

  const dayCost = useMemo(() => {
    if (!day) return 0;
    let total = 0;
    for (const a of day.activities) {
      const cat = catalog.get(a.catalogId);
      if (!cat) continue;
      const match = cat.cost_estimate.match(/[\d,]+/);
      if (match) total += parseInt(match[0].replace(/,/g, ""), 10);
    }
    return total;
  }, [day, catalog]);

  const startDate = useItineraryStore((s) => s.startDate);
  const storeSeason = useItineraryStore((s) => s.season);

  const seasonalInfo = useMemo(() => {
    if (!destination) return null;
    let month: number | null = null;
    if (startDate) {
      const d = new Date(startDate + "T00:00:00");
      d.setDate(d.getDate() + dayNumber - 1);
      month = d.getMonth() + 1;
    }
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const crowdMap = destination.crowd_level_by_month as Record<string, number>;
    const crowdLevel = month ? crowdMap[String(month)] ?? null : null;
    const bestSeasons = destination.best_seasons ?? [];
    const currentSeason = storeSeason ?? "spring";
    const isGoodSeason = bestSeasons.some((s) =>
      s.toLowerCase().includes(currentSeason),
    );

    if (!crowdLevel && !bestSeasons.length) return null;

    const parts: string[] = [];
    if (month) {
      parts.push(`${destination.name} in ${monthNames[month - 1]}`);
      if (crowdLevel) {
        const crowdLabel =
          crowdLevel <= 2
            ? "Low crowds"
            : crowdLevel <= 3
              ? "Moderate crowds"
              : "Heavy crowds";
        parts.push(`${crowdLabel} (${crowdLevel}/5)`);
      }
    }
    if (isGoodSeason) {
      parts.push(`Best seasons: ${bestSeasons.join(", ")}`);
    } else if (bestSeasons.length > 0) {
      parts.push(`Best in ${bestSeasons.join(", ")} (current: ${currentSeason})`);
    }

    return { parts, crowdLevel, isGoodSeason };
  }, [destination, startDate, dayNumber, storeSeason]);

  if (!day) return null;

  const moveActivity = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= day.activities.length) return;
    const items = [...day.activities];
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    reorderActivities(dayNumber, items);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Your day
            </p>
            {dayCost > 0 && (
              <p className="mt-1 text-[12px] text-ink-2">
                Approximately ¥{dayCost.toLocaleString()} in activities
              </p>
            )}
          </div>
          {nearbyDestinations.length > 0 && (
            <div>
              {dayTripSlug ? (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setDayTrip(dayNumber, null)}
                >
                  <X className="mr-1 h-3 w-3" />
                  Cancel day trip
                </Button>
              ) : (
                <select
                  className="h-8 border border-border bg-background px-2 text-[12px] text-foreground focus:border-foreground focus:outline-none"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) setDayTrip(dayNumber, e.target.value);
                  }}
                >
                  <option value="">Add a day trip…</option>
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

        {seasonalInfo && seasonalInfo.parts.length > 0 && (
          <p
            className={cn(
              "mt-3 text-[11px] uppercase tracking-[0.12em]",
              seasonalInfo.crowdLevel && seasonalInfo.crowdLevel >= 4
                ? "text-accent"
                : "text-muted-foreground",
            )}
          >
            {seasonalInfo.parts.join(" · ")}
          </p>
        )}

        {dayTripSlug && (
          <p className="mt-3 border border-border bg-secondary/40 px-3 py-2 text-[12px] text-foreground">
            Day trip to{" "}
            <strong className="font-medium">
              {SEED_DESTINATIONS.find((d) => d.slug === dayTripSlug)?.name ??
                dayTripSlug}
            </strong>
          </p>
        )}

        {activitiesWithTime.length === 0 ? (
          <div className="mt-6 border border-dashed border-border p-8 text-center">
            <Plus className="mx-auto h-7 w-7 text-muted-foreground/40" />
            <p className="mt-3 text-[14px] text-ink-2">
              Add activities from the panel or apply a quick-start template.
            </p>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col border-t border-border">
            {activitiesWithTime.map((item, index) => {
              const a = item.catalogActivity;
              const name = item.customName ?? a?.name ?? "Custom activity";
              const desc = item.customDescription ?? a?.description;

              const prev = index > 0 ? activitiesWithTime[index - 1] : null;
              let movementIndicator: React.ReactNode = null;
              if (prev && !item.isMovement && !prev.isMovement) {
                const prevEnd =
                  parseInt(prev.time.split(":")[0]) * 60 +
                  parseInt(prev.time.split(":")[1]) +
                  (prev.catalogActivity?.duration_minutes ??
                    (prev.isMealSlot ? 60 : 30));
                const curStart =
                  parseInt(item.time.split(":")[0]) * 60 +
                  parseInt(item.time.split(":")[1]);
                const gap = curStart - prevEnd;
                if (gap > 0 && prev.catalogActivity && a) {
                  const move = getMovementTime(
                    activeSlug,
                    prev.catalogActivity.area,
                    a.area,
                  );
                  movementIndicator = (
                    <li className="py-2 pl-20 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {move.minutes} min {move.method}
                    </li>
                  );
                }
              }

              const rowBase =
                "flex items-start gap-4 border-b border-border py-4";

              if (item.isMovement) {
                return (
                  <span key={item.catalogId} className="contents">
                    {movementIndicator}
                    <li
                      className={cn(
                        rowBase,
                        "border-l-0 border-r-0 bg-secondary/30",
                      )}
                    >
                      <div className="w-14 shrink-0 text-right font-display text-[15px] font-medium text-muted-foreground">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          Transit
                        </div>
                        <p className="mt-1 font-display text-[17px] font-medium tracking-[-0.005em] text-foreground">
                          {name}
                        </p>
                        {desc && (
                          <p className="mt-1 text-[13px] text-ink-2">{desc}</p>
                        )}
                      </div>
                    </li>
                  </span>
                );
              }

              if (item.isMealSlot) {
                return (
                  <span key={item.catalogId} className="contents">
                    {movementIndicator}
                    <li className={rowBase}>
                      <div className="w-14 shrink-0 text-right font-display text-[15px] font-medium text-muted-foreground">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          Meal
                        </div>
                        <p className="mt-1 font-display text-[17px] font-medium tracking-[-0.005em] text-foreground">
                          {name}
                        </p>
                        {desc && (
                          <p className="mt-1 text-[13px] text-ink-2">{desc}</p>
                        )}
                      </div>
                    </li>
                  </span>
                );
              }

              return (
                <span key={item.catalogId} className="contents">
                  {movementIndicator}
                  <li className={rowBase}>
                    <div className="w-14 shrink-0 pt-0.5 text-right">
                      <input
                        type="time"
                        value={item.customStartTime ?? item.time}
                        onChange={(e) =>
                          setActivityTime(
                            dayNumber,
                            item.catalogId,
                            e.target.value || null,
                          )
                        }
                        className="w-full cursor-pointer appearance-none border-none bg-transparent p-0 text-right font-display text-[15px] font-semibold text-accent [&::-webkit-calendar-picker-indicator]:hidden focus:outline-none focus:ring-1 focus:ring-accent"
                        title="Click to set custom time"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-[17px] font-medium tracking-[-0.005em] text-foreground">
                          {name}
                        </p>
                        {a?.reservation_required && (
                          <button
                            type="button"
                            onClick={() =>
                              toggleBooked(dayNumber, item.catalogId)
                            }
                            className={cn(
                              "border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] transition-colors",
                              item.booked
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                            )}
                          >
                            {item.booked ? "Booked" : "Reserve"}
                          </button>
                        )}
                      </div>
                      {desc && (
                        <p className="mt-1 text-[14px] leading-[1.55] text-ink-2">
                          {desc}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                        {a && (
                          <>
                            <span>{a.duration_minutes} min</span>
                            <span>{a.cost_estimate}</span>
                          </>
                        )}
                      </div>
                      {a?.insider_tip && (
                        <p className="mt-2 border-l-2 border-accent/40 pl-3 text-[12px] text-ink-2">
                          {a.insider_tip}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        disabled={index === 0}
                        onClick={() => moveActivity(index, -1)}
                        aria-label="Move up"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        disabled={index === activitiesWithTime.length - 1}
                        onClick={() => moveActivity(index, 1)}
                        aria-label="Move down"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() =>
                          removeActivity(dayNumber, item.catalogId)
                        }
                        aria-label="Remove activity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </li>
                </span>
              );
            })}
          </ul>
        )}

        <div className="mt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Where to stay
          </p>
          {(day.accommodation ?? suggestedAccommodation) && (
            <div className="mt-3 flex flex-wrap items-start gap-4 border border-border bg-card p-4">
              <div className="flex-1">
                <p className="font-display text-[17px] font-medium tracking-[-0.005em] text-foreground">
                  {(day.accommodation ?? suggestedAccommodation)!.zone}
                </p>
                <p className="mt-1 text-[13px] text-ink-2">
                  {(day.accommodation ?? suggestedAccommodation)!.type} ·{" "}
                  {(day.accommodation ?? suggestedAccommodation)!.reasoning}
                </p>
              </div>
              {!day.accommodation && suggestedAccommodation && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() =>
                    setAccommodation(dayNumber, suggestedAccommodation)
                  }
                >
                  Confirm
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border border-border bg-card lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
        <div className="border-b border-border px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Activity picker
          </p>
        </div>
        <div className="p-4">
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
    </div>
  );
}
