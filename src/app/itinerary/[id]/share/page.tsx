import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, CalendarCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Shared Itinerary | Your Japan Plan",
  description: "View a shared Japan travel itinerary.",
};

export default function SharePage() {
  // Phase 5 placeholder — will fetch itinerary by share_token from Supabase
  // Full implementation requires connecting the save flow end-to-end with a live DB
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <Card>
        <CardContent className="py-12">
          <CalendarCheck className="mx-auto h-12 w-12 text-rose-500" />
          <h1 className="mt-4 text-2xl font-bold">Shared Itinerary</h1>
          <p className="mt-2 text-muted-foreground">
            This itinerary was shared with you. Connect your Supabase project to
            view saved itineraries.
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
