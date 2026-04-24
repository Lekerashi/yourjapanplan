"use client";

interface RecommendationCardProps {
  recommendation: {
    destination_slug?: string;
    match_score?: number;
    reasoning?: string;
    suggested_days?: number;
    highlights?: (string | undefined)[];
    best_area_to_stay?: string;
    must_reserve?: (string | undefined)[];
  };
  rank: number;
}

export function RecommendationCard({
  recommendation,
  rank,
}: RecommendationCardProps) {
  const r = recommendation;
  const name =
    r.destination_slug
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "…";

  return (
    <article className="grid gap-5 border border-border bg-card p-6 md:grid-cols-[auto_1fr_auto] md:items-start">
      <div className="inline-flex h-12 w-12 items-center justify-center border border-border bg-background font-display text-[18px] font-semibold text-foreground">
        {String(rank).padStart(2, "0")}
      </div>

      <div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-[clamp(22px,2.4vw,28px)] font-medium tracking-[-0.01em] text-foreground">
            {name}
          </h3>
          {r.suggested_days != null && (
            <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              {r.suggested_days} {r.suggested_days === 1 ? "day" : "days"}
            </span>
          )}
        </div>

        {r.reasoning && (
          <p className="mt-3 text-[15px] leading-[1.6] text-ink-2">
            {r.reasoning}
          </p>
        )}

        {r.highlights && r.highlights.filter(Boolean).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {r.highlights.filter(Boolean).map((h) => (
              <span
                key={h}
                className="border border-border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        <dl className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-[13px]">
          {r.best_area_to_stay && (
            <div className="flex gap-3">
              <dt className="w-[96px] shrink-0 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Stay in
              </dt>
              <dd className="text-foreground">{r.best_area_to_stay}</dd>
            </div>
          )}
          {r.must_reserve && r.must_reserve.filter(Boolean).length > 0 && (
            <div className="flex gap-3">
              <dt className="w-[96px] shrink-0 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Reserve ahead
              </dt>
              <dd className="text-foreground">
                {r.must_reserve.filter(Boolean).join(", ")}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {r.match_score != null && (
        <div className="self-start border border-border bg-background px-3 py-2 text-right">
          <div className="font-display text-[22px] font-semibold tracking-[-0.01em] text-accent">
            {r.match_score}%
          </div>
          <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
            match
          </div>
        </div>
      )}
    </article>
  );
}
