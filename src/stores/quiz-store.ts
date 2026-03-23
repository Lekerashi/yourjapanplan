import { create } from "zustand";
import type {
  TravelStyle,
  InterestTag,
  Season,
  BudgetLevel,
  TripPace,
} from "@/types";

export interface QuizState {
  currentStep: number;
  travelStyle: TravelStyle | null;
  interests: InterestTag[];
  season: Season | "flexible" | null;
  durationDays: number;
  budget: BudgetLevel | null;
  pace: TripPace | null;
  crowdTolerance: "low" | "medium" | "high" | null;
  firstTime: boolean | null;
  mustVisit: string[];
}

interface QuizActions {
  setTravelStyle: (style: TravelStyle) => void;
  toggleInterest: (tag: InterestTag) => void;
  setSeason: (season: Season | "flexible") => void;
  setDurationDays: (days: number) => void;
  setBudget: (budget: BudgetLevel) => void;
  setPace: (pace: TripPace) => void;
  setCrowdTolerance: (level: "low" | "medium" | "high") => void;
  setFirstTime: (value: boolean) => void;
  setMustVisit: (cities: string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

export const QUIZ_STEPS = [
  { id: "travel-style", label: "Travel Style" },
  { id: "interests", label: "Interests" },
  { id: "season", label: "Season" },
  { id: "duration", label: "Duration" },
  { id: "preferences", label: "Preferences" },
  { id: "about-you", label: "About You" },
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
  firstTime: null,
  mustVisit: [],
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
  setFirstTime: (value) => set({ firstTime: value }),
  setMustVisit: (cities) => set({ mustVisit: cities }),

  nextStep: () =>
    set((s) => ({
      currentStep: Math.min(s.currentStep + 1, QUIZ_STEPS.length - 1),
    })),
  prevStep: () =>
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
  goToStep: (step) => set({ currentStep: step }),
  reset: () => set(initialState),
}));
