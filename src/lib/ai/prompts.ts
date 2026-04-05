export const SYSTEM_PROMPT = `You are an expert Japan travel planner with deep knowledge of every region, season, and travel style across Japan. You have helped thousands of travelers plan their perfect trips.

Your recommendations are grounded in REAL destination data provided to you. You must ONLY recommend destinations from the data provided — never invent places, restaurants, or train lines.

When recommending destinations:
- Explain WHY each destination matches the traveler's specific preferences
- Consider seasonal factors (cherry blossoms, foliage, snow, festivals, crowds)
- Account for travel logistics (distance between destinations, transport time)
- Be honest about crowd levels and suggest ways to avoid peak times
- For first-time visitors, include iconic must-sees alongside your picks
- For repeat visitors, lean toward lesser-known gems

Keep your tone warm, knowledgeable, and enthusiastic — like a friend who lives in Japan and loves helping people plan trips.`;

interface QuizParams {
  travelStyle: string;
  interests: string[];
  season: string;
  durationDays: number;
  budget: string;
  pace: string;
  crowdTolerance: string;
  eveningPreference?: string;
  firstTime: boolean;
  mustVisit: string[];
}

const EVENING_PREF_DESCRIPTIONS: Record<string, string> = {
  early: "Early Bird — prefers to be back at the hotel by 9pm",
  moderate: "Moderate — happy staying out until 10-11pm",
  nightowl: "Night Owl — loves late nights, bars, and nightlife",
};

const TRAVEL_STYLE_HINTS: Record<string, string> = {
  honeymoon: "This is a HONEYMOON trip — prioritize romantic experiences: luxury ryokans with private onsen, kaiseki fine dining, scenic and intimate settings, and special couple-oriented activities. Avoid crowded tourist traps and party nightlife.",
  couple: "Traveling as a couple — suggest romantic dining, scenic spots, and a balanced mix of activities.",
  solo: "Solo traveler — suggest places that are easy to navigate alone, with good hostel/social scenes and safe late-night options.",
  friends: "Group of friends — prioritize fun experiences, nightlife, food crawls, and group-friendly activities.",
  family: "Family trip — prioritize kid-friendly activities, accessible routes, and a comfortable pace.",
  workcation: "Working remotely — suggest destinations with good WiFi, cafes, and a relaxed pace with things to do after work hours.",
};

export function buildRecommendationPrompt(
  params: QuizParams,
  destinationData: string
): string {
  const lines = [
    `The traveler is planning a trip to Japan. Here are their preferences:`,
    ``,
    `- **Travel style**: ${params.travelStyle}`,
    `- **Interests**: ${params.interests.join(", ")}`,
    `- **Season**: ${params.season}`,
    `- **Trip duration**: ${params.durationDays} days`,
    `- **Budget**: ${params.budget}`,
    `- **Pace**: ${params.pace} (${params.pace === "relaxed" ? "2-3 activities/day" : params.pace === "moderate" ? "3-4 activities/day" : "5+ activities/day"})`,
    `- **Crowd tolerance**: ${params.crowdTolerance}`,
    `- **Evening preference**: ${EVENING_PREF_DESCRIPTIONS[params.eveningPreference ?? "moderate"] ?? "Moderate"}`,
    `- **First time in Japan**: ${params.firstTime ? "Yes" : "No, they've been before"}`,
  ];

  if (params.mustVisit.length > 0) {
    lines.push(`- **Must visit**: ${params.mustVisit.join(", ")}`);
  }

  const styleHint = TRAVEL_STYLE_HINTS[params.travelStyle];
  if (styleHint) {
    lines.push(``, `**Style note**: ${styleHint}`);
  }

  if (params.eveningPreference === "nightowl") {
    lines.push(``, `**Evening note**: This traveler loves nightlife — rank destinations with vibrant bar scenes, late-night districts, and evening food culture higher. Tokyo, Osaka, Fukuoka, and Sapporo are strong picks for night owls.`);
  }

  lines.push(
    ``,
    `Here are the available destinations with their details:`,
    ``,
    destinationData,
    ``,
    `Based on their preferences, recommend the best destinations for their ${params.durationDays}-day trip. Rank them by match quality. Suggest how many days to spend at each so the total adds up to roughly ${params.durationDays} days (allow 1-2 days flexibility). Include 4-7 destinations depending on trip length and pace.`,
  );

  return lines.join("\n");
}
