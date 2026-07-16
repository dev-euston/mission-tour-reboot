# Agent Profile

The identity surface for every agent on the platform. A single agent can hold any combination of the four roles — Player, Creator, Moderator, Business Owner — and each role runs as a separate, independent track on the profile. Tracks do not mix: player score does not affect creator tier, and so on.

The profile is functional, not social — it surfaces progress and trust, not a follower graph.

---

## Overview

Every signed-in user has an Agent Profile, created automatically on first sign-up. Player and Creator tracks are active immediately. The Moderator and Business Owner tracks must be applied for and approved by a supervising moderator before they appear on the profile.

The profile shows whichever role tracks are active for that agent. A pure player sees only their player track. A creator who also plays sees both. An agent running all four roles sees all four tracks.

---

## Profile Structure

### Identity (always shown)
| Field | Description |
|---|---|
| Handle | Unique display name chosen at sign-up |
| Member since | Account creation date |
| Active roles | Which of the four tracks are active for this agent |

### Player Track
Visible if the agent has ever started a mission.

| Field | Description |
|---|---|
| Player level | Current numeric level driven by player score |
| Player score | Cumulative score from completions, outcomes, and badges |
| Global ranking | Position among all players by score |
| Mission stamps | Visual stamp collection; one per completed run, outcome-flavoured |
| Achievement badges | Permanent badges earned through milestones and feats |
| Missions in progress | Active runs with resume CTA |
| Missions completed | History with outcome summary |

### Creator Track
Visible if the agent has ever saved a task or mission draft.

| Field | Description |
|---|---|
| Creator tier | Recruit → Operative → Handler → Architect |
| Creator score | Cumulative score from approvals, ratings, and challenge completions |
| Missions published | Count and list with play count and average player rating |
| Tasks in library | Count of approved reusable tasks |
| Moderation standing | Current flag status (clean / flagged); visible only to the agent |
| Creator badges | Earned through output milestones and quality signals |
| Active challenges | Any open weekly/seasonal creator challenges with progress |

### Moderator Track
Visible only if the agent has been assigned moderator status by platform staff.

| Field | Description |
|---|---|
| Reviews completed | Total moderation decisions made |
| Accuracy rate | Percentage of decisions not later overturned |
| Moderator badges | Earned through volume and quality of reviews |

### Business Owner Track
Visible if the agent has a linked business profile.

| Field | Description |
|---|---|
| Business name | Linked business profile |
| Active campaigns | Campaigns currently live with pool remaining |
| Total rewards issued | Across all campaigns |
| Total rewards redeemed | Redemption rate across campaigns |
| Business Owner badges | Earned through campaign milestones |

---

## Flows

### Apply for a Gated Role
1. Agent sees a persistent "Apply for more roles" section on their profile listing the two gated roles (Moderator, Business Owner) with a brief description of each.
2. Agent taps to apply and is taken to the relevant application form.
3. On submission, the role shows as "Application pending" on the profile.
4. On approval or rejection, the agent is notified on next page load.
5. Approved roles activate immediately and the new track appears on the profile.

### View Profile
1. Agent navigates to their profile from the nav.
2. Active role tracks are shown as tabs or sections — only tracks with activity are visible.
3. Each track shows the relevant tier, score, and progress indicators.

### Tier Upgrade
1. Tier is recomputed server-side on relevant events: mission completion (player), moderation decision (moderator), content approval or rating (creator), campaign milestone (business owner).
2. When a threshold is crossed, the agent sees an upgrade notification on next page load.
3. The notification explains the practical meaning of the new tier (e.g. "Your submissions will now move through moderation faster").

### Flagged State (Creator Track)
1. If a creator accumulates rejections above threshold, or a moderator flags the account, the creator track is flagged.
2. The agent sees a notice on their creator track explaining the flag and what is required to lift it.
3. A flag does not affect any other role track.

---

## UI States

- **Single role** — profile shows one track; clean and minimal
- **Multi-role** — tracks shown as tabs; agent switches between them
- **Tier upgrade notification** — shown once per upgrade per track; dismissed on tap
- **Flagged creator** — warning banner on creator track; other tracks unaffected
- **Empty track** — a role with no activity yet shows a brief CTA (e.g. "Start your first mission" for an agent who has never played)
- **Role application pending** — shown in a "Roles" section below the active tracks; non-intrusive
- **Role application rejected** — reason shown inline; reapply or revise link available

---

## Data Needs

- `AgentProfile` — `id`, `handle`, `email`, `createdAt`, `isModerator`
- `PlayerProgression` — `agentId`, `level`, `score`, `globalRank`
- `CreatorProgression` — `agentId`, `tier`, `score`, `flagStatus`, `flagReason`
- `ModeratorProgression` — `agentId`, `reviewCount`, `accuracyRate`
- `BusinessOwnerProgression` — `agentId`, `businessProfileId`, `totalIssued`, `totalRedeemed`
- `AgentBadge` — `agentId`, `badgeId`, `earnedAt`
- `MissionStamp` — `agentId`, `missionId`, `missionRunId`, `outcome`, `earnedAt`
- Tier thresholds are server-side config; not stored in a user-facing table
