"use client";

import { useEffect, useRef, useState } from "react";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { REGIONS, INTEREST_TAGS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Check, Plus } from "lucide-react";

// Real lat/lng for each destination
const DESTINATION_COORDS: Record<string, [number, number]> = {
  sapporo: [43.06, 141.35],
  niseko: [42.86, 140.69],
  "furano-biei": [43.34, 142.38],
  sendai: [38.27, 140.87],
  tokyo: [35.68, 139.69],
  kamakura: [35.32, 139.55],
  nikko: [36.75, 139.6],
  hakone: [35.23, 139.11],
  "mt-fuji": [35.36, 138.73],
  matsumoto: [36.24, 137.97],
  kanazawa: [36.56, 136.65],
  takayama: [36.14, 137.25],
  "shirakawa-go": [36.26, 136.91],
  ito: [34.97, 139.1],
  kyoto: [35.01, 135.77],
  osaka: [34.69, 135.5],
  nara: [34.69, 135.8],
  kobe: [34.69, 135.19],
  koyasan: [34.21, 135.6],
  hiroshima: [34.4, 132.46],
  onomichi: [34.41, 133.2],
  naoshima: [34.46, 133.99],
  fukuoka: [33.59, 130.4],
  beppu: [33.28, 131.49],
  yakushima: [30.35, 130.51],
  "okinawa-main": [26.33, 127.8],
};

interface JapanMapProps {
  selectedSlugs: Set<string>;
  onSelect: (slug: string, name: string) => void;
}

export function JapanMap({ selectedSlugs, onSelect }: JapanMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const [hoveredDest, setHoveredDest] = useState<string | null>(null);
  const [tappedSlug, setTappedSlug] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const hoveredData = hoveredDest
    ? SEED_DESTINATIONS.find((d) => d.slug === hoveredDest)
    : null;
  const hoveredRegion = hoveredData
    ? REGIONS.find((r) => r.value === hoveredData.region)
    : null;

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    let cancelled = false;

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      // Import Leaflet CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const map = L.map(mapRef.current, {
        center: [36.5, 137],
        zoom: 5,
        minZoom: 4,
        maxZoom: 10,
        zoomControl: true,
        attributionControl: false,
      });

      // Clean, minimal tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
      }).addTo(map);

      // Add attribution in corner
      L.control.attribution({ position: "bottomright" }).addTo(map);
      map.attributionControl.addAttribution(
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
      );

      // Add markers for each destination
      SEED_DESTINATIONS.forEach((dest) => {
        const coords = DESTINATION_COORDS[dest.slug];
        if (!coords) return;

        const isSelected = selectedSlugs.has(dest.slug);

        const marker = L.circleMarker(coords, {
          radius: isSelected ? 8 : 6,
          fillColor: isSelected ? "#e11d48" : "#f43f5e",
          color: "white",
          weight: isSelected ? 2 : 1,
          fillOpacity: isSelected ? 1 : 0.8,
        }).addTo(map);

        marker.bindTooltip(dest.name, {
          direction: "top",
          offset: [0, -8],
          className: "leaflet-tooltip-custom",
        });

        marker.on("click", () => {
          // On touch devices: first tap shows info, second tap adds
          const isTouchDevice = "ontouchstart" in window;
          if (isTouchDevice) {
            setTappedSlug((prev) => {
              if (prev === dest.slug) {
                // Second tap — add/remove
                onSelect(dest.slug, dest.name);
                return null;
              }
              // First tap — show info
              setHoveredDest(dest.slug);
              return dest.slug;
            });
          } else {
            onSelect(dest.slug, dest.name);
          }
        });

        marker.on("mouseover", () => {
          setHoveredDest(dest.slug);
        });

        marker.on("mouseout", () => {
          setHoveredDest(null);
        });

        markersRef.current.push(marker);
      });

      leafletMapRef.current = map;
      setLoaded(true);
    });

    return () => {
      cancelled = true;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      markersRef.current = [];
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update marker styles when selection changes
  useEffect(() => {
    if (!loaded) return;

    import("leaflet").then(() => {
      markersRef.current.forEach((marker, i) => {
        const dest = SEED_DESTINATIONS[i];
        if (!dest) return;
        const isSelected = selectedSlugs.has(dest.slug);
        marker.setStyle({
          radius: isSelected ? 8 : 6,
          fillColor: isSelected ? "#e11d48" : "#f43f5e",
          weight: isSelected ? 2 : 1,
          fillOpacity: isSelected ? 1 : 0.8,
        });
      });
    });
  }, [selectedSlugs, loaded]);

  return (
    <div>
      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full rounded-xl border overflow-hidden"
        style={{ height: 500 }}
      />

      {/* Tooltip CSS override */}
      <style>{`
        .leaflet-tooltip-custom {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .leaflet-tooltip-custom::before {
          border-top-color: #e5e7eb;
        }
      `}</style>

      {/* Hover info below map */}
      {hoveredData && (
        <div className="mt-3 rounded-lg border bg-background p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold">{hoveredData.name}</p>
              <p className="text-xs text-muted-foreground">
                {hoveredRegion?.label}
                {hoveredRegion?.label_jp ? ` (${hoveredRegion.label_jp})` : ""}
              </p>
            </div>
            {selectedSlugs.has(hoveredData.slug) ? (
              <Badge variant="secondary" className="text-xs">
                <Check className="mr-1 h-3 w-3" /> Added
              </Badge>
            ) : tappedSlug === hoveredData.slug ? (
              <Badge className="text-xs animate-pulse">
                Tap again to add
              </Badge>
            ) : (
              <Badge className="text-xs">
                <Plus className="mr-1 h-3 w-3" /> Click to add
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {hoveredData.description.split(".")[0]}.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {hoveredData.tags.slice(0, 4).map((tag) => {
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

      {selectedSlugs.size === 0 && !hoveredData && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Click a destination on the map to add it to your itinerary
        </p>
      )}
    </div>
  );
}
