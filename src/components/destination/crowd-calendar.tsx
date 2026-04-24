import { cn } from "@/lib/utils";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const LEVEL_LABELS = ["", "Very low", "Low", "Moderate", "High", "Very high"];

// Opacity scale for the vermillion accent, driven by crowd level 1-5.
const LEVEL_OPACITY = ["0", "0.12", "0.24", "0.4", "0.62", "0.9"];

interface CrowdCalendarProps {
  crowdByMonth: Record<string, number>;
}

export function CrowdCalendar({ crowdByMonth }: CrowdCalendarProps) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-1 sm:grid-cols-6 lg:grid-cols-12">
        {MONTHS.map((month, i) => {
          const level = crowdByMonth[String(i + 1)] ?? 3;
          const opacity = LEVEL_OPACITY[level] ?? LEVEL_OPACITY[3];
          return (
            <div
              key={month}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="h-10 w-full border border-border"
                style={{
                  backgroundColor: `color-mix(in oklab, var(--accent) ${Number(opacity) * 100}%, var(--card))`,
                }}
                aria-hidden
              />
              <span
                className={cn(
                  "text-[10px] font-medium uppercase tracking-[0.1em] text-foreground",
                  level >= 4 && "text-accent",
                )}
              >
                {month}
              </span>
              <span className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                {LEVEL_LABELS[level]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
