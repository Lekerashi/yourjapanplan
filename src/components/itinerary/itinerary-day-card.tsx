import { ActivityItem } from "./activity-item";

interface DayCardProps {
  day: {
    day_number?: number;
    destination_name?: string;
    theme?: string;
    activities?: (
      | {
          time?: string;
          title?: string;
          description?: string;
          duration_minutes?: number;
          reservation_required?: boolean;
          cost_estimate?: string;
          tip?: string | null;
        }
      | undefined
    )[];
    transport?: {
      from?: string;
      to?: string;
      method?: string;
      duration?: string;
      cost?: string;
      tip?: string | null;
    } | null;
    accommodation?: {
      name?: string;
      area?: string;
      type?: string;
      reasoning?: string;
    };
  };
}

export function ItineraryDayCard({ day }: DayCardProps) {
  return (
    <article className="border border-border bg-card">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border p-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Day {day.day_number ?? "…"}
            {day.destination_name ? ` · ${day.destination_name}` : ""}
          </p>
          <h3 className="mt-2 font-display text-[clamp(22px,2.6vw,28px)] font-medium leading-[1.1] tracking-[-0.015em] text-foreground">
            {day.theme ?? "Planning…"}
          </h3>
        </div>
      </header>

      <div className="px-6 pt-2 pb-5">
        {day.activities && day.activities.length > 0 && (
          <ul>
            {day.activities
              .filter((a): a is NonNullable<typeof a> => !!a)
              .map((activity, i) => (
                <li key={i}>
                  <ActivityItem activity={activity} />
                </li>
              ))}
          </ul>
        )}
      </div>

      {day.transport && (
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-border bg-secondary/40 px-6 py-4 text-[13px] text-foreground">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Transit
          </span>
          <span className="font-display text-[15px] font-medium">
            {day.transport.from} → {day.transport.to}
          </span>
          {day.transport.method && (
            <span className="text-ink-2">via {day.transport.method}</span>
          )}
          <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {[day.transport.duration, day.transport.cost]
              .filter(Boolean)
              .join(" · ")}
          </span>
          {day.transport.tip && (
            <p className="mt-1 w-full text-[12px] text-ink-2">
              {day.transport.tip}
            </p>
          )}
        </div>
      )}

      {day.accommodation && day.accommodation.name && (
        <div className="border-t border-border px-6 py-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Where to stay
          </p>
          <p className="mt-1 font-display text-[16px] font-medium tracking-[-0.005em] text-foreground">
            {day.accommodation.name}
          </p>
          {day.accommodation.area && (
            <p className="text-[12px] text-ink-2">
              {day.accommodation.area}
              {day.accommodation.type ? ` · ${day.accommodation.type}` : ""}
            </p>
          )}
          {day.accommodation.reasoning && (
            <p className="mt-1 text-[12px] text-ink-2">
              {day.accommodation.reasoning}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
