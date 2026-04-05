// ============================================================
// Region & Destination Types
// ============================================================

export type Region =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "chugoku"
  | "shikoku"
  | "kyushu"
  | "okinawa";

export type InterestTag =
  | "onsen"
  | "nature"
  | "shopping"
  | "temples"
  | "food"
  | "nightlife"
  | "culture"
  | "adventure"
  | "beach"
  | "skiing";

export type ActivityType =
  | "sight"
  | "food"
  | "experience"
  | "shopping"
  | "nightlife"
  | "nature";

export type Season = "spring" | "summer" | "autumn" | "winter";

export type TravelStyle =
  | "solo"
  | "couple"
  | "friends"
  | "family"
  | "workcation"
  | "honeymoon";

export type BudgetLevel = "budget" | "moderate" | "luxury";

export type EveningPreference = "early" | "moderate" | "nightowl";

export type TripPace = "relaxed" | "moderate" | "packed";

// ============================================================
// Database Models
// ============================================================

export interface Destination {
  id: string;
  slug: string;
  name: string;
  region: Region;
  description: string;
  highlights: string[];
  best_seasons: Season[];
  crowd_level_by_month: Record<string, number>; // "1"-"12" → 1-5
  tags: InterestTag[];
  image_url: string;
  lat: number;
  lng: number;
  jr_accessible: boolean;
  reservation_tips: string;
  accommodation_zones: AccommodationZone[];
}

export interface AccommodationZone {
  name: string;
  description: string;
  best_for: string[];
}

export interface Activity {
  id: string;
  destination_id: string;
  name: string;
  description: string;
  type: ActivityType;
  duration_minutes: number;
  cost_estimate: string;
  reservation_required: boolean;
  reservation_url: string | null;
  best_time_of_day: string | null;
  seasonal_availability: Season[];
  tags: InterestTag[];
  image_url: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Itinerary {
  id: string;
  user_id: string | null;
  title: string;
  status: "draft" | "published";
  start_date: string | null;
  end_date: string | null;
  travel_style: TravelStyle;
  num_travelers: number;
  total_budget_estimate: string | null;
  jr_pass_recommended: boolean | null;
  jr_pass_reasoning: string | null;
  share_token: string;
  is_public: boolean;
  preferences_snapshot: QuizAnswers | null;
  created_at: string;
  updated_at: string;
}

export interface ItineraryDay {
  id: string;
  itinerary_id: string;
  day_number: number;
  date: string | null;
  destination_id: string;
  destination?: Destination;
  notes: string | null;
  accommodation_suggestion: {
    name: string;
    area: string;
    type: string;
    reasoning: string;
  } | null;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  id: string;
  day_id: string;
  activity_id: string | null;
  activity?: Activity;
  time_slot: string;
  custom_name: string | null;
  custom_description: string | null;
  order_index: number;
  notes: string | null;
}

// ============================================================
// Quiz / Preferences
// ============================================================

export interface QuizAnswers {
  travel_style: TravelStyle;
  interests: InterestTag[];
  season: Season | "flexible";
  duration_days: number;
  budget: BudgetLevel;
  pace: TripPace;
  crowd_tolerance: "low" | "medium" | "high";
  evening_preference: EveningPreference;
  first_time: boolean;
  must_visit: string[];
}

// ============================================================
// AI Response Types
// ============================================================

export interface AIRecommendation {
  destination_id: string;
  destination: Destination;
  match_score: number;
  reasoning: string;
  suggested_days: number;
  highlights: string[];
}

export interface AIItineraryDay {
  day_number: number;
  destination_id: string;
  theme: string;
  activities: {
    time: string;
    title: string;
    description: string;
    activity_id: string | null;
    duration_minutes: number;
    reservation_required: boolean;
    cost_estimate: string;
    tip: string | null;
  }[];
  transport: {
    from: string;
    to: string;
    method: string;
    duration: string;
    cost: string;
    tip: string | null;
  } | null;
  accommodation: {
    name: string;
    area: string;
    type: string;
    reasoning: string;
  };
}
