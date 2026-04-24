"use client";

import { useState } from "react";
import { INTEREST_TAGS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const DEFAULT_ACTIVE = new Set(["food", "nature"]);

export function Interests() {
  const [active, setActive] = useState<Set<string>>(DEFAULT_ACTIVE);

  const toggle = (value: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-[clamp(48px,6vw,72px)]">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              Step one
            </p>
            <h3 className="mt-2 font-display text-[clamp(26px,3.6vw,36px)] font-medium leading-tight tracking-[-0.015em] text-foreground">
              What draws you to Japan?
            </h3>
          </div>
          <p className="max-w-[28ch] text-sm text-muted-foreground">
            Pick as many as you like. We&apos;ll weight destinations and
            activities against your picks.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {INTEREST_TAGS.map((tag, i) => {
            const isActive = active.has(tag.value);
            const number = String(i + 1).padStart(2, "0");
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => toggle(tag.value)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2.5 border px-4 py-2.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-ink-2 hover:border-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "font-display text-[11px] tracking-[0.1em]",
                    isActive ? "text-background/70" : "text-muted-foreground",
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
    </section>
  );
}
