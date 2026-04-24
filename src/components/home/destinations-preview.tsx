"use client";

import { useMemo, useRef, useState } from "react";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { REGIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SectionHead } from "./section-head";
import { DestinationCard } from "@/components/destination/destination-card";
import { Button } from "@/components/ui/button";
import { useHomeDemo } from "./home-demo-context";
import { INTEREST_TAGS } from "@/lib/constants";

const COLLAPSED_COUNT_MOBILE = 3;
const COLLAPSED_COUNT_DESKTOP = 6;

type TabKey = "all" | (typeof REGIONS)[number]["value"];

function useRegionTabs() {
  return useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of SEED_DESTINATIONS) {
      counts[d.region] = (counts[d.region] ?? 0) + 1;
    }
    const pad = (n: number) => String(n).padStart(2, "0");
    const tabs: Array<{ key: TabKey; label: string; count: string }> = [
      { key: "all", label: "All regions", count: pad(SEED_DESTINATIONS.length) },
      ...REGIONS.filter((r) => (counts[r.value] ?? 0) > 0).map((r) => ({
        key: r.value as TabKey,
        label: r.label,
        count: pad(counts[r.value] ?? 0),
      })),
    ];
    return tabs;
  }, []);
}

export function DestinationsPreview() {
  const tabs = useRegionTabs();
  const [tab, setTab] = useState<TabKey>("all");
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { selectedInterests, clearInterests } = useHomeDemo();

  const filtered = useMemo(() => {
    let result =
      tab === "all"
        ? SEED_DESTINATIONS
        : SEED_DESTINATIONS.filter((d) => d.region === tab);
    if (selectedInterests.size > 0) {
      result = result.filter((d) =>
        d.tags.some((t) => selectedInterests.has(t)),
      );
    }
    return result;
  }, [tab, selectedInterests]);

  const interestLabels = useMemo(
    () =>
      Array.from(selectedInterests)
        .map((v) => INTEREST_TAGS.find((t) => t.value === v)?.label ?? v)
        .join(", "),
    [selectedInterests],
  );

  const hasInterestFilter =
    selectedInterests.size > 0 && selectedInterests.size < INTEREST_TAGS.length;

  const canCollapse = tab === "all" && filtered.length > COLLAPSED_COUNT_MOBILE;
  const visible =
    canCollapse && !expanded
      ? filtered.slice(0, COLLAPSED_COUNT_DESKTOP)
      : filtered;
  const hiddenCount = filtered.length - visible.length;

  const toggleExpanded = () => {
    const nowExpanded = !expanded;
    setExpanded(nowExpanded);
    if (!nowExpanded) {
      // Collapsing: jump back to top of the destinations section so the
      // button doesn't strand the user at the page bottom with no cards.
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <section id="destinations" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-[clamp(56px,8vw,96px)]">
        <SectionHead
          eyebrow="Destinations"
          title={
            <>
              Not just Tokyo{" "}
              <span className="font-display italic font-normal text-accent">
                &amp; Kyoto.
              </span>
            </>
          }
          lede="Every city we cover, ordered by region. Filter to the part of Japan you want to see."
        />

        {hasInterestFilter && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-border bg-card px-4 py-3">
            <p className="text-[13px] text-ink-2">
              Filtered by{" "}
              <span className="font-medium text-foreground">
                {interestLabels}
              </span>
              . Showing {filtered.length} of {SEED_DESTINATIONS.length}.
            </p>
            <Button variant="ghost" size="xs" onClick={clearInterests}>
              Clear
            </Button>
          </div>
        )}

        <div
          className="mt-8 flex flex-wrap gap-x-6 border-b border-border"
          role="tablist"
        >
          {tabs.map((t) => {
            const on = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setTab(t.key);
                  setExpanded(false);
                }}
                className={cn(
                  "-mb-px border-b-2 py-3 text-sm font-medium transition-colors",
                  on
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "ml-1.5 text-[11px]",
                    on ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d, i) => {
            const mobileHidden =
              canCollapse && !expanded && i >= COLLAPSED_COUNT_MOBILE;
            return (
              <div
                key={d.slug}
                className={cn(mobileHidden && "hidden sm:block")}
              >
                <DestinationCard destination={d} index={i} />
              </div>
            );
          })}
        </div>

        {canCollapse && (
          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              onClick={toggleExpanded}
              aria-expanded={expanded}
            >
              {expanded ? (
                <>
                  Show fewer
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden
                  >
                    <path d="M4 10l4-4 4 4" />
                  </svg>
                </>
              ) : (
                <>
                  Show all {filtered.length}
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </>
              )}
            </Button>
          </div>
        )}

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No destinations in this region yet.
          </p>
        )}

        {canCollapse && !expanded && hiddenCount > 0 && (
          <p className="sr-only">
            {hiddenCount} more destinations available.
          </p>
        )}
      </div>
    </section>
  );
}
