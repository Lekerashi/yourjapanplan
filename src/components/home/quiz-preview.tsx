"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionHead } from "./section-head";

const OPTIONS = [
  {
    key: "A",
    label: "First time",
    sub: "I haven't been. Help me hit the highlights without rushing.",
  },
  {
    key: "B",
    label: "Returning",
    sub: "I've done Tokyo and Kyoto. I want to go deeper or further.",
  },
  {
    key: "C",
    label: "Local focus",
    sub: "I want a single region, not a loop. Show me the texture.",
  },
  {
    key: "D",
    label: "Special interest",
    sub: "I'm here for one thing. Food, art, hiking, trains.",
  },
];

export function QuizPreview() {
  const [picked, setPicked] = useState<string>("A");

  return (
    <section
      id="quiz"
      className="border-y border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-[clamp(56px,8vw,96px)]">
        <SectionHead
          eyebrow="The quiz"
          title={
            <>
              A personalized plan,{" "}
              <span className="font-display italic font-normal text-accent">
                eight questions in.
              </span>
            </>
          }
          lede="Your answers save locally so you can come back, tweak them, and share a plan that actually fits."
        />

        <div className="mt-8 grid gap-[clamp(24px,4vw,48px)] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Question <span className="text-foreground">02</span> of 08
            </div>
            <div className="mt-3 h-0.5 w-full bg-border">
              <div
                className="h-full bg-accent"
                style={{ width: "25%" }}
                aria-hidden
              />
            </div>
            <h3 className="mt-8 font-display text-[clamp(28px,4vw,44px)] font-medium leading-[1.05] tracking-[-0.015em] text-foreground">
              Which best describes{" "}
              <span className="font-display italic font-normal text-accent">
                this trip?
              </span>
            </h3>
            <p className="mt-4 max-w-[32ch] text-[14px] text-ink-2">
              Pick what resonates most. We&apos;ll refine it through the next
              few questions.
            </p>

            <div className="mt-8">
              <Button size="default" render={<Link href="/quiz" />}>
                Start the quiz
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
          </div>

          <div className="grid gap-3">
            {OPTIONS.map((o) => {
              const on = o.key === picked;
              return (
                <button
                  key={o.key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPicked(o.key)}
                  className={cn(
                    "flex flex-col items-start gap-1 border p-5 text-left transition-colors",
                    on
                      ? "border-accent bg-card ring-1 ring-inset ring-accent"
                      : "border-border bg-card hover:border-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "text-[12px] font-medium uppercase tracking-[0.1em]",
                      on ? "text-accent" : "text-muted-foreground",
                    )}
                  >
                    Option {o.key}
                  </span>
                  <span className="font-display text-[17px] font-semibold tracking-[-0.01em] text-foreground">
                    {o.label}
                  </span>
                  <span className="text-[14px] text-ink-2">{o.sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
