"use client";

import { useState } from "react";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { REGIONS, INTEREST_TAGS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

// Approximate positions on a 400x600 SVG canvas (x%, y%)
// Mapped from real lat/lng to relative positions on a Japan outline
const DESTINATION_POSITIONS: Record<string, { x: number; y: number }> = {
  // Hokkaido
  sapporo: { x: 72, y: 8 },
  niseko: { x: 66, y: 10 },
  "furano-biei": { x: 76, y: 6 },
  // Tohoku
  sendai: { x: 72, y: 24 },
  // Kanto
  tokyo: { x: 68, y: 38 },
  kamakura: { x: 66, y: 40 },
  nikko: { x: 66, y: 33 },
  // Chubu
  hakone: { x: 62, y: 41 },
  "mt-fuji-area": { x: 59, y: 40 },
  matsumoto: { x: 58, y: 35 },
  kanazawa: { x: 48, y: 33 },
  takayama: { x: 53, y: 36 },
  "shirakawa-go": { x: 50, y: 35 },
  ito: { x: 64, y: 43 },
  // Kansai
  kyoto: { x: 46, y: 41 },
  osaka: { x: 44, y: 43 },
  nara: { x: 47, y: 43 },
  kobe: { x: 42, y: 43 },
  "koya-san": { x: 44, y: 46 },
  // Chugoku
  hiroshima: { x: 30, y: 46 },
  onomichi: { x: 34, y: 45 },
  // Shikoku
  naoshima: { x: 36, y: 48 },
  // Kyushu
  fukuoka: { x: 22, y: 50 },
  beppu: { x: 26, y: 52 },
  yakushima: { x: 20, y: 62 },
  // Okinawa
  okinawa: { x: 10, y: 82 },
};

interface JapanMapProps {
  selectedSlugs: Set<string>;
  onSelect: (slug: string, name: string) => void;
}

export function JapanMap({ selectedSlugs, onSelect }: JapanMapProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const hoveredDest = hoveredSlug
    ? SEED_DESTINATIONS.find((d) => d.slug === hoveredSlug)
    : null;
  const hoveredRegion = hoveredDest
    ? REGIONS.find((r) => r.value === hoveredDest.region)
    : null;

  return (
    <div className="relative">
      {/* Map container */}
      <div className="relative w-full aspect-[2/3] max-w-md mx-auto">
        {/* Japan outline SVG background */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simplified Japan shape — decorative background */}
          <ellipse cx="70" cy="8" rx="12" ry="6" className="fill-muted/40" /> {/* Hokkaido */}
          <ellipse cx="70" cy="28" rx="6" ry="10" className="fill-muted/40" /> {/* Tohoku */}
          <ellipse cx="60" cy="38" rx="10" ry="6" className="fill-muted/40" /> {/* Kanto/Chubu */}
          <ellipse cx="45" cy="43" rx="8" ry="4" className="fill-muted/40" /> {/* Kansai */}
          <ellipse cx="30" cy="47" rx="8" ry="4" className="fill-muted/40" /> {/* Chugoku */}
          <ellipse cx="36" cy="50" rx="5" ry="3" className="fill-muted/30" /> {/* Shikoku */}
          <ellipse cx="22" cy="54" rx="6" ry="6" className="fill-muted/40" /> {/* Kyushu */}
          <ellipse cx="10" cy="82" rx="4" ry="2" className="fill-muted/40" /> {/* Okinawa */}
        </svg>

        {/* Destination markers */}
        {SEED_DESTINATIONS.map((dest) => {
          const pos = DESTINATION_POSITIONS[dest.slug];
          if (!pos) return null;
          const isSelected = selectedSlugs.has(dest.slug);
          const isHovered = hoveredSlug === dest.slug;

          return (
            <button
              key={dest.slug}
              onClick={() => onSelect(dest.slug, dest.name)}
              onMouseEnter={() => setHoveredSlug(dest.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {/* Marker dot */}
              <div
                className={`flex items-center justify-center rounded-full transition-all ${
                  isSelected
                    ? "h-5 w-5 bg-rose-500 text-white ring-2 ring-rose-200"
                    : isHovered
                      ? "h-5 w-5 bg-rose-400 text-white ring-2 ring-rose-100"
                      : "h-3 w-3 bg-rose-400/70 hover:bg-rose-500"
                }`}
              >
                {isSelected && (
                  <MapPin className="h-3 w-3" />
                )}
              </div>
              {/* Label */}
              <span
                className={`absolute left-1/2 -translate-x-1/2 top-full mt-0.5 whitespace-nowrap text-[10px] font-medium transition-opacity ${
                  isSelected || isHovered
                    ? "opacity-100 text-foreground"
                    : "opacity-60 text-muted-foreground"
                }`}
              >
                {dest.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hover tooltip */}
      {hoveredDest && !selectedSlugs.has(hoveredDest.slug) && (
        <div className="mt-4 rounded-lg border bg-background p-3 text-center">
          <p className="font-semibold">{hoveredDest.name}</p>
          <p className="text-xs text-muted-foreground">
            {hoveredRegion?.label} · {hoveredDest.description.split(".")[0]}.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {hoveredDest.tags.map((tag) => {
              const meta = INTEREST_TAGS.find((t) => t.value === tag);
              return (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {meta ? `${meta.icon} ${meta.label}` : tag}
                </Badge>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-rose-600 font-medium">
            Click to add
          </p>
        </div>
      )}
    </div>
  );
}
