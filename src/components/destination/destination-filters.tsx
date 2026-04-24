"use client";

import { useMemo, useState } from "react";
import { REGIONS, INTEREST_TAGS, SEASONS } from "@/lib/constants";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DestinationCard } from "./destination-card";

const ALL_REGION = "all" as const;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function DestinationFilters() {
  const [region, setRegion] = useState<string>(ALL_REGION);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return SEED_DESTINATIONS.filter((d) => {
      if (region !== ALL_REGION && d.region !== region) return false;
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((t) => d.tags.includes(t))
      )
        return false;
      if (selectedSeason && !d.best_seasons.includes(selectedSeason))
        return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.tags.some((t) => t.includes(q))
        );
      }
      return true;
    });
  }, [region, selectedTags, selectedSeason, search]);

  const regionCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const d of SEED_DESTINATIONS) c[d.region] = (c[d.region] ?? 0) + 1;
    return c;
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const hasFilters =
    region !== ALL_REGION ||
    selectedTags.length > 0 ||
    selectedSeason ||
    search;

  const clearFilters = () => {
    setRegion(ALL_REGION);
    setSelectedTags([]);
    setSelectedSeason(null);
    setSearch("");
  };

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div
        className="mt-6 flex flex-wrap gap-x-6 border-b border-border"
        role="tablist"
        aria-label="Region"
      >
        <button
          type="button"
          role="tab"
          aria-selected={region === ALL_REGION}
          onClick={() => setRegion(ALL_REGION)}
          className={cn(
            "-mb-px border-b-2 py-3 text-sm font-medium transition-colors",
            region === ALL_REGION
              ? "border-accent text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          All regions
          <span
            className={cn(
              "ml-1.5 text-[11px]",
              region === ALL_REGION
                ? "text-accent"
                : "text-muted-foreground",
            )}
          >
            {pad(SEED_DESTINATIONS.length)}
          </span>
        </button>
        {REGIONS.filter((r) => (regionCounts[r.value] ?? 0) > 0).map((r) => {
          const on = region === r.value;
          return (
            <button
              key={r.value}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setRegion(r.value)}
              className={cn(
                "-mb-px border-b-2 py-3 text-sm font-medium transition-colors",
                on
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {r.label}
              <span
                className={cn(
                  "ml-1.5 text-[11px]",
                  on ? "text-accent" : "text-muted-foreground",
                )}
              >
                {pad(regionCounts[r.value] ?? 0)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Interests
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTEREST_TAGS.map((tag, i) => {
            const on = selectedTags.includes(tag.value);
            return (
              <button
                key={tag.value}
                type="button"
                aria-pressed={on}
                onClick={() => toggleTag(tag.value)}
                className={cn(
                  "inline-flex items-center gap-2 border px-3 py-2 text-[13px] font-medium transition-colors",
                  on
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-ink-2 hover:border-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "font-display text-[11px] tracking-[0.1em]",
                    on ? "text-background/70" : "text-muted-foreground",
                  )}
                >
                  {pad(i + 1)}
                </span>
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Season
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SEASONS.map((s) => {
            const on = selectedSeason === s.value;
            return (
              <button
                key={s.value}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setSelectedSeason(on ? null : s.value)
                }
                className={cn(
                  "border px-3 py-2 text-[13px] font-medium transition-colors",
                  on
                    ? "border-accent bg-accent/5 text-foreground ring-1 ring-inset ring-accent"
                    : "border-border bg-card text-ink-2 hover:border-foreground hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {hasFilters && (
        <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          <span>
            {filtered.length}{" "}
            {filtered.length === 1 ? "destination" : "destinations"}
          </span>
          <Button variant="ghost" size="xs" onClick={clearFilters}>
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d, i) => (
          <DestinationCard key={d.slug} destination={d} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="font-display text-[22px] font-medium tracking-[-0.01em] text-foreground">
            No destinations match those filters.
          </p>
          <p className="mt-2 text-[14px] text-ink-2">
            Try adjusting your filters or search term.
          </p>
        </div>
      )}
    </div>
  );
}
