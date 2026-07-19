# Task Builder

The creator tool for building reusable, story-agnostic tasks. Tasks created here are the atomic units that get placed into missions via the Story Builder.

---

## Overview

A Task describes a real-world action — photograph something, scan a code, answer a question, navigate to a spot. Tasks carry no narrative context; that lives in the `ChapterTask` placement. This separation means a well-designed task (e.g. "photograph a red door") can be reused across many different missions with completely different story contexts.

Any signed-in user can access the Task Builder. Reputation tier affects how submitted tasks are treated in moderation, not whether the tool is available.

---

## Flows

### Create a Task
1. Creator names the task (internal label; not shown to players).
2. Creator selects the task type (see table below).
3. Creator configures the type-specific settings (answer text, choices, object label, GPS pin, etc.).
4. Optionally sets: `instances_required` (for multi-instance submission tasks), `retries_allowed`, and an optional GPS override (if the task requires proximity beyond the Act's Stop).
5. Task is saved as a draft; the creator can publish it to make it available for story building.

### Edit a Task
- Tasks that have not yet been placed in any ChapterTask can be freely edited.
- Tasks placed in a published mission are read-only. The creator must duplicate and create a new version.

### Task Library
- Creators can browse their own tasks and community tasks (approved, by other creators).
- Filter by task type and search by name.
- Tasks can be duplicated to create a personal variant.

---

## Task Types & Config

| Type | Config Fields |
|---|---|
| `GPS_ARRIVAL` | `gps_lat`, `gps_lng`, `gps_radius_m` (overrides Act Stop if set) |
| `PHOTO_UPLOAD` | `instances_required` |
| `OBJECT_DETECTION` | `object_label` (what AI/moderator looks for), `instances_required` |
| `QR_SCAN` | `qr_value` (expected scan value), `instances_required` |
| `ANSWER_MATCH` | `text_answer`, `choices` (optional), `input_type` (`text` or `number`), `instances_required` |
| `SELF_REPORT` | `require_note` (bool), `instances_required` |
| `TIME_WINDOW` | `windows: [{start, end}]` (HH:MM UTC strings) |
| `COUNTDOWN` | `duration_seconds` |
| `CHOICE` | `choices: string[]`, `choiceOutcomes: Record<string, TaskOutcome>` |
| `STORY_BEAT` | No config (pure narrative; story context lives in ChapterTask) |

---

## Verification Logic

A task can have **multiple** VerificationRules (AND logic):
- Any `fail` → overall outcome is `fail`
- Any `partial` → overall outcome is `partial`
- All `success` → overall outcome is `success`

This lets creators combine rules — e.g. GPS proximity AND photo upload — without building a new task type.

---

## UI States

- **Draft** — task created but not yet submitted for review
- **Pending review** — submitted; awaiting moderator approval
- **Approved** — available to place in missions
- **Rejected** — returned with moderator feedback; creator can revise and resubmit
- **In use (published)** — placed in at least one published mission; read-only

---

## Data Needs

- `Task` — `id`, `name`, `type`, `config: Json`, `status`, `createdBy`, `createdAt`
- `VerificationRule` — `taskId`, `type`, `config: Json`
- Task status flow: `draft → pending_review → approved | rejected`
