"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { TRAVEL_STYLES } from "@/lib/constants";
import { OptionCard } from "./option-card";

export function StepTravelStyle() {
  const { travelStyle, setTravelStyle } = useQuizStore();

  return (
    <div
      role="radiogroup"
      aria-label="Travel style"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {TRAVEL_STYLES.map((style, i) => (
        <OptionCard
          key={style.value}
          label={style.label}
          description={style.description}
          index={i}
          selected={travelStyle === style.value}
          onClick={() => setTravelStyle(style.value)}
        />
      ))}
    </div>
  );
}
