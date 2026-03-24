import type { Region, InterestTag, Season, TravelStyle, BudgetLevel, TripPace } from "@/types";

export const SITE_NAME = "Your Japan Plan";
export const SITE_DESCRIPTION =
  "Plan your perfect Japan trip. Build custom itineraries with curated destinations, activities, where to stay, JR Pass calculator, and what to reserve in advance.";

export const REGIONS: { value: Region; label: string; label_jp: string }[] = [
  { value: "hokkaido", label: "Hokkaido", label_jp: "北海道" },
  { value: "tohoku", label: "Tohoku", label_jp: "東北" },
  { value: "kanto", label: "Kanto", label_jp: "関東" },
  { value: "chubu", label: "Chubu", label_jp: "中部" },
  { value: "kansai", label: "Kansai", label_jp: "関西" },
  { value: "chugoku", label: "Chugoku", label_jp: "中国" },
  { value: "shikoku", label: "Shikoku", label_jp: "四国" },
  { value: "kyushu", label: "Kyushu", label_jp: "九州" },
  { value: "okinawa", label: "Okinawa", label_jp: "沖縄" },
];

export const INTEREST_TAGS: { value: InterestTag; label: string; icon: string }[] = [
  { value: "onsen", label: "Onsen", icon: "♨️" },
  { value: "nature", label: "Nature", icon: "🌿" },
  { value: "shopping", label: "Shopping", icon: "🛍️" },
  { value: "temples", label: "Temples & Shrines", icon: "⛩️" },
  { value: "food", label: "Food & Dining", icon: "🍜" },
  { value: "nightlife", label: "Nightlife", icon: "🌃" },
  { value: "culture", label: "Culture & History", icon: "🏯" },
  { value: "adventure", label: "Adventure", icon: "🏔️" },
  { value: "beach", label: "Beach", icon: "🏖️" },
  { value: "skiing", label: "Skiing & Snow", icon: "⛷️" },
];

export const SEASONS: { value: Season; label: string; months: string }[] = [
  { value: "spring", label: "Spring", months: "March – May" },
  { value: "summer", label: "Summer", months: "June – August" },
  { value: "autumn", label: "Autumn", months: "September – November" },
  { value: "winter", label: "Winter", months: "December – February" },
];

export const TRAVEL_STYLES: { value: TravelStyle; label: string; description: string }[] = [
  { value: "solo", label: "Solo", description: "Traveling on your own" },
  { value: "couple", label: "Couple", description: "Romantic getaway for two" },
  { value: "friends", label: "Friends", description: "Group trip with friends" },
  { value: "family", label: "Family", description: "Traveling with kids or relatives" },
  { value: "workcation", label: "Workcation", description: "Working remotely while exploring" },
];

export const BUDGET_LEVELS: { value: BudgetLevel; label: string; description: string }[] = [
  { value: "budget", label: "Budget", description: "Hostels, street food, local trains" },
  { value: "moderate", label: "Moderate", description: "Hotels, restaurants, shinkansen" },
  { value: "luxury", label: "Luxury", description: "Ryokans, fine dining, private tours" },
];

export const TRIP_PACES: { value: TripPace; label: string; description: string }[] = [
  { value: "relaxed", label: "Relaxed", description: "2-3 activities per day, plenty of downtime" },
  { value: "moderate", label: "Moderate", description: "3-4 activities per day, balanced schedule" },
  { value: "packed", label: "Packed", description: "5+ activities per day, see everything" },
];

export const NAV_LINKS = [
  { href: "/quiz", label: "Quiz" },
  { href: "/itinerary/new", label: "Build Itinerary" },
  { href: "/destinations", label: "Destinations" },
  { href: "/tools/jr-pass", label: "JR Pass Calculator" },
] as const;
