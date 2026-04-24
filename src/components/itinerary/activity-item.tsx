interface ActivityItemProps {
  activity: {
    time?: string;
    title?: string;
    description?: string;
    duration_minutes?: number;
    reservation_required?: boolean;
    cost_estimate?: string;
    tip?: string | null;
  };
}

export function ActivityItem({ activity: a }: ActivityItemProps) {
  return (
    <div className="grid gap-3 border-b border-border py-4 last:border-b-0 sm:grid-cols-[64px_1fr_auto]">
      <div className="font-display text-[15px] font-medium text-foreground">
        {a.time ?? "…"}
      </div>

      <div>
        <h4 className="font-display text-[18px] font-medium tracking-[-0.005em] text-foreground">
          {a.title ?? "…"}
        </h4>
        {a.description && (
          <p className="mt-1 text-[14px] leading-[1.55] text-ink-2">
            {a.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {a.duration_minutes != null && (
            <span>
              {a.duration_minutes >= 60
                ? `${Math.floor(a.duration_minutes / 60)}h${a.duration_minutes % 60 ? ` ${a.duration_minutes % 60}m` : ""}`
                : `${a.duration_minutes}m`}
            </span>
          )}
          {a.cost_estimate && <span>{a.cost_estimate}</span>}
          {a.reservation_required && (
            <span className="text-accent">Reserve ahead</span>
          )}
        </div>

        {a.tip && (
          <p className="mt-2 border-l-2 border-accent/40 pl-3 text-[12px] leading-[1.5] text-ink-2">
            {a.tip}
          </p>
        )}
      </div>
    </div>
  );
}
