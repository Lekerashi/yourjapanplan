"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ItineraryDayCard } from "@/components/itinerary/itinerary-day-card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Share2,
  Pencil,
  Trash2,
  Globe,
  Lock,
  Check,
  Printer,
  CalendarPlus,
} from "lucide-react";
import { generateICS, downloadICS } from "@/lib/utils/ical-export";
import { cn } from "@/lib/utils";

interface SavedItinerary {
  id: string;
  title: string;
  share_token: string;
  is_public: boolean;
  start_date: string | null;
  jr_pass_recommended: boolean | null;
  jr_pass_reasoning: string | null;
  total_budget_estimate: string | null;
  preferences_snapshot: {
    builder_state?: {
      destinations: unknown[];
      builderDays: unknown[];
      eveningPreference?: string;
    };
    generated_plan?: {
      title: string;
      days: {
        day_number: number;
        destination_slug: string;
        destination_name: string;
        theme: string;
        activities: {
          time: string;
          title: string;
          description: string;
          duration_minutes: number;
          reservation_required: boolean;
          cost_estimate: string;
          tip: string | null;
        }[];
        transport: {
          from: string;
          to: string;
          method: string;
          duration: string;
          cost: string;
          tip: string | null;
        } | null;
        accommodation: {
          name: string;
          area: string;
          type: string;
          reasoning: string;
        };
      }[];
      packing_tips?: string[];
    };
  };
}

function SummaryBlock({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title?: string;
  body: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-card p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {eyebrow}
      </p>
      {title && (
        <h3 className="mt-2 font-display text-[20px] font-medium tracking-[-0.01em] text-foreground">
          {title}
        </h3>
      )}
      <div className="mt-3 text-[14px] leading-[1.6] text-ink-2">{body}</div>
    </section>
  );
}

export default function ItineraryViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [itinerary, setItinerary] = useState<SavedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingPublic, setTogglingPublic] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/itinerary?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load itinerary");
        return res.json();
      })
      .then(setItinerary)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleTogglePublic = async () => {
    if (!itinerary) return;
    setTogglingPublic(true);
    try {
      const res = await fetch("/api/itinerary", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_public: !itinerary.is_public }),
      });
      if (res.ok) {
        setItinerary({ ...itinerary, is_public: !itinerary.is_public });
      }
    } finally {
      setTogglingPublic(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this itinerary? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/itinerary?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/itinerary/saved");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/itinerary/${id}/share`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="mx-auto max-w-[720px] px-[clamp(20px,4vw,40px)] py-20 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Not found
        </p>
        <h1 className="mt-3 font-display text-[clamp(28px,3.5vw,40px)] font-medium tracking-[-0.015em] text-foreground">
          Itinerary not available.
        </h1>
        <p className="mt-3 text-[15px] text-ink-2">
          {error ?? "Sign in to view your saved itineraries."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button render={<Link href="/itinerary/new" />}>
            Build new itinerary
          </Button>
          <Button variant="outline" render={<Link href="/auth" />}>
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  const plan = itinerary.preferences_snapshot?.generated_plan;
  const days = plan?.days ?? [];
  const canEdit = !!itinerary.preferences_snapshot?.builder_state;

  return (
    <div className="mx-auto max-w-[1000px] px-[clamp(20px,4vw,40px)] py-[clamp(48px,8vw,96px)]">
      <Button
        variant="ghost"
        size="sm"
        render={<Link href="/itinerary/saved" />}
        className="-ml-3 print:hidden"
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
        My itineraries
      </Button>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-5 border-b border-border pb-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Your plan
          </p>
          <h1 className="mt-2 font-display text-[clamp(32px,4vw,52px)] font-medium leading-[1.02] tracking-[-0.02em] text-foreground">
            {itinerary.title}
          </h1>
        </div>
        <div className="flex shrink-0 gap-2 print:hidden">
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/itinerary/new?edit=${id}`} />}
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete itinerary"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {days.length > 0 && (
        <div className="mt-10 flex flex-col gap-6">
          {days.map((day) => (
            <ItineraryDayCard key={day.day_number} day={day} />
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-4 md:grid-cols-3 print:hidden">
        {itinerary.jr_pass_reasoning && (
          <SummaryBlock
            eyebrow="JR Pass"
            title={
              itinerary.jr_pass_recommended ? "Recommended" : "Not needed"
            }
            body={itinerary.jr_pass_reasoning}
          />
        )}
        {itinerary.total_budget_estimate && (
          <SummaryBlock
            eyebrow="Budget"
            title={itinerary.total_budget_estimate}
            body="Activities only. Flights, lodging, and most meals not included."
          />
        )}
        {plan?.packing_tips && plan.packing_tips.length > 0 && (
          <SummaryBlock
            eyebrow="Packing tips"
            body={
              <ul className="flex flex-col gap-1.5">
                {plan.packing_tips.map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <span
                      aria-hidden
                      className="mt-[9px] inline-block h-1 w-1 shrink-0 rounded-full bg-accent"
                    />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            }
          />
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-8 print:hidden">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="mr-1.5 h-3.5 w-3.5" />
          Print / PDF
        </Button>

        {itinerary.start_date && days.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const calDays = days.map((day, i) => {
                const date = new Date(itinerary.start_date + "T00:00:00");
                date.setDate(date.getDate() + i);
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                return {
                  date: dateStr,
                  destination_name: day.destination_name ?? "",
                  activities: (day.activities ?? []).map((a) => ({
                    time: a.time ?? "09:00",
                    title: a.title ?? "Activity",
                    description: a.description ?? "",
                    duration_minutes: a.duration_minutes ?? 60,
                    location: day.destination_name ?? "",
                  })),
                  transport: day.transport,
                };
              });
              const ics = generateICS(calDays, itinerary.title);
              downloadICS(ics, `${itinerary.title.replace(/\s+/g, "-")}.ics`);
            }}
          >
            <CalendarPlus className="mr-1.5 h-3.5 w-3.5" />
            Add to calendar
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleTogglePublic}
          disabled={togglingPublic}
          className={cn(itinerary.is_public && "border-accent text-accent")}
        >
          {itinerary.is_public ? (
            <>
              <Globe className="mr-1.5 h-3.5 w-3.5" />
              Public
            </>
          ) : (
            <>
              <Lock className="mr-1.5 h-3.5 w-3.5" />
              Private
            </>
          )}
        </Button>

        <Button variant="outline" size="sm" onClick={handleCopyShare}>
          {copied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5 text-accent" />
              Copied
            </>
          ) : (
            <>
              <Share2 className="mr-1.5 h-3.5 w-3.5" />
              Copy share link
            </>
          )}
        </Button>
      </div>

      {!itinerary.is_public && (
        <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground print:hidden">
          Make your itinerary public for the share link to work.
        </p>
      )}
    </div>
  );
}
