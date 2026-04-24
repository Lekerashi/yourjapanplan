"use client";

import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  description?: string;
  /** Small uppercase prefix like "Option A" or "01". Falls back to the auto-derived letter from `index` if provided. */
  prefix?: string;
  /** If prefix isn't passed, the card will show "Option {letter}" derived from this. */
  index?: number;
  selected: boolean;
  onClick: () => void;
}

function letterFromIndex(i: number): string {
  return String.fromCharCode(65 + (i % 26));
}

export function OptionCard({
  label,
  description,
  prefix,
  index,
  selected,
  onClick,
}: OptionCardProps) {
  const resolvedPrefix =
    prefix ?? (index !== undefined ? `Option ${letterFromIndex(index)}` : null);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 border p-5 text-left transition-colors",
        selected
          ? "border-accent bg-card ring-1 ring-inset ring-accent"
          : "border-border bg-card hover:border-foreground",
      )}
    >
      {resolvedPrefix && (
        <span
          className={cn(
            "text-[12px] font-medium uppercase tracking-[0.1em]",
            selected ? "text-accent" : "text-muted-foreground",
          )}
        >
          {resolvedPrefix}
        </span>
      )}
      <span className="font-display text-[17px] font-semibold tracking-[-0.01em] text-foreground">
        {label}
      </span>
      {description && (
        <span className="text-[14px] leading-snug text-ink-2">
          {description}
        </span>
      )}
    </button>
  );
}
