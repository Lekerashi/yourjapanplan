"use client";

import { useState } from "react";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { REGIONS, INTEREST_TAGS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Check, Plus } from "lucide-react";

// Positions mapped to the SVG viewBox (0 0 580 800)
const DESTINATION_POSITIONS: Record<string, { x: number; y: number }> = {
  // Hokkaido
  sapporo: { x: 420, y: 95 },
  niseko: { x: 370, y: 110 },
  "furano-biei": { x: 450, y: 70 },
  // Tohoku
  sendai: { x: 430, y: 245 },
  // Kanto
  tokyo: { x: 410, y: 370 },
  kamakura: { x: 395, y: 390 },
  nikko: { x: 385, y: 330 },
  // Chubu
  hakone: { x: 370, y: 395 },
  "mt-fuji-area": { x: 345, y: 380 },
  matsumoto: { x: 325, y: 340 },
  kanazawa: { x: 270, y: 325 },
  takayama: { x: 300, y: 350 },
  "shirakawa-go": { x: 280, y: 340 },
  ito: { x: 385, y: 415 },
  // Kansai
  kyoto: { x: 248, y: 380 },
  osaka: { x: 235, y: 400 },
  nara: { x: 258, y: 400 },
  kobe: { x: 218, y: 395 },
  "koya-san": { x: 240, y: 425 },
  // Chugoku
  hiroshima: { x: 150, y: 410 },
  onomichi: { x: 180, y: 400 },
  // Shikoku
  naoshima: { x: 195, y: 430 },
  // Kyushu
  fukuoka: { x: 100, y: 430 },
  beppu: { x: 130, y: 460 },
  yakushima: { x: 90, y: 545 },
  // Okinawa
  "okinawa-main": { x: 50, y: 700 },
};

interface JapanMapProps {
  selectedSlugs: Set<string>;
  onSelect: (slug: string, name: string) => void;
}

export function JapanMap({ selectedSlugs, onSelect }: JapanMapProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ w: 580, h: 800 });

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
        className="relative mx-auto overflow-hidden rounded-xl border"
        style={{ width: "100%", maxWidth: 580, aspectRatio: "580/800" }}
      >
        <svg
          viewBox="0 0 580 800"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ocean background */}
          <rect width="580" height="800" fill="#dbeafe" />

          {/* Hokkaido */}
          <path d="M360,55 L380,45 L410,40 L440,45 L465,55 L475,70 L478,90 L470,110 L455,125 L435,130 L415,128 L395,120 L375,115 L360,105 L350,90 L348,75 Z"
            fill="#e8e8e8" stroke="#c4c4c4" strokeWidth="1" />

          {/* Honshu - main island */}
          <path d="M455,175 L465,185 L470,200 L468,220 L460,235 L450,250 L442,265 L438,280 L435,295 L430,310 L425,325 L420,340 L418,355 L415,365 L420,380 L415,395 L405,405 L390,410 L375,405 L360,398 L345,395 L330,388 L315,380 L300,375 L285,370 L270,368 L255,370 L240,375 L225,380 L210,385 L195,388 L180,385 L168,380 L160,372 L155,360 L160,350 L170,342 L182,338 L195,335 L210,332 L225,330 L240,325 L255,320 L270,315 L285,318 L298,325 L310,330 L325,332 L340,330 L355,325 L370,318 L385,310 L395,298 L405,285 L410,270 L415,255 L420,240 L428,225 L435,210 L440,195 L445,180 Z"
            fill="#e8e8e8" stroke="#c4c4c4" strokeWidth="1" />

          {/* Shikoku */}
          <path d="M175,415 L195,410 L215,415 L230,425 L235,440 L225,450 L210,452 L195,448 L180,440 L170,430 L172,420 Z"
            fill="#e8e8e8" stroke="#c4c4c4" strokeWidth="1" />

          {/* Kyushu */}
          <path d="M80,400 L100,395 L120,400 L135,415 L140,435 L138,455 L130,470 L118,480 L105,485 L90,480 L78,470 L70,455 L68,435 L72,418 Z"
            fill="#e8e8e8" stroke="#c4c4c4" strokeWidth="1" />

          {/* Yakushima */}
          <circle cx="90" cy="545" r="12" fill="#e8e8e8" stroke="#c4c4c4" strokeWidth="1" />

          {/* Okinawa */}
          <ellipse cx="50" cy="700" rx="12" ry="25" fill="#e8e8e8" stroke="#c4c4c4" strokeWidth="1" />

          {/* Destination dots */}
          {SEED_DESTINATIONS.map((dest) => {
            const pos = DESTINATION_POSITIONS[dest.slug];
            if (!pos) return null;
            const isSelected = selectedSlugs.has(dest.slug);
            const isHovered = hoveredSlug === dest.slug;

            return (
              <g key={dest.slug}>
                {isSelected && (
                  <circle cx={pos.x} cy={pos.y} r="10" fill="#fda4af" fillOpacity="0.4" />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 6 : isHovered ? 5 : 4}
                  fill={isSelected ? "#e11d48" : isHovered ? "#fb7185" : "#f43f5e"}
                  stroke="white"
                  strokeWidth={isSelected ? 2 : 1}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredSlug(dest.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                  onClick={() => onSelect(dest.slug, dest.name)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating tooltip */}
        {hoveredDest && (
          <div
            className="absolute z-20 w-56 rounded-lg border bg-white shadow-lg p-3 pointer-events-none"
            style={{
              left: Math.min(tooltipPos.x + 16, containerSize.w - 240),
              top: Math.max(10, Math.min(tooltipPos.y - 20, containerSize.h - 120)),
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
