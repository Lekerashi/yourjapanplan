import { create } from "zustand";

export interface SelectedDestination {
  slug: string;
  name: string;
  days: number;
}

export interface BuilderActivity {
  catalogId: string;
  customName: string | null;
  customDescription: string | null;
  notes: string;
}

export interface BuilderDay {
  dayNumber: number;
  destinationSlug: string;
  activities: BuilderActivity[];
  accommodation: {
    zone: string;
    type: string;
    reasoning: string;
  } | null;
  notes: string;
}

interface ItineraryBuilderState {
  destinations: SelectedDestination[];
  travelStyle: string | null;
  interests: string[];
  season: string | null;
  durationDays: number;
  budget: string | null;
  pace: string | null;
  builderDays: BuilderDay[];
  isBuilderActive: boolean;
  activeDay: number;
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
  initializeBuilder: () => void;
  setActiveDay: (day: number) => void;
  addActivity: (dayNumber: number, catalogId: string) => void;
  removeActivity: (dayNumber: number, catalogId: string) => void;
  reorderActivities: (
    dayNumber: number,
    activities: BuilderActivity[]
  ) => void;
  applyTemplate: (dayNumber: number, activityIds: string[]) => void;
  setAccommodation: (
    dayNumber: number,
    accommodation: BuilderDay["accommodation"]
  ) => void;
  setDayNotes: (dayNumber: number, notes: string) => void;
  addCustomActivity: (
    dayNumber: number,
    name: string,
    description: string
  ) => void;
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
  builderDays: [],
  isBuilderActive: false,
  activeDay: 1,
};

export const useItineraryStore = create<
  ItineraryBuilderState & ItineraryBuilderActions
>()((set, get) => ({
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

  initializeBuilder: () => {
    const { destinations } = get();
    const days: BuilderDay[] = [];
    let dayNum = 1;
    for (const dest of destinations) {
      for (let i = 0; i < dest.days; i++) {
        days.push({
          dayNumber: dayNum++,
          destinationSlug: dest.slug,
          activities: [],
          accommodation: null,
          notes: "",
        });
      }
    }
    set({ builderDays: days, isBuilderActive: true, activeDay: 1 });
  },

  setActiveDay: (day) => set({ activeDay: day }),

  addActivity: (dayNumber, catalogId) =>
    set((s) => ({
      builderDays: s.builderDays.map((d) =>
        d.dayNumber === dayNumber &&
        !d.activities.some((a) => a.catalogId === catalogId)
          ? {
              ...d,
              activities: [
                ...d.activities,
                {
                  catalogId,
                  customName: null,
                  customDescription: null,
                  notes: "",
                },
              ],
            }
          : d
      ),
    })),

  removeActivity: (dayNumber, catalogId) =>
    set((s) => ({
      builderDays: s.builderDays.map((d) =>
        d.dayNumber === dayNumber
          ? {
              ...d,
              activities: d.activities.filter(
                (a) => a.catalogId !== catalogId
              ),
            }
          : d
      ),
    })),

  reorderActivities: (dayNumber, activities) =>
    set((s) => ({
      builderDays: s.builderDays.map((d) =>
        d.dayNumber === dayNumber ? { ...d, activities } : d
      ),
    })),

  applyTemplate: (dayNumber, activityIds) =>
    set((s) => ({
      builderDays: s.builderDays.map((d) =>
        d.dayNumber === dayNumber
          ? {
              ...d,
              activities: activityIds.map((id) => ({
                catalogId: id,
                customName: null,
                customDescription: null,
                notes: "",
              })),
            }
          : d
      ),
    })),

  setAccommodation: (dayNumber, accommodation) =>
    set((s) => ({
      builderDays: s.builderDays.map((d) =>
        d.dayNumber === dayNumber ? { ...d, accommodation } : d
      ),
    })),

  setDayNotes: (dayNumber, notes) =>
    set((s) => ({
      builderDays: s.builderDays.map((d) =>
        d.dayNumber === dayNumber ? { ...d, notes } : d
      ),
    })),

  addCustomActivity: (dayNumber, name, description) =>
    set((s) => ({
      builderDays: s.builderDays.map((d) =>
        d.dayNumber === dayNumber
          ? {
              ...d,
              activities: [
                ...d.activities,
                {
                  catalogId: `custom-${Date.now()}`,
                  customName: name,
                  customDescription: description,
                  notes: "",
                },
              ],
            }
          : d
      ),
    })),

  reset: () => set(initialState),
}));
