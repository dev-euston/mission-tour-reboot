# Auth & Agent Profile

Handles sign-up, sign-in, session management, and role access. On sign-up, every agent immediately has access to both Player and Creator tools. The Moderator and Business Owner roles are gated and require a separate application.

---

## Overview

Auth is a custom JWT system — no third-party auth provider. On sign-up, an Agent Profile is created with Player and Creator tracks active by default. The session token is stored in an `HttpOnly` cookie and validated server-side on every protected request.

---

## Role Access Model

| Role | Access |
|---|---|
| Player | Automatic on sign-up |
| Creator | Automatic on sign-up |
| Moderator | Gated — apply and be approved by a supervising moderator |
| Business Owner | Gated — apply with a business profile; approved by a supervising moderator |

---

## Flows

### Sign Up
1. Agent enters an email address and a display name (their agent handle).
2. A one-time verification link is sent to their email.
3. On click, a session is established and an Agent Profile is created with Player and Creator tracks active.
4. Agent is redirected to the mission browse screen.

### Sign In
1. Agent enters their email address.
2. A one-time sign-in link is sent.
3. On click, the session is re-established.
4. Agent is redirected to where they left off (or the mission browse screen).

### Session Management
- Session token is a signed JWT in an `HttpOnly` cookie.
- `getSession()` is called in Server Components and Server Actions to validate and return the session.
- `middleware.ts` enforces auth on protected routes before the request reaches the page.
- Sessions expire after a configurable TTL; re-authentication sends a new magic link.

### Apply for Moderator Role
1. Agent navigates to their profile and selects "Apply to become a Moderator".
2. Agent submits a short application: why they want to moderate and any relevant background.
3. Application enters the supervising moderator queue.
4. Supervising moderator reviews and approves or rejects with a reason.
5. On approval, the Moderator track is activated on the agent's profile and they gain access to the moderation tools.

### Apply for Business Owner Role
1. Agent navigates to their profile and selects "Apply as a Business Owner".
2. Agent completes a business profile: business name, type, physical address, contact email, and a brief description of the rewards they intend to offer.
3. Application enters the supervising moderator queue alongside the business profile details.
4. Supervising moderator reviews the application: verifies the business appears legitimate, checks for policy conflicts.
5. On approval, the Business Owner track is activated and the agent gains access to the Business Portal.
6. On rejection, the reason is shown and the agent can revise and resubmit.

---

## UI States

- **Unauthenticated** — redirected to sign-in; no mission content visible
- **Signed in** — Player and Creator tools immediately available
- **Email sent** — confirmation screen; resend option after a cooldown
- **Expired link** — error state with a new sign-in link offered
- **Application pending** — role application submitted; read-only status shown on profile
- **Application approved** — new role track activated; notification on next page load
- **Application rejected** — reason shown; revise and resubmit available

---

## Data Needs

- `AgentProfile` — `id`, `email`, `handle`, `createdAt`
- `AgentRole` — `agentId`, `role` (`player | creator | moderator | business_owner`), `status` (`active | pending | rejected`), `activatedAt`
- `RoleApplication` — `id`, `agentId`, `role`, `applicationData: Json`, `status`, `reviewedBy`, `reviewNotes`, `submittedAt`, `decidedAt`
- Session cookie JWT payload: `{ agentId, email, roles: string[] }`
- No passwords stored; no OAuth tokens stored
