"use client";

import { useRouter } from "next/navigation";
import { useQuizStore, QUIZ_STEPS } from "@/stores/quiz-store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { StepTravelStyle } from "./step-travel-style";
import { StepInterests } from "./step-interests";
import { StepSeason } from "./step-season";
import { StepDuration } from "./step-duration";
import { StepPreferences } from "./step-preferences";
import { StepAboutYou } from "./step-about-you";

const STEP_COMPONENTS = [
  StepTravelStyle,
  StepInterests,
  StepSeason,
  StepDuration,
  StepPreferences,
  StepAboutYou,
];

function canProceed(step: number, state: ReturnType<typeof useQuizStore.getState>): boolean {
  switch (step) {
    case 0:
      return state.travelStyle !== null;
    case 1:
      return state.interests.length >= 2;
    case 2:
      return state.season !== null;
    case 3:
      return state.durationDays > 0;
    case 4:
      return state.budget !== null && state.pace !== null && state.crowdTolerance !== null && state.eveningPreference !== null;
    case 5:
      return state.firstTime !== null;
    default:
      return false;
  }
}

export function QuizShell() {
  const router = useRouter();
  const store = useQuizStore();
  const { currentStep, nextStep, prevStep } = store;

  const StepComponent = STEP_COMPONENTS[currentStep];
  const isLastStep = currentStep === QUIZ_STEPS.length - 1;
  const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;
  const canContinue = canProceed(currentStep, store);

  function handleNext() {
    if (isLastStep) {
      // Serialize quiz state to URL params and navigate to results
      const params = new URLSearchParams({
        style: store.travelStyle!,
        interests: store.interests.join(","),
        season: store.season!,
        days: String(store.durationDays),
        budget: store.budget!,
        pace: store.pace!,
        crowd: store.crowdTolerance!,
        evening: store.eveningPreference!,
        firstTime: String(store.firstTime),
      });
      if (store.mustVisit.length > 0) {
        params.set("mustVisit", store.mustVisit.join(","));
      }
      router.push(`/quiz/results?${params.toString()}`);
    } else {
      nextStep();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {/* Progress */}
      <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Step {currentStep + 1} of {QUIZ_STEPS.length}
        </span>
        <span>{QUIZ_STEPS[currentStep].label}</span>
      </div>
      <Progress value={progress} className="mb-10 h-2" />

      {/* Current step */}
      <StepComponent />

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button onClick={handleNext} disabled={!canContinue}>
          {isLastStep ? (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Get Recommendations
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
