"use client";

import { useState } from "react";
import { useItineraryStore } from "@/stores/itinerary-store";
import { useQuizStore } from "@/stores/quiz-store";
import { DestinationPicker } from "@/components/itinerary/destination-picker";
import { ItineraryTimeline } from "@/components/itinerary/itinerary-timeline";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NewItineraryPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const store = useItineraryStore();
  const quiz = useQuizStore();

  // Pre-fill preferences from quiz if available
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

  const handleGenerate = () => {
    if (store.destinations.length === 0) return;
    setIsGenerating(true);
  };

  if (isGenerating) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2"
          onClick={() => setIsGenerating(false)}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to destination selection
        </Button>

        <ItineraryTimeline
          params={{
            travelStyle,
            interests,
            season,
            durationDays: totalDays,
            budget,
            pace,
            destinations: store.destinations,
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Build Your Itinerary
        </h1>
        <p className="mt-3 text-muted-foreground">
          Pick your destinations and set how many days at each, then our AI will
          build a detailed day-by-day plan.
        </p>
      </div>

      <div className="mt-8">
        <DestinationPicker />
      </div>

      {/* Generate button */}
      {store.destinations.length > 0 && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <Button size="lg" onClick={handleGenerate}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate {totalDays}-Day Itinerary
          </Button>
          <p className="text-xs text-muted-foreground">
            Using your preferences: {travelStyle} / {budget} budget / {pace}{" "}
            pace / {season}
          </p>
        </div>
      )}
    </div>
  );
}
