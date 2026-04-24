import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { INTEREST_TAGS, REGIONS, SEASONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { CrowdCalendar } from "@/components/destination/crowd-calendar";
import { AccommodationZones } from "@/components/destination/accommodation-zones";

export function generateStaticParams() {
  return SEED_DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const dest = SEED_DESTINATIONS.find((d) => d.slug === slug);
    if (!dest) return { title: "Not Found" };
    const region = REGIONS.find((r) => r.value === dest.region);
    return {
      title: `${dest.name} Japan Travel Guide — Things to Do, Where to Stay & Tips`,
      description: `${dest.description} Best seasons, crowd levels, where to stay, what to reserve, and insider tips for visiting ${dest.name}${region ? ` in ${region.label}` : ""}.`,
      keywords: [
        `${dest.name} Japan`,
        `${dest.name} travel guide`,
        `things to do in ${dest.name}`,
        `${dest.name} itinerary`,
        `visit ${dest.name}`,
      ],
    };
  });
}

function SubHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="border-b border-border pb-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-[clamp(22px,2.6vw,30px)] font-medium tracking-[-0.01em] text-foreground">
        {title}
      </h2>
    </div>
  );
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = SEED_DESTINATIONS.find((d) => d.slug === slug);
  if (!dest) notFound();

  const region = REGIONS.find((r) => r.value === dest.region);
  const tagLabels = dest.tags.map(
    (t) => INTEREST_TAGS.find((it) => it.value === t)?.label ?? t,
  );
  const seasonLabels = dest.best_seasons.map(
    (s) => SEASONS.find((ss) => ss.value === s)?.label ?? s,
  );

  return (
    <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] pt-8 pb-[clamp(48px,8vw,96px)]">
      <Button
        variant="ghost"
        size="sm"
        render={<Link href="/destinations" />}
        className="-ml-3"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M13 8H3M7 4L3 8l4 4" />
        </svg>
        All destinations
      </Button>

      {dest.image && (
        <div className="mt-6 relative aspect-[16/9] w-full overflow-hidden bg-secondary">
          <Image
            src={dest.image}
            alt={dest.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute right-5 bottom-5 left-5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#fbf6ec] drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)]">
            {dest.name}
            {region ? ` · ${region.label}` : ""}
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-[clamp(32px,5vw,64px)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {region?.label}
            {region?.label_jp ? ` · ${region.label_jp}` : ""}
          </p>
          <h1 className="mt-3 font-display text-[clamp(40px,6vw,72px)] font-medium leading-[0.98] tracking-[-0.02em] text-foreground">
            {dest.name}
          </h1>
          <p className="mt-6 max-w-[48ch] text-[clamp(16px,1.4vw,18px)] leading-relaxed text-ink-2">
            {dest.description}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-5 self-start border border-border bg-card p-6">
          <FactRow label="Best seasons" value={seasonLabels.join(" · ")} />
          <FactRow
            label="JR Pass covers"
            value={dest.jr_accessible ? "Yes" : "Not on the base pass"}
          />
          <div className="col-span-2">
            <FactRow
              label="Interests"
              value={tagLabels.join(" · ")}
              wrap
            />
          </div>
        </dl>
      </div>

      <section className="mt-[clamp(48px,6vw,80px)]">
        <SubHead eyebrow="Highlights" title="What to see and do." />
        <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {dest.highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-3 border-t border-border pt-3 text-[15px] text-foreground first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
            >
              <span
                aria-hidden
                className="mt-[8px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-[clamp(48px,6vw,80px)]">
        <SubHead eyebrow="When to go" title="Crowd levels by month." />
        <p className="mt-3 max-w-[52ch] text-[14px] text-ink-2">
          Vermillion density shows how crowded the city feels each month.
          Darker cells mean more tourists and higher prices.
        </p>
        <div className="mt-6">
          <CrowdCalendar crowdByMonth={dest.crowd_level_by_month} />
        </div>
      </section>

      <section className="mt-[clamp(48px,6vw,80px)]">
        <SubHead eyebrow="Where to stay" title="Neighbourhoods to consider." />
        <div className="mt-6">
          <AccommodationZones zones={dest.accommodation_zones} />
        </div>
      </section>

      <section className="mt-[clamp(48px,6vw,80px)]">
        <SubHead eyebrow="Book ahead" title="Reservations that matter." />
        <p className="mt-6 max-w-[68ch] text-[16px] leading-[1.6] text-ink-2">
          {dest.reservation_tips}
        </p>
      </section>

      <section className="mt-[clamp(56px,8vw,96px)] border-t border-border pt-10">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-display text-[clamp(22px,2.4vw,28px)] font-medium tracking-[-0.01em] text-foreground">
            Plan a trip around{" "}
            <span className="font-display italic font-normal text-accent">
              {dest.name}.
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/quiz" />}>Take the quiz</Button>
            <Button variant="outline" render={<Link href="/itinerary/new" />}>
              Build from scratch
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FactRow({
  label,
  value,
  wrap,
}: {
  label: string;
  value: string;
  wrap?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd
        className={
          "mt-1 text-[14px] text-foreground " +
          (wrap ? "" : "truncate")
        }
      >
        {value}
      </dd>
    </div>
  );
}
