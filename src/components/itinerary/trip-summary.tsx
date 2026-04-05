"use client";

import { useMemo } from "react";
import { useItineraryStore } from "@/stores/itinerary-store";
import { getActivitiesForDestination } from "@/lib/data/seed-activities";
import { findRoute, findAllRoutes, JR_PASS_PRICES } from "@/lib/data/transport-routes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { PackingList } from "./packing-list";
import {
  Wallet,
  Train,
  Bookmark,
  Check,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export function TripSummary() {
  const builderDays = useItineraryStore((s) => s.builderDays);
  const destinations = useItineraryStore((s) => s.destinations);
  const budgetTier = useItineraryStore((s) => s.budget);

  // Build activity lookup
  const catalogMap = useMemo(() => {
    const map = new Map<string, { cost_estimate: string; reservation_required: boolean; name: string; destination_slug: string }>();
    for (const dest of destinations) {
      for (const a of getActivitiesForDestination(dest.slug)) {
        map.set(a.id, a);
      }
    }
    return map;
  }, [destinations]);

  // Budget estimate
  const budgetEstimate = useMemo(() => {
    let total = 0;
    for (const day of builderDays) {
      for (const activity of day.activities) {
        const a = catalogMap.get(activity.catalogId);
        if (!a) continue;
        const match = a.cost_estimate.match(/[\d,]+/);
        if (match) total += parseInt(match[0].replace(/,/g, ""), 10);
      }
    }
    return total;
  }, [builderDays, catalogMap]);

  // Budget comparison
  const budgetComparison = useMemo(() => {
    const dailyBudgets: Record<string, number> = {
      budget: 8000,
      moderate: 18000,
      luxury: 40000,
    };
    const dailyTarget = dailyBudgets[budgetTier ?? "moderate"] ?? 18000;
    const totalTarget = dailyTarget * builderDays.length;
    const pct = totalTarget > 0 ? Math.round((budgetEstimate / totalTarget) * 100) : 0;
    return { dailyTarget, totalTarget, pct };
  }, [budgetEstimate, budgetTier, builderDays.length]);

  // Transport routes between consecutive destinations
  const transportLegs = useMemo(() => {
    const legs: {
      from: string;
      to: string;
      route: ReturnType<typeof findRoute>;
      altRoute: ReturnType<typeof findRoute>;
    }[] = [];
    let prevSlug = "";
    for (const day of builderDays) {
      if (day.destinationSlug !== prevSlug && prevSlug) {
        const allRoutes = findAllRoutes(prevSlug, day.destinationSlug);
        const primary = findRoute(prevSlug, day.destinationSlug);
        const alt = allRoutes.length > 1
          ? allRoutes.find((r) => r !== primary) ?? null
          : null;
        legs.push({
          from: prevSlug,
          to: day.destinationSlug,
          route: primary,
          altRoute: alt,
        });
      }
      prevSlug = day.destinationSlug;
    }
    return legs;
  }, [builderDays]);

  // JR Pass analysis
  const jrAnalysis = useMemo(() => {
    let jrCoveredTotal = 0;
    let totalTransport = 0;
    for (const leg of transportLegs) {
      if (leg.route) {
        totalTransport += leg.route.cost_jpy;
        if (leg.route.jr_pass_covered) jrCoveredTotal += leg.route.cost_jpy;
      }
    }
    const totalDays = builderDays.length;
    const passType =
      totalDays <= 7
        ? "7-day"
        : totalDays <= 14
          ? "14-day"
          : ("21-day" as keyof typeof JR_PASS_PRICES);
    const passCost = JR_PASS_PRICES[passType].ordinary;
    return {
      jrCoveredTotal,
      totalTransport,
      passCost,
      passType,
      worthIt: jrCoveredTotal > passCost,
    };
  }, [transportLegs, builderDays.length]);

  // Reservation checklist
  const reservations = useMemo(() => {
    const items: { name: string; destination: string; booked: boolean }[] = [];
    for (const day of builderDays) {
      for (const activity of day.activities) {
        const a = catalogMap.get(activity.catalogId);
        if (a?.reservation_required) {
          const destName = destinations.find(
            (d) => d.slug === a.destination_slug
          )?.name ?? a.destination_slug;
          items.push({ name: a.name, destination: destName, booked: activity.booked });
        }
      }
    }
    return items;
  }, [builderDays, catalogMap, destinations]);

  const totalActivities = builderDays.reduce(
    (sum, d) => sum + d.activities.length,
    0
  );

  if (totalActivities === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Trip Summary</h3>

      {/* Budget */}
      <Card size="sm">
        <CardContent className="flex gap-3 p-4">
          <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
          <div>
            <h4 className="text-sm font-semibold">Estimated Activity Costs</h4>
            <p className="text-lg font-bold">
              ~¥{budgetEstimate.toLocaleString()}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Progress
                value={Math.min(budgetComparison.pct, 100)}
                className="h-2 flex-1"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {budgetComparison.pct}% of {budgetTier ?? "moderate"} budget
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalActivities} activities across {builderDays.length} days
              · Target: ~¥{budgetComparison.totalTarget.toLocaleString()}
              (excludes lodging, transport, meals not listed)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transport */}
      {transportLegs.length > 0 && (
        <Card size="sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Train className="h-5 w-5 text-rose-500" />
              <h4 className="text-sm font-semibold">Transport Between Cities</h4>
            </div>
            <div className="mt-3 space-y-2">
              {transportLegs.map((leg, i) => {
                const fromName =
                  destinations.find((d) => d.slug === leg.from)?.name ?? leg.from;
                const toName =
                  destinations.find((d) => d.slug === leg.to)?.name ?? leg.to;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="font-medium">{fromName}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{toName}</span>
                    {leg.route ? (
                      <div className="ml-auto text-right">
                        <span className="text-xs text-muted-foreground">
                          {leg.route.primary_method} · {leg.route.duration} ·{" "}
                          {leg.route.cost_display}
                        </span>
                        {leg.altRoute && (
                          <p className="text-[11px] text-muted-foreground/70">
                            or {leg.altRoute.primary_method} · {leg.altRoute.duration} · {leg.altRoute.cost_display}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Route info not available
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <Separator className="my-3" />

            {/* JR Pass recommendation */}
            <div className="flex items-start gap-2">
              {jrAnalysis.worthIt ? (
                <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {jrAnalysis.passType} JR Pass{" "}
                  {jrAnalysis.worthIt
                    ? `saves ~¥${(jrAnalysis.jrCoveredTotal - jrAnalysis.passCost).toLocaleString()}`
                    : "may not be worth it"}
                </p>
                <p className="text-xs text-muted-foreground">
                  JR-covered routes: ¥{jrAnalysis.jrCoveredTotal.toLocaleString()} ·
                  Pass: ¥{jrAnalysis.passCost.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reservations */}
      {reservations.length > 0 && (
        <Card size="sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-amber-500" />
              <h4 className="text-sm font-semibold">Book in Advance</h4>
            </div>
            <ul className="mt-2 space-y-1">
              {reservations.map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  {r.booked ? (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                  )}
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {r.destination}
                  </Badge>
                  <span className={r.booked ? "line-through text-muted-foreground" : ""}>
                    {r.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Packing List */}
      <PackingList />
    </div>
  );
}
