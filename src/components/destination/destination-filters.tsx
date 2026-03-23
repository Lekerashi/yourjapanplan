"use client";

import { useState, useMemo } from "react";
import { REGIONS, INTEREST_TAGS, SEASONS } from "@/lib/constants";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { Input } from "@/components/ui/input";
import { DestinationCard } from "./destination-card";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALL_REGION = "all" as const;

export function DestinationFilters() {
  const [region, setRegion] = useState<string>(ALL_REGION);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return SEED_DESTINATIONS.filter((d) => {
      if (region !== ALL_REGION && d.region !== region) return false;
      if (selectedTags.length > 0 && !selectedTags.some((t) => d.tags.includes(t)))
        return false;
      if (selectedSeason && !d.best_seasons.includes(selectedSeason)) return false;
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

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const hasFilters = region !== ALL_REGION || selectedTags.length > 0 || selectedSeason || search;

  const clearFilters = () => {
    setRegion(ALL_REGION);
    setSelectedTags([]);
    setSelectedSeason(null);
    setSearch("");
  };

  return (
    <div>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Region tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setRegion(ALL_REGION)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            region === ALL_REGION
              ? "bg-rose-600 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All Regions
        </button>
        {REGIONS.map((r) => (
          <button
            key={r.value}
            onClick={() => setRegion(r.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              region === r.value
                ? "bg-rose-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Interest tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {INTEREST_TAGS.map((tag) => (
          <button
            key={tag.value}
            onClick={() => toggleTag(tag.value)}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedTags.includes(tag.value)
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            <span>{tag.icon}</span>
            {tag.label}
          </button>
        ))}
      </div>

      {/* Season filter */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Season:</span>
        {SEASONS.map((s) => (
          <button
            key={s.value}
            onClick={() =>
              setSelectedSeason(selectedSeason === s.value ? null : s.value)
            }
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedSeason === s.value
                ? "bg-rose-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Active filters + clear */}
      {hasFilters && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "destination" : "destinations"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
        </div>
      )}

      {/* Results grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <DestinationCard key={d.slug} destination={d} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-lg font-semibold">No destinations found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or search term.
          </p>
        </div>
      )}
    </div>
  );
}
