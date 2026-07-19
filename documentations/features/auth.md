# Auth & User Profile

Handles sign-up, sign-in, session management, and role access. On sign-up, every user immediately has access to both Player and Creator tools. The Moderator and Business Owner roles are gated and require a separate application.

---

## Overview

Auth is a custom JWT system — no third-party auth provider. On sign-up, a user profile is created with Player and Creator tracks active by default. The session token is stored in an `HttpOnly` cookie and validated server-side on every protected request.

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
1. User enters an email address and a display name (their handle).
2. A one-time verification link is sent to their email.
3. On click, a session is established and a user profile is created with Player and Creator tracks active.
4. User is redirected to the mission browse screen.

### Sign In
1. User enters their email address.
2. A one-time sign-in link is sent.
3. On click, the session is re-established.
4. User is redirected to where they left off (or the mission browse screen).

### Session Management
- Session token is a signed JWT in an `HttpOnly` cookie.
- `getSession()` is called in Server Components and Server Actions to validate and return the session.
- `middleware.ts` enforces auth on protected routes before the request reaches the page.
- Sessions expire after a configurable TTL; re-authentication sends a new magic link.

### Apply for Moderator Role
1. User navigates to their profile and selects "Apply to become a Moderator".
2. User submits a short application: why they want to moderate and any relevant background.
3. Application enters the supervising Moderator queue.
4. Supervising Moderator reviews and approves or rejects with a reason.
5. On approval, the Moderator track is activated on the user's profile and they gain access to the moderation tools.

### Apply for Business Owner Role
1. User navigates to their profile and selects "Apply as a Business Owner".
2. User completes a business profile: business name, type, physical address, contact email, and a brief description of the rewards they intend to offer.
3. Application enters the supervising Moderator queue alongside the business profile details.
4. Supervising Moderator reviews the application: verifies the business appears legitimate, checks for policy conflicts.
5. On approval, the Business Owner track is activated and the user gains access to the Business Portal.
6. On rejection, the reason is shown and the user can revise and resubmit.

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

- `UserProfile` — `id`, `email`, `handle`, `createdAt`
- `UserRole` — `userId`, `role` (`player | creator | moderator | business_owner`), `status` (`active | pending | rejected`), `activatedAt`
- `RoleApplication` — `id`, `userId`, `role`, `applicationData: Json`, `status`, `reviewedBy`, `reviewNotes`, `submittedAt`, `decidedAt`
- Session cookie JWT payload: `{ userId, email, roles: string[] }`
- No passwords stored; no OAuth tokens stored
