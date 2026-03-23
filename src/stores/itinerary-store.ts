import { create } from "zustand";

export interface SelectedDestination {
  slug: string;
  name: string;
  days: number;
}

interface ItineraryBuilderState {
  destinations: SelectedDestination[];
  travelStyle: string | null;
  interests: string[];
  season: string | null;
  durationDays: number;
  budget: string | null;
  pace: string | null;
}

interface ItineraryBuilderActions {
  addDestination: (dest: SelectedDestination) => void;
  removeDestination: (slug: string) => void;
  updateDays: (slug: string, days: number) => void;
  reorderDestinations: (destinations: SelectedDestination[]) => void;
  setPreferences: (prefs: {
    travelStyle: string;
    interests: string[];
    season: string;
    durationDays: number;
    budget: string;
    pace: string;
  }) => void;
  reset: () => void;
}

const initialState: ItineraryBuilderState = {
  destinations: [],
  travelStyle: null,
  interests: [],
  season: null,
  durationDays: 10,
  budget: null,
  pace: null,
};

export const useItineraryStore = create<
  ItineraryBuilderState & ItineraryBuilderActions
>()((set) => ({
  ...initialState,

  addDestination: (dest) =>
    set((s) => {
      if (s.destinations.some((d) => d.slug === dest.slug)) return s;
      return { destinations: [...s.destinations, dest] };
    }),

  removeDestination: (slug) =>
    set((s) => ({
      destinations: s.destinations.filter((d) => d.slug !== slug),
    })),

  updateDays: (slug, days) =>
    set((s) => ({
      destinations: s.destinations.map((d) =>
        d.slug === slug ? { ...d, days } : d
      ),
    })),

  reorderDestinations: (destinations) => set({ destinations }),

  setPreferences: (prefs) =>
    set({
      travelStyle: prefs.travelStyle,
      interests: prefs.interests,
      season: prefs.season,
      durationDays: prefs.durationDays,
      budget: prefs.budget,
      pace: prefs.pace,
    }),

  reset: () => set(initialState),
}));
