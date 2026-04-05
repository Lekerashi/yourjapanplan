"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { BUDGET_LEVELS, TRIP_PACES, EVENING_PREFERENCES } from "@/lib/constants";
import { OptionCard } from "./option-card";

const BUDGET_ICONS: Record<string, string> = {
  budget: "🪙",
  moderate: "💴",
  luxury: "💎",
};

const PACE_ICONS: Record<string, string> = {
  relaxed: "🧘",
  moderate: "🚶",
  packed: "🏃",
};

const EVENING_ICONS: Record<string, string> = {
  early: "🌙",
  moderate: "🕐",
  nightowl: "🦉",
};

const CROWD_OPTIONS = [
  { value: "low" as const, label: "Avoid crowds", icon: "🏞️", description: "Off the beaten path" },
  { value: "medium" as const, label: "Don't mind", icon: "🚶‍♂️", description: "A mix is fine" },
  { value: "high" as const, label: "Bring it on", icon: "🎆", description: "I want the energy" },
];

export function StepPreferences() {
  const { budget, setBudget, pace, setPace, crowdTolerance, setCrowdTolerance, eveningPreference, setEveningPreference } =
    useQuizStore();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold">What&apos;s your budget?</h2>
        <p className="mt-2 text-muted-foreground">
          This shapes accommodation and dining recommendations.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {BUDGET_LEVELS.map((level) => (
            <OptionCard
              key={level.value}
              label={level.label}
              description={level.description}
              icon={BUDGET_ICONS[level.value]}
              selected={budget === level.value}
              onClick={() => setBudget(level.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold">What pace do you prefer?</h2>
        <p className="mt-2 text-muted-foreground">
          How packed should each day be?
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {TRIP_PACES.map((p) => (
            <OptionCard
              key={p.value}
              label={p.label}
              description={p.description}
              icon={PACE_ICONS[p.value]}
              selected={pace === p.value}
              onClick={() => setPace(p.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold">How do you feel about crowds?</h2>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {CROWD_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              icon={opt.icon}
              selected={crowdTolerance === opt.value}
              onClick={() => setCrowdTolerance(opt.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold">How late do you want to stay out?</h2>
        <p className="mt-2 text-muted-foreground">
          This shapes your evening schedule and nightlife recommendations.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {EVENING_PREFERENCES.map((pref) => (
            <OptionCard
              key={pref.value}
              label={pref.label}
              description={pref.description}
              icon={EVENING_ICONS[pref.value]}
              selected={eveningPreference === pref.value}
              onClick={() => setEveningPreference(pref.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
