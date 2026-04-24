"use client";

import { useMemo } from "react";
import { useItineraryStore } from "@/stores/itinerary-store";
import { getActivitiesForDestination } from "@/lib/data/seed-activities";
import {
  findRoute,
  findAllRoutes,
  JR_PASS_PRICES,
} from "@/lib/data/transport-routes";
import { PackingList } from "./packing-list";
import { cn } from "@/lib/utils";

function SummarySection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-card p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {eyebrow}
      </p>
      {title && (
        <h4 className="mt-2 font-display text-[20px] font-medium tracking-[-0.01em] text-foreground">
          {title}
        </h4>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function TripSummary() {
  const builderDays = useItineraryStore((s) => s.builderDays);
  const destinations = useItineraryStore((s) => s.destinations);
  const budgetTier = useItineraryStore((s) => s.budget);

  const catalogMap = useMemo(() => {
    const map = new Map<
      string,
      {
        cost_estimate: string;
        reservation_required: boolean;
        name: string;
        destination_slug: string;
      }
    >();
    for (const dest of destinations) {
      for (const a of getActivitiesForDestination(dest.slug)) {
        map.set(a.id, a);
      }
    }
    return map;
  }, [destinations]);

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

  const budgetComparison = useMemo(() => {
    const dailyBudgets: Record<string, number> = {
      budget: 8000,
      moderate: 18000,
      luxury: 40000,
    };
    const dailyTarget = dailyBudgets[budgetTier ?? "moderate"] ?? 18000;
    const totalTarget = dailyTarget * builderDays.length;
    const pct =
      totalTarget > 0
        ? Math.round((budgetEstimate / totalTarget) * 100)
        : 0;
    return { dailyTarget, totalTarget, pct };
  }, [budgetEstimate, budgetTier, builderDays.length]);

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
        const alt =
          allRoutes.length > 1
            ? (allRoutes.find((r) => r !== primary) ?? null)
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

  const reservations = useMemo(() => {
    const items: { name: string; destination: string; booked: boolean }[] = [];
    for (const day of builderDays) {
      for (const activity of day.activities) {
        const a = catalogMap.get(activity.catalogId);
        if (a?.reservation_required) {
          const destName =
            destinations.find((d) => d.slug === a.destination_slug)?.name ??
            a.destination_slug;
          items.push({
            name: a.name,
            destination: destName,
            booked: activity.booked,
          });
        }
      }
    }
    return items;
  }, [builderDays, catalogMap, destinations]);

  const totalActivities = builderDays.reduce(
    (sum, d) => sum + d.activities.length,
    0,
  );

  if (totalActivities === 0) return null;

  const progressPct = Math.min(budgetComparison.pct, 100);

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-10">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Trip summary
        </p>
        <h3 className="mt-2 font-display text-[clamp(24px,2.8vw,32px)] font-medium tracking-[-0.01em] text-foreground">
          How it adds up.
        </h3>
      </div>

      <SummarySection
        eyebrow="Activity budget"
        title={`~¥${budgetEstimate.toLocaleString()}`}
      >
        <div className="flex items-center gap-4">
          <div className="h-1 flex-1 bg-border">
            <div
              className="h-full bg-accent"
              style={{ width: `${progressPct}%` }}
              aria-hidden
            />
          </div>
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {budgetComparison.pct}% of {budgetTier ?? "moderate"} target
          </span>
        </div>
        <p className="mt-3 text-[12px] text-ink-2">
          {totalActivities} activities across {builderDays.length} days ·
          target ~¥{budgetComparison.totalTarget.toLocaleString()} (excludes
          lodging, transport, meals not listed).
        </p>
      </SummarySection>

      {transportLegs.length > 0 && (
        <SummarySection eyebrow="Transport between cities">
          <ul className="flex flex-col gap-3">
            {transportLegs.map((leg, i) => {
              const fromName =
                destinations.find((d) => d.slug === leg.from)?.name ?? leg.from;
              const toName =
                destinations.find((d) => d.slug === leg.to)?.name ?? leg.to;
              return (
                <li
                  key={i}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="font-display text-[15px] font-medium text-foreground">
                    {fromName} → {toName}
                  </span>
                  {leg.route ? (
                    <span className="text-right">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                        {leg.route.primary_method} · {leg.route.duration} ·{" "}
                        {leg.route.cost_display}
                      </span>
                      {leg.altRoute && (
                        <span className="mt-0.5 block text-[10px] uppercase tracking-[0.1em] text-muted-foreground/70">
                          or {leg.altRoute.primary_method} ·{" "}
                          {leg.altRoute.duration} · {leg.altRoute.cost_display}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      Route info not available
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-4 border-t border-border pt-4">
            <p className="font-display text-[16px] font-medium tracking-[-0.005em] text-foreground">
              {jrAnalysis.passType} JR Pass{" "}
              <span
                className={cn(
                  "font-display italic font-normal",
                  jrAnalysis.worthIt ? "text-accent" : "text-muted-foreground",
                )}
              >
                {jrAnalysis.worthIt
                  ? `saves ~¥${(jrAnalysis.jrCoveredTotal - jrAnalysis.passCost).toLocaleString()}.`
                  : "may not be worth it."}
              </span>
            </p>
            <p className="mt-1 text-[12px] text-ink-2">
              JR-covered routes: ¥
              {jrAnalysis.jrCoveredTotal.toLocaleString()} · Pass: ¥
              {jrAnalysis.passCost.toLocaleString()}
            </p>
          </div>
        </SummarySection>
      )}

      {reservations.length > 0 && (
        <SummarySection eyebrow="Book in advance">
          <ul className="flex flex-col">
            {reservations.map((r, i) => (
              <li
                key={i}
                className="flex items-center gap-3 border-b border-border py-2.5 last:border-b-0"
              >
                <span
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    r.booked ? "bg-muted-foreground" : "bg-accent",
                  )}
                  aria-hidden
                />
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  {r.destination}
                </span>
                <span
                  className={cn(
                    "flex-1 text-[14px]",
                    r.booked
                      ? "text-muted-foreground line-through"
                      : "text-foreground",
                  )}
                >
                  {r.name}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {r.booked ? "Booked" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        </SummarySection>
      )}

      <PackingList />
    </div>
  );
}
