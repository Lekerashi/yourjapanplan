"use client";

import { useQuizStore } from "@/stores/quiz-store";
import {
  BUDGET_LEVELS,
  TRIP_PACES,
  EVENING_PREFERENCES,
} from "@/lib/constants";
import { OptionCard } from "./option-card";

const CROWD_OPTIONS = [
  {
    value: "low" as const,
    label: "Avoid crowds",
    description: "Off the beaten path, quieter neighbourhoods.",
  },
  {
    value: "medium" as const,
    label: "Don't mind",
    description: "A mix of popular and less-trafficked.",
  },
  {
    value: "high" as const,
    label: "Bring it on",
    description: "The energy of Shibuya, Dotonbori, Harajuku.",
  },
];

function SubSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border pt-8 first:border-t-0 first:pt-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-[22px] font-medium tracking-[-0.01em] text-foreground">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function StepPreferences() {
  const {
    budget,
    setBudget,
    pace,
    setPace,
    crowdTolerance,
    setCrowdTolerance,
    eveningPreference,
    setEveningPreference,
  } = useQuizStore();

  return (
    <div className="flex flex-col gap-10">
      <SubSection eyebrow="Budget" title="What are you spending?">
        <div
          role="radiogroup"
          aria-label="Budget"
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {BUDGET_LEVELS.map((level, i) => (
            <OptionCard
              key={level.value}
              label={level.label}
              description={level.description}
              index={i}
              selected={budget === level.value}
              onClick={() => setBudget(level.value)}
            />
          ))}
        </div>
      </SubSection>

      <SubSection eyebrow="Pace" title="How full do you want each day?">
        <div
          role="radiogroup"
          aria-label="Pace"
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {TRIP_PACES.map((p, i) => (
            <OptionCard
              key={p.value}
              label={p.label}
              description={p.description}
              index={i}
              selected={pace === p.value}
              onClick={() => setPace(p.value)}
            />
          ))}
        </div>
      </SubSection>

      <SubSection eyebrow="Crowds" title="How do you feel about crowds?">
        <div
          role="radiogroup"
          aria-label="Crowd tolerance"
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {CROWD_OPTIONS.map((opt, i) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              index={i}
              selected={crowdTolerance === opt.value}
              onClick={() => setCrowdTolerance(opt.value)}
            />
          ))}
        </div>
      </SubSection>

      <SubSection eyebrow="Evenings" title="How late do you like to stay out?">
        <div
          role="radiogroup"
          aria-label="Evening preference"
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {EVENING_PREFERENCES.map((pref, i) => (
            <OptionCard
              key={pref.value}
              label={pref.label}
              description={pref.description}
              index={i}
              selected={eveningPreference === pref.value}
              onClick={() => setEveningPreference(pref.value)}
            />
          ))}
        </div>
      </SubSection>
    </div>
  );
}
