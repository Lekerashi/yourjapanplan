import { cn } from "@/lib/utils";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const LEVEL_COLORS = [
  "",
  "bg-emerald-100 text-emerald-800",
  "bg-emerald-200 text-emerald-900",
  "bg-amber-100 text-amber-800",
  "bg-orange-200 text-orange-900",
  "bg-rose-200 text-rose-900",
];

const LEVEL_LABELS = ["", "Very Low", "Low", "Moderate", "High", "Very High"];

interface CrowdCalendarProps {
  crowdByMonth: Record<string, number>;
}

export function CrowdCalendar({ crowdByMonth }: CrowdCalendarProps) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
        {MONTHS.map((month, i) => {
          const level = crowdByMonth[String(i + 1)] ?? 3;
          return (
            <div
              key={month}
              className={cn(
                "flex flex-col items-center rounded-lg p-2 text-center",
                LEVEL_COLORS[level]
              )}
            >
              <span className="text-xs font-semibold">{month}</span>
              <span className="mt-0.5 text-[10px] leading-tight">
                {LEVEL_LABELS[level]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-emerald-100" />
          Quiet
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-amber-100" />
          Moderate
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-rose-200" />
          Busy
        </div>
      </div>
    </div>
  );
}
