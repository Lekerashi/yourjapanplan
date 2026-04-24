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

The Button wrapper auto-sets `nativeButton={false}` when `render` is provided, so Base UI doesn't warn about swapping in an `<a>`.

## Design System

Washi paper / sumi ink editorial. Flat surfaces, squared corners (mostly 0 radius, 2px for small controls), no shadows, single vermillion accent, no emoji, no gradient backgrounds, no color-coded signals. Two themes: **washi** (light, default) and **ink** (dark).

### Tokens (`src/app/globals.css`)

All shadcn variables (`--background`, `--foreground`, `--primary`, `--border`, etc.) are mapped to washi/ink hex values. Extra tokens exposed as Tailwind colors via `@theme inline`:

- `bg-ink` / `text-ink` — primary text (#1f1a16 washi, #f4efe4 ink)
- `text-ink-2` — body text (#3a332b washi, #d7cfbf ink)
- `bg-surface` / `bg-card` — card surface (#fbf6ec washi, #1f2636 ink)
- `bg-secondary` / `bg-bg-2` — secondary cream (#ede2cf washi)
- `border-line` / `border-border` — 1px divider (#d3c7b0 washi)
- `text-accent` / `bg-accent` — vermillion (#a83232 washi, #ff6a4d ink)
- `--radius` = `0.125rem` (everything is effectively squared)

Ink theme applies via either `.dark` (shadcn convention) or `[data-theme="ink"]` on `<html>`. The `@custom-variant dark` targets both.

### Fonts

- **Playfair Display** via `next/font` → `--font-display` / `font-display` / `font-heading` — used for h1/h2/h3, large editorial moments, italic accents
- **Inter** via `next/font` → `--font-sans` / default `html { font-family }` — everything else

Italic Playfair in vermillion is the signature display moment (e.g. "Find the Japan *that finds you.*"). Use it sparingly on section titles.

### Theme toggle (`src/components/layout/theme-toggle.tsx`)

Uses `useSyncExternalStore` with a custom `yjp:theme-change` event so multiple toggles stay in sync without cascading renders. Persists to `localStorage("theme")`. A small inline `<script>` in `layout.tsx` `<head>` reads localStorage and sets `data-theme` + `.dark` before hydration — **don't remove that script** or users who prefer ink will see a washi flash on every page load.

### Signature motifs (only two allowed)

- **BrandMark** (`src/components/layout/brand-mark.tsx`) — vermillion circle with two cream wave lines. Used in nav + footer. Don't swap for `MapPin` or any other lucide icon.
- **SeigaihaDivider** (`src/components/layout/seigaiha-divider.tsx`) — repeating arc SVG pattern, used in the footer bottom bar. Can be reused as a section separator but not everywhere.

### What this design is NOT

Explicitly rejected by stakeholder review (enforced across all pages):

- **No woodblock / ukiyo-e illustrations**, hand-drawn SVG mountains, rising-sun rays, bamboo, cherry-blossom scatter, torii gate graphics, calligraphy brushstrokes. The brand mark + seigaiha divider are the only Japan-coded visuals.
- **No emoji in UI.** `INTEREST_TAGS[].icon` in `constants.ts` still holds the emoji strings as data, but nothing renders them any more. Don't reintroduce them in cards, chips, buttons, or step components.
- **No gradient backgrounds.** Everything is flat washi or flat ink.
- **No rounded-card-with-left-border-accent** patterns. Active states use a filled square number tile (see `itinerary-preview` day list) or a vermillion ring, not a colored left stripe.
- **No color-coded signals** (emerald/amber/rose for good/warning/bad). Per README accessibility note: "color alone never encodes meaning." The crowd calendar uses a single-hue `color-mix(accent, card)` opacity scale + text labels instead.

### Copy voice (for all user-facing strings)

- **No em-dashes (—)** in rendered UI copy. Use period, comma, or colon. Exception: SEO `<title>` metadata and code comments are fine.
- **No "X, not Y" parallel punchlines** (e.g. "texture, not traffic"). Reads as AI marketing speak. Exception: "Built for travellers, not tourists." is the brand tagline from the design handoff.
- Destination and activity descriptions target the handoff's factual voice: concrete nouns, numbers, place names, no superlatives ("exquisite", "stunning", "perfect").

### shadcn primitives to keep squared

`button.tsx` and `card.tsx` were rebuilt against the new tokens:
- Button default variant = `bg-primary text-primary-foreground` (ink on cream), hover → `bg-accent`. `outline` = bordered foreground → inverted on hover. `rounded-[2px]` base.
- Card = `rounded-none`, 1px `border-border`, `shadow-none`, no ring.

Don't restore `shadow-*`, `rounded-lg/xl`, or rose-tinted variants.

## Home page composition

`src/app/page.tsx` wraps everything in `<HomeDemoProvider>` (see below). Section order (editorial flow, not numbered):

1. **Hero** (`home/hero.tsx`) — client component, picks a random destination photo on mount via `setTimeout(0)` to avoid hydration mismatch. Keep the deterministic `DEFAULT_PICK` for SSR.
2. **HowItWorks** (`home/how-it-works.tsx`) — 3-panel grid, italic vermillion numerals.
3. **Interests** (`home/interests.tsx`) — numbered chips 01-10 wired to `useHomeDemo()`. Clicking toggles interest selection which filters the destinations grid below. "Start the quiz" CTA underneath.
4. **DestinationsPreview** (`home/destinations-preview.tsx`) — region tab row + 3-col card grid. Reads `selectedInterests` from `HomeDemoProvider` to filter. Mobile shows 3 cards before "Show more" (`hidden sm:block` on items 4-6); desktop shows 6. Expanding shows all 27. Collapsing scrolls back to the section top via `sectionRef`.
5. **ItineraryPreview** (`home/itinerary-preview.tsx`) — labelled "Example itinerary". Six fully-written days, click a day to swap the right panel.
6. **JRPassPreview** (`home/jr-pass-preview.tsx`) — mini calculator using placeholder fare math (index-distance × 3800 + 8800). The full `/tools/jr-pass` page uses real `TRANSPORT_ROUTES` data — see below.
7. **QuizPreview** (`home/quiz-preview.tsx`) — mock "Question 02 of 08" with 4 option cards → `/quiz`.
8. **CTABand** (`home/cta-band.tsx`) — full-bleed inverse (ink bg, cream text) before footer.

`SectionHead` (`home/section-head.tsx`) is shared across sections and `/destinations`, `/tools/jr-pass`, `/itinerary/saved` — eyebrow + Playfair title + optional lede.

### HomeDemoProvider pattern (`home/home-demo-context.tsx`)

Simple React context holding `selectedInterests: Set<string>`. Exposed via `useHomeDemo()`. Both `Interests` and `DestinationsPreview` are clients and read/write through the hook. This is a home-page-only demo of the quiz-to-filter flow. If you add another interactive home section, use this same context rather than adding Zustand.

## Data Architecture

**Static-first.** All destination/activity/transport data lives in TypeScript files under `src/lib/data/`. AI is used only for quiz recommendations.

- **`seed-activities.ts`** — ~127 activities across 27 destinations (id, name, type, duration, cost, tags, `best_time_of_day`, `area`, `first_timer`)
- **`day-templates.ts`** — ~85 preset day plans (3+ per destination)
- **`transport-routes.ts`** — ~55 inter-city routes + `JR_PASS_PRICES` (7/14/21-day). `findRoute()` = best single, `findAllRoutes()` = all options
- **`movement-times.ts`** — Area-to-area transit within destinations
- **`packing-rules.ts`** — Season + activity-tag → packing items
- **`seed-destinations.ts`** (`src/lib/ai/`) — 27 destinations with `image` (Unsplash URL), `crowd_level_by_month`, `best_seasons`, `accommodation_zones`. Descriptions were rewritten to factual long-form voice during the redesign.

Note on photos: avoid `plus.unsplash.com/premium_photo-*` URLs — several returned generic stock art rather than the intended city. Prefer plain `images.unsplash.com/photo-*` URLs and WebFetch to verify before committing.

### Streaming Partial Types

`experimental_useObject` returns deeply partial objects. Use `.filter((a): a is NonNullable<typeof a> => !!a)` not `.filter(Boolean)`.

## Itinerary Builder

No AI. Users pick destinations (reorderable via arrow buttons) → build days from catalog → review (budget, JR Pass, reservations, packing list) → save/edit/share. "Build My Itinerary" from quiz results pre-populates destinations sorted geographically (nearest-neighbor from easternmost city) and skips straight to the day builder.

State: `src/stores/itinerary-store.ts` — `BuilderDay[]`, `BuilderActivity` (`catalogId`, `customName`, `customDescription`, `notes`, `customStartTime`, `booked`).

Activity timeline renders in `day-builder.tsx` as a single border-separated list (not individual Cards) — keep this pattern when adding new row types. Meal slots and day-trip transit use the same row shape with a different eyebrow ("Meal", "Transit").

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

## Quiz flow

Two-column layout (`minmax(0,1fr) minmax(0,2fr)`), sticky left rail on desktop. Left rail shows `Question X of 06` eyebrow, 2px vermillion progress bar, Playfair question, Inter explainer, Continue + Back buttons. Right column = step-specific controls (no h2/p of its own — shell owns headings).

`QUIZ_STEPS` in `src/stores/quiz-store.ts` carries each step's `question` + `explainer` copy so the shell can pull from one source.

`OptionCard` (`components/quiz/option-card.tsx`) accepts `index={i}` and auto-derives "Option A / B / C" prefix. Active state = vermillion inset ring + border. No `icon` prop — emoji are out.

Validation per step is in `canProceed()` inside `quiz-shell.tsx` — adjust there when adding or changing step requirements.

## JR Pass calculator

Full page at `/tools/jr-pass` uses real data:
- Stations derived from unique from/to names in `TRANSPORT_ROUTES` (flights filtered out).
- `fareFor(from, to)` looks up routes bidirectionally (handles `Hiroshima → Tokyo` even though only `Tokyo → Hiroshima` is seeded).
- Pass prices from `JR_PASS_PRICES` (7-day ¥50,000 / 14-day ¥80,000 / 21-day ¥100,000).
- Verdict compares `sum(leg fares)` vs `passPrice[passKey]`.

The homepage `JRPassPreview` is a simpler version using an index-distance formula (`|A-B| * 3800 + 8800`) — that's placeholder math and the full page should be the canonical answer.

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

1. **`seed-destinations.ts`** — destination object with factual long-form `description` (no em-dashes, no superlatives)
2. **`seed-activities.ts`** — 8-12 activities, matching `destination_slug`
3. **`day-templates.ts`** — 2-3 templates, `activity_ids` must match step 2
4. **`transport-routes.ts`** — routes to/from nearby destinations
5. **`movement-times.ts`** — area-to-area times (skip for small walkable places)
6. **`japan-map.tsx`** — lat/lng in `DESTINATION_COORDS`

Auto-appears in: browse page, filters, builder map, JR calculator, hero random pick, sitemap.

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
- `setState` inside `useEffect` bodies is flagged by lint (`react-hooks/set-state-in-effect`). Wrap in `setTimeout(…, 0)` or use `useSyncExternalStore` — see `hero.tsx`, `theme-toggle.tsx`, `auth-button.tsx` for the patterns.
- Ito (Izu Peninsula) is onsen + coastal, NOT nightlife. Nightlife tag was explicitly removed.
