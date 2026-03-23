"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { OptionCard } from "./option-card";

export function StepAboutYou() {
  const { firstTime, setFirstTime } = useQuizStore();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold">Is this your first time in Japan?</h2>
        <p className="mt-2 text-muted-foreground">
          First-timers get extra tips on navigating trains, etiquette, and
          must-sees. Repeat visitors get deeper, off-the-radar picks.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 max-w-md">
          <OptionCard
            label="First time"
            icon="✈️"
            description="Show me the essentials"
            selected={firstTime === true}
            onClick={() => setFirstTime(true)}
          />
          <OptionCard
            label="Been before"
            icon="🔄"
            description="Surprise me with new spots"
            selected={firstTime === false}
            onClick={() => setFirstTime(false)}
          />
        </div>
      </div>
    </div>
  );
}
