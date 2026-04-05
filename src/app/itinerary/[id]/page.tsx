"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ItineraryDayCard } from "@/components/itinerary/itinerary-day-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  Train,
  Wallet,
  Backpack,
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
      `${window.location.origin}/itinerary/${id}/share`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Itinerary not found</h1>
        <p className="mt-2 text-muted-foreground">
          {error ?? "Sign in to view your saved itineraries."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button render={<Link href="/itinerary/new" />}>
            Build New Itinerary
          </Button>
          <Button variant="outline" render={<Link href="/auth" />}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const plan = itinerary.preferences_snapshot?.generated_plan;
  const days = plan?.days ?? [];
  const canEdit = !!itinerary.preferences_snapshot?.builder_state;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Button
        variant="ghost"
        size="sm"
        render={<Link href="/itinerary/saved" />}
        className="mb-6 -ml-2 print:hidden"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        My Itineraries
      </Button>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {itinerary.title}
        </h1>
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
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Day cards */}
      {days.length > 0 && (
        <div className="mt-8 space-y-6">
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

      {/* Share & Visibility */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
        >
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
            Add to Calendar
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleTogglePublic}
          disabled={togglingPublic}
        >
          {itinerary.is_public ? (
            <>
              <Globe className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
              Public
            </>
          ) : (
            <>
              <Lock className="mr-1.5 h-3.5 w-3.5" />
              Private
            </>
          )}
        </Button>

        <Button variant="outline" onClick={handleCopyShare}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-emerald-600" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" />
              Copy Share Link
            </>
          )}
        </Button>
      </div>

      {!itinerary.is_public && (
        <p className="mt-2 text-center text-xs text-muted-foreground print:hidden">
          Make your itinerary public for the share link to work.
        </p>
      )}
    </div>
  );
}
