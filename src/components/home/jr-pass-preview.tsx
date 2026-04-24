"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionHead } from "./section-head";

const STATIONS = [
  "Tokyo",
  "Shin-Yokohama",
  "Odawara",
  "Nagoya",
  "Kyoto",
  "Shin-Osaka",
  "Hiroshima",
  "Hakata",
  "Kanazawa",
  "Sendai",
] as const;

const PASSES = [
  { k: 7, label: "7 day", price: 50000 },
  { k: 14, label: "14 day", price: 80000 },
  { k: 21, label: "21 day", price: 100000 },
] as const;

const DEFAULT_ROUTES = [
  { from: "Tokyo", to: "Kyoto" },
  { from: "Kyoto", to: "Hiroshima" },
  { from: "Hiroshima", to: "Tokyo" },
] as const;

function fareFor(from: string, to: string) {
  const a = STATIONS.indexOf(from as (typeof STATIONS)[number]);
  const b = STATIONS.indexOf(to as (typeof STATIONS)[number]);
  if (a < 0 || b < 0) return 0;
  return Math.abs(a - b) * 3800 + 8800;
}

export function JRPassPreview() {
  const [routes, setRoutes] = useState<{ from: string; to: string }[]>([
    ...DEFAULT_ROUTES,
  ]);
  const [passKey, setPassKey] = useState<7 | 14 | 21>(14);

  const individual = useMemo(
    () => routes.reduce((sum, r) => sum + fareFor(r.from, r.to), 0),
    [routes],
  );
  const passPrice = PASSES.find((p) => p.k === passKey)!.price;
  const savings = individual - passPrice;
  const worth = savings > 0;

  const updateLeg = (i: number, key: "from" | "to", value: string) => {
    setRoutes((rs) => rs.map((r, j) => (j === i ? { ...r, [key]: value } : r)));
  };
  const addLeg = () =>
    setRoutes((rs) => [...rs, { from: "Tokyo", to: "Nagoya" }]);

  return (
    <section id="jrpass">
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-[clamp(56px,8vw,96px)]">
        <SectionHead
          eyebrow="JR Pass calculator"
          title={
            <>
              Worth it?{" "}
              <span className="font-display italic font-normal text-accent">
                Find out in thirty seconds.
              </span>
            </>
          }
          lede="The JR Pass price doubled in 2023. Put your real route in and we'll show you the break-even."
        />

        <div className="mt-8 grid gap-0 border border-border bg-card md:grid-cols-2">
          <div className="border-b border-border p-[clamp(20px,3vw,32px)] md:border-r md:border-b-0">
            <h3 className="font-display text-[22px] font-medium tracking-[-0.01em] text-foreground">
              Your route
            </h3>
            <p className="mt-1 text-[14px] text-ink-2">
              Add every shinkansen leg you&apos;d take. Return trips count
              twice.
            </p>

            <div className="mt-6">
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Legs
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                {routes.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"
                  >
                    <select
                      value={r.from}
                      onChange={(e) => updateLeg(i, "from", e.target.value)}
                      className="h-10 w-full border border-border bg-background px-3 text-[14px] text-foreground focus:border-foreground focus:outline-none"
                      aria-label={`Leg ${i + 1} origin`}
                    >
                      {STATIONS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <span className="px-1 text-muted-foreground" aria-hidden>
                      →
                    </span>
                    <select
                      value={r.to}
                      onChange={(e) => updateLeg(i, "to", e.target.value)}
                      className="h-10 w-full border border-border bg-background px-3 text-[14px] text-foreground focus:border-foreground focus:outline-none"
                      aria-label={`Leg ${i + 1} destination`}
                    >
                      {STATIONS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLeg}
                  className="border border-dashed border-border py-2.5 text-[13px] font-medium text-ink-2 transition-colors hover:border-foreground hover:text-foreground"
                >
                  + Add leg
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Pass length
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {PASSES.map((p) => {
                  const on = p.k === passKey;
                  return (
                    <button
                      key={p.k}
                      type="button"
                      onClick={() => setPassKey(p.k)}
                      aria-pressed={on}
                      className={cn(
                        "flex flex-col items-center justify-center gap-0.5 border py-3 transition-colors",
                        on
                          ? "border-accent bg-accent/5 ring-1 ring-inset ring-accent"
                          : "border-border bg-background hover:border-foreground",
                      )}
                    >
                      <span className="font-display text-[17px] font-semibold tracking-[-0.01em] text-foreground">
                        {p.label}
                      </span>
                      <span className="text-[12px] text-muted-foreground">
                        ¥{p.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 p-[clamp(20px,3vw,32px)]">
            <div>
              <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                Verdict
              </p>
              <h3 className="mt-3 font-display text-[clamp(26px,3vw,36px)] font-medium leading-[1.1] tracking-[-0.015em] text-foreground">
                {worth ? (
                  <>
                    Yes. Get the pass.
                    <br />
                    <span className="font-display italic font-normal text-accent">
                      You save ¥{savings.toLocaleString()}.
                    </span>
                  </>
                ) : (
                  <>
                    Skip the pass.
                    <br />
                    <span className="font-display italic font-normal text-accent">
                      Pay as you go wins by ¥
                      {Math.abs(savings).toLocaleString()}.
                    </span>
                  </>
                )}
              </h3>
            </div>

            <dl className="flex flex-col gap-2 border-t border-border pt-4">
              <VerdictRow label="Individual fares" value={individual} />
              <VerdictRow label={`${passKey} day pass`} value={passPrice} />
              <VerdictRow
                label={worth ? "You save" : "You lose"}
                value={Math.abs(savings)}
                emphasize
              />
            </dl>

            <div>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/tools/jr-pass" />}
              >
                Open full calculator
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
        </div>
      </div>
    </section>
  );
}

function VerdictRow({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: number;
  emphasize?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-3",
        emphasize && "border-t border-border pt-2 mt-2",
      )}
    >
      <dt className="text-[13px] font-medium text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "tabular-nums",
          emphasize
            ? "font-display text-[24px] font-semibold tracking-[-0.01em] text-foreground"
            : "text-[14px] text-foreground",
        )}
      >
        ¥{value.toLocaleString()}
      </dd>
    </div>
  );
}
