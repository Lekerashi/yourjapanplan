import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import {
  ITINERARY_SYSTEM_PROMPT,
  buildItineraryPrompt,
} from "@/lib/ai/itinerary-prompts";
import { itineraryResponseSchema } from "@/lib/ai/itinerary-schemas";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { formatDestinationsForPrompt } from "@/lib/ai/destinations-context";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    travelStyle,
    interests,
    season,
    durationDays,
    budget,
    pace,
    destinations: selectedDestinations,
  } = body as {
    travelStyle: string;
    interests: string[];
    season: string;
    durationDays: number;
    budget: string;
    pace: string;
    destinations: { slug: string; name: string; days: number }[];
  };

  // Get full data for the selected destinations
  const destData = SEED_DESTINATIONS.filter((d) =>
    selectedDestinations.some((s) => s.slug === d.slug)
  );

  const destinationContext = formatDestinationsForPrompt(destData);

  const prompt = buildItineraryPrompt(
    {
      travelStyle,
      interests,
      season,
      durationDays,
      budget,
      pace,
      destinations: selectedDestinations,
    },
    destinationContext
  );

  const result = streamObject({
    model: anthropic("claude-sonnet-4-20250514"),
    system: ITINERARY_SYSTEM_PROMPT,
    prompt,
    schema: itineraryResponseSchema,
  });

  return result.toTextStreamResponse();
}
