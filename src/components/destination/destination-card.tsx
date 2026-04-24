import Image from "next/image";
import Link from "next/link";
import { REGIONS, INTEREST_TAGS, SEASONS } from "@/lib/constants";
import type { DestinationRow } from "@/lib/ai/destinations-context";

interface DestinationCardProps {
  destination: DestinationRow;
  index?: number;
}

function labelForTag(value: string) {
  return INTEREST_TAGS.find((t) => t.value === value)?.label ?? value;
}

function labelForSeason(value: string) {
  return SEASONS.find((s) => s.value === value)?.label ?? value;
}

export function DestinationCard({ destination: d, index }: DestinationCardProps) {
  const region = REGIONS.find((r) => r.value === d.region);
  const primaryTags = d.tags.slice(0, 2).map(labelForTag);
  const meta = [
    d.best_seasons[0] ? labelForSeason(d.best_seasons[0]) : null,
    ...primaryTags,
  ].filter(Boolean) as string[];

  return (
    <Link
      href={`/destinations/${d.slug}`}
      className="group relative flex flex-col border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-foreground"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {d.image && (
          <Image
            src={d.image}
            alt={d.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
          />
        )}
        {index !== undefined && (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-[2px] bg-foreground/80 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-background backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-4 pb-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[24px] font-medium leading-[1.1] tracking-[-0.01em] text-foreground">
            {d.name}
          </h3>
          {region && (
            <span className="mt-1 shrink-0 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {region.label}
            </span>
          )}
        </div>

        <p className="text-[13.5px] leading-[1.55] text-ink-2 line-clamp-4">
          {d.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {meta.map((m) => (
            <span
              key={m}
              className="border border-border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
            >
              {m}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors group-hover:text-accent">
            View details
            <svg
              viewBox="0 0 16 16"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </span>
          <span
            aria-hidden
            className="inline-flex h-[30px] w-[30px] items-center justify-center border border-border transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground"
          >
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M8 3v10M3 8h10" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
