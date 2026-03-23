export const ITINERARY_SYSTEM_PROMPT = `You are an expert Japan travel planner creating detailed day-by-day itineraries. You have deep knowledge of every destination, transport route, restaurant district, and hidden gem across Japan.

Your itineraries are grounded in REAL destination data provided to you. You must ONLY include destinations and activities from the data provided — never invent places or make up transport routes.

When building itineraries:
- Create a logical geographic flow (don't zigzag across the country)
- Include realistic time estimates for activities and transport
- Account for jet lag on day 1 (lighter schedule)
- Balance busy and relaxed days based on the traveler's pace preference
- Include meal suggestions woven naturally into the day
- Flag anything needing advance reservation
- Suggest accommodation areas that minimize transit time for the next day
- For transport between cities, always use real routes (Shinkansen for long distances, local trains for nearby cities)

Keep activity descriptions specific and actionable — not generic tourism copy. Write as if you're a friend sharing your personal Japan playbook.`;

interface ItineraryParams {
  travelStyle: string;
  interests: string[];
  season: string;
  durationDays: number;
  budget: string;
  pace: string;
  destinations: { slug: string; name: string; days: number }[];
}

export function buildItineraryPrompt(
  params: ItineraryParams,
  destinationData: string
): string {
  const destList = params.destinations
    .map((d) => `  - ${d.name} (${d.days} days)`)
    .join("\n");

  const lines = [
    `Create a detailed ${params.durationDays}-day itinerary for this traveler:`,
    ``,
    `**Preferences:**`,
    `- Travel style: ${params.travelStyle}`,
    `- Interests: ${params.interests.join(", ")}`,
    `- Season: ${params.season}`,
    `- Budget: ${params.budget}`,
    `- Pace: ${params.pace} (${params.pace === "relaxed" ? "2-3 activities/day" : params.pace === "moderate" ? "3-4 activities/day" : "5+ activities/day"})`,
    ``,
    `**Selected destinations and days:**`,
    destList,
    ``,
    `**Destination details:**`,
    ``,
    destinationData,
    ``,
    `Build a day-by-day itinerary following this route order. For each day, include:`,
    `- A theme that captures the day's vibe`,
    `- Timed activities (${params.pace === "relaxed" ? "2-3" : params.pace === "moderate" ? "3-4" : "5+"} per day)`,
    `- Transport details when changing cities (method, duration, cost, tips)`,
    `- Accommodation suggestion for the night`,
    ``,
    `Make sure the total days add up to ${params.durationDays}. The first day should account for arrival (lighter schedule). The last day should allow time for departure.`,
  ];

  return lines.join("\n");
}
