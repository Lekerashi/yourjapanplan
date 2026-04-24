"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface ItinerarySummary {
  id: string;
  title: string;
  travel_style: string;
  total_budget_estimate: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [itineraries, setItineraries] = useState<ItinerarySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth?next=/profile");
        return;
      }
      setUser(data.user);

      fetch("/api/itinerary")
        .then((res) => (res.ok ? res.json() : []))
        .then(setItineraries)
        .finally(() => setLoading(false));
    });
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-accent" />
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name ?? "Traveler";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-[900px] px-[clamp(20px,4vw,40px)] py-[clamp(48px,8vw,96px)]">
      <div className="flex items-center gap-5 border-b border-border pb-8">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-secondary font-display text-[18px] font-semibold text-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Your profile
          </p>
          <h1 className="mt-1.5 font-display text-[clamp(28px,3vw,36px)] font-medium tracking-[-0.015em] text-foreground">
            {displayName}
          </h1>
          <p className="mt-1 text-[14px] text-ink-2">
            {user.email} · Joined{" "}
            {new Date(user.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Saved itineraries
            </p>
            <h2 className="mt-2 font-display text-[24px] font-medium tracking-[-0.01em] text-foreground">
              Your plans
            </h2>
          </div>
          <Button size="sm" render={<Link href="/itinerary/new" />}>
            New itinerary
          </Button>
        </div>

        {itineraries.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-[14px] text-ink-2">
              No itineraries yet. Start planning a trip.
            </p>
            <Button
              render={<Link href="/itinerary/new" />}
              className="mt-5"
              size="sm"
            >
              Build an itinerary
            </Button>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col">
            {itineraries.map((it) => (
              <li
                key={it.id}
                className="border-b border-border last:border-b-0"
              >
                <Link
                  href={`/itinerary/${it.id}`}
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
                >
                  <div className="min-w-0">
                    <div className="font-display text-[17px] font-medium tracking-[-0.005em] text-foreground transition-colors group-hover:text-accent">
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
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
