"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { INTEREST_TAGS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StepInterests() {
  const { interests, toggleInterest } = useQuizStore();

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Pick at least two — there&apos;s no limit.
      </p>
      <div
        role="group"
        aria-label="Interests"
        className="flex flex-wrap gap-2"
      >
        {INTEREST_TAGS.map((tag, i) => {
          const active = interests.includes(tag.value);
          const number = String(i + 1).padStart(2, "0");
          return (
            <button
              key={tag.value}
              type="button"
              aria-pressed={active}
              onClick={() => toggleInterest(tag.value)}
              className={cn(
                "inline-flex items-center gap-2.5 border px-4 py-2.5 text-[14px] font-medium transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-ink-2 hover:border-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "font-display text-[11px] tracking-[0.1em]",
                  active ? "text-background/70" : "text-muted-foreground",
                )}
              >
                {number}
              </span>
              {tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
