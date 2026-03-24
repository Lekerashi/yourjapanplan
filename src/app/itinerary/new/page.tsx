"use client";

import { useState } from "react";
import { useItineraryStore } from "@/stores/itinerary-store";
import { useQuizStore } from "@/stores/quiz-store";
import { DestinationPicker } from "@/components/itinerary/destination-picker";
import { ItineraryBuilder } from "@/components/itinerary/itinerary-builder";
import { ItineraryDayCard } from "@/components/itinerary/itinerary-day-card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  Share2,
  Check,
  Loader2,
  MapPin,
} from "lucide-react";
import { getActivitiesForDestination } from "@/lib/data/seed-activities";
import { findRoute } from "@/lib/data/transport-routes";

type Step = "pick" | "build" | "review";

export default function NewItineraryPage() {
  const [step, setStep] = useState<Step>("pick");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const store = useItineraryStore();
  const quiz = useQuizStore();

  const travelStyle = store.travelStyle ?? quiz.travelStyle ?? "solo";
  const interests =
    store.interests.length > 0
      ? store.interests
      : quiz.interests.length > 0
        ? quiz.interests
        : ["food", "culture"];
  const season = store.season ?? quiz.season ?? "spring";
  const budget = store.budget ?? quiz.budget ?? "moderate";
  const pace = store.pace ?? quiz.pace ?? "moderate";
  const totalDays = store.destinations.reduce((sum, d) => sum + d.days, 0);

  const handleStartBuild = () => {
    if (store.destinations.length === 0) return;
    store.initializeBuilder();
    setStep("build");
  };

  const handleReview = () => {
    setStep("review");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const saveData = builderDaysToSaveFormat(store);
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${totalDays}-Day Japan Trip`,
          travel_style: travelStyle,
          season,
          duration_days: totalDays,
          budget,
          pace,
          interests,
          destinations: store.destinations,
          days: saveData.days,
          jr_pass_recommended: saveData.jrPassRecommended,
          jr_pass_reasoning: saveData.jrPassReasoning,
          total_budget_estimate: saveData.budgetEstimate,
          packing_tips: [],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(true);
        setShareUrl(`${window.location.origin}/itinerary/${data.id}/share`);
      }
    } finally {
      setSaving(false);
    }
  };

  // Step 1: Pick destinations
  if (step === "pick") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Build Your Itinerary
          </h1>
          <p className="mt-3 text-muted-foreground">
            Pick your destinations and set how many days at each, then build
            your day-by-day plan.
          </p>
        </div>

        <div className="mt-8">
          <DestinationPicker />
        </div>

        {store.destinations.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <Button size="lg" onClick={handleStartBuild}>
              <MapPin className="mr-2 h-4 w-4" />
              Build {totalDays}-Day Itinerary
            </Button>
            <p className="text-xs text-muted-foreground">
              {travelStyle} / {budget} budget / {pace} pace / {season}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Interactive builder
  if (step === "build") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2"
            onClick={() => setStep("pick")}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleReview}>
            Review & Save
          </Button>
        </div>

        <ItineraryBuilder />
      </div>
    );
  }

  // Step 3: Review & Save
  const reviewDays = builderDaysToReviewFormat(store);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 -ml-2"
        onClick={() => setStep("build")}
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to Builder
      </Button>

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Your {totalDays}-Day Japan Itinerary
      </h1>

      <div className="mt-8 space-y-6">
        {reviewDays.map((day) => (
          <ItineraryDayCard key={day.day_number} day={day} />
        ))}
      </div>

      {/* Save / Share */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button onClick={handleSave} disabled={saving || saved}>
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Itinerary
            </>
          )}
        </Button>

        {shareUrl && (
          <Button
            variant="outline"
            onClick={() => navigator.clipboard.writeText(shareUrl)}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Copy Share Link
          </Button>
        )}
      </div>
    </div>
  );
}

// Convert builder state to the format used by ItineraryDayCard for review
function builderDaysToReviewFormat(
  store: ReturnType<typeof useItineraryStore.getState>
) {
  return store.builderDays.map((day) => {
    const dest = store.destinations.find((d) => d.slug === day.destinationSlug);
    const catalog = new Map(
      getActivitiesForDestination(day.destinationSlug).map((a) => [a.id, a])
    );

    let currentMinutes = 9 * 60;
    const activities = day.activities.map((a) => {
      const cat = catalog.get(a.catalogId);
      const time = `${String(Math.floor(currentMinutes / 60)).padStart(2, "0")}:${String(currentMinutes % 60).padStart(2, "0")}`;
      currentMinutes += (cat?.duration_minutes ?? 60) + 30;
      return {
        time,
        title: a.customName ?? cat?.name ?? "Activity",
        description: a.customDescription ?? cat?.description ?? "",
        duration_minutes: cat?.duration_minutes ?? 60,
        reservation_required: cat?.reservation_required ?? false,
        cost_estimate: cat?.cost_estimate ?? "",
        tip: cat?.insider_tip ?? null,
      };
    });

    // Find transport to next destination
    const dayIndex = store.builderDays.indexOf(day);
    const nextDay = store.builderDays[dayIndex + 1];
    let transport = null;
    if (nextDay && nextDay.destinationSlug !== day.destinationSlug) {
      const route = findRoute(day.destinationSlug, nextDay.destinationSlug);
      if (route) {
        transport = {
          from: route.from_name,
          to: route.to_name,
          method: route.primary_method,
          duration: route.duration,
          cost: route.cost_display,
          tip: route.tip,
        };
      }
    }

    return {
      day_number: day.dayNumber,
      destination_name: dest?.name ?? day.destinationSlug,
      theme: `Day ${day.dayNumber} in ${dest?.name ?? day.destinationSlug}`,
      activities,
      transport,
      accommodation: day.accommodation
        ? {
            name: `${day.accommodation.type} in ${day.accommodation.zone}`,
            area: day.accommodation.zone,
            type: day.accommodation.type,
            reasoning: day.accommodation.reasoning,
          }
        : undefined,
    };
  });
}

// Convert builder state to the save API format
function builderDaysToSaveFormat(
  store: ReturnType<typeof useItineraryStore.getState>
) {
  const days = builderDaysToReviewFormat(store);

  // Simple JR pass analysis
  let jrTotal = 0;
  for (let i = 0; i < store.builderDays.length - 1; i++) {
    const curr = store.builderDays[i];
    const next = store.builderDays[i + 1];
    if (curr.destinationSlug !== next.destinationSlug) {
      const route = findRoute(curr.destinationSlug, next.destinationSlug);
      if (route?.jr_pass_covered) jrTotal += route.cost_jpy;
    }
  }
  const jrPassRecommended = jrTotal > 50000;

  // Budget estimate
  let totalBudget = 0;
  for (const day of store.builderDays) {
    for (const a of day.activities) {
      const cat = getActivitiesForDestination(day.destinationSlug).find(
        (c) => c.id === a.catalogId
      );
      if (cat) {
        const match = cat.cost_estimate.match(/[\d,]+/);
        if (match) totalBudget += parseInt(match[0].replace(/,/g, ""), 10);
      }
    }
  }

  return {
    days,
    jrPassRecommended,
    jrPassReasoning: jrPassRecommended
      ? `Your JR-covered routes total ~¥${jrTotal.toLocaleString()}, making the pass a good value.`
      : `Your JR-covered routes total ~¥${jrTotal.toLocaleString()}, which may not justify the pass cost.`,
    budgetEstimate: `~¥${totalBudget.toLocaleString()} (activities only)`,
  };
}
