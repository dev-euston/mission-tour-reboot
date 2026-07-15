# Mission: Tour

A location-based, narrative-driven adventure game delivered as a mobile-first web app. Creators build missions tied to real places; players complete those missions, and every outcome — success, partial, or failure — advances the story differently. There are no dead ends.

---

## The Core Loop

```
Mission
└── Act  (a physical location — the Stop)
    └── Chapter  (narrative context for a group of tasks)
        └── Task  (the real-world action to complete)
```

A **Mission** is one story told across multiple locations. Each **Act** anchors the story to a real place. **Chapters** give tasks their narrative meaning. **Tasks** are the atomic actions — navigate somewhere, photograph something, scan a QR code, make a choice.

Every task outcome writes a flag to a mission-scoped state bag. Later story beats read those flags to deliver branching narrative — consequences are short-lived and all paths converge (Telltale-style).

---

## Creator First

Missions are community-sourced. Creators at **Handler** tier and above build and publish content through two tools:

- **Task builder** — create reusable, story-agnostic tasks (type, instruction, optional precise GPS)
- **Story builder** — assemble tasks into Mission → Act → Chapter structure and add all narrative context: pre-task narrative, per-outcome story branches, chapter intros/outros, and act summary flags

All community content is moderated before players can access it.

---

## Reputation Tiers

| Tier | Access |
|---|---|
| Recruit | Basic missions only |
| Operative | Harder missions, episodic arcs |
| Handler | Basic mission creation tools |
| Architect | Full creator access, revenue sharing |

---

## Task Types

| Type | How it works |
|---|---|
| `GPS_ARRIVAL` | GPS proximity trigger at a specific location |
| `PHOTO_UPLOAD` | Player uploads any photo |
| `OBJECT_DETECTION` | AI detects a specific object in the photo |
| `QR_SCAN` | Player scans a QR code |
| `ANSWER_MATCH` | Answer matched server-side; renders as multiple choice, PIN field, or free text |
| `SELF_REPORT` | Self-reported completion; optionally requires a written note |
| `TIME_WINDOW` | Must complete within a defined UTC time window |
| `COUNTDOWN` | Countdown timer |
| `CHOICE` | Player selects from a set of options; each choice routes to a different outcome |
| `STORY_BEAT` | Narrative-only; no pass/fail; tap to continue |

---

## Local Setup

**Prerequisites:** Docker, Node.js, pnpm

```bash
# 1. Install dependencies
pnpm install

# 2. Start the database
cp .env.example .env.local   # fill in POSTGRES_URL and other secrets
docker compose up -d

# 3. Run migrations
pnpm db:migrate

# 4. (Optional) Seed sample mission data
pnpm db:seed

# 5. Start the dev server
pnpm dev
```

---

## Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind v4 · mobile-first (375px baseline)
- **Database:** PostgreSQL · Prisma v7 (Server Components + Server Actions read/write directly)
- **Auth:** Custom JWT · `HttpOnly` session cookie
- **Storage:** S3-compatible (AWS S3 + Rekognition for object detection)
- **PWA:** Offline-capable via service worker
- **Deploy:** Vercel

---

## Design Principles

1. **No dead ends** — failure is narratively meaningful, never a blocker
2. **Real world first** — the app supports the physical experience; it does not replace it
3. **Story over gamification** — narrative depth over points and streaks
4. **Low friction** — the player must always know what to do next
5. **Offline resilience** — must work in areas with poor signal
6. **Privacy by design** — collect only the location data needed; never sell or share it
