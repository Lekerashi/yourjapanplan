import { create } from "zustand";
import type {
  TravelStyle,
  InterestTag,
  Season,
  BudgetLevel,
  TripPace,
  EveningPreference,
} from "@/types";
import type { RecommendationResponse } from "@/lib/ai/schemas";

export interface QuizState {
  currentStep: number;
  travelStyle: TravelStyle | null;
  interests: InterestTag[];
  season: Season | "flexible" | null;
  durationDays: number;
  budget: BudgetLevel | null;
  pace: TripPace | null;
  crowdTolerance: "low" | "medium" | "high" | null;
  eveningPreference: EveningPreference | null;
  firstTime: boolean | null;
  mustVisit: string[];
  cachedResults: RecommendationResponse | null;
}

interface QuizActions {
  setTravelStyle: (style: TravelStyle) => void;
  toggleInterest: (tag: InterestTag) => void;
  setSeason: (season: Season | "flexible") => void;
  setDurationDays: (days: number) => void;
  setBudget: (budget: BudgetLevel) => void;
  setPace: (pace: TripPace) => void;
  setCrowdTolerance: (level: "low" | "medium" | "high") => void;
  setEveningPreference: (pref: EveningPreference) => void;
  setFirstTime: (value: boolean) => void;
  setMustVisit: (cities: string[]) => void;
  setCachedResults: (results: RecommendationResponse) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

export const QUIZ_STEPS = [
  {
    id: "travel-style",
    label: "Travel style",
    question: "Who are you travelling with?",
    explainer:
      "This shapes the pace, the lodging style, and how risk-averse our picks get.",
  },
  {
    id: "interests",
    label: "Interests",
    question: "What draws you to Japan?",
    explainer:
      "Pick two or more. We weight destinations and activities against what you choose.",
  },
  {
    id: "season",
    label: "Season",
    question: "When are you thinking of going?",
    explainer:
      "Japan is fine in every season. This lets us match the weather to what you want to do.",
  },
  {
    id: "duration",
    label: "Duration",
    question: "How long is the trip?",
    explainer:
      "We tailor the number of cities and the depth in each to the days you have.",
  },
  {
    id: "preferences",
    label: "Preferences",
    question: "Tell us how you travel.",
    explainer:
      "Budget, pace, tolerance for crowds, and how late you like to stay out.",
  },
  {
    id: "about-you",
    label: "About you",
    question: "Have you been to Japan before?",
    explainer:
      "First-timers get navigation and etiquette tips and the classic routes. Returning visitors get deeper, off-radar picks.",
  },
] as const;

const initialState: QuizState = {
  currentStep: 0,
  travelStyle: null,
  interests: [],
  season: null,
  durationDays: 10,
  budget: null,
  pace: null,
  crowdTolerance: null,
  eveningPreference: null,
  firstTime: null,
  mustVisit: [],
  cachedResults: null,
};

export const useQuizStore = create<QuizState & QuizActions>()((set) => ({
  ...initialState,

  setTravelStyle: (style) => set({ travelStyle: style }),
  toggleInterest: (tag) =>
    set((s) => ({
      interests: s.interests.includes(tag)
        ? s.interests.filter((t) => t !== tag)
        : [...s.interests, tag],
    })),
  setSeason: (season) => set({ season }),
  setDurationDays: (days) => set({ durationDays: days }),
  setBudget: (budget) => set({ budget }),
  setPace: (pace) => set({ pace }),
  setCrowdTolerance: (level) => set({ crowdTolerance: level }),
  setEveningPreference: (pref) => set({ eveningPreference: pref }),
  setFirstTime: (value) => set({ firstTime: value }),
  setMustVisit: (cities) => set({ mustVisit: cities }),
  setCachedResults: (results) => set({ cachedResults: results }),

  nextStep: () =>
    set((s) => ({
      currentStep: Math.min(s.currentStep + 1, QUIZ_STEPS.length - 1),
    })),
  prevStep: () =>
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
  goToStep: (step) => set({ currentStep: step }),
  reset: () => set(initialState),
}));
