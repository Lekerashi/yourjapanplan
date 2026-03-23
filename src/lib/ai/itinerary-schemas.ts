import { z } from "zod";

export const itineraryActivitySchema = z.object({
  time: z.string().describe("Time slot, e.g. '09:00' or 'Morning'"),
  title: z.string().describe("Activity name"),
  description: z
    .string()
    .describe("1-2 sentence description of what to do and why it's great"),
  duration_minutes: z.number().describe("Estimated duration in minutes"),
  reservation_required: z
    .boolean()
    .describe("Whether advance reservation is needed"),
  cost_estimate: z
    .string()
    .describe("Estimated cost in JPY, e.g. '¥1,500' or 'Free'"),
  tip: z
    .string()
    .nullable()
    .describe("Optional insider tip for this activity"),
});

export const itineraryTransportSchema = z.object({
  from: z.string().describe("Departure city/area"),
  to: z.string().describe("Arrival city/area"),
  method: z
    .string()
    .describe("Transport method, e.g. 'Shinkansen', 'Local train', 'Bus'"),
  duration: z.string().describe("Travel time, e.g. '2h 15m'"),
  cost: z.string().describe("Cost in JPY, e.g. '¥13,320'"),
  tip: z
    .string()
    .nullable()
    .describe("Optional transport tip (e.g. reserve window seat for Mt. Fuji views)"),
});

export const itineraryAccommodationSchema = z.object({
  name: z
    .string()
    .describe("Suggested type/area, e.g. 'Business hotel near Shinjuku Station'"),
  area: z.string().describe("Neighborhood/area name"),
  type: z
    .string()
    .describe("Accommodation type: hotel, ryokan, hostel, apartment"),
  reasoning: z
    .string()
    .describe("Why this area/type is best for this traveler"),
});

export const itineraryDaySchema = z.object({
  day_number: z.number().describe("Day number starting from 1"),
  destination_slug: z
    .string()
    .describe("Slug of the destination for this day"),
  destination_name: z.string().describe("Display name of the destination"),
  theme: z
    .string()
    .describe("Theme for the day, e.g. 'Traditional Kyoto & Temple Hopping'"),
  activities: z
    .array(itineraryActivitySchema)
    .describe("Ordered list of activities for the day"),
  transport: itineraryTransportSchema
    .nullable()
    .describe("Transport to next destination (null if staying in same city or last day)"),
  accommodation: itineraryAccommodationSchema.describe(
    "Where to stay this night"
  ),
});

export const itineraryResponseSchema = z.object({
  title: z
    .string()
    .describe("A catchy title for this itinerary, e.g. '10 Days of Culture & Cuisine'"),
  days: z
    .array(itineraryDaySchema)
    .describe("Day-by-day itinerary in chronological order"),
  jr_pass_recommended: z
    .boolean()
    .describe("Whether a JR Pass is recommended for this trip"),
  jr_pass_reasoning: z
    .string()
    .describe("Explanation of why JR Pass is or isn't worth it for this route"),
  packing_tips: z
    .array(z.string())
    .describe("3-5 packing tips specific to this trip's destinations and season"),
  total_budget_estimate: z
    .string()
    .describe("Rough total budget estimate for the trip (excluding flights), e.g. '¥150,000 - ¥200,000'"),
});

export type ItineraryResponse = z.infer<typeof itineraryResponseSchema>;
export type ItineraryDay = z.infer<typeof itineraryDaySchema>;
export type ItineraryActivity = z.infer<typeof itineraryActivitySchema>;
