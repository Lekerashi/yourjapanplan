# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Your Japan Plan** (yourjapanplan.com) — a Japan travel planning web app. Users take a preference quiz to get destination recommendations, then build custom day-by-day itineraries by picking from pre-generated activity catalogs. Itineraries can be saved and shared via Supabase.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript check (use this over `npm run build` on Windows — Turbopack build workers can crash)
```

## Tech Stack

- **Next.js 16** (App Router) with TypeScript
- **Tailwind CSS v4** + **shadcn/ui v4** (uses `@base-ui/react`, NOT Radix)
- **Supabase** — Postgres database, Auth (Google OAuth + email/password), Storage
- **Claude API** via **Vercel AI SDK** — streaming AI recommendations only (quiz results)
- **Zustand** — client state management (quiz store, itinerary builder store)
- **Vercel** — deployment (auto-deploys on push to `master`)

## Architecture

### shadcn/ui v4 — Important

This project uses shadcn/ui v4 which is built on `@base-ui/react` instead of Radix UI. Key difference: **there is no `asChild` prop**. Use the `render` prop instead:

```tsx
// WRONG (Radix/shadcn v3 pattern):
<Button asChild><Link href="/foo">Click</Link></Button>

// CORRECT (base-ui/shadcn v4 pattern):
<Button render={<Link href="/foo" />}>Click</Button>
```

### Data Architecture

**Static-first approach.** All destination, activity, and transport data is curated and stored as static TypeScript files. No database queries needed for the core experience. AI is used only for the quiz recommendation flow.

#### Static Data Files (`src/lib/data/`)

- **`seed-activities.ts`** — Activity catalog (~280 entries across 26 destinations). Each activity has id, name, description, type, duration, cost, tags, reservation info, time-of-day, and insider tip.
- **`day-templates.ts`** — Pre-built day plans (~65 templates, 2-3 per destination) that users can apply as a starting point.
- **`transport-routes.ts`** — Train/bus/flight routes between destinations (~45 routes) with costs, durations, and JR Pass coverage. Shared by the itinerary builder and JR Pass calculator.

#### Seed Destinations (`src/lib/ai/seed-destinations.ts`)

26 curated destinations with highlights, tags, best seasons, crowd levels by month, accommodation zones, and reservation tips.

#### AI (quiz only)

The quiz recommendation flow (`/api/ai/recommend`) is the only feature that calls Claude. It streams structured recommendations using `experimental_useObject` from `@ai-sdk/react`. Results are cached in the Zustand quiz store so revisiting the page doesn't re-generate.

### Streaming Partial Types — Pitfall

When using `experimental_useObject` from `@ai-sdk/react`, the returned object is deeply partial (`PartialObject<T>`). Arrays become `(T | undefined)[]`. Use `.filter((a): a is NonNullable<typeof a> => !!a)` instead of `.filter(Boolean)` — the latter doesn't narrow types in TypeScript. Always define component props with optional fields when consuming streamed data.

### Key Directories

```
src/app/               → Next.js App Router pages and API routes
src/app/api/ai/        → AI endpoints (recommend, itinerary — itinerary is legacy)
src/app/api/itinerary/ → Save/load itinerary CRUD
src/components/ui/     → shadcn/ui primitives (auto-generated, don't hand-edit)
src/components/        → App components by feature (layout/, quiz/, itinerary/, destination/, tools/)
src/lib/data/          → Static data files (activities, templates, transport routes)
src/lib/ai/            → AI prompts, schemas, seed destinations
src/lib/supabase/      → Supabase client/server utilities
src/stores/            → Zustand stores (quiz-store, itinerary-store)
src/types/             → Shared TypeScript types
supabase/              → SQL migrations and seed data
```

### Itinerary Builder Flow

The interactive builder uses NO AI. Users:
1. Pick destinations + set days per destination (`DestinationPicker`)
2. Build each day by adding activities from the pre-generated catalog (`DayBuilder` + `ActivityPicker`)
3. Review the full itinerary with budget estimate, JR Pass recommendation, and reservation checklist (`TripSummary`)
4. Save to Supabase and share via link

State managed in `src/stores/itinerary-store.ts` with `BuilderDay` and `BuilderActivity` types. Time slots are computed in components via `useMemo`, not stored.

### Database

Schema defined in `supabase/migrations/`. Core tables: `destinations`, `activities`, `itineraries`, `itinerary_days`, `itinerary_activities`, `profiles`, `quiz_responses`. All tables have RLS policies. Destinations and activities are publicly readable; itineraries are owner-only (or public if shared).

### Auth

Google OAuth + email/password via Supabase Auth. Middleware in `middleware.ts` refreshes sessions. `AuthButton` component in navbar shows sign-in/avatar dropdown. Auth page at `/auth` has both options with sign-in/sign-up toggle.

### Routing

- `/` — Landing page
- `/quiz` → `/quiz/results` — Preference quiz → AI recommendations (cached in store)
- `/destinations` → `/destinations/[slug]` — Browse/detail pages (statically generated)
- `/itinerary/new` — Interactive itinerary builder (pick → build → review)
- `/itinerary/[id]` — View saved itinerary
- `/itinerary/saved` — List of user's saved itineraries
- `/itinerary/[id]/share` — Public shared view (no auth)
- `/tools/jr-pass` — JR Pass calculator
- `/auth` — Sign in/up (Google OAuth + email/password)

### SEO

- `src/app/sitemap.ts` — Dynamic sitemap with all destination pages
- `src/app/robots.ts` — Allows all pages, blocks API routes
- Each page has keyword-rich metadata with Open Graph and Twitter cards
- Destination detail pages have dynamic keywords per city

## Destination Slugs — Critical

Slugs MUST match exactly across all files. The canonical slug is in `seed-destinations.ts`. Known mismatches to watch for:

| Destination | Correct slug | Common wrong slug |
|---|---|---|
| Okinawa | `okinawa-main` | `okinawa` |
| Mt. Fuji | `mt-fuji` | `mt-fuji-area` |
| Koya-san | `koyasan` | `koya-san` |

Activity IDs use the format `{destination_slug}-{activity-slug}` (e.g. `tokyo-senso-ji`). However, some historical activity IDs don't match the destination slug exactly (e.g. `mt-fuji-area-kawaguchiko` has `destination_slug: "mt-fuji"`). This is fine — the `getActivitiesForDestination()` function filters by `destination_slug`, not the ID prefix.

The `japan-map.tsx` component also has a coordinates lookup keyed by slug — update it when adding destinations.

## Adding a New Destination

When adding a new destination, update these files in order:

1. **`src/lib/ai/seed-destinations.ts`** — Add the destination object (slug, name, region, description, highlights, best_seasons, crowd_level_by_month, tags, jr_accessible, reservation_tips, accommodation_zones)
2. **`src/lib/data/seed-activities.ts`** — Add 8-12 activities. Set `destination_slug` to match the slug from step 1. Activity IDs follow `{slug}-{activity-name}` format.
3. **`src/lib/data/day-templates.ts`** — Add 2-3 day templates. Set `destination_slug` to match step 1. `activity_ids` must exactly match IDs from step 2.
4. **`src/lib/data/transport-routes.ts`** — Add transport routes from/to nearby destinations with `from_slug`/`to_slug`.
5. **`src/components/itinerary/japan-map.tsx`** — Add lat/lng coordinates in `DESTINATION_COORDS`.
6. **`src/app/sitemap.ts`** — Auto-included (reads from seed destinations), no change needed.

The destination will automatically appear in: browse page, filters, itinerary builder map, JR calculator (if transport routes added, flights filtered out), and the sitemap.

## Conventions

- Path alias: `@/*` maps to `./src/*`
- Constants/enums in `src/lib/constants.ts` — regions, interest tags, travel styles, etc.
- TypeScript types in `src/types/index.ts`
- All destination/activity data comes from static data files, never hardcoded in components
- Don't mention "AI" in user-facing copy — the site should feel like curated expert recommendations
- Prices in transport-routes.ts should be kept current — verify against official sources when updating
- The Shinkansen does NOT go to Sapporo (only to Shin-Hakodate) — recommend flights for Hokkaido
- There is no rail to Okinawa — flights only
- NEVER use hand-drawn SVG paths for maps — use Leaflet or a real map library
- Activities have `best_time_of_day` (morning/afternoon/evening/anytime) — the builder respects this when calculating time slots
- Bars/nightlife should always be `best_time_of_day: "evening"` — never schedule them in the morning
