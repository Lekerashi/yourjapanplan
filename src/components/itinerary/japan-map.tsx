"use client";

import { useState } from "react";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { REGIONS, INTEREST_TAGS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Check, Plus } from "lucide-react";

const DESTINATION_POSITIONS: Record<string, { x: number; y: number }> = {
  // Hokkaido
  sapporo: { x: 72, y: 10 },
  niseko: { x: 62, y: 6 },
  "furano-biei": { x: 82, y: 5 },
  // Tohoku
  sendai: { x: 75, y: 25 },
  // Kanto — spread out more
  tokyo: { x: 74, y: 38 },
  kamakura: { x: 72, y: 43 },
  nikko: { x: 70, y: 32 },
  // Chubu — spread across the middle
  hakone: { x: 66, y: 43 },
  "mt-fuji-area": { x: 62, y: 39 },
  matsumoto: { x: 56, y: 33 },
  kanazawa: { x: 46, y: 31 },
  takayama: { x: 52, y: 36 },
  "shirakawa-go": { x: 48, y: 34 },
  ito: { x: 69, y: 47 },
  // Kansai — spread vertically
  kyoto: { x: 43, y: 39 },
  osaka: { x: 40, y: 43 },
  nara: { x: 46, y: 43 },
  kobe: { x: 37, y: 41 },
  "koya-san": { x: 42, y: 48 },
  // Chugoku
  hiroshima: { x: 27, y: 45 },
  onomichi: { x: 33, y: 43 },
  // Shikoku
  naoshima: { x: 35, y: 50 },
  // Kyushu
  fukuoka: { x: 19, y: 49 },
  beppu: { x: 24, y: 53 },
  yakushima: { x: 17, y: 63 },
  // Okinawa
  "okinawa-main": { x: 8, y: 83 },
};

interface JapanMapProps {
  selectedSlugs: Set<string>;
  onSelect: (slug: string, name: string) => void;
}

export function JapanMap({ selectedSlugs, onSelect }: JapanMapProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ w: 500, h: 600 });

  const hoveredDest = hoveredSlug
    ? SEED_DESTINATIONS.find((d) => d.slug === hoveredSlug)
    : null;
  const hoveredRegion = hoveredDest
    ? REGIONS.find((r) => r.value === hoveredDest.region)
    : null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setContainerSize({ w: rect.width, h: rect.height });
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div>
      <div
        onMouseMove={handleMouseMove}
        className="relative mx-auto border rounded-xl overflow-hidden select-none"
        style={{ width: "100%", maxWidth: 500, height: 600 }}
      >
        {/* Background SVG with land masses */}
        <svg
          viewBox="0 0 200 300"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Ocean */}
          <rect width="200" height="300" fill="#e0f2fe" />

          {/* Hokkaido */}
          <path
            d="M130,15 C138,10 150,8 158,12 C164,16 166,22 162,28 C158,34 148,36 140,34 C132,32 126,26 128,20 Z"
            fill="#d4d4d8" fillOpacity="0.4" stroke="#a1a1aa" strokeWidth="0.5" strokeOpacity="0.3"
          />

          {/* Honshu (main island) */}
          <path
            d="M148,60 C152,55 156,52 158,56 C160,62 156,68 150,74 C146,78 142,82 138,88 C134,94 130,98 126,102 C122,106 118,110 114,114 C110,118 106,120 102,122 C98,124 94,126 90,128 C86,130 82,132 78,132 C74,132 70,130 66,128 C62,126 58,124 54,126 C50,128 48,132 46,136 C44,138 42,138 40,136 C38,132 40,128 44,124 C48,120 52,118 56,116 C60,114 64,112 68,110 C72,108 74,106 76,102 C78,98 78,94 80,90 C82,86 86,84 90,82 C94,80 98,80 102,78 C106,76 110,72 114,68 C118,64 122,62 126,60 C130,58 134,56 138,56 C142,56 146,58 148,60 Z"
            fill="#d4d4d8" fillOpacity="0.4" stroke="#a1a1aa" strokeWidth="0.5" strokeOpacity="0.3"
          />

          {/* Shikoku */}
          <path
            d="M68,142 C72,138 78,138 82,140 C86,142 88,146 86,150 C84,154 78,156 74,154 C70,152 66,148 68,142 Z"
            fill="#d4d4d8" fillOpacity="0.35" stroke="#a1a1aa" strokeWidth="0.5" strokeOpacity="0.3"
          />

          {/* Kyushu */}
          <path
            d="M36,146 C40,142 46,140 50,144 C54,148 54,154 50,160 C46,166 40,168 36,164 C32,160 32,152 36,146 Z"
            fill="#d4d4d8" fillOpacity="0.4" stroke="#a1a1aa" strokeWidth="0.5" strokeOpacity="0.3"
          />

          {/* Yakushima */}
          <circle cx="38" cy="186" r="4" fill="#d4d4d8" fillOpacity="0.35" stroke="#a1a1aa" strokeWidth="0.5" strokeOpacity="0.3" />

          {/* Okinawa */}
          <ellipse cx="16" cy="248" rx="5" ry="8" fill="#d4d4d8" fillOpacity="0.35" stroke="#a1a1aa" strokeWidth="0.5" strokeOpacity="0.3" />
        </svg>

        {/* Region labels */}
        <span className="absolute text-[9px] text-muted-foreground/50 font-semibold pointer-events-none" style={{ left: "66%", top: "2%" }}>HOKKAIDO</span>
        <span className="absolute text-[9px] text-muted-foreground/50 font-semibold pointer-events-none" style={{ left: "76%", top: "22%" }}>TOHOKU</span>
        <span className="absolute text-[9px] text-muted-foreground/50 font-semibold pointer-events-none" style={{ left: "73%", top: "36%" }}>KANTO</span>
        <span className="absolute text-[9px] text-muted-foreground/50 font-semibold pointer-events-none" style={{ left: "50%", top: "30%" }}>CHUBU</span>
        <span className="absolute text-[9px] text-muted-foreground/50 font-semibold pointer-events-none" style={{ left: "36%", top: "38%" }}>KANSAI</span>
        <span className="absolute text-[9px] text-muted-foreground/50 font-semibold pointer-events-none" style={{ left: "14%", top: "44%" }}>CHUGOKU</span>
        <span className="absolute text-[9px] text-muted-foreground/50 font-semibold pointer-events-none" style={{ left: "13%", top: "49%" }}>KYUSHU</span>
        <span className="absolute text-[9px] text-muted-foreground/50 font-semibold pointer-events-none" style={{ left: "2%", top: "78%" }}>OKINAWA</span>

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
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div
                className={`rounded-full transition-all ${
                  isSelected
                    ? "h-4 w-4 bg-rose-500 ring-2 ring-rose-300 shadow"
                    : isHovered
                      ? "h-3.5 w-3.5 bg-rose-400 ring-2 ring-rose-200 shadow"
                      : "h-2 w-2 bg-rose-500/80 hover:scale-150"
                }`}
              />
            </button>
          );
        })}

        {/* Floating tooltip inside the map container */}
        {hoveredDest && (
          <div
            className="absolute z-20 w-56 rounded-lg border bg-white shadow-lg p-3 pointer-events-none"
            style={{
              left: Math.min(tooltipPos.x + 16, containerSize.w - 240),
              top: Math.min(tooltipPos.y - 10, containerSize.h - 140),
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{hoveredDest.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {hoveredRegion?.label}
                  {hoveredRegion?.label_jp ? ` (${hoveredRegion.label_jp})` : ""}
                </p>
              </div>
              {selectedSlugs.has(hoveredDest.slug) ? (
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : (
                <Plus className="h-4 w-4 text-rose-500 shrink-0" />
              )}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
              {hoveredDest.description.split(".")[0]}.
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {hoveredDest.tags.slice(0, 4).map((tag) => {
                const meta = INTEREST_TAGS.find((t) => t.value === tag);
                return (
                  <Badge key={tag} variant="secondary" className="text-[9px] px-1 py-0">
                    {meta ? `${meta.icon} ${meta.label}` : tag}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedSlugs.size === 0 && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Hover over a dot to see details, click to add to your itinerary
        </p>
      )}
    </div>
  );
}
