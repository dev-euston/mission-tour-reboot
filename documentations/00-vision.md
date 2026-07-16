# Vision

Mission: Tour is a location-based, narrative-driven adventure game delivered as a mobile-first web app. Players complete real-world tasks tied to physical locations, and those outcomes feed a branching story. The game is built on community-sourced content — creators write missions, and the player experience is downstream of having a rich, diverse creator ecosystem.

---

## Product Goals

1. **Enable creators to build compelling missions** — The primary value of the platform comes from creators authoring high-quality, place-rooted narratives. The creator tools must be expressive enough to support spy thrillers, walking tours, detective stories, and more, without requiring technical skill.

2. **Deliver a seamless player experience** — Players should always know what to do next. The app supports the physical experience; it never replaces or blocks it. Narrative feedback (success, failure, partial) is always immediate and meaningful.

3. **Build a trust-weighted community** — Anyone can create from day one. Reputation is earned through play and by having content well-received by the community. A creator's reputation tier determines how their submissions are treated in moderation — high trust means lighter scrutiny and faster approval; low trust means closer review. The system rewards quality without locking people out of creation.

4. **Operate offline-first** — Missions happen in the real world, often in areas with poor connectivity. Core task flows — GPS arrival, narrative reads, self-reports — must work without a reliable network connection.

---

## Roles

A single agent can hold any combination of the four roles simultaneously. Each role is a separate track with its own progression, score, and gamification — they do not mix. An agent who plays missions, publishes content, reviews submissions, and runs a reward campaign has four independent tracks running in parallel on their profile.

### Player
Selects and runs missions. Navigates to physical locations, completes tasks, and experiences a branching narrative that responds to their outcomes. Earns mission stamps, achievement badges, and a persistent player score that feeds their reputation ranking.

### Creator
Authors missions. Builds reusable tasks in the **Task Builder** and assembles them into narrative structures in the **Story Builder**. Any agent can create — there are no role gates on the tools. A creator's reputation tier (earned through their creator track) determines how submissions move through moderation: trusted creators get lighter review; new or low-reputation creators get closer scrutiny.

### Moderator
Reviews community-created content before it is published. Approves or rejects tasks and missions, and manages the photo validation queue during player runs. The Moderator role is gated — any agent can apply, but the application is reviewed and approved by a supervising moderator. There is a two-level hierarchy: regular moderators handle content review; supervising moderators handle content review and role applications.

### Business Owner
A real-world business (café, retailer, attraction, etc.) that sponsors missions or provides rewards to players. Manages reward campaigns — vouchers, discounts, access passes — redeemable by players on mission completion. The Business Owner role is gated — any agent can apply, but the application (including business profile verification) is reviewed and approved by a supervising moderator. Business Owner participation is the primary commercial model for the platform.

---

## Reputation Tiers

Each role track has its own progression system — they are independent and do not affect one another.

### Player Levels
Players progress through numeric levels driven by player score (mission completions, outcome quality, badges earned). Levels have no named tiers — they reflect how much a player has experienced, not a trust classification.

### Creator Tiers
Driven by creator score (approvals, rejection rate, player ratings on published missions). Tiers affect moderation treatment — not tool access.

| Tier | Moderation Treatment |
|---|---|
| Recruit | Full manual review on every submission |
| Operative | Standard queue; prior approved content noted to reduce re-review effort |
| Handler | Expedited queue; strong approval history surfaced to the moderator |
| Architect | Lightest scrutiny; fast-tracked; eligible for revenue sharing |

A creator flagged for repeated rejections or policy violations is demoted within their tier: submissions move to heightened review regardless of tier until the flag is lifted.

### Moderator & Business Owner Tracks
These roles have their own separate progression tracks. The shape of those tracks is defined in their respective feature docs.

---

## Design Principles

1. **No dead ends** — Failure is narratively meaningful, never a game-over. Every outcome — success, partial, fail — advances the story differently.
2. **Real world first** — The app is a companion to a physical experience. It must not demand attention away from the environment.
3. **Gamification serves the story, not the other way around** — Badges, stamps, and scores reinforce engagement and reward real effort. For players, they reflect mission history and outcomes. For creators, they encourage consistent output. Neither should become a grind that replaces the narrative as the core motivation.
4. **Low friction** — The next action is always obvious. No menus to dig through mid-mission.
5. **Offline resilience** — Core flows must survive poor signal. Mutations queue; reads are cached.
6. **Privacy by design** — Collect only the GPS data the mission requires. No persistent tracking between missions.

---

## Non-Goals

- **This is not a general-purpose game engine.** Missions are structured narratives tied to real locations, not arbitrary game logic.
- **This is not a social network.** There are no follows, feeds, or social graphs. Community is built through shared missions, not profiles.
- **Gamification does not replace the story.** Badges, stamps, and scores support engagement — they are not the reason to play. A mission with weak narrative but high badge yield is not a good mission.
- **This is not a live-ops platform.** There is no real-time multiplayer, live events, or time-limited content at launch.
- **Creator monetization is post-launch.** Revenue sharing for Architect-tier creators is planned but not part of the initial build.
