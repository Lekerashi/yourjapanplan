"use client";

import { useEffect, useRef } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { itineraryResponseSchema } from "@/lib/ai/itinerary-schemas";
import { ItineraryDayCard } from "./itinerary-day-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  RotateCcw,
  Train,
  Backpack,
  Wallet,
} from "lucide-react";

interface ItineraryTimelineProps {
  params: {
    travelStyle: string;
    interests: string[];
    season: string;
    durationDays: number;
    budget: string;
    pace: string;
    destinations: { slug: string; name: string; days: number }[];
  };
}

export function ItineraryTimeline({ params }: ItineraryTimelineProps) {
  const submittedRef = useRef(false);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/ai/itinerary",
    schema: itineraryResponseSchema,
  });

  useEffect(() => {
    if (!submittedRef.current) {
      submittedRef.current = true;
      submit(params);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="mx-auto max-w-2xl text-center py-20">
        <p className="text-lg font-semibold text-destructive">
          Something went wrong generating your itinerary.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "Please try again."}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => submit(params)}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  const days = object?.days ?? [];
  const hasDays = days.length > 0;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Title */}
      {object?.title && (
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {object.title}
        </h2>
      )}

      {/* Loading */}
      {isLoading && !hasDays && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Building your perfect itinerary day by day...
          </p>
        </div>
      )}

      {/* Day cards */}
      {hasDays && (
        <div className="mt-8 space-y-6">
          {days.map((day, i) =>
            day ? <ItineraryDayCard key={day.day_number ?? i} day={day} /> : null
          )}
        </div>
      )}

      {/* Still streaming indicator */}
      {isLoading && hasDays && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Still generating...
        </div>
      )}

      {/* Summary cards (appear after streaming) */}
      {!isLoading &&
        (object?.jr_pass_recommended != null ||
          object?.packing_tips ||
          object?.total_budget_estimate) && (
          <div className="mt-10 space-y-4">
            {/* JR Pass */}
            {object.jr_pass_reasoning && (
              <Card>
                <CardContent className="flex gap-4 p-5">
                  <Train className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">JR Pass</h3>
                      <Badge
                        variant={
                          object.jr_pass_recommended
                            ? "default"
                            : "secondary"
                        }
                      >
                        {object.jr_pass_recommended
                          ? "Recommended"
                          : "Not needed"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {object.jr_pass_reasoning}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Budget estimate */}
            {object.total_budget_estimate && (
              <Card>
                <CardContent className="flex gap-4 p-5">
                  <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                  <div>
                    <h3 className="font-semibold">Estimated Budget</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {object.total_budget_estimate} (excluding international
                      flights)
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Packing tips */}
            {object.packing_tips && object.packing_tips.filter(Boolean).length > 0 && (
              <Card>
                <CardContent className="flex gap-4 p-5">
                  <Backpack className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                  <div>
                    <h3 className="font-semibold">Packing Tips</h3>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      {object.packing_tips.filter(Boolean).map((tip, i) => (
                        <li key={i}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
    </div>
  );
}
