"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { OptionCard } from "./option-card";

const DURATION_OPTIONS = [
  { days: 5, label: "3–5 days", description: "A quick dip — one or two cities." },
  { days: 7, label: "1 week", description: "The classic trip. Two or three stops." },
  { days: 10, label: "10 days", description: "Room to breathe between cities." },
  { days: 14, label: "2 weeks", description: "Two regions with day trips between." },
  { days: 21, label: "3 weeks", description: "A grand loop through the country." },
  { days: 30, label: "A month or more", description: "Slow travel with overnight detours." },
];

export function StepDuration() {
  const { durationDays, setDurationDays } = useQuizStore();

  return (
    <div
      role="radiogroup"
      aria-label="Duration"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {DURATION_OPTIONS.map((opt, i) => (
        <OptionCard
          key={opt.days}
          label={opt.label}
          description={opt.description}
          index={i}
          selected={durationDays === opt.days}
          onClick={() => setDurationDays(opt.days)}
        />
      ))}
    </div>
  );
}
