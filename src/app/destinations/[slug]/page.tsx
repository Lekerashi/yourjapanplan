import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { INTEREST_TAGS, REGIONS, SEASONS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CrowdCalendar } from "@/components/destination/crowd-calendar";
import { AccommodationZones } from "@/components/destination/accommodation-zones";
import {
  ArrowLeft,
  Train,
  CalendarCheck,
  Bookmark,
  Sparkles,
  MapPin,
} from "lucide-react";

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
      keywords: [`${dest.name} Japan`, `${dest.name} travel guide`, `things to do in ${dest.name}`, `${dest.name} itinerary`, `visit ${dest.name}`],
    };
  });
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Back link */}
      <Button
        variant="ghost"
        size="sm"
        render={<Link href="/destinations" />}
        className="mb-6 -ml-2"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        All Destinations
      </Button>

      {/* Hero image */}
      {dest.image && (
        <div className="relative mb-8 h-48 w-full overflow-hidden rounded-xl sm:h-64 md:h-72">
          <Image
            src={dest.image}
            alt={dest.name}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl drop-shadow-lg">
              {dest.name}
            </h1>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            {!dest.image && (
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {dest.name}
              </h1>
            )}
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {region?.label}
                {region?.label_jp ? ` (${region.label_jp})` : ""}
              </span>
            </div>
          </div>
          {dest.jr_accessible && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <Train className="h-4 w-4" />
              JR Accessible
            </div>
          )}
        </div>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {dest.description}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {dest.tags.map((tag) => {
            const meta = INTEREST_TAGS.find((t) => t.value === tag);
            return (
              <Badge key={tag} variant="secondary">
                {meta ? `${meta.icon} ${meta.label}` : tag}
              </Badge>
            );
          })}
        </div>

        {/* Best seasons */}
        <div className="mt-4 flex items-center gap-2 text-sm">
          <CalendarCheck className="h-4 w-4 text-rose-500" />
          <span className="font-medium">Best seasons:</span>
          {dest.best_seasons.map((s) => {
            const meta = SEASONS.find((ss) => ss.value === s);
            return (
              <span
                key={s}
                className="rounded bg-rose-50 px-2 py-0.5 text-sm font-medium text-rose-600"
              >
                {meta?.label ?? s}
              </span>
            );
          })}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Highlights */}
      <section>
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Sparkles className="h-5 w-5 text-rose-500" />
          Highlights
        </h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {dest.highlights.map((h) => (
            <div
              key={h}
              className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-3 text-sm"
            >
              <span className="text-rose-500">&#9679;</span>
              {h}
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Crowd Calendar */}
      <section>
        <h2 className="text-xl font-bold">Crowd Levels by Month</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan your visit around crowd levels
        </p>
        <div className="mt-4">
          <CrowdCalendar crowdByMonth={dest.crowd_level_by_month} />
        </div>
      </section>

      <Separator className="my-8" />

      {/* Where to Stay */}
      <section>
        <h2 className="text-xl font-bold">Where to Stay</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Recommended areas based on your travel style
        </p>
        <div className="mt-4">
          <AccommodationZones zones={dest.accommodation_zones} />
        </div>
      </section>

      <Separator className="my-8" />

      {/* Reservation Tips */}
      <section>
        <Card>
          <CardContent className="flex gap-4 p-5">
            <Bookmark className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <h3 className="font-semibold">Reservation Tips</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {dest.reservation_tips}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button render={<Link href="/quiz" />}>
          Plan a Trip Including {dest.name}
        </Button>
        <Button variant="outline" render={<Link href="/destinations" />}>
          Browse More Destinations
        </Button>
      </div>
    </div>
  );
}
