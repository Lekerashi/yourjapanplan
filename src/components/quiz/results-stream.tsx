"use client";

import { useEffect, useRef } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recommendationResponseSchema } from "@/lib/ai/schemas";
import type { RecommendationResponse } from "@/lib/ai/schemas";
import { useQuizStore } from "@/stores/quiz-store";
import { useItineraryStore } from "@/stores/itinerary-store";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { RecommendationCard } from "./recommendation-card";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Train, CalendarCheck, Route } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DEST_COORDS: Record<string, [number, number]> = {
  sapporo: [43.06, 141.35], niseko: [42.86, 140.69], "furano-biei": [43.34, 142.38],
  sendai: [38.27, 140.87], tokyo: [35.68, 139.69], kamakura: [35.32, 139.55],
  nikko: [36.75, 139.6], hakone: [35.23, 139.11], "mt-fuji": [35.36, 138.73],
  matsumoto: [36.24, 137.97], kanazawa: [36.56, 136.65], nagoya: [35.18, 136.91],
  takayama: [36.14, 137.25], "shirakawa-go": [36.26, 136.91], ito: [34.97, 139.1],
  kyoto: [35.01, 135.77], osaka: [34.69, 135.5], nara: [34.69, 135.8],
  kobe: [34.69, 135.19], koyasan: [34.21, 135.6], hiroshima: [34.4, 132.46],
  onomichi: [34.41, 133.2], naoshima: [34.46, 133.99], fukuoka: [33.59, 130.4],
  beppu: [33.28, 131.49], yakushima: [30.35, 130.51], "okinawa-main": [26.33, 127.8],
};

interface ResultsStreamProps {
  quizParams: {
    travelStyle: string;
    interests: string[];
    season: string;
    durationDays: number;
    budget: string;
    pace: string;
    crowdTolerance: string;
    eveningPreference: string;
    firstTime: boolean;
    mustVisit: string[];
  };
}

export function ResultsStream({ quizParams }: ResultsStreamProps) {
  const submittedRef = useRef(false);
  const cachedResults = useQuizStore((s) => s.cachedResults);
  const setCachedResults = useQuizStore((s) => s.setCachedResults);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/ai/recommend",
    schema: recommendationResponseSchema,
  });

  // Cache results when streaming completes
  const prevLoadingRef = useRef(isLoading);
  useEffect(() => {
    if (prevLoadingRef.current && !isLoading && object) {
      const complete = object as RecommendationResponse;
      if (complete.recommendations?.length) {
        setCachedResults(complete);
      }
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading, object, setCachedResults]);

  // Use cached results or start streaming
  useEffect(() => {
    if (!submittedRef.current && !cachedResults) {
      submittedRef.current = true;
      submit(quizParams);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pick data source: cached or streaming
  const data = cachedResults ?? object;
  const streamingActive = !cachedResults && isLoading;

  if (error && !cachedResults) {
    return (
      <div className="mx-auto max-w-2xl text-center py-20">
        <p className="text-lg font-semibold text-destructive">
          Something went wrong generating your recommendations.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "Please try again."}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => submit(quizParams)}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  const recommendations = data?.recommendations ?? [];
  const hasRecommendations = recommendations.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Your Japan Plan
        </h1>
        <p className="mt-3 text-muted-foreground">
          {streamingActive && !hasRecommendations
            ? "Analyzing your preferences and finding the perfect destinations..."
            : `Here are ${recommendations.length} perfect destinations for your ${quizParams.durationDays}-day ${quizParams.season === "flexible" ? "" : quizParams.season + " "}trip`}
        </p>
      </div>

      {/* Loading skeleton */}
      {streamingActive && !hasRecommendations && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Planning your perfect trip...
          </p>
        </div>
      )}

      {/* Recommendation cards */}
      {hasRecommendations && (
        <div className="mt-10 space-y-4">
          {recommendations.map((rec, i) =>
            rec ? (
              <RecommendationCard
                key={rec.destination_slug ?? i}
                recommendation={rec}
                rank={i + 1}
              />
            ) : null
          )}
        </div>
      )}

      {/* Trip flow, seasonal tip, JR pass */}
      {(data?.trip_flow || data?.seasonal_tip || data?.jr_pass_initial_take) && (
        <>
          <Separator className="my-10" />
          <div className="space-y-6">
            {data.trip_flow && (
              <Card>
                <CardContent className="flex gap-4 p-5">
                  <Route className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                  <div>
                    <h3 className="font-semibold">Suggested Route</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {data.trip_flow}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {data.seasonal_tip && (
              <Card>
                <CardContent className="flex gap-4 p-5">
                  <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                  <div>
                    <h3 className="font-semibold">Seasonal Tip</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {data.seasonal_tip}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {data.jr_pass_initial_take && (
              <Card>
                <CardContent className="flex gap-4 p-5">
                  <Train className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                  <div>
                    <h3 className="font-semibold">JR Pass</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {data.jr_pass_initial_take}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Actions */}
      {!streamingActive && hasRecommendations && (
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <BuildItineraryButton recommendations={recommendations} quizParams={quizParams} />
          <Button
            variant="outline"
            onClick={() => {
              useQuizStore.getState().setCachedResults(null as unknown as RecommendationResponse);
            }}
            render={<Link href="/quiz" />}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Edit Preferences
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              useQuizStore.getState().reset();
            }}
            render={<Link href="/quiz" />}
          >
            Retake Quiz
          </Button>
        </div>
      )}

      {streamingActive && hasRecommendations && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Still generating...
        </div>
      )}
    </div>
  );
}

/** Sort destinations into a geographic route via nearest-neighbor from the easternmost city */
function sortGeographic<T extends { slug: string }>(
  dests: T[],
  coords: Record<string, [number, number]>
): T[] {
  if (dests.length <= 1) return dests;

  const dist = (a: string, b: string) => {
    const [lat1, lng1] = coords[a] ?? [0, 0];
    const [lat2, lng2] = coords[b] ?? [0, 0];
    return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
  };

  // Start from the easternmost destination (highest longitude)
  const remaining = [...dests];
  remaining.sort((a, b) => (coords[b.slug]?.[1] ?? 0) - (coords[a.slug]?.[1] ?? 0));
  const result: T[] = [remaining.shift()!];

  while (remaining.length > 0) {
    const last = result[result.length - 1].slug;
    let nearest = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = dist(last, remaining[i].slug);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    }
    result.push(remaining.splice(nearest, 1)[0]);
  }

  return result;
}

function BuildItineraryButton({
  recommendations,
  quizParams,
}: {
  recommendations: ({ destination_slug?: string; suggested_days?: number } | undefined)[];
  quizParams: ResultsStreamProps["quizParams"];
}) {
  const router = useRouter();
  const store = useItineraryStore;

  const handleClick = () => {
    // Reset builder state
    store.getState().reset();

    // Build destination list from quiz recommendations
    const recs = recommendations.filter(
      (r): r is NonNullable<typeof r> => !!r?.destination_slug
    );
    const destList = recs
      .map((rec) => {
        const dest = SEED_DESTINATIONS.find((d) => d.slug === rec.destination_slug);
        return dest ? { slug: dest.slug, name: dest.name, days: rec.suggested_days ?? 2 } : null;
      })
      .filter((d): d is NonNullable<typeof d> => !!d);

    // Sort into a geographic route using nearest-neighbor from easternmost city
    const sorted = sortGeographic(destList, DEST_COORDS);

    for (const dest of sorted) {
      store.getState().addDestination(dest);
    }

    // Set preferences from quiz params
    store.getState().setPreferences({
      travelStyle: quizParams.travelStyle,
      interests: quizParams.interests,
      season: quizParams.season,
      durationDays: quizParams.durationDays,
      budget: quizParams.budget,
      pace: quizParams.pace,
      eveningPreference: quizParams.eveningPreference,
    });

    router.push("/itinerary/new?from=quiz");
  };

  return (
    <Button onClick={handleClick}>
      Build My Itinerary
    </Button>
  );
}
