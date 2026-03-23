import { z } from "zod";

export const recommendationItemSchema = z.object({
  destination_slug: z.string().describe("The slug of the recommended destination"),
  match_score: z
    .number()
    .min(0)
    .max(100)
    .describe("How well this destination matches the user's preferences, 0-100"),
  reasoning: z
    .string()
    .describe("2-3 sentences explaining why this destination is a great fit for this traveler"),
  suggested_days: z
    .number()
    .min(1)
    .describe("How many days to spend at this destination"),
  highlights: z
    .array(z.string())
    .describe("3-5 specific things the traveler would love here based on their interests"),
  best_area_to_stay: z
    .string()
    .describe("Which neighborhood or area to stay in, based on their travel style"),
  must_reserve: z
    .array(z.string())
    .describe("Things that need advance reservations at this destination"),
});

export const recommendationResponseSchema = z.object({
  recommendations: z
    .array(recommendationItemSchema)
    .describe("Ranked list of destination recommendations, best match first"),
  trip_flow: z
    .string()
    .describe("A suggested order to visit these destinations with brief transport notes"),
  seasonal_tip: z
    .string()
    .describe("A relevant tip about traveling Japan in their chosen season"),
  jr_pass_initial_take: z
    .string()
    .describe("Quick initial assessment of whether a JR Pass makes sense for this trip shape"),
});

export type RecommendationResponse = z.infer<typeof recommendationResponseSchema>;
export type RecommendationItem = z.infer<typeof recommendationItemSchema>;
