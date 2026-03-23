"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { SEASONS } from "@/lib/constants";
import { OptionCard } from "./option-card";
import type { Season } from "@/types";

const SEASON_ICONS: Record<string, string> = {
  spring: "🌸",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️",
  flexible: "🗓️",
};

export function StepSeason() {
  const { season, setSeason } = useQuizStore();

  const options: { value: Season | "flexible"; label: string; months: string }[] = [
    ...SEASONS,
    { value: "flexible" as const, label: "Flexible", months: "I'm open to any time" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold">When are you thinking of going?</h2>
      <p className="mt-2 text-muted-foreground">
        Japan is stunning in every season — each offers something unique.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            description={opt.months}
            icon={SEASON_ICONS[opt.value]}
            selected={season === opt.value}
            onClick={() => setSeason(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
