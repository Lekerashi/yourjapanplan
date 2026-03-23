"use client";

import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  description?: string;
  icon?: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionCard({
  label,
  description,
  icon,
  selected,
  onClick,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border-2 p-5 text-center transition-all hover:border-rose-300 hover:bg-rose-50/50",
        selected
          ? "border-rose-500 bg-rose-50 shadow-sm"
          : "border-muted bg-background"
      )}
    >
      {icon && <span className="text-3xl">{icon}</span>}
      <span className="font-semibold">{label}</span>
      {description && (
        <span className="text-xs text-muted-foreground">{description}</span>
      )}
    </button>
  );
}
