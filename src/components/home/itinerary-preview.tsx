"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionHead } from "./section-head";

const DAYS = [
  { n: "01", title: "Arrival + Yanaka", sub: "Tokyo · NRT → Nippori" },
  { n: "02", title: "Shitamachi walk", sub: "Tokyo · Yanaka → Ueno" },
  { n: "03", title: "Harajuku + Shibuya", sub: "Tokyo · west side day" },
  { n: "04", title: "Hakone overnight", sub: "Odakyu line · ryokan" },
  { n: "05", title: "Shinkansen to Kyoto", sub: "Hikari 503 · 13:20" },
  { n: "06", title: "Higashiyama temples", sub: "Kyoto · east side" },
];

const DAY_2_ACTIVITIES = [
  {
    time: "08:30",
    title: "Tenmasu Tokyo",
    body: "A 1920s kissaten behind Nezu station serving a traditional morning set of toast, egg, salad, and coffee.",
    tag: "Breakfast",
    accent: true,
  },
  {
    time: "10:00",
    title: "Yanaka Ginza",
    body: "A short covered shopping street of about seventy small family-run shops that survived the wartime bombing of Tokyo.",
    tag: "Walk",
  },
  {
    time: "12:30",
    title: "Kayaba Coffee",
    body: "A restored 1938 wooden coffee house on the corner of Kototoi-dori famous for its egg sandwich and iced coffee jelly.",
    tag: "Lunch",
  },
  {
    time: "14:00",
    title: "SCAI the Bathhouse",
    body: "A 200 year old public bathhouse converted into a contemporary art gallery showing rotating exhibitions of Japanese artists.",
    tag: "Art",
  },
  {
    time: "16:00",
    title: "Nezu-jinja",
    body: "A Shinto shrine founded in 1705 with a tunnel of vermillion torii gates and a six thousand bush azalea garden that blooms in April.",
    tag: "Shrine",
  },
  {
    time: "19:00",
    title: "Hantei",
    body: "A kushiage restaurant inside a century-old wooden townhouse serving seasonal skewers in a set menu that builds course by course.",
    tag: "Reserve",
    accent: true,
  },
];

export function ItineraryPreview() {
  const [active, setActive] = useState("02");

  return (
    <section
      id="itinerary"
      className="border-y border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-[clamp(56px,8vw,96px)]">
        <SectionHead
          eyebrow="The builder"
          title={
            <>
              A plan with{" "}
              <span className="font-display italic font-normal text-accent">
                a pulse.
              </span>
            </>
          }
          lede="Swap a temple for an onsen, add a day, cut a city. Every change updates train times, lodging zones, and what you still need to book."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <aside className="border border-border bg-card p-6">
            <h4 className="font-display text-[22px] font-medium tracking-[-0.01em] text-foreground">
              14 days · Classic loop
            </h4>
            <div className="mt-1 text-[12px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
              Tokyo → Hakone → Kyoto → Naoshima → Osaka
            </div>
            <div className="mt-5 flex flex-col gap-1.5">
              {DAYS.map((d) => {
                const on = d.n === active;
                return (
                  <button
                    key={d.n}
                    type="button"
                    onClick={() => setActive(d.n)}
                    className={cn(
                      "flex items-center gap-3.5 border p-3 text-left transition-colors",
                      on
                        ? "border-border bg-background"
                        : "border-transparent hover:border-border",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-grid h-[34px] w-[34px] shrink-0 place-items-center border font-display text-[14px] font-semibold transition-colors",
                        on
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-background text-foreground",
                      )}
                    >
                      {d.n}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-semibold text-foreground">
                        {d.title}
                      </div>
                      <div className="mt-0.5 truncate text-[10px] uppercase tracking-[0.05em] text-muted-foreground">
                        {d.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="border border-border bg-card">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border p-6">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Day 02 · Tokyo · Shitamachi
                </div>
                <h3 className="mt-2 font-display text-[26px] font-medium leading-[1.1] tracking-[-0.015em] text-foreground">
                  A slow east side wander.
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/itinerary/new" />}
              >
                Build your own
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
            </div>

            <ul>
              {DAY_2_ACTIVITIES.map((a, i) => (
                <li
                  key={i}
                  className="grid gap-4 border-b border-border px-6 py-5 last:border-b-0 sm:grid-cols-[64px_1fr_auto]"
                >
                  <div className="text-[14px] font-medium text-foreground">
                    {a.time}
                  </div>
                  <div>
                    <h5 className="font-display text-[18px] font-medium tracking-[-0.005em] text-foreground">
                      {a.title}
                    </h5>
                    <p className="mt-1 text-[14px] leading-[1.55] text-ink-2">
                      {a.body}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "self-start text-[10px] font-medium uppercase tracking-[0.15em]",
                      a.accent ? "text-accent" : "text-muted-foreground",
                    )}
                  >
                    {a.tag}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
