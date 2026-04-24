"use client";

import { useEffect, useRef } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recommendationResponseSchema } from "@/lib/ai/schemas";
import type { RecommendationResponse } from "@/lib/ai/schemas";
import { useQuizStore } from "@/stores/quiz-store";
import { useItineraryStore } from "@/stores/itinerary-store";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { RecommendationCard } from "./recommendation-card";
import { Button } from "@/components/ui/button";
import { SectionHead } from "@/components/home/section-head";
import { Loader2, RotateCcw } from "lucide-react";
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

function InsightCard({
  eyebrow,
  body,
}: {
  eyebrow: string;
  body: string;
}) {
  return (
    <div className="border border-border bg-card p-6">
      <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
        {eyebrow}
      </p>
      <p className="mt-3 text-[15px] leading-[1.6] text-ink-2">{body}</p>
    </div>
  );
}

export function ResultsStream({ quizParams }: ResultsStreamProps) {
  const submittedRef = useRef(false);
  const cachedResults = useQuizStore((s) => s.cachedResults);
  const setCachedResults = useQuizStore((s) => s.setCachedResults);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/ai/recommend",
    schema: recommendationResponseSchema,
  });

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

  useEffect(() => {
    if (!submittedRef.current && !cachedResults) {
      submittedRef.current = true;
      submit(quizParams);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const data = cachedResults ?? object;
  const streamingActive = !cachedResults && isLoading;

  if (error && !cachedResults) {
    return (
      <div className="mx-auto max-w-[720px] px-[clamp(20px,4vw,40px)] py-20 text-center">
        <p className="font-display text-[clamp(24px,3vw,32px)] font-medium tracking-[-0.01em] text-foreground">
          Something went wrong.
        </p>
        <p className="mt-3 text-[14px] text-ink-2">
          {error.message || "Please try again."}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => submit(quizParams)}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  const recommendations = data?.recommendations ?? [];
  const hasRecommendations = recommendations.length > 0;
  const seasonText =
    quizParams.season === "flexible" ? "" : `${quizParams.season} `;

  return (
    <div className="mx-auto max-w-[1000px] px-[clamp(20px,4vw,40px)] py-[clamp(48px,8vw,96px)]">
      <SectionHead
        eyebrow="Your plan"
        title={
          <>
            Japan,{" "}
            <span className="font-display italic font-normal text-accent">
              shaped around you.
            </span>
          </>
        }
        lede={
          streamingActive && !hasRecommendations
            ? "Reading your answers and pairing them with the catalog…"
            : `${recommendations.length} cities for your ${quizParams.durationDays}-day ${seasonText}trip, in the order we'd string them together.`
        }
      />

      {streamingActive && !hasRecommendations && (
        <div className="mt-14 flex flex-col items-center gap-4">
          <Loader2 className="h-7 w-7 animate-spin text-accent" />
          <p className="text-[13px] uppercase tracking-[0.15em] text-muted-foreground">
            Planning your trip
          </p>
        </div>
      )}

      {hasRecommendations && (
        <div className="mt-10 flex flex-col gap-4">
          {recommendations.map((rec, i) =>
            rec ? (
              <RecommendationCard
                key={rec.destination_slug ?? i}
                recommendation={rec}
                rank={i + 1}
              />
            ) : null,
          )}
        </div>
      )}

      {(data?.trip_flow ||
        data?.seasonal_tip ||
        data?.jr_pass_initial_take) && (
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {data.trip_flow && (
            <InsightCard eyebrow="Suggested route" body={data.trip_flow} />
          )}
          {data.seasonal_tip && (
            <InsightCard eyebrow="Seasonal tip" body={data.seasonal_tip} />
          )}
          {data.jr_pass_initial_take && (
            <InsightCard
              eyebrow="JR Pass"
              body={data.jr_pass_initial_take}
            />
          )}
        </div>
      )}

      {!streamingActive && hasRecommendations && (
        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8">
          <BuildItineraryButton
            recommendations={recommendations}
            quizParams={quizParams}
          />
          <Button
            variant="outline"
            render={<Link href="/quiz" />}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Edit preferences
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              useQuizStore.getState().reset();
            }}
            render={<Link href="/quiz" />}
          >
            Retake quiz
          </Button>
        </div>
      )}

      {streamingActive && hasRecommendations && (
        <div className="mt-6 flex items-center justify-center gap-2 text-[13px] uppercase tracking-[0.15em] text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Still generating
        </div>
      )}
    </div>
  );
}

function sortGeographic<T extends { slug: string }>(
  dests: T[],
  coords: Record<string, [number, number]>,
): T[] {
  if (dests.length <= 1) return dests;

  const dist = (a: string, b: string) => {
    const [lat1, lng1] = coords[a] ?? [0, 0];
    const [lat2, lng2] = coords[b] ?? [0, 0];
    return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
  };

  const remaining = [...dests];
  remaining.sort(
    (a, b) => (coords[b.slug]?.[1] ?? 0) - (coords[a.slug]?.[1] ?? 0),
  );
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
  recommendations: (
    | { destination_slug?: string; suggested_days?: number }
    | undefined
  )[];
  quizParams: ResultsStreamProps["quizParams"];
}) {
  const router = useRouter();
  const store = useItineraryStore;

  const handleClick = () => {
    store.getState().reset();

    const recs = recommendations.filter(
      (r): r is NonNullable<typeof r> => !!r?.destination_slug,
    );
    const destList = recs
      .map((rec) => {
        const dest = SEED_DESTINATIONS.find(
          (d) => d.slug === rec.destination_slug,
        );
        return dest
          ? { slug: dest.slug, name: dest.name, days: rec.suggested_days ?? 2 }
          : null;
      })
      .filter((d): d is NonNullable<typeof d> => !!d);

    const sorted = sortGeographic(destList, DEST_COORDS);

    for (const dest of sorted) {
      store.getState().addDestination(dest);
    }

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

  return <Button onClick={handleClick}>Build my itinerary</Button>;
}
