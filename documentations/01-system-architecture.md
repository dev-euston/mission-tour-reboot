# System Architecture

Mission: Tour is a Next.js 15 App Router application backed by PostgreSQL (via Prisma), S3-compatible object storage, and a custom JWT auth system. It is deployed as a PWA with offline resilience as a hard requirement.

---

## App Layers

```
Browser (PWA)
  └── Next.js App Router
        ├── Server Components  →  reads (Prisma, direct)
        ├── Server Actions     →  mutations (thin wrappers over lib/)
        └── Route Handlers     →  webhooks, manifest, third-party callbacks

lib/<domain>/               ←  business logic (pure functions)
lib/db.ts                   ←  Prisma client singleton

PostgreSQL                  ←  primary data store
S3-compatible storage       ←  photo uploads, mission assets
```

### Server Components
Used for all data reads. Fetch directly from Prisma inside the component — no intermediate API layer. This keeps read paths simple and avoids unnecessary round trips.

### Server Actions
Used for all mutations. Form submissions and interactive updates call Server Actions, which call `lib/<domain>/` functions and then handle `revalidatePath` or `redirect`. Never build a REST endpoint for internal app data mutations.

### Route Handlers (`app/api/`)
Used only for things that must be HTTP endpoints: webhook receivers (e.g. photo validation callbacks), the PWA manifest, and third-party OAuth or callback URLs.

---

## Authentication

Auth is a custom JWT implementation — no NextAuth or third-party auth provider.

- Session token is a signed JWT stored in an `HttpOnly` cookie
- `getSession()` validates and returns the session; called in Server Components and Server Actions
- `middleware.ts` enforces auth on protected routes by checking the cookie before the request reaches the page
- Agent Profiles are created on first sign-up; reputation tier is stored on the profile and checked at the application layer for feature access

---

## Data Layer

- **Prisma v7** + PostgreSQL; schema lives in `prisma/`
- The Prisma client singleton is in `lib/db.ts` — import from here, never instantiate directly
- Business logic lives in `lib/<domain>/` (e.g. `lib/mission/`, `lib/task/`, `lib/run/`)
- Server Actions are thin: call a `lib/` function, then handle path revalidation or redirect
- Never import the Prisma client in client components

### Core Entities

```
AgentProfile         ←  player/creator identity, reputation tier
Mission              ←  the full narrative arc; has status (draft/published)
Act                  ←  one physical location (Stop); owns GPS coordinates
Chapter              ←  narrative grouping within an Act
ChapterTask          ←  placement of a Task in a Chapter; carries all story context
Task                 ←  pure action; story-agnostic; reusable across missions
MissionRun           ←  one player's in-progress or completed run of a Mission
ChapterTaskResult    ←  recorded outcome for one ChapterTask within a MissionRun
```

### Story State Model
Flags are the mechanism for branching narrative. They live in `MissionRun.flags` — a flat `Record<string, string>` scoped to one player's one run.

- `ChapterTask.outcomeFlags` — maps outcome code → flag name (set when a task is completed)
- `ChapterTask.outcomeNarratives` — maps outcome code → narrative text shown to the player
- `Act.summaryFlagConfig` — threshold rules that compute an act-level summary flag (e.g. `act1_outcome: good | neutral | bad`) at end of act
- `StoryBeatVariant.conditions[]` — AND logic; top-to-bottom; first match wins; reads from `MissionRun.flags`

The `_attempts_<chapterTaskId>` flag key prefix is reserved for retry tracking — never use it for story flags.

---

## Storage

- Photos and mission assets are stored in S3-compatible object storage (e.g. AWS S3 or compatible)
- Upload URLs are pre-signed server-side; the client uploads directly to storage
- The photo validation pipeline (for `OBJECT_DETECTION` tasks) is designed to be swappable between three modes:
  1. **Community review** — a moderator manually reviews the photo
  2. **AI validation** — AWS Rekognition (or equivalent) checks for the required object
  3. **Sampling** — a percentage of submissions are reviewed; the rest auto-pass

---

## PWA & Offline

- Service worker registered via `next-pwa` (or equivalent); configured in `next.config.ts`
- `public/manifest.json` declares app metadata, icons, and `display: standalone`
- Offline resilience is a hard requirement:
  - GPS task state and narrative content are cached by the service worker
  - Mutations (task completions, photo uploads) are queued locally and replayed when connectivity returns
  - The app must be usable in airplane mode once a mission has been loaded

---

## Frontend Conventions

- **Tailwind v4 first** — utility classes for all styling; custom CSS only for pseudo-elements or complex `@keyframes`; co-located `<feature>.css` files
- **Client components** (`'use client'`) only when browser APIs, event handlers, or local state are required — default to Server Components
- Domain components in `app/components/<domain>/`; cross-domain shared UI in `app/components/<category>/`
- **Mobile-first** — all UI must work at 375px width before scaling up
- Theme system: active theme set via `data-theme="<name>"` on `<html>`; CSS variable overrides in `app/globals.css`; persisted to `localStorage`

---

## Key Complexity Areas

These areas require careful design — flag them when touched and prefer the simplest viable approach:

| Area | Risk |
|---|---|
| Branching story state | Flag bag + ChapterTask placement + Act summary rules must stay consistent across retries and partial completions |
| GPS drift | Use generous proximity thresholds; always provide a self-report fallback |
| Photo validation pipeline | Must be swappable between community review, AI, and sampling without schema changes |
| PWA offline | Service worker cache strategy must cover GPS task assets and narrative content; mutation queue must be reliable |
