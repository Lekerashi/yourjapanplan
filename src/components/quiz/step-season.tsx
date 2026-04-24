"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { SEASONS } from "@/lib/constants";
import { OptionCard } from "./option-card";
import type { Season } from "@/types";

export function StepSeason() {
  const { season, setSeason } = useQuizStore();

  const options: { value: Season | "flexible"; label: string; months: string }[] =
    [
      ...SEASONS,
      {
        value: "flexible" as const,
        label: "Flexible",
        months: "I'm open to any time",
      },
    ];

  return (
    <div
      role="radiogroup"
      aria-label="Season"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {options.map((opt, i) => (
        <OptionCard
          key={opt.value}
          label={opt.label}
          description={opt.months}
          index={i}
          selected={season === opt.value}
          onClick={() => setSeason(opt.value)}
        />
      ))}
    </div>
  );
}
