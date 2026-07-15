# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

Mission: Tour is a location-based, narrative-driven adventure game delivered as a mobile-first web app. Players select a mission (structured like a tour itinerary), complete real-world tasks tied to physical locations, and those outcomes feed a branching story. There are no dead ends — success, failure, and partial completion all advance the narrative differently.

This is a focused rebuild of the previous `mission-singapore` project. **The primary shift: story creation is the core product surface, not the player experience.** Community-sourced content (creators building missions) is treated as the primary value driver. The player experience is downstream of having a rich creator ecosystem.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind v4 · Prisma v7 · PostgreSQL · S3-compatible storage · PWA

---

## Commands

```bash
# Install dependencies
pnpm install

# Start DB (Docker)
docker compose up -d

# Run migrations
pnpm db:migrate

# Seed demo content
pnpm db:seed

# Start dev server
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Test
pnpm test

# Test a single file
pnpm test src/path/to/file.test.ts

# Test with coverage
pnpm test:coverage
```

---

## Product Terminology

ALWAYS use these terms. Never use alternatives.

- **Mission** — not "quest", "game", "level", or "adventure"
- **Act** — not "location", "zone", or "area" (a major story segment tied to a physical location)
- **Chapter** — not "section" or "group" (a narrative unit within an act; groups tasks by area or sequence)
- **Task** — not "challenge", "step", or "objective"
- **Story beat** — not "cutscene", "narrative update", or "interstitial" (a narrative-only task; no pass/fail)
- **Agent Profile** — not "player profile", "account", or "user page"
- **Reputation tier** — not "level", "rank", or "XP"
- **Mission brief** — not "intro", "description", or "overview"
- **Creator** — not "author", "builder", or "contributor" (unless referring to a specific role)
- **Stop** — not "waypoint", "checkpoint", or "location" (the GPS anchor of an Act)

---

## Reputation Tiers (in order)

1. Recruit — basic missions only
2. Operative — harder missions, episodic arcs
3. Handler — basic mission creation tools
4. Architect — full creator access, revenue sharing

---

## Story Structure

```
Mission
└── Act  (owns the Stop — GPS location + radius)
    └── Chapter  (narrative context: intro + outro text)
        └── ChapterTask  (placement: pre-narrative + story flags + outcome narratives)
            └── Task  (pure action; story-agnostic; reusable across missions)
```

- **Mission** — the full narrative arc; one story told across multiple locations
- **Act** — one physical location (Stop); owns `stop_lat`, `stop_lng`, `stop_radius_m`; computes an act summary flag at end of act via `Act.summaryFlagConfig`
- **Chapter** — groups tasks by proximity or narrative sequence within an act; has `intro_narrative` and `outro_narrative`
- **ChapterTask** — the placement of a task within a chapter; carries all story context: `pre_narrative`, `outcomeFlags: Json` (maps outcome code → flag name), `outcomeNarratives: Json` (maps outcome code → narrative text). Outcome codes: `"1"` = success, `"2"` = partial, `"3"` = fail. **This is where the story's voice lives.**
- **Task** — pure action with no story context; optionally has its own `gps_lat/lng/radius`; reusable across any mission.

The spy narrative, detective voice, and journalist tone all live in `ChapterTask` — not in `Task`.

---

## Branching & State Model

Telltale-style soft branching: outcomes have short-lived consequences that converge back to the main story line.

- Flags live on `ChapterTask` — each placement defines `outcomeFlags` and `outcomeNarratives` keyed by outcome code
- Flags are written to `MissionRun.flags`: a flat `Record<string, string>` scoped to one player's run
- Story beats (`STORY_BEAT` task type) read flags via `StoryBeatVariant.conditions[]` (AND logic, top-to-bottom, first match wins)
- Each act computes a summary flag (e.g. `act1_outcome: good | neutral | bad`) via threshold rules in `Act.summaryFlagConfig`
- Summary flags carry forward to later acts for narrative flavor
- **Retries** — `task.config.retries_allowed` enables retry attempts; on a non-success outcome with attempts remaining, `completeChapterTask` writes `_attempts_<chapterTaskId>` to `MissionRun.flags` (incrementing) without writing the outcome flag. The `_attempts_*` prefix is reserved; never use it for story flags.

---

## Task Types (VerificationRule)

A task can have **multiple** verification rules (AND logic: any `fail` → `fail`, any `partial` → `partial`, all `success` → `success`).

| VerificationRule | Concept | Notes |
|---|---|---|
| `GPS_ARRIVAL` | Navigate | GPS proximity trigger |
| `PHOTO_UPLOAD` | Photograph | Player uploads any photo |
| `OBJECT_DETECTION` | Photograph | AI detects a specific object in the photo |
| `QR_SCAN` | Scan | Player scans a QR code |
| `ANSWER_MATCH` | Observe | Answer matched server-side against `config.text_answer`; `config.choices` → multiple choice; `config.input_type: 'number'` → PIN field; default → free text |
| `SELF_REPORT` | Interact | Self-reported; optional `config.require_note: true` |
| `TIME_WINDOW` | Time-based | `config.windows: [{start, end}]` HH:MM UTC strings |
| `COUNTDOWN` | Time-based | Countdown timer |
| `CHOICE` | Choice | `choices: string[]`; `choiceOutcomes: Record<string, TaskOutcome>` |
| `STORY_BEAT` | Story beat | Narrative-only; no pass/fail; tap to continue |

Submission-based rules (`PHOTO_UPLOAD`, `OBJECT_DETECTION`, `QR_SCAN`, `ANSWER_MATCH`, `SELF_REPORT`, `CHOICE`) accept `config.instances_required: number` for multi-instance tasks.

---

## Architecture

### Next.js App Router

- **Server Components** for data reads — fetch directly from Prisma in the component; no intermediate API layer
- **Server Actions** for all mutations — form submissions and interactive updates call Server Actions; never build a REST endpoint for internal app data
- **Route Handlers** (`app/api/`) only for things that must be HTTP endpoints: webhook receivers, PWA manifest, and any third-party callback URLs
- Auth is custom JWT: session token stored in an `HttpOnly` cookie; a `getSession()` helper (called in Server Components and Server Actions) validates and returns the session. No NextAuth.
- Middleware (`middleware.ts`) enforces auth on protected routes by checking the session cookie

### Data Layer

- Prisma v7 + PostgreSQL; `prisma/` at project root
- Server Actions and Server Components import from `lib/db.ts` (the Prisma client singleton)
- Business logic lives in `lib/<domain>/` (e.g. `lib/mission/`, `lib/task/`); Server Actions are thin wrappers that call these functions and handle `revalidatePath`/`redirect`
- Never import Prisma client in client components

### Frontend

- **Tailwind first** — utility classes for all styling; custom CSS only for things Tailwind cannot express (pseudo-elements, complex `@keyframes`); co-located `<feature>.css` files, never `<style>` tags
- **Client components** (`'use client'`) only when you need browser APIs, event handlers, or local state — default to Server Components
- Domain components in `app/components/<domain>/`; cross-domain shared components in `app/components/<category>/` (never a `shared/` folder)
- Mobile-first — all UI must work at 375px width before scaling up
- Theme system: active theme set via `data-theme="<name>"` on `<html>`; CSS variable overrides in `app/globals.css`; persisted to `localStorage`

### PWA

- Service worker via `next-pwa` (or equivalent); configured in `next.config.ts`
- Offline resilience is a hard requirement — GPS task state and narrative reads must survive poor signal
- `public/manifest.json` declares app metadata, icons, and `display: standalone`

---

## Testing

Vitest with `globals: true` — no need to import `describe`, `it`, `expect`, `beforeAll`, `afterAll`, `vi`.

- Integration tests hit a real PostgreSQL instance — no DB mocking
- Each test file calls a `cleanup()` helper to delete rows in dependency order before seeding
- `fileParallelism: false` keeps test files serial (avoids DB race conditions)
- Use `it(` not `test(` for individual cases
- `environment: 'node'` for server-side tests; `environment: 'jsdom'` for component tests

---

## Coding Conventions

- **TypeScript strict mode** — no `any`, no implicit returns
- **Named exports** — no default exports except Next.js page/layout components (required by the framework)
- **2-space indentation**
- **Async/await** — not `.then()` chains
- **Env vars** — always use `.env.local` with a `.env.example`; server-only vars have no `NEXT_PUBLIC_` prefix

---

## Design Principles

1. **No dead ends** — failure is narratively meaningful, never a blocker
2. **Real world first** — the app supports the physical experience; it does not replace it
3. **Story over gamification** — narrative depth over points and streaks
4. **Low friction** — the player must always know what to do next
5. **Offline resilience** — must work in areas with poor signal
6. **Privacy by design** — collect only the location data needed

---

## Creator Workflow (Primary Surface)

This rebuild prioritises the creator experience as the core product surface. Two workflows:

1. **Task builder** — create reusable, story-agnostic tasks (type, instruction, optional GPS override)
2. **Story builder** — assemble tasks into Mission → Act → Chapter structure; add narrative context at each level (`pre_narrative`, `outcomeFlags`, `outcomeNarratives`, chapter `intro`/`outro`, act summary flag config)

All community-created content is moderated before players can access it (status: `pending_review → approved | rejected`). Reputation gate: **Handler** tier for basic tools, **Architect** for full access + revenue sharing.

---

## Design Documentation

Design docs live in `documentations/`. Three-tier pyramid:

- `documentations/00-vision.md` — product goals, principles, user types, non-goals
- `documentations/01-system-architecture.md` — app layers, auth, data, storage, PWA, offline
- `documentations/features/<feature>.md` — per-feature flows, states, data needs, UI

Before implementing a non-trivial feature, check `documentations/features/` for an existing spec. If one exists, the spec is authoritative — raise a conflict if the code would diverge. Use mermaid for any new diagrams added to these docs.

---

## Key Technical Complexity Areas

When touching these, flag complexity and suggest the simplest viable approach:

- **Branching story state** — flat `MissionRun.flags` bag + `ChapterTask` placement flags + `Act.summaryFlagConfig` threshold rules
- **GPS drift** — use generous proximity thresholds; provide self-report fallback
- **Photo validation pipeline** — must be swappable between community review, AI (Rekognition), and sampling modes
- **PWA offline** — service worker cache strategy must cover GPS task assets and narrative content; mutations queue for when connectivity returns
