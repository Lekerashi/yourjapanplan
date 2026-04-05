import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import { SYSTEM_PROMPT, buildRecommendationPrompt } from "@/lib/ai/prompts";
import { recommendationResponseSchema } from "@/lib/ai/schemas";
import { SEED_DESTINATIONS } from "@/lib/ai/seed-destinations";
import { formatDestinationsForPrompt } from "@/lib/ai/destinations-context";
import type { DestinationRow } from "@/lib/ai/destinations-context";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    travelStyle,
    interests,
    season,
    durationDays,
    budget,
    pace,
    crowdTolerance,
    eveningPreference,
    firstTime,
    mustVisit = [],
  } = body;

  // Filter destinations by relevance (season + at least one matching tag)
  // For now, use seed data. When Supabase is connected, query the DB instead.
  const candidates = filterDestinations(SEED_DESTINATIONS, {
    season,
    interests,
    crowdTolerance,
  });

  const destinationContext = formatDestinationsForPrompt(candidates);

  const prompt = buildRecommendationPrompt(
    {
      travelStyle,
      interests,
      season,
      durationDays,
      budget,
      pace,
      crowdTolerance,
      eveningPreference,
      firstTime,
      mustVisit,
    },
    destinationContext
  );

  const result = streamObject({
    model: anthropic("claude-sonnet-4-20250514"),
    system: SYSTEM_PROMPT,
    prompt,
    schema: recommendationResponseSchema,
  });

  return result.toTextStreamResponse();
}

function filterDestinations(
  destinations: DestinationRow[],
  filters: {
    season: string;
    interests: string[];
    crowdTolerance: string;
  }
): DestinationRow[] {
  return destinations.filter((d) => {
    // If a specific season is chosen, prefer destinations good in that season
    // but don't exclude others entirely (the AI can decide)
    const seasonMatch =
      filters.season === "flexible" ||
      d.best_seasons.includes(filters.season);

    // At least one interest tag matches
    const interestMatch = d.tags.some((t) => filters.interests.includes(t));

    // For low crowd tolerance, we still include crowded destinations
    // but the AI will factor in crowd levels
    return seasonMatch || interestMatch;
  });
}
