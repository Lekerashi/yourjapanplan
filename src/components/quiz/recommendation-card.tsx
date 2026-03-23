"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Bookmark } from "lucide-react";
interface RecommendationCardProps {
  recommendation: {
    destination_slug?: string;
    match_score?: number;
    reasoning?: string;
    suggested_days?: number;
    highlights?: (string | undefined)[];
    best_area_to_stay?: string;
    must_reserve?: (string | undefined)[];
  };
  rank: number;
}

export function RecommendationCard({ recommendation, rank }: RecommendationCardProps) {
  const r = recommendation;
  const name = r.destination_slug?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? "...";

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-600">
              {rank}
            </span>
            <div>
              <h3 className="text-lg font-bold">{name}</h3>
              {r.suggested_days != null && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{r.suggested_days} {r.suggested_days === 1 ? "day" : "days"}</span>
                </div>
              )}
            </div>
          </div>
          {r.match_score != null && (
            <div className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600">
              {r.match_score}% match
            </div>
          )}
        </div>

        {r.reasoning && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {r.reasoning}
          </p>
        )}

        {r.highlights && r.highlights.filter(Boolean).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {r.highlights.filter(Boolean).map((h) => (
              <Badge key={h} variant="secondary" className="text-xs">
                {h}
              </Badge>
            ))}
          </div>
        )}

        {r.best_area_to_stay && (
          <div className="mt-4 flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              <strong>Stay in:</strong> {r.best_area_to_stay}
            </span>
          </div>
        )}

        {r.must_reserve && r.must_reserve.filter(Boolean).length > 0 && (
          <div className="mt-2 flex items-start gap-2 text-sm">
            <Bookmark className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <span>
              <strong>Reserve ahead:</strong> {r.must_reserve.filter(Boolean).join(", ")}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
