"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { SectionHead } from "@/components/home/section-head";

interface ItinerarySummary {
  id: string;
  title: string;
  travel_style: string;
  total_budget_estimate: string | null;
  created_at: string;
}

export default function SavedItinerariesPage() {
  const [itineraries, setItineraries] = useState<ItinerarySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/itinerary")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setItineraries)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this itinerary? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/itinerary?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItineraries((prev) => prev.filter((it) => it.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[900px] px-[clamp(20px,4vw,40px)] py-[clamp(48px,8vw,96px)] text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Sign in required
        </p>
        <h1 className="mt-3 font-display text-[clamp(28px,3.5vw,40px)] font-medium tracking-[-0.015em] text-foreground">
          Sign in to view your itineraries.
        </h1>
        <p className="mt-3 text-[15px] text-ink-2">
          Save and access your Japan travel plans from any device.
        </p>
        <Button render={<Link href="/auth" />} className="mt-7">
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-[clamp(48px,8vw,96px)]">
      <SectionHead
        eyebrow="Your itineraries"
        title={
          <>
            Saved{" "}
            <span className="font-display italic font-normal text-accent">
              plans.
            </span>
          </>
        }
        lede="Every trip you've built. Click through to view, edit, share, or print."
      />

      <div className="mt-8 flex justify-end">
        <Button size="sm" render={<Link href="/itinerary/new" />}>
          New itinerary
        </Button>
      </div>

      {itineraries.length === 0 ? (
        <div className="mt-16 text-center">
          <h2 className="font-display text-[22px] font-medium tracking-[-0.01em] text-foreground">
            Nothing saved yet.
          </h2>
          <p className="mt-3 text-[14px] text-ink-2">
            Build your first Japan travel plan.
          </p>
          <Button
            render={<Link href="/itinerary/new" />}
            className="mt-6"
            size="sm"
          >
            Build an itinerary
          </Button>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col border-t border-border">
          {itineraries.map((it) => (
            <li
              key={it.id}
              className="relative border-b border-border"
            >
              <Link
                href={`/itinerary/${it.id}`}
                className="group flex items-center justify-between gap-4 py-5 pr-12 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[20px] font-medium tracking-[-0.01em] text-foreground transition-colors group-hover:text-accent">
                    {it.title}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {it.travel_style}
                    {it.total_budget_estimate
                      ? ` · ${it.total_budget_estimate}`
                      : ""}
                  </div>
                </div>
                <span className="shrink-0 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  {new Date(it.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </Link>
              <button
                type="button"
                onClick={(e) => handleDelete(e, it.id)}
                disabled={deletingId === it.id}
                aria-label="Delete itinerary"
                className="absolute top-1/2 right-0 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
              >
                {deletingId === it.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
