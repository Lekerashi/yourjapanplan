"use client";

import { useMemo, useState } from "react";
import {
  TRANSPORT_ROUTES,
  JR_PASS_PRICES,
} from "@/lib/data/transport-routes";
import { cn } from "@/lib/utils";

const STATIONS = Array.from(
  new Set(
    TRANSPORT_ROUTES.filter(
      (r) => !r.primary_method.toLowerCase().includes("flight"),
    ).flatMap((r) => [r.from_name, r.to_name]),
  ),
).sort((a, b) => a.localeCompare(b));

type PassKey = "7-day" | "14-day" | "21-day";

const PASSES: { key: PassKey; label: string }[] = [
  { key: "7-day", label: "7 day" },
  { key: "14-day", label: "14 day" },
  { key: "21-day", label: "21 day" },
];

function fareFor(from: string, to: string): number | null {
  if (from === to) return 0;
  const match =
    TRANSPORT_ROUTES.find(
      (r) =>
        !r.primary_method.toLowerCase().includes("flight") &&
        ((r.from_name === from && r.to_name === to) ||
          (r.from_name === to && r.to_name === from)),
    ) ?? null;
  return match ? match.cost_jpy : null;
}

type Leg = { from: string; to: string };

const DEFAULT_LEGS: Leg[] = [
  { from: "Tokyo", to: "Kyoto" },
  { from: "Kyoto", to: "Hiroshima" },
  { from: "Hiroshima", to: "Tokyo" },
];

export function JRPassCalculator() {
  const [legs, setLegs] = useState<Leg[]>(DEFAULT_LEGS);
  const [passKey, setPassKey] = useState<PassKey>("14-day");

  const fares = useMemo(() => legs.map((l) => fareFor(l.from, l.to)), [legs]);
  const individual: number = fares.reduce<number>((s, f) => s + (f ?? 0), 0);
  const unknownCount = fares.filter((f) => f === null).length;
  const passPrice = JR_PASS_PRICES[passKey].ordinary;
  const savings = individual - passPrice;
  const worth = savings > 0;

  const updateLeg = (i: number, key: keyof Leg, value: string) => {
    setLegs((ls) => ls.map((l, j) => (j === i ? { ...l, [key]: value } : l)));
  };
  const addLeg = () =>
    setLegs((ls) => [...ls, { from: "Tokyo", to: "Nagoya" }]);
  const removeLeg = (i: number) =>
    setLegs((ls) => ls.filter((_, j) => j !== i));

  return (
    <div className="grid gap-0 border border-border bg-card md:grid-cols-2">
      <div className="border-b border-border p-[clamp(20px,3vw,36px)] md:border-r md:border-b-0">
        <h3 className="font-display text-[clamp(22px,2.4vw,26px)] font-medium tracking-[-0.01em] text-foreground">
          Your route
        </h3>
        <p className="mt-1 text-[14px] text-ink-2">
          Add every rail leg you&apos;d take. Return trips count twice. Flights
          aren&apos;t covered by the pass.
        </p>

        <div className="mt-6">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Legs
          </div>
          <div className="mt-3 flex flex-col gap-2.5">
            {legs.map((leg, i) => {
              const fare = fares[i];
              const knownFare = fare !== null;
              return (
                <div key={i} className="flex flex-col gap-1">
                  <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                    <select
                      value={leg.from}
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
                      value={leg.to}
                      onChange={(e) => updateLeg(i, "to", e.target.value)}
                      className="h-10 w-full border border-border bg-background px-3 text-[14px] text-foreground focus:border-foreground focus:outline-none"
                      aria-label={`Leg ${i + 1} destination`}
                    >
                      {STATIONS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeLeg(i)}
                      disabled={legs.length === 1}
                      aria-label={`Remove leg ${i + 1}`}
                      className="inline-flex h-10 w-10 items-center justify-center border border-border bg-background text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        aria-hidden
                      >
                        <path d="M3 8h10" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between pl-1 text-[11px] text-muted-foreground">
                    <span
                      className={cn(
                        !knownFare && "text-accent",
                        "uppercase tracking-[0.12em]",
                      )}
                    >
                      {knownFare
                        ? `¥${(fare ?? 0).toLocaleString()}`
                        : "No direct route data"}
                    </span>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addLeg}
              className="border border-dashed border-border py-2.5 text-[13px] font-medium text-ink-2 transition-colors hover:border-foreground hover:text-foreground"
            >
              + Add leg
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Pass length
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {PASSES.map((p) => {
              const on = p.key === passKey;
              const price = JR_PASS_PRICES[p.key].ordinary;
              return (
                <button
                  key={p.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPassKey(p.key)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 border py-3.5 transition-colors",
                    on
                      ? "border-accent bg-accent/5 ring-1 ring-inset ring-accent"
                      : "border-border bg-background hover:border-foreground",
                  )}
                >
                  <span className="font-display text-[17px] font-semibold tracking-[-0.01em] text-foreground">
                    {p.label}
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    ¥{price.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-[clamp(20px,3vw,36px)]">
        <div>
          <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Verdict
          </p>
          <h3 className="mt-3 font-display text-[clamp(28px,3.2vw,40px)] font-medium leading-[1.05] tracking-[-0.015em] text-foreground">
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

        <dl className="flex flex-col gap-2 border-t border-border pt-5">
          <VerdictRow label="Individual fares" value={individual} />
          <VerdictRow
            label={`${passKey.replace("-day", " day")} pass`}
            value={passPrice}
          />
          <VerdictRow
            label={worth ? "You save" : "You lose"}
            value={Math.abs(savings)}
            emphasize
          />
        </dl>

        {unknownCount > 0 && (
          <p className="text-[12px] text-accent">
            {unknownCount === 1
              ? "One leg has no route data — its fare is counted as ¥0."
              : `${unknownCount} legs have no route data — their fares are counted as ¥0.`}
          </p>
        )}

        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          Prices are approximate and may vary by seat class, season, and
          operator.
        </p>
      </div>
    </div>
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
        emphasize && "mt-3 border-t border-border pt-3",
      )}
    >
      <dt className="text-[13px] font-medium text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "tabular-nums",
          emphasize
            ? "font-display text-[26px] font-semibold tracking-[-0.01em] text-foreground"
            : "text-[14px] text-foreground",
        )}
      >
        ¥{value.toLocaleString()}
      </dd>
    </div>
  );
}
