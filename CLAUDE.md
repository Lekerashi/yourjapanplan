# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Your Japan Plan** (yourjapanplan.com) — an AI-powered Japan travel planning web app. Users take a preference quiz, get personalized destination recommendations from Claude, and generate/save/share custom day-by-day itineraries.

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
- **Supabase** — Postgres database, Auth (Google OAuth), Storage
- **Claude API** via **Vercel AI SDK** — streaming AI recommendations and itinerary generation
- **Vercel** — deployment target

## Architecture

### shadcn/ui v4 — Important

This project uses shadcn/ui v4 which is built on `@base-ui/react` instead of Radix UI. Key difference: **there is no `asChild` prop**. Use the `render` prop instead:

```tsx
// WRONG (Radix/shadcn v3 pattern):
<Button asChild><Link href="/foo">Click</Link></Button>

// CORRECT (base-ui/shadcn v4 pattern):
<Button render={<Link href="/foo" />}>Click</Button>
```

### Data Architecture (Hybrid)

Curated Postgres database of real destinations/activities for accuracy. Claude selects from and personalizes this data — it doesn't hallucinate places.

- **Destinations & activities**: curated seed data in `supabase/seed.sql`
- **AI pipeline**: DB query → filter by preferences → pass to Claude → validate response with Zod schemas → return structured JSON

### Key Directories

```
src/app/            → Next.js App Router pages and API routes
src/components/ui/  → shadcn/ui primitives (auto-generated, don't hand-edit)
src/components/     → App components organized by feature (layout/, quiz/, itinerary/, destination/)
src/lib/            → Utilities, Supabase clients, AI prompts, constants
src/types/          → Shared TypeScript types
supabase/           → SQL migrations and seed data
```

### AI Integration Pattern

API routes in `src/app/api/ai/` receive user preferences, query the Supabase DB for matching destinations/activities, then pass the filtered results + preferences to Claude. Responses are streamed using Vercel AI SDK and validated against Zod schemas in `src/lib/ai/schemas.ts`.

### Database

Schema defined in `supabase/migrations/`. Core tables: `destinations`, `activities`, `itineraries`, `itinerary_days`, `itinerary_activities`, `profiles`, `quiz_responses`. All tables have RLS policies. Destinations and activities are publicly readable; itineraries are owner-only (or public if shared).

### Routing

- `/` — Landing page
- `/quiz` → `/quiz/results` — Preference quiz → AI recommendations
- `/destinations` → `/destinations/[slug]` — Browse/detail pages (static for SEO)
- `/itinerary/new` → `/itinerary/[id]` — Build/view itinerary
- `/itinerary/[id]/share` — Public shared view (no auth)
- `/tools/jr-pass` — JR Pass calculator
- `/auth` — Sign in (Google OAuth via Supabase)

## Conventions

- Path alias: `@/*` maps to `./src/*`
- Constants/enums in `src/lib/constants.ts` — regions, interest tags, travel styles, etc.
- TypeScript types in `src/types/index.ts`
- All destination/activity data comes from the database, never hardcoded in components
