import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Interests } from "@/components/home/interests";
import { HowItWorks } from "@/components/home/how-it-works";
import { DestinationsPreview } from "@/components/home/destinations-preview";
import { ItineraryPreview } from "@/components/home/itinerary-preview";
import { JRPassPreview } from "@/components/home/jr-pass-preview";
import { QuizPreview } from "@/components/home/quiz-preview";
import { CTABand } from "@/components/home/cta-band";
import { HomeDemoProvider } from "@/components/home/home-demo-context";

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

export default function Home() {
  return (
    <HomeDemoProvider>
      <Hero />
      <HowItWorks />
      <Interests />
      <DestinationsPreview />
      <ItineraryPreview />
      <JRPassPreview />
      <QuizPreview />
      <CTABand />
    </HomeDemoProvider>
  );
}
