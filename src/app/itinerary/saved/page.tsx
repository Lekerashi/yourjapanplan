"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, CalendarCheck, Trash2 } from "lucide-react";

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
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Sign in to view your itineraries</h1>
        <p className="mt-2 text-muted-foreground">
          Save and access your Japan travel plans from any device.
        </p>
        <Button render={<Link href="/auth" />} className="mt-6">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My Itineraries
        </h1>
        <Button size="sm" render={<Link href="/itinerary/new" />}>
          <Plus className="mr-1.5 h-4 w-4" />
          New
        </Button>
      </div>

      {itineraries.length === 0 ? (
        <div className="mt-16 text-center">
          <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No itineraries yet</h2>
          <p className="mt-1 text-muted-foreground">
            Create your first Japan travel plan.
          </p>
          <Button render={<Link href="/itinerary/new" />} className="mt-6">
            Build an Itinerary
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {itineraries.map((it) => (
            <Link key={it.id} href={`/itinerary/${it.id}`} className="block">
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{it.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {it.travel_style}
                      {it.total_budget_estimate
                        ? ` · ${it.total_budget_estimate}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {new Date(it.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, it.id)}
                      disabled={deletingId === it.id}
                      className="rounded-md p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {deletingId === it.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
