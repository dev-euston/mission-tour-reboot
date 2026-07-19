# Rewards & Business Portal

The surface through which Business Owners offer real-world incentives to players, and through which players redeem those rewards upon mission completion or milestone achievement.

---

## Overview

Rewards bridge the in-app experience to the real world. A Business Owner sponsors a mission (or a specific Act within a mission) and provides a pool of rewards — typically vouchers, discounts, or access offers. Players who complete the mission or reach the associated milestone receive a reward code they can redeem in person or online.

This is the primary commercial model for the platform. Business Owners pay to participate; Creators (at Architect tier) may earn a share of that revenue.

---

## User Types

- **Business Owner** — manages their business profile, reward campaigns, and reward inventory
- **Player** — earns and redeems rewards through normal mission play
- **Creator** — partners with a Business Owner to place their Stop or brand into a mission narrative

---

## Flows

### Business Owner: Set Up a Reward Campaign
1. Business Owner creates a business profile (name, location, contact).
2. Business Owner creates a reward: type (voucher code, percentage discount, free item, access), description shown to players, terms and expiry.
3. Business Owner allocates a pool size (number of rewards available).
4. Business Owner links the reward to a mission (or a specific Act within a mission) — either by partnering with a creator, or by having the platform team wire the link.
5. Campaign goes live when the linked mission is published.

### Player: Earn a Reward
1. Player completes the mission (or the specific Act) that has a reward attached.
2. On the completion screen, a reward is shown if one is available in the pool.
3. Player taps to claim — a unique voucher code (or equivalent) is issued and stored on their Agent Profile.
4. The pool count decrements; if the pool is exhausted, subsequent completions show an "out of stock" state.

### Player: Redeem a Reward
1. Player opens their reward wallet from their Agent Profile.
2. Each unclaimed reward shows the business name, description, and expiry.
3. Player taps to reveal the code (or show a barcode/QR) and presents it in person or at checkout.
4. Reward is marked as redeemed with a timestamp.

---

## Reward Types

| Type | Description |
|---|---|
| Voucher code | A unique alphanumeric code; one-time use |
| Percentage discount | A reusable or one-time percentage off at a specific business |
| Free item | A specific item offered by the business on presentation |
| Access pass | Entry to an experience, event, or location |

At launch, voucher codes are the primary type. Other types may require integration with the business's POS or booking system — post-launch.

---

## Reward Triggers

Rewards can be tied to:
- **Mission completion** — player completes all Acts
- **Act completion** — player completes a specific Act (useful for business owners tied to one Stop)
- **Outcome-gated** — reward only issued if a specific summary flag condition is met (e.g. only players who got `act1_outcome: good` receive the premium reward)

---

## Business Portal UI States

- **Dashboard** — active campaigns, pool remaining, redemption count
- **Create campaign** — reward type, description, terms, pool size, mission link
- **Campaign active** — live stats; pool can be topped up; early termination available
- **Campaign ended** — summary: total issued, total redeemed, expiry rate
- **Out of stock** — pool exhausted; option to top up or close

## Player UI States

- **Reward earned** — shown on mission/act completion screen; prominent CTA to claim
- **Reward wallet** — list of claimed rewards grouped by unclaimed / redeemed / expired
- **Redeem screen** — full-screen code or QR display; one-tap mark as redeemed
- **Out of stock** — shown on completion if pool is exhausted; no reward issued

---

## Data Needs

- `BusinessProfile` — `id`, `name`, `location`, `contactEmail`, `createdAt`
- `RewardCampaign` — `id`, `businessId`, `missionId`, `actId` (nullable), `rewardType`, `description`, `terms`, `expiresAt`, `poolSize`, `poolRemaining`, `triggerCondition: Json`
- `PlayerReward` — `id`, `agentId`, `campaignId`, `code`, `issuedAt`, `redeemedAt` (nullable), `expiresAt`
- Voucher codes are generated server-side on claim; never pre-generated in bulk (to avoid leakage)

---

## Open Questions

- **Verification** — how does the Business Owner confirm a redemption happened? At launch, self-reported by the player (mark as redeemed). A future integration with POS/booking systems could automate this.
- **Fraud** — should there be a cool-down between completing a mission and claiming a reward to reduce farming? Consider: one reward per player per campaign lifetime.
- **Creator revenue share** — Architect-tier creators who bring a Business Owner sponsor may earn a percentage of the campaign fee. The exact split is TBD and post-launch.
