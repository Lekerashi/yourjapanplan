interface Zone {
  name: string;
  description: string;
  best_for: string[];
}

interface AccommodationZonesProps {
  zones: Zone[];
}

export function AccommodationZones({ zones }: AccommodationZonesProps) {
  return (
    <div className="grid gap-0 border border-border bg-card md:grid-cols-2">
      {zones.map((zone, i) => (
        <div
          key={zone.name}
          className={
            "p-5 " +
            (i < zones.length - 1
              ? "border-b border-border last:border-b-0 md:border-r md:[&:nth-child(2n)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0"
              : "")
          }
        >
          <h4 className="font-display text-[18px] font-medium tracking-[-0.005em] text-foreground">
            {zone.name}
          </h4>
          <p className="mt-2 text-[14px] leading-[1.55] text-ink-2">
            {zone.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {zone.best_for.map((tag) => (
              <span
                key={tag}
                className="border border-border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
