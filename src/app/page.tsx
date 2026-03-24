import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Your Japan Plan — Japan Trip Planner & Itinerary Builder",
  description:
    "Plan your perfect Japan trip. Build custom day-by-day itineraries, discover the best destinations from Tokyo to Okinawa, calculate JR Pass savings, and know what to book in advance.",
  keywords: [
    "Japan trip planner",
    "Japan itinerary builder",
    "plan Japan trip",
    "Japan vacation planner",
    "where to go in Japan",
    "Japan travel planner",
    "custom Japan itinerary",
    "Japan for first timers",
  ],
};
import {
  MapPin,
  Sparkles,
  Calendar,
  Train,
  Bookmark,
  Share2,
  ArrowRight,
} from "lucide-react";
import { INTEREST_TAGS } from "@/lib/constants";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Personalized Recommendations",
    description:
      "Tell us what you love and we'll match you with the perfect destinations across Japan.",
  },
  {
    icon: Calendar,
    title: "Custom Itineraries",
    description:
      "Get a day-by-day plan with activities, timing, transport, and restaurant tips.",
  },
  {
    icon: Train,
    title: "JR Pass Calculator",
    description:
      "Find out if the Japan Rail Pass saves you money based on your specific route.",
  },
  {
    icon: Bookmark,
    title: "Reservation Alerts",
    description:
      "Know exactly what to book in advance — from restaurants to ryokans to temple visits.",
  },
  {
    icon: MapPin,
    title: "Where to Stay",
    description:
      "Neighborhood-level hotel tips based on your interests and itinerary.",
  },
  {
    icon: Share2,
    title: "Save & Share",
    description:
      "Save your itinerary, make changes anytime, and share it with your travel group.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 to-background">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-500">
              Plan your perfect Japan trip
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
              Discover where in Japan{" "}
              <span className="text-rose-500">you</span> should go
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Pick your destinations, choose activities, and build a
              personalized itinerary with lodging tips and everything you
              need to book in advance.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button render={<Link href="/quiz" />} size="lg">
                Take the Quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button render={<Link href="/itinerary/new" />} variant="outline" size="lg">
                Custom Itinerary
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interest tags */}
      <section className="border-y bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {INTEREST_TAGS.map((tag) => (
              <span
                key={tag.value}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background px-4 py-2 text-sm font-medium"
              >
                <span>{tag.icon}</span>
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-muted-foreground">
              Three steps to your dream Japan trip
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Take the quiz",
                description:
                  "Answer a few questions about your travel style, interests, dates, and budget.",
              },
              {
                step: "2",
                title: "Get recommendations",
                description:
                  "We analyze your preferences and match you with the best destinations in Japan.",
              },
              {
                step: "3",
                title: "Build your itinerary",
                description:
                  "Generate a detailed day-by-day plan you can customize, save, and share.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-lg font-bold text-rose-600">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for Japan
            </h2>
            <p className="mt-4 text-muted-foreground">
              From first-timers to repeat visitors, we cover the details that
              make or break a trip.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <feature.icon className="h-8 w-8 text-rose-500" />
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to plan your Japan adventure?
            </h2>
            <p className="mt-4 text-muted-foreground">
              It only takes a couple minutes. No account required to get
              started.
            </p>
            <Button render={<Link href="/itinerary/new" />} size="lg" className="mt-8">
              Start Planning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
