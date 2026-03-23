"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { OptionCard } from "./option-card";

const DURATION_OPTIONS = [
  { days: 5, label: "3–5 days", icon: "⚡", description: "Quick trip" },
  { days: 7, label: "1 week", icon: "📅", description: "The classic trip" },
  { days: 10, label: "10 days", icon: "🗾", description: "Deeper exploration" },
  { days: 14, label: "2 weeks", icon: "🎌", description: "See multiple regions" },
  { days: 21, label: "3 weeks", icon: "🏯", description: "The grand tour" },
  { days: 30, label: "1 month+", icon: "🌏", description: "Extended stay" },
];

export function StepDuration() {
  const { durationDays, setDurationDays } = useQuizStore();

  return (
    <div>
      <h2 className="text-2xl font-bold">How long is your trip?</h2>
      <p className="mt-2 text-muted-foreground">
        Pick the closest option. We&apos;ll tailor the number of destinations to
        fit.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {DURATION_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.days}
            label={opt.label}
            description={opt.description}
            icon={opt.icon}
            selected={durationDays === opt.days}
            onClick={() => setDurationDays(opt.days)}
          />
        ))}
      </div>
    </div>
  );
}
