"use client";

import { useEffect, useRef } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recommendationResponseSchema } from "@/lib/ai/schemas";
import type { RecommendationResponse } from "@/lib/ai/schemas";
import { useQuizStore } from "@/stores/quiz-store";
import { RecommendationCard } from "./recommendation-card";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Train, CalendarCheck, Route } from "lucide-react";
import Link from "next/link";

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
          <Button render={<Link href="/itinerary/new" />}>
            Build My Itinerary
          </Button>
          <Button render={<Link href="/quiz" />} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Adjust Preferences
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
