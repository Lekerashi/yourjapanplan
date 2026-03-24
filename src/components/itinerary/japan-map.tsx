"use client";

import { useState } from "react";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { REGIONS, INTEREST_TAGS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Check, Plus } from "lucide-react";

// Positions as percentages on a 100x100 grid, tuned to match Japan's geography
const DESTINATION_POSITIONS: Record<string, { x: number; y: number }> = {
  sapporo: { x: 72, y: 8 },
  niseko: { x: 65, y: 11 },
  "furano-biei": { x: 78, y: 5 },
  sendai: { x: 73, y: 25 },
  tokyo: { x: 69, y: 39 },
  kamakura: { x: 67, y: 41 },
  nikko: { x: 67, y: 34 },
  hakone: { x: 63, y: 42 },
  "mt-fuji-area": { x: 59, y: 40 },
  matsumoto: { x: 57, y: 35 },
  kanazawa: { x: 47, y: 34 },
  takayama: { x: 53, y: 37 },
  "shirakawa-go": { x: 50, y: 35 },
  ito: { x: 65, y: 44 },
  kyoto: { x: 45, y: 42 },
  osaka: { x: 43, y: 44 },
  nara: { x: 47, y: 44 },
  kobe: { x: 41, y: 44 },
  "koya-san": { x: 44, y: 47 },
  hiroshima: { x: 29, y: 47 },
  onomichi: { x: 34, y: 46 },
  naoshima: { x: 37, y: 49 },
  fukuoka: { x: 21, y: 51 },
  beppu: { x: 25, y: 53 },
  yakushima: { x: 19, y: 63 },
  okinawa: { x: 8, y: 83 },
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
    <div>
      {/* Map */}
      <div
        className="relative mx-auto border rounded-xl bg-gradient-to-b from-sky-50 to-blue-50 overflow-hidden"
        style={{ width: "100%", maxWidth: 500, height: 600 }}
      >
        {/* Water label */}
        <span className="absolute top-2 left-3 text-[10px] text-sky-300 font-medium">
          Sea of Japan
        </span>
        <span className="absolute bottom-2 right-3 text-[10px] text-sky-300 font-medium">
          Pacific Ocean
        </span>

        {/* Region labels */}
        <span className="absolute text-[9px] text-muted-foreground/40 font-semibold" style={{ left: "68%", top: "2%" }}>HOKKAIDO</span>
        <span className="absolute text-[9px] text-muted-foreground/40 font-semibold" style={{ left: "76%", top: "22%" }}>TOHOKU</span>
        <span className="absolute text-[9px] text-muted-foreground/40 font-semibold" style={{ left: "72%", top: "36%" }}>KANTO</span>
        <span className="absolute text-[9px] text-muted-foreground/40 font-semibold" style={{ left: "50%", top: "30%" }}>CHUBU</span>
        <span className="absolute text-[9px] text-muted-foreground/40 font-semibold" style={{ left: "38%", top: "39%" }}>KANSAI</span>
        <span className="absolute text-[9px] text-muted-foreground/40 font-semibold" style={{ left: "14%", top: "45%" }}>CHUGOKU</span>
        <span className="absolute text-[9px] text-muted-foreground/40 font-semibold" style={{ left: "14%", top: "49%" }}>KYUSHU</span>
        <span className="absolute text-[9px] text-muted-foreground/40 font-semibold" style={{ left: "2%", top: "78%" }}>OKINAWA</span>

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
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              title={dest.name}
            >
              {/* Dot */}
              <div
                className={`rounded-full transition-all shadow-sm ${
                  isSelected
                    ? "h-4 w-4 bg-rose-500 ring-2 ring-rose-200"
                    : isHovered
                      ? "h-4 w-4 bg-rose-400 ring-2 ring-rose-100"
                      : "h-2.5 w-2.5 bg-rose-400/80 hover:bg-rose-500 hover:scale-150"
                }`}
              />
              {/* Label */}
              <span
                className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap rounded px-1 text-[10px] font-medium leading-tight transition-all ${
                  isSelected
                    ? "text-rose-700 bg-white/80"
                    : isHovered
                      ? "text-foreground bg-white/80"
                      : "text-muted-foreground/70 opacity-0 group-hover:opacity-100"
                }`}
              >
                {dest.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hover info panel */}
      {hoveredDest && (
        <div className="mt-3 rounded-lg border bg-background p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{hoveredDest.name}</p>
              <p className="text-xs text-muted-foreground">
                {hoveredRegion?.label}
                {hoveredRegion?.label_jp ? ` (${hoveredRegion.label_jp})` : ""}
              </p>
            </div>
            {selectedSlugs.has(hoveredDest.slug) ? (
              <Badge variant="secondary" className="text-xs">
                <Check className="mr-1 h-3 w-3" />
                Added
              </Badge>
            ) : (
              <Badge className="text-xs">
                <Plus className="mr-1 h-3 w-3" />
                Click to add
              </Badge>
            )}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {hoveredDest.description.split(".")[0]}.
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {hoveredDest.tags.map((tag) => {
              const meta = INTEREST_TAGS.find((t) => t.value === tag);
              return (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {meta ? `${meta.icon} ${meta.label}` : tag}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {!hoveredDest && selectedSlugs.size === 0 && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Hover over a dot to see details, click to add to your itinerary
        </p>
      )}
    </div>
  );
}
