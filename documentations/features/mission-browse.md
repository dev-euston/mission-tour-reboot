# Mission Browse

The entry point for players after sign-in. Players discover, preview, and start missions from this surface. It is the storefront of the platform.

---

## Overview

The browse screen presents a curated list of available missions. Players can filter by location, estimated duration, and difficulty. Each mission card surfaces enough context for a player to commit: title, setting, estimated time, reputation requirement, and a short brief.

Only missions with status `approved` and `published` are visible to players. Missions that require a higher reputation tier than the player's current tier are shown but locked.

---

## Flows

### Browse
1. Player lands on the browse screen after sign-in.
2. Missions are listed as cards, sorted by featured status then recency.
3. Player can filter by: location area, estimated duration, reputation tier required.
4. Tapping a card opens the Mission Detail screen.

### Mission Detail
1. Shows the full mission brief, act count, estimated duration, creator handle, and reputation requirement.
2. A "Start Mission" button is shown if the player meets the reputation gate.
3. If the player does not meet the tier requirement, the button is replaced with a lock state explaining what tier is needed.
4. If the player has an in-progress run for this mission, the button changes to "Continue Mission".

### Start Mission
1. Tapping "Start Mission" creates a new `MissionRun` record.
2. Player is taken directly to the first Act of the mission.
3. If the player already has an in-progress run, tapping "Continue Mission" resumes at the last incomplete ChapterTask.

---

## UI States

- **Loading** — skeleton cards while the list fetches
- **Empty** — no missions match the active filters; prompt to clear filters
- **Locked mission** — card shows the tier lock; tapping opens the detail with an explanation
- **In-progress mission** — card shows a progress indicator and "Continue" CTA
- **Completed mission** — card shows a completion badge; player can replay

---

## Data Needs

- `Mission` — `id`, `title`, `brief`, `estimatedDurationMinutes`, `reputationTierRequired`, `status`, `createdBy` (creator handle), `actCount`
- `MissionRun` — used to surface in-progress and completed state for the signed-in player
- Filter options are derived from mission metadata (no separate taxonomy table at launch)
