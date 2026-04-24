"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { OptionCard } from "./option-card";

export function StepAboutYou() {
  const { firstTime, setFirstTime } = useQuizStore();

  return (
    <div
      role="radiogroup"
      aria-label="First time in Japan"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <OptionCard
        label="First time"
        description="Show me the essentials and the etiquette you wish someone told you."
        index={0}
        selected={firstTime === true}
        onClick={() => setFirstTime(true)}
      />
      <OptionCard
        label="Been before"
        description="I've done the classics. Surprise me with off-the-radar picks."
        index={1}
        selected={firstTime === false}
        onClick={() => setFirstTime(false)}
      />
    </div>
  );
}
