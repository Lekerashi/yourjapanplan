"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { TRAVEL_STYLES } from "@/lib/constants";
import { OptionCard } from "./option-card";

const STYLE_ICONS: Record<string, string> = {
  solo: "🧳",
  couple: "💑",
  friends: "👯",
  family: "👨‍👩‍👧‍👦",
  workcation: "💻",
  honeymoon: "💍",
};

export function StepTravelStyle() {
  const { travelStyle, setTravelStyle } = useQuizStore();

  return (
    <div>
      <h2 className="text-2xl font-bold">Who are you traveling with?</h2>
      <p className="mt-2 text-muted-foreground">
        This helps us tailor recommendations to your group.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {TRAVEL_STYLES.map((style) => (
          <OptionCard
            key={style.value}
            label={style.label}
            description={style.description}
            icon={STYLE_ICONS[style.value]}
            selected={travelStyle === style.value}
            onClick={() => setTravelStyle(style.value)}
          />
        ))}
      </div>
    </div>
  );
}
