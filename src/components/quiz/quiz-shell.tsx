"use client";

import { useRouter } from "next/navigation";
import { useQuizStore, QUIZ_STEPS } from "@/stores/quiz-store";
import { Button } from "@/components/ui/button";
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

function canProceed(
  step: number,
  state: ReturnType<typeof useQuizStore.getState>,
): boolean {
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
      return (
        state.budget !== null &&
        state.pace !== null &&
        state.crowdTolerance !== null &&
        state.eveningPreference !== null
      );
    case 5:
      return state.firstTime !== null;
    default:
      return false;
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function QuizShell() {
  const router = useRouter();
  const store = useQuizStore();
  const { currentStep, nextStep, prevStep } = store;

  const StepComponent = STEP_COMPONENTS[currentStep];
  const step = QUIZ_STEPS[currentStep];
  const isLastStep = currentStep === QUIZ_STEPS.length - 1;
  const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;
  const canContinue = canProceed(currentStep, store);

  function handleNext() {
    if (isLastStep) {
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
    <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-[clamp(48px,8vw,96px)]">
      <div className="grid gap-[clamp(32px,5vw,64px)] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="text-[12px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Question{" "}
            <span className="text-foreground">{pad(currentStep + 1)}</span> of{" "}
            {pad(QUIZ_STEPS.length)}
          </div>
          <div
            className="mt-3 h-0.5 w-full bg-border"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-accent transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h1 className="mt-8 font-display text-[clamp(30px,4vw,48px)] font-medium leading-[1.05] tracking-[-0.015em] text-foreground">
            {step.question}
          </h1>
          <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-ink-2">
            {step.explainer}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button onClick={handleNext} disabled={!canContinue}>
              {isLastStep ? "See the plan" : "Continue"}
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M13 8H3M7 4L3 8l4 4" />
              </svg>
              Back
            </Button>
          </div>
        </aside>

        <div>
          <StepComponent />
        </div>
      </div>
    </div>
  );
}
