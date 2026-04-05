"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  AlertCircle,
} from "lucide-react";
import { getActivitiesForDestination } from "@/lib/data/seed-activities";
import { findRoute } from "@/lib/data/transport-routes";

type Step = "pick" | "build" | "review";

export default function NewItineraryPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [step, setStep] = useState<Step>("pick");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(!!editId);

  const store = useItineraryStore();
  const quiz = useQuizStore();

  // Load existing itinerary for editing
  useEffect(() => {
    if (!editId) return;

    fetch(`/api/itinerary?id=${editId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load itinerary");
        return res.json();
      })
      .then((data) => {
        const bs = data.preferences_snapshot?.builder_state;
        if (!bs) throw new Error("This itinerary cannot be edited");

        store.loadItinerary({
          id: data.id,
          shareToken: data.share_token,
          destinations: bs.destinations,
          builderDays: bs.builderDays,
          startDate: bs.startDate ?? data.start_date ?? null,
          preferences: {
            travelStyle:
              data.preferences_snapshot?.preferences?.travel_style ?? "solo",
            interests:
              data.preferences_snapshot?.preferences?.interests ?? [],
            season:
              data.preferences_snapshot?.preferences?.season ?? "spring",
            budget:
              data.preferences_snapshot?.preferences?.budget ?? "moderate",
            pace: data.preferences_snapshot?.preferences?.pace ?? "moderate",
            eveningPreference: bs.eveningPreference,
          },
        });
        setStep("build");
      })
      .catch(() => {
        setSaveError("Could not load itinerary for editing.");
      })
      .finally(() => setLoadingEdit(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

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
    setSaveError(null);
    try {
      const saveData = builderDaysToSaveFormat(store);
      const isEditing = !!store.editingId;
      const payload = {
        ...(isEditing ? { id: store.editingId } : {}),
        title: `${totalDays}-Day Japan Trip`,
        travel_style: travelStyle,
        season,
        duration_days: totalDays,
        budget,
        pace,
        interests,
        destinations: store.destinations,
        days: saveData.days,
        start_date: store.startDate ?? undefined,
        end_date: store.startDate
          ? new Date(
              new Date(store.startDate).getTime() +
                (totalDays - 1) * 86400000
            )
              .toISOString()
              .split("T")[0]
          : undefined,
        builder_state: {
          destinations: store.destinations,
          builderDays: store.builderDays,
          eveningPreference: store.eveningPreference,
          startDate: store.startDate,
        },
        jr_pass_recommended: saveData.jrPassRecommended,
        jr_pass_reasoning: saveData.jrPassReasoning,
        total_budget_estimate: saveData.budgetEstimate,
        packing_tips: [],
      };

      const res = await fetch("/api/itinerary", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setSaveError("Sign in to save your itinerary.");
        return;
      }

      if (!res.ok) {
        setSaveError("Something went wrong. Please try again.");
        return;
      }

      const data = await res.json();
      setSaved(true);
      const itineraryId = data.id ?? store.editingId;
      setShareUrl(`${window.location.origin}/itinerary/${itineraryId}/share`);
    } catch {
      setSaveError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Loading state for edit mode
  if (loadingEdit) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  // Step 1: Pick destinations
  if (step === "pick") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {editId ? "Edit Your Itinerary" : "Build Your Itinerary"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            Pick your destinations and set how many days at each, then build
            your day-by-day plan.
          </p>
        </div>

        {saveError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {saveError}
          </div>
        )}

        <div className="mt-8">
          <DestinationPicker />
        </div>

        {store.destinations.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={handleStartBuild}>
              <MapPin className="mr-2 h-4 w-4" />
              Build {totalDays}-Day Itinerary
            </Button>
            <Button variant="outline" render={<Link href="/quiz" />}>
              Adjust Preferences
            </Button>
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
              {store.editingId ? "Update Itinerary" : "Save Itinerary"}
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

      {saveError && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {saveError}
          {saveError.includes("Sign in") && (
            <Link href="/auth?next=/itinerary/new" className="underline">
              Sign in
            </Link>
          )}
        </div>
      )}
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

    // Sort activities by time-of-day, then calculate time slots
    const sorted = [...day.activities].sort((a, b) => {
      const order = { morning: 0, anytime: 1, afternoon: 2, evening: 3 };
      const aT = catalog.get(a.catalogId)?.best_time_of_day ?? "anytime";
      const bT = catalog.get(b.catalogId)?.best_time_of_day ?? "anytime";
      return (order[aT] ?? 1) - (order[bT] ?? 1);
    });

    let morningTime = 9 * 60;
    let afternoonTime = 13 * 60;
    let eveningTime = 18 * 60;

    const activities = sorted.map((a) => {
      const cat = catalog.get(a.catalogId);
      const tod = cat?.best_time_of_day ?? "anytime";
      const dur = cat?.duration_minutes ?? 60;

      let startMin: number;
      if (tod === "evening") { startMin = eveningTime; eveningTime += dur + 30; }
      else if (tod === "afternoon") { startMin = afternoonTime; afternoonTime += dur + 30; }
      else { startMin = morningTime; morningTime += dur + 30; }

      const time = `${String(Math.floor(startMin / 60)).padStart(2, "0")}:${String(startMin % 60).padStart(2, "0")}`;
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
