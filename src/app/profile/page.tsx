"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Mail,
  CalendarCheck,
  Plus,
  LogOut,
} from "lucide-react";
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

      // Fetch itineraries
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
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
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
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            {user.email}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Joined {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* My Itineraries */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Itineraries</h2>
          <Button size="sm" render={<Link href="/itinerary/new" />}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New
          </Button>
        </div>

        {itineraries.length === 0 ? (
          <div className="mt-6 text-center py-8">
            <CalendarCheck className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              No itineraries yet. Start planning your Japan trip!
            </p>
            <Button
              render={<Link href="/itinerary/new" />}
              className="mt-4"
              size="sm"
            >
              Build an Itinerary
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {itineraries.map((it) => (
              <Link key={it.id} href={`/itinerary/${it.id}`} className="block">
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-medium">{it.title}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {it.travel_style}
                        {it.total_budget_estimate
                          ? ` · ${it.total_budget_estimate}`
                          : ""}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(it.created_at).toLocaleDateString()}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Account actions */}
      <div className="mt-10 border-t pt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="text-muted-foreground"
        >
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
