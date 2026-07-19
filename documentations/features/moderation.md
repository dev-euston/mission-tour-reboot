# Moderation

The review pipeline covering three distinct responsibilities: community content review, photo validation during player runs, and role application approval. Moderators operate at two levels — regular and supervising — with supervising moderators handling everything regular moderators do plus role application decisions.

---

## Moderator Hierarchy

| Level | Responsibilities |
|---|---|
| Regular moderator | Review tasks and missions; manage photo validation queue; flag creator accounts |
| Supervising moderator | All of the above, plus: approve/reject Moderator role applications; approve/reject Business Owner role applications; lift creator account flags |

Supervising moderator status is assigned by platform staff. Regular moderator status is approved by a supervising moderator via the role application flow.

---

## Overview

Moderation ensures quality and safety before content reaches players. Every creator can submit content from day one; reputation determines the weight of scrutiny applied. A new or low-reputation creator receives full manual review on every submission. A trusted creator with a consistent record of approvals moves through a lighter, faster process. A creator with a pattern of rejections or violations receives heightened scrutiny — more moderators, lower queue priority, additional checks. The photo validation pipeline (for `OBJECT_DETECTION` tasks) is a separate but related concern — it runs during player mission runs, not during content creation.

---

## What Gets Moderated

| Content | Trigger |
|---|---|
| Task | Creator submits from Task Builder |
| Mission (full submission) | Creator submits from Story Builder |

Missions are reviewed as a complete unit — the moderator sees the full narrative arc, all ChapterTask placements, and all flag configurations. Individual tasks within the mission may already be approved from a prior submission; this is noted to reduce moderator effort.

---

## Status Flow

```
draft → pending_review → approved | rejected
                              ↓
                         (revision)
                         pending_review → approved | rejected
```

- A creator can revise a rejected submission and resubmit.
- Once approved, content is published and visible to players.
- An approved task that is later placed in a new mission does not need re-review (the task is trusted; the mission placement is reviewed as part of the mission).

---

## Reputation-Weighted Review

| Creator Tier | Review Behaviour |
|---|---|
| Recruit | Full manual review; no shortcuts; longest expected wait |
| Operative | Standard review; previously approved tasks flagged as trusted to reduce re-review effort |
| Handler | Expedited queue position; strong approval history is surfaced to the moderator |
| Architect | Lightest scrutiny; moderator sees trust summary upfront; fast-tracked |
| Flagged (any tier) | Demoted to heightened review: lower queue priority, requires sign-off from two moderators, additional content checks |

A creator is flagged when: they accumulate a threshold of rejections within a rolling period, or a moderator explicitly flags the account for a policy violation. Flags can be lifted by a moderator after a probation period with clean submissions.

---

## Moderator Workflow

### Review Queue
1. Moderator sees a list of pending submissions, sorted by priority (flagged accounts first, then by tier weight descending, then by submission date).
2. Each item shows: content type (task or mission), creator handle, reputation tier, flag status, submission date, and a link to review.

### Reviewing a Task
1. Moderator reads the task name, type, and config.
2. Checks for: clear instruction, appropriate difficulty, no harmful content, correct config for the task type.
3. Approves (task becomes available in the library) or rejects (with a written reason returned to the creator).

### Reviewing a Mission
1. Moderator reads the full mission: brief, each Act's Stop and narrative framing, each Chapter's intro/outro, and each ChapterTask's pre/outcome narratives.
2. Checks for: narrative coherence, no harmful content, correct flag wiring (do outcomeFlags and summaryFlagConfig make sense?), GPS coordinates are real and accessible.
3. Approves (mission is published) or rejects (with written feedback per section if needed).

---

## Photo Validation (Runtime Moderation)

For missions with `OBJECT_DETECTION` tasks, submitted photos are validated separately during mission runs — not during content creation review. Three modes (switchable without schema changes):

1. **Community review** — a moderator manually reviews the photo submission and marks it pass/fail
2. **AI validation** — AWS Rekognition (or equivalent) checks for the required object label
3. **Sampling** — a configured percentage of submissions are reviewed; the rest auto-pass

The outcome of photo validation writes back to the `ChapterTaskResult` and unblocks the player's run.

---

## Role Application Review (Supervising Moderators Only)

### Moderator Applications
1. Supervising moderator sees pending moderator applications in a separate queue.
2. Reviews the applicant's handle, reputation tiers, and their written application.
3. Approves (Moderator role activated on the applicant's profile) or rejects with a written reason.
4. No appeal process — the applicant can reapply after a cooldown period.

### Business Owner Applications
1. Supervising moderator sees pending business owner applications in a separate queue.
2. Reviews the submitted business profile: name, type, address, contact, and proposed reward types.
3. Checks for: business appears legitimate and real, proposed rewards are appropriate, no policy conflicts (e.g. alcohol brands near school locations).
4. Approves (Business Owner role and Business Portal activated) or rejects with a written reason.
5. Applicant can revise the business profile and resubmit immediately after rejection.

---

## UI States

### Regular Moderator
- **Content queue** — pending task and mission submissions
- **Review panel** — full content view with approve/reject controls and a notes field
- **Photo queue** — pending photo validation submissions during player runs
- **History** — log of past decisions

### Supervising Moderator
- All regular moderator views, plus:
- **Role application queue** — pending moderator and business owner applications, shown as a separate tab
- **Application review panel** — applicant details, submitted info, approve/reject with notes
- **Flag management** — list of flagged creator accounts with option to lift flags

### Creator (content submission)
- **Pending** — submission in review; task/mission locked
- **Approved** — confirmed with timestamp
- **Rejected** — reason shown; revision and resubmit available

### User (role application)
- **Application pending** — submitted; read-only status on profile
- **Application approved** — new role track activated; notification on next page load
- **Application rejected** — reason shown; reapply or revise available

---

## Data Needs

- `Task.status` / `Mission.status` — `draft | pending_review | approved | rejected`
- `ModerationRecord` — `contentType`, `contentId`, `moderatorId`, `decision`, `notes`, `decidedAt`
- `ChapterTaskResult.photoStatus` — `pending | approved | rejected` (for photo validation)
- `RoleApplication` — `userId`, `role`, `applicationData: Json`, `status`, `reviewedBy`, `reviewNotes`, `submittedAt`, `decidedAt` (shared with auth feature)
- `UserRole.level` — `regular | supervising` (for Moderators only; other roles have no sub-level)
