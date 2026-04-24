"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionHead } from "./section-head";

type Activity = {
  time: string;
  title: string;
  body: string;
  tag: string;
  accent?: boolean;
};

type Day = {
  n: string;
  title: string;
  sub: string;
  headline: string;
  eyebrow: string;
  activities: Activity[];
};

const DAYS: Day[] = [
  {
    n: "01",
    title: "Arrival + Yanaka",
    sub: "Tokyo · NRT → Nippori",
    eyebrow: "Day 01 · Tokyo · Arrival",
    headline: "Narita to Nippori, slowly.",
    activities: [
      {
        time: "14:30",
        title: "Narita Express",
        body: "Direct train from the airport to Nippori in about an hour. Reserve a seat at the JR East ticket office before boarding.",
        tag: "Transfer",
      },
      {
        time: "16:00",
        title: "Check in, Yanaka",
        body: "Drop bags at a small family-run ryokan in the Yanaka shitamachi neighbourhood. Quiet lanes, no skyscrapers.",
        tag: "Lodging",
      },
      {
        time: "17:30",
        title: "Yuyake Dandan steps",
        body: "The short stairway above Yanaka Ginza is the neighbourhood's unofficial sunset viewpoint.",
        tag: "Walk",
      },
      {
        time: "19:00",
        title: "Izakaya Hantei",
        body: "Kushiage in a century-old wooden townhouse a short walk from the station. Set menu builds course by course.",
        tag: "Dinner",
        accent: true,
      },
    ],
  },
  {
    n: "02",
    title: "Shitamachi walk",
    sub: "Tokyo · Yanaka → Ueno",
    eyebrow: "Day 02 · Tokyo · Shitamachi",
    headline: "A slow east side wander.",
    activities: [
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
    ],
  },
  {
    n: "03",
    title: "Harajuku + Shibuya",
    sub: "Tokyo · west side day",
    eyebrow: "Day 03 · Tokyo · West side",
    headline: "Takeshita, Cat Street, Shibuya scramble.",
    activities: [
      {
        time: "09:30",
        title: "Meiji Jingu forest",
        body: "Walk the gravel approach through 100,000 donated trees before the daytime crowds arrive.",
        tag: "Shrine",
      },
      {
        time: "11:00",
        title: "Cat Street",
        body: "Quieter back lane running from Harajuku to Shibuya, packed with small clothing boutiques and vintage shops.",
        tag: "Walk",
      },
      {
        time: "13:00",
        title: "Afuri Ramen, Ebisu",
        body: "Yuzu shio ramen with a light citrus broth. The original Ebisu branch is still the best of a chain that has since expanded.",
        tag: "Lunch",
      },
      {
        time: "15:00",
        title: "Shibuya Sky",
        body: "Open-air rooftop observation deck on the 46th floor of Shibuya Scramble Square. Book a timed ticket online.",
        tag: "View",
        accent: true,
      },
      {
        time: "19:00",
        title: "Nonbei Yokocho",
        body: "A two-lane alley of tiny standing bars tucked behind Shibuya Station, most seating only six or seven people.",
        tag: "Bars",
      },
    ],
  },
  {
    n: "04",
    title: "Hakone overnight",
    sub: "Odakyu line · ryokan",
    eyebrow: "Day 04 · Hakone · Onsen ryokan",
    headline: "Mountain night, wooden bath.",
    activities: [
      {
        time: "09:00",
        title: "Romancecar from Shinjuku",
        body: "The Odakyu Romancecar runs Shinjuku to Hakone-Yumoto in 85 minutes. Book the front observation seats online.",
        tag: "Transfer",
      },
      {
        time: "11:30",
        title: "Hakone Open-Air Museum",
        body: "Outdoor sculpture park with a large Picasso pavilion and a stained-glass tower. Easy to spend two hours.",
        tag: "Art",
      },
      {
        time: "14:00",
        title: "Lake Ashi cruise",
        body: "Replica pirate ship crossing the caldera lake. On clear days Mount Fuji is visible from the deck.",
        tag: "Nature",
      },
      {
        time: "17:00",
        title: "Check in at ryokan",
        body: "Traditional ryokan with private onsen baths in each room. Yukata, kaiseki dinner, and futon laid out while you bathe.",
        tag: "Lodging",
        accent: true,
      },
      {
        time: "19:00",
        title: "Kaiseki dinner",
        body: "Twelve-course seasonal meal served in your room or a private tatami dining space.",
        tag: "Dinner",
      },
    ],
  },
  {
    n: "05",
    title: "Shinkansen to Kyoto",
    sub: "Hikari 503 · 13:20",
    eyebrow: "Day 05 · Kyoto · Arrival",
    headline: "Tokyo to Kyoto in two hours.",
    activities: [
      {
        time: "11:00",
        title: "Check out, store bags",
        body: "Leave bags at a coin locker at Hakone-Yumoto or send them ahead to the Kyoto hotel via takkyubin.",
        tag: "Transfer",
      },
      {
        time: "13:20",
        title: "Hikari 503 to Kyoto",
        body: "Right-side window seats get the Mount Fuji view about 40 minutes in, weather permitting.",
        tag: "Train",
        accent: true,
      },
      {
        time: "15:45",
        title: "Check in, Downtown Kyoto",
        body: "Machiya townhouse near Kawaramachi. Walking distance to Nishiki Market and the Kamo River.",
        tag: "Lodging",
      },
      {
        time: "17:00",
        title: "Nishiki Market",
        body: "Five-block covered arcade of Kyoto specialty food stalls. Try tsukemono pickles and yuba tofu skin.",
        tag: "Walk",
      },
      {
        time: "19:30",
        title: "Kaiseki at Giro Giro",
        body: "Playful counter-seat kaiseki on a small canal in Gion. Reservations open 30 days ahead on their website.",
        tag: "Reserve",
        accent: true,
      },
    ],
  },
  {
    n: "06",
    title: "Higashiyama temples",
    sub: "Kyoto · east side",
    eyebrow: "Day 06 · Kyoto · Higashiyama",
    headline: "The stone lane, the wooden stage.",
    activities: [
      {
        time: "07:30",
        title: "Kiyomizu-dera",
        body: "Go before the 9am tour buses arrive. The wooden stage is worth the climb up Chawan-zaka.",
        tag: "Temple",
      },
      {
        time: "09:30",
        title: "Sannenzaka stone path",
        body: "Preserved Edo-era street of teahouses and craft shops linking Kiyomizu-dera to Yasaka Pagoda.",
        tag: "Walk",
      },
      {
        time: "11:30",
        title: "Omen udon, Yasaka",
        body: "Cold or hot handmade udon with a sesame dipping sauce. The Yasaka branch is quieter than the Ginkakuji one.",
        tag: "Lunch",
      },
      {
        time: "13:30",
        title: "Philosopher's Path",
        body: "Two-kilometre canal-side walk from Ginkakuji toward Nanzenji, lined with cherry trees in spring.",
        tag: "Walk",
      },
      {
        time: "16:00",
        title: "Nanzen-ji + aqueduct",
        body: "Zen temple complex with a red brick Meiji-era aqueduct running through the grounds.",
        tag: "Temple",
      },
      {
        time: "19:00",
        title: "Pontocho alley",
        body: "Narrow lantern-lit lane of kaiseki and yakitori restaurants along the Kamo River.",
        tag: "Dinner",
        accent: true,
      },
    ],
  },
];

export function ItineraryPreview() {
  const [active, setActive] = useState("02");
  const activeDay = DAYS.find((d) => d.n === active) ?? DAYS[1];

  return (
    <section
      id="itinerary"
      className="border-y border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-[clamp(56px,8vw,96px)]">
        <SectionHead
          eyebrow="The builder · example"
          title={
            <>
              A plan with{" "}
              <span className="font-display italic font-normal text-accent">
                a pulse.
              </span>
            </>
          }
          lede="Swap a temple for an onsen, add a day, cut a city. Every change updates train times, lodging zones, and what you still need to book. Here's a sample trip built with it."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <aside className="border border-border bg-card p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Example itinerary
            </p>
            <h4 className="mt-2 font-display text-[22px] font-medium tracking-[-0.01em] text-foreground">
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
                  {activeDay.eyebrow}
                </div>
                <h3 className="mt-2 font-display text-[26px] font-medium leading-[1.1] tracking-[-0.015em] text-foreground">
                  {activeDay.headline}
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
              {activeDay.activities.map((a, i) => (
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
