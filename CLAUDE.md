# CLAUDE.md

## Project Overview

**Your Japan Plan** (yourjapanplan.com) — Japan travel planning app. Quiz → destination recommendations → custom day-by-day itineraries from curated activity catalogs. Save, edit, and share via Supabase.

## Commands

```bash
npm run dev          # Dev server (Turbopack)
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript check (use this over `npm run build` on Windows — Turbopack workers crash)
```

## Tech Stack

Next.js 16 (App Router), TypeScript, Tailwind v4, **shadcn/ui v4** (`@base-ui/react`, NOT Radix), Supabase (Postgres + Auth), Claude API via Vercel AI SDK (quiz only), Zustand, Vercel (auto-deploys on push to `master`).

### shadcn/ui v4 — No `asChild`

```tsx
// WRONG:  <Button asChild><Link href="/foo">Click</Link></Button>
// RIGHT:  <Button render={<Link href="/foo" />}>Click</Button>
```

## Data Architecture

**Static-first.** All destination/activity/transport data lives in TypeScript files under `src/lib/data/`. AI is used only for quiz recommendations.

- **`seed-activities.ts`** — ~127 activities across 27 destinations (id, name, type, duration, cost, tags, `best_time_of_day`, `area`, `first_timer`)
- **`day-templates.ts`** — ~85 preset day plans (3+ per destination)
- **`transport-routes.ts`** — ~55 inter-city routes. `findRoute()` = best single, `findAllRoutes()` = all options
- **`movement-times.ts`** — Area-to-area transit within destinations
- **`packing-rules.ts`** — Season + activity-tag → packing items
- **`seed-destinations.ts`** (`src/lib/ai/`) — 27 destinations with crowd_level_by_month, best_seasons, accommodation_zones

### Streaming Partial Types

`experimental_useObject` returns deeply partial objects. Use `.filter((a): a is NonNullable<typeof a> => !!a)` not `.filter(Boolean)`.

## Itinerary Builder

No AI. Users pick destinations (reorderable via arrow buttons) → build days from catalog → review (budget, JR Pass, reservations, packing list) → save/edit/share. "Build My Itinerary" from quiz results pre-populates destinations sorted geographically (nearest-neighbor from easternmost city) and skips straight to the day builder.

State: `src/stores/itinerary-store.ts` — `BuilderDay[]`, `BuilderActivity` (`catalogId`, `customName`, `customDescription`, `notes`, `customStartTime`, `booked`).

### Save / Edit / Share

- **Save**: POST `/api/itinerary`. Stores `builder_state` (raw store state) + `generated_plan` (review format) in `preferences_snapshot` JSONB. The `builder_state` key is the source of truth for editing.
- **Edit**: `/itinerary/new?edit={id}` → fetches itinerary → `store.loadItinerary()` → PUT on save. `editingId` tracks edit mode.
- **Share**: PATCH toggles `is_public`. Share page fetches with `?public=true`. No auth for public view.
- **Delete**: DELETE endpoint with cascade. `window.confirm()` for UI.
- **DB enum**: `travel_style` doesn't include `honeymoon` — API maps it to `couple` via `safeTravelStyle()`.

### Day Scheduling

5 time buckets: morning (9:00), lunch (11:30 — food activities with `best_time_of_day: "anytime"`), afternoon (13:00), evening (18:00), late evening (after dinner = nightlife only). Movement time from `movement-times.ts`. Auto-inserted meal slots when no food activity exists in the window. Dinner shifts with evening preference (early/moderate/nightowl). Activities with `customStartTime` override auto-calculation.

### Day Trips

`dayTripSlug` on `BuilderDay` → shows activities from trip destination, auto-adds transport bookends, shifts morning start. Filtered from `TRANSPORT_ROUTES` (within 2h, no flights).

## Routing

| Route | Purpose |
|---|---|
| `/quiz` → `/quiz/results` | Preference quiz → AI recommendations |
| `/destinations/[slug]` | Destination detail (static) |
| `/itinerary/new` | Builder (pick → build → review) |
| `/itinerary/new?edit={id}` | Edit existing itinerary |
| `/itinerary/[id]` | View saved (edit, delete, share, print, calendar export) |
| `/itinerary/[id]/share` | Public shared view (requires `is_public`) |
| `/itinerary/saved` | User's saved itineraries |
| `/profile` | User profile + account |
| `/tools/jr-pass` | JR Pass calculator |

## Destination Slugs — Critical

Slugs MUST match across all files. Canonical source: `seed-destinations.ts`.

| Destination | Correct | Wrong |
|---|---|---|
| Okinawa | `okinawa-main` | `okinawa` |
| Mt. Fuji | `mt-fuji` | `mt-fuji-area` |
| Koya-san | `koyasan` | `koya-san` |

Activity IDs: `{slug}-{activity}` format. `getActivitiesForDestination()` filters by `destination_slug`, not ID prefix. Update `japan-map.tsx` coords when adding destinations.

## Adding a New Destination

1. **`seed-destinations.ts`** — destination object
2. **`seed-activities.ts`** — 8-12 activities, matching `destination_slug`
3. **`day-templates.ts`** — 2-3 templates, `activity_ids` must match step 2
4. **`transport-routes.ts`** — routes to/from nearby destinations
5. **`movement-times.ts`** — area-to-area times (skip for small walkable places)
6. **`japan-map.tsx`** — lat/lng in `DESTINATION_COORDS`

Auto-appears in: browse page, filters, builder map, JR calculator, sitemap.

## Conventions

- `@/*` maps to `./src/*`
- Don't mention "AI" in user-facing copy
- Shinkansen does NOT reach Sapporo (only Shin-Hakodate) — flights for Hokkaido
- No rail to Okinawa — flights only
- NEVER hand-draw SVG maps — use Leaflet
- Nightlife: always `best_time_of_day: "evening"` + `type: "nightlife"` — scheduled after dinner, never before
- `first_timer: true` activities are hidden from the activity picker for returning visitors — only shown to first-timers
- Travel styles: solo, couple, friends, family, workcation, honeymoon (6 total)
- `useSearchParams()` requires `<Suspense>` wrapper — see `itinerary/new/page.tsx`
- `preferences_snapshot` JSONB is the primary data store for itineraries. Structured `itinerary_days`/`itinerary_activities` tables are populated but not the source of truth.
