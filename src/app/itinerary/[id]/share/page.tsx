"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ItineraryDayCard } from "@/components/itinerary/itinerary-day-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Train,
  Wallet,
  Backpack,
  MapPin,
  CalendarCheck,
  Lock,
} from "lucide-react";

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
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (notFound || !itinerary) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <Card>
          <CardContent className="py-12">
            <Lock className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h1 className="mt-4 text-2xl font-bold">
              Itinerary Not Available
            </h1>
            <p className="mt-2 text-muted-foreground">
              This itinerary is private or doesn&apos;t exist. Ask the owner to
              make it public, or create your own plan.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button render={<Link href="/itinerary/new" />}>
                <MapPin className="mr-2 h-4 w-4" />
                Create Your Own
              </Button>
              <Button variant="outline" render={<Link href="/quiz" />}>
                Take the Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const plan = itinerary.preferences_snapshot?.generated_plan;
  const days = plan?.days ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <CalendarCheck className="h-4 w-4 text-rose-500" />
          Shared Itinerary
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {itinerary.title}
        </h1>
        {itinerary.travel_style && (
          <Badge variant="secondary" className="mt-2">
            {itinerary.travel_style}
          </Badge>
        )}
      </div>

      {/* Day cards */}
      {days.length > 0 && (
        <div className="space-y-6">
          {days.map((day) => (
            <ItineraryDayCard key={day.day_number} day={day} />
          ))}
        </div>
      )}

      {/* Summary cards */}
      <div className="mt-10 space-y-4">
        {itinerary.jr_pass_reasoning && (
          <Card>
            <CardContent className="flex gap-4 p-5">
              <Train className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">JR Pass</h3>
                  <Badge
                    variant={
                      itinerary.jr_pass_recommended ? "default" : "secondary"
                    }
                  >
                    {itinerary.jr_pass_recommended
                      ? "Recommended"
                      : "Not needed"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {itinerary.jr_pass_reasoning}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {itinerary.total_budget_estimate && (
          <Card>
            <CardContent className="flex gap-4 p-5">
              <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
              <div>
                <h3 className="font-semibold">Estimated Budget</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {itinerary.total_budget_estimate} (excluding international
                  flights)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {plan?.packing_tips && plan.packing_tips.length > 0 && (
          <Card>
            <CardContent className="flex gap-4 p-5">
              <Backpack className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
              <div>
                <h3 className="font-semibold">Packing Tips</h3>
                <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                  {plan.packing_tips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <p className="text-sm text-muted-foreground">
          Want to plan your own trip?
        </p>
        <div className="mt-3 flex justify-center gap-3">
          <Button render={<Link href="/itinerary/new" />}>
            <MapPin className="mr-2 h-4 w-4" />
            Build Your Itinerary
          </Button>
          <Button variant="outline" render={<Link href="/quiz" />}>
            Take the Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
