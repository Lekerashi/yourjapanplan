"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { INTEREST_TAGS } from "@/lib/constants";
import { OptionCard } from "./option-card";

export function StepInterests() {
  const { interests, toggleInterest } = useQuizStore();

  return (
    <div>
      <h2 className="text-2xl font-bold">What are you into?</h2>
      <p className="mt-2 text-muted-foreground">
        Pick everything that sounds good. Select at least 2.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {INTEREST_TAGS.map((tag) => (
          <OptionCard
            key={tag.value}
            label={tag.label}
            icon={tag.icon}
            selected={interests.includes(tag.value)}
            onClick={() => toggleInterest(tag.value)}
          />
        ))}
      </div>
    </div>
  );
}
