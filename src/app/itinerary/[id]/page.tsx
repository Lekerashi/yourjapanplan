import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Itinerary | Your Japan Plan",
  description: "View your personalized Japan travel itinerary.",
};

export default function ItineraryViewPage() {
  // Phase 5 will load saved itineraries from Supabase by ID.
  // For now, show a placeholder that directs users to create a new one.
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Itinerary
      </h1>
      <p className="mt-3 text-muted-foreground">
        Saved itineraries will be available once you sign in. For now, generate a
        fresh itinerary to view it.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button render={<Link href="/itinerary/new" />}>
          Build New Itinerary
        </Button>
        <Button variant="outline" render={<Link href="/quiz" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Take the Quiz First
        </Button>
      </div>
    </div>
  );
}
