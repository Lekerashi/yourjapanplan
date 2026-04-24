"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { ACTIVITY_CATALOG } from "@/lib/data/seed-activities";
import { REGIONS } from "@/lib/constants";

type HeroPick = {
  name: string;
  region: string;
  image: string;
};

const WITH_IMAGE: HeroPick[] = SEED_DESTINATIONS.filter(
  (d): d is typeof d & { image: string } => Boolean(d.image),
).map((d) => {
  const region = REGIONS.find((r) => r.value === d.region);
  return {
    name: d.name,
    region: region?.label ?? d.region,
    image: d.image,
  };
});

// Deterministic default for SSR to avoid hydration mismatch.
const DEFAULT_PICK: HeroPick = WITH_IMAGE[0] ?? {
  name: "Japan",
  region: "",
  image:
    "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80&auto=format&fit=crop",
};

function pickRandom(): HeroPick {
  if (WITH_IMAGE.length === 0) return DEFAULT_PICK;
  return WITH_IMAGE[Math.floor(Math.random() * WITH_IMAGE.length)];
}

export function Hero() {
  const cityCount = SEED_DESTINATIONS.length;
  const activityCount = ACTIVITY_CATALOG.length;
  const regionCount = REGIONS.length;

  const [pick, setPick] = useState<HeroPick>(DEFAULT_PICK);

  useEffect(() => {
    // Defer the random pick to a microtask so the initial SSR frame
    // hydrates cleanly, then swap to a random destination on mount.
    const id = setTimeout(() => setPick(pickRandom()), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative">
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] pt-[clamp(48px,8vw,96px)] pb-[clamp(32px,5vw,56px)]">
        <div className="grid items-end gap-[clamp(32px,5vw,64px)] md:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div>
            <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              A planner for travellers, not tourists
            </p>
            <h1 className="mt-5 max-w-[14ch] font-display text-[clamp(44px,8vw,88px)] font-medium leading-[0.95] tracking-[-0.02em] text-foreground">
              Find the Japan{" "}
              <span className="font-display italic font-normal text-accent">
                that finds you.
              </span>
            </h1>
            <p className="mt-6 max-w-[44ch] text-[clamp(16px,1.4vw,18px)] leading-relaxed text-ink-2">
              Answer a few questions about how you travel and we&apos;ll shape
              a day-by-day plan with lodging tips, reservations, and what to
              skip.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" render={<Link href="/quiz" />}>
                Take the quiz
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/itinerary/new" />}
              >
                Build from scratch
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-6">
              <HeroStat num={cityCount} label="Cities curated" />
              <HeroStat num={regionCount} label="Regions covered" />
              <HeroStat num={`${activityCount}+`} label="Activities" />
            </div>
          </div>

          <div
            className="relative aspect-[3/4] w-full overflow-hidden bg-secondary"
            suppressHydrationWarning
          >
            <Image
              src={pick.image}
              alt={pick.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover"
            />
            <div
              className="absolute right-4 bottom-3.5 left-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[#fbf6ec] drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)]"
              suppressHydrationWarning
            >
              {pick.name}
              {pick.region ? ` · ${pick.region}` : ""}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function HeroStat({
  num,
  label,
}: {
  num: number | string;
  label: string;
}) {
  return (
    <div>
      <div className="font-display text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.02em] text-foreground">
        {num}
      </div>
      <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
