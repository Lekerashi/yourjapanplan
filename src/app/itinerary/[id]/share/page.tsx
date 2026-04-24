"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ItineraryDayCard } from "@/components/itinerary/itinerary-day-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SharedItinerary {
  id: string;
  title: string;
  is_public: boolean;
  jr_pass_recommended: boolean | null;
  jr_pass_reasoning: string | null;
  total_budget_estimate: string | null;
  travel_style: string | null;
  preferences_snapshot: {
    generated_plan?: {
      title: string;
      days: {
        day_number: number;
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

export default function SharePage() {
  const params = useParams();
  const id = params.id as string;
  const [itinerary, setItinerary] = useState<SharedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/itinerary?id=${id}&public=true`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setItinerary)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-accent" />
      </div>
    );
  }

  if (notFound || !itinerary) {
    return (
      <div className="mx-auto max-w-[720px] px-[clamp(20px,4vw,40px)] py-20 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Private or removed
        </p>
        <h1 className="mt-3 font-display text-[clamp(28px,3.5vw,40px)] font-medium tracking-[-0.015em] text-foreground">
          This itinerary isn&apos;t available.
        </h1>
        <p className="mt-3 max-w-[44ch] text-[15px] text-ink-2 mx-auto">
          Ask the owner to make it public, or build your own plan from scratch.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button render={<Link href="/itinerary/new" />}>
            Create your own
          </Button>
          <Button variant="outline" render={<Link href="/quiz" />}>
            Take the quiz
          </Button>
        </div>
      </div>
    );
  }

  const plan = itinerary.preferences_snapshot?.generated_plan;
  const days = plan?.days ?? [];

  return (
    <div className="mx-auto max-w-[1000px] px-[clamp(20px,4vw,40px)] py-[clamp(48px,8vw,96px)]">
      <div className="border-b border-border pb-8 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Shared itinerary
        </p>
        <h1 className="mt-3 font-display text-[clamp(32px,4vw,52px)] font-medium leading-[1.02] tracking-[-0.02em] text-foreground">
          {itinerary.title}
        </h1>
        {itinerary.travel_style && (
          <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            {itinerary.travel_style}
          </p>
        )}
      </div>

      {days.length > 0 && (
        <div className="mt-10 flex flex-col gap-6">
          {days.map((day) => (
            <ItineraryDayCard key={day.day_number} day={day} />
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-4 md:grid-cols-3">
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

      <div className="mt-12 border-t border-border pt-8 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Plan your own
        </p>
        <h3 className="mt-3 font-display text-[clamp(24px,2.8vw,32px)] font-medium tracking-[-0.01em] text-foreground">
          Want a plan that fits{" "}
          <span className="font-display italic font-normal text-accent">
            your trip?
          </span>
        </h3>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button render={<Link href="/itinerary/new" />}>
            Build your itinerary
          </Button>
          <Button variant="outline" render={<Link href="/quiz" />}>
            Take the quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
