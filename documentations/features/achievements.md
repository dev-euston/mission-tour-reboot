# Achievements & Progression

The gamification layer across all four roles. Each role — Player, Creator, Moderator, Business Owner — has its own independent track with separate scores, badges, and tiers. A user active in multiple roles accumulates progress on each track independently; they never mix.

---

## Player Gamification

### Mission Completion Stamps
Every completed mission leaves a stamp on the player's user profile — a visual record of their run history. The stamp reflects the overall outcome of the run (good / neutral / bad, derived from act summary flags), giving it meaning beyond just "completed".

- One stamp per mission per run; replaying a mission can earn a new stamp
- Stamps are displayed as a collection on the profile — a visual log of places visited and stories experienced
- Stamp art can be mission-specific (defined by the creator) or a default tied to the mission's narrative theme

### Achievement Badges
MMORPG-style badges awarded for hitting milestones or completing specific feats. Badges are permanent once earned.

Examples:
| Badge | Condition |
|---|---|
| First Mission | Complete your first mission |
| Clean Sweep | Complete a mission with all "success" task outcomes |
| Ghost | Complete a mission with zero failed tasks |
| Cartographer | Complete missions across 5 different physical locations |
| Completionist | Complete a mission on all available outcome paths (replay) |
| Night Owl | Complete a mission between midnight and 5am |
| Speed Run | Complete a mission under a creator-defined time threshold |
| Community Pick | Complete a mission with a community rating above threshold |

Badges are defined in a server-side catalogue. Creators can define mission-specific badges (e.g. "unlocked only by completing Mission X with a 'good' outcome") as an optional feature.

### Persistent Score, Level & Ranking
A cumulative score that accumulates across all missions and drives the player's level and ranking. Levels are numeric — there are no named tiers for players.

Score is earned from:
- Mission completion (base points)
- Outcome quality (bonus for "good" act outcomes, reduced points for "bad")
- Badge unlocks (one-time point bonuses)
- Replay completions (diminishing returns on the same mission)

Score determines **level** (a numeric progression, e.g. Level 1 → Level 2 → ...) and feeds a **global ranking** (all players) and a **local ranking** (players who have run missions in the same geographic area). Rankings are visible on the user profile and on mission detail pages (top completers).

---

## Creator Gamification

Creators have a separate gamification track designed to reward consistent, quality output. Unlike player gamification, creator achievements can include time-boxed challenges.

### Creator Badges
| Badge | Condition |
|---|---|
| First Draft | Submit your first task for review |
| Published | Have your first mission approved and published |
| Three in a Row | Have 3 submissions approved without a rejection in between |
| Prolific | Publish 5 missions |
| Well Received | Have a mission reach an average player rating above threshold |
| Location Scout | Create missions across 3 different geographic areas |
| Collaborator | Have a task used by another creator in their mission |

### Creator Challenges (Weekly / Seasonal)
Time-boxed challenges that encourage output bursts. These are optional — creators do not lose anything by ignoring them.

Examples:
- "Create 3 tasks this week"
- "Publish a mission this month"
- "Have a mission completed by 10 players this season"

Completing a challenge earns a creator score bonus and may award a limited-edition badge. Challenges are defined by platform staff, not by creators themselves.

### Creator Score
Separate from the player score. Feeds into the creator's reputation tier calculation alongside moderation signals (approval rate, rejection rate, player ratings on published missions).

---

## Moderator Track

Moderators are assigned by staff, not self-selected. Their track rewards review quality and volume.

### Moderator Badges
| Badge | Condition |
|---|---|
| First Verdict | Complete your first moderation review |
| Century | Complete 100 reviews |
| Sharp Eye | Maintain an accuracy rate above threshold for 30 days |
| Trusted Reviewer | Assigned by staff for sustained high-quality moderation |

No weekly challenges for moderators — review cadence is organic, not incentivised by streaks.

---

## Business Owner Track

Rewards campaign performance and platform participation.

### Business Owner Badges
| Badge | Condition |
|---|---|
| Open for Business | Launch your first reward campaign |
| Fully Redeemed | Have a campaign pool fully claimed by players |
| Local Favourite | Have rewards redeemed across 3 different missions |
| Returning Sponsor | Run 3 or more campaigns |

Business Owner score is primarily a trust signal for the platform (similar to creator reputation for moderation) — it is not a public ranking.

---

## Data Needs

- `Badge` — `id`, `slug`, `name`, `description`, `iconUrl`, `scope` (`player | creator`)
- `UserBadge` — `userId`, `badgeId`, `earnedAt`; unique per user per badge
- `MissionStamp` — `userId`, `missionId`, `missionRunId`, `outcome`, `stampArt`, `earnedAt`
- `UserScore` — `userId`, `playerScore`, `creatorScore`, `updatedAt`
- `CreatorChallenge` — `id`, `description`, `condition: Json`, `startsAt`, `endsAt`, `badgeId` (nullable), `scoreBonus`
- `UserChallengeCompletion` — `userId`, `challengeId`, `completedAt`
- Score and tier recalculation runs server-side on mission completion and moderation events; not real-time

---

## Open Questions

- **Stamp art** — does the platform provide default stamp art, or is it always creator-defined? A default set per mission theme is the practical starting point.
- **Ranking visibility** — is the global ranking public (visible to all players) or only visible to the signed-in user? Start private, open later.
- **Score decay** — does inactivity reduce score over time? Probably not at launch — keep it simple; score only goes up.
- **Mission-specific badges** — creator-defined badges are powerful but add complexity. Post-launch feature.
