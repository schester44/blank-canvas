# Contact Verification — Working Spec

## Core Data Model

- **Parent User Login**: The verified identity — one per unique verified email. Owns one or more Verified Clients across agencies.
- **Verified Client (Partner Client)**: A client record linked to a Parent User Login. Created when an unverified client completes email verification. Scoped to one agency.
- **Unverified Client (Partner Client)**: A client record created during quoting before email verification. Not linked to any Parent User Login. Visible only to the agency that created it.
- **Partner / Agency**: The agency through which the client interacts. Verification is per-partner for agent-initiated flows.
- **Magic Link**: The verification mechanism. Sent to the client's email; clicking it proves email ownership and promotes the unverified client to verified.
- **AKA**: Name variants accumulated on the Parent User Login from different verified partner clients. Shown internally.

---

## Base Rules

1. **Deferred email collection (agent flows)** — Email is not collected at client creation. Agents select/create a client by name only. Email is entered on the review screen before bind.
2. **Default unverified** — All clients start as unverified. Verification happens only after completing magic-link email verification.
3. **Per-partner verification (agent flows)** — A client verified at Agency A must re-verify when quoting through Agency B, even with the same email.
4. **Verified = trusted within same partner** — Once verified at a partner, no re-verification needed for future quotes at that partner.
5. **Verified → Parent User** — A verified client is linked to a Parent User Login (email-based identity the client uses to log in).
6. **Multi-agency roll-up** — Multiple verified clients across different agencies live under one Parent User Login.
7. **Unverified = isolated** — Unverified clients are never linked to a Parent User Login and are invisible to other agencies.
8. **Graduation** — When an unverified client verifies, the unverified record is replaced by a verified client under the Parent User Login. Quotes transfer.
9. **Name ownership** — First person to claim an email sets the display name. Client can change it anytime. All name variants from verified partner clients appear as AKAs internally.
10. **Agency-scoped visibility** — Agents see verified and unverified clients within their own agency only. Cross-agency Parent User relationships are invisible to agents.
11. **D2C framing** — D2C clients verify once per partner as part of checkout. If already logged in, no re-verification needed for additional policies.

---

## Agent Flow: Review Screen

### Layout
- Policyholder card: client name + `Unverified` or `Verified` badge
- If unverified: email field with helper "This email will be used to set up [Name]'s online account."
- Send review link button
- After send: read-only email, resend (silently rate-limited), change email (silently invalidates old link)
- If verified: shows verified email, read-only, send review link still available for sign/pay
- After sending, agent can optionally continue to prepayment screen

### Verification States (agent-visible)
Only two: `Unverified` and `Verified`. No intermediate states.

### Prepayment
- Separate optional step after link send
- Payment against the quote, not the link
- No bearing on verification requirement
- If prepaid, client skips payment step on their end

### Bind Gate
Three conditions, all required: email verified (link clicked) + client signed + paid (by client or agent prepaid). Policy sits in "Pending client review" until all three are true.

### Same-Agency Email Collision (E2)
Inline prompt when agent enters an email already verified at their agency:
> "[email] is already set up as an account for [Name] at your agency."
> - Use [Name]'s account for this policy
> - Set up a different account for this policy
> - View [Name]'s profile (text link, opens in new tab)

### Multi-Quote Scenario
- One link per policy, but same unverified client across quotes
- Agent can send links to different emails per quote; email lives on the link, not the client
- First-verified-wins: first click creates login, graduates client, all quotes move
- Remaining links still work — client lands on review/sign with no re-verification (Option A)
- Client dashboard shows remaining pending policies after first bind

### Change Email After Send
- Silently invalidates old link
- Old link shows "This link is no longer active — contact your agent"
- If agent prepaid, payment stays attached to quote

### Change Email After Verification
- Blocked on review screen; email changes go through client profile edit flow (section B)

---

## Client Communications

### Single email template, agnostic to state
- From: Obie on behalf of [Agency Name]
- Subject: "Your insurance for [Address] is ready to review"
- Body: agency logo, agent name, property address, premium, one button: **Review & sign**
- If prepaid: premium line shows "Paid by [Agency]"
- No verification language, no account creation language
- Expiry: 7 days, stated in small print

### Reminders
Day 3 and Day 6, same template, subject prefixed "Reminder:". Agent manual resends are separate and rate-limited.

### Expired link
No email sent. Client clicks dead link → page offers "Request a new link" → notifies agent.

### Post-bind confirmation
Standard policy-issued email. For first-time logins: "View documents and manage your account at [portal link] — sign in with this email."

---

## Client Click-Through Experience

### Every path is identical from the client's perspective
Click → review page → sign → pay (if needed) → done.

Behind the scenes:
- If no login exists: login created, client graduated, verification satisfied
- If login exists at another partner: same flow, re-verification satisfied silently
- If already verified at this partner: straight to review/sign, no verification needed

### Cross-cutting
- Link is the auth — no password, no "confirm it's you"
- Token reusable until bind; second click just reopens the page
- Name typed at signature must match policyholder name
- Payment failure: stays in review state, client can retry, verification persists
- Done page: "You're covered." Policy number, docs. Passwordless by default.

---

## Email Change Flow (Section B)

### Core principle
Email change = account-level change to Parent User Login. Affects ALL active policies under ALL partner clients across ALL agencies. Email NPBEs (endorsements) run on every active policy.

### B1: New email not in use anywhere
1. Agent/CSR/client enters new email on profile
2. Confirmation email sent to NEW address: "Confirm your updated email address. This will be the email used to sign into your account. Your X active policies will be updated to reflect this new contact email."
3. Notification sent to OLD address: "Your sign-in email is being changed to [new]. If this wasn't you, contact [agent]." Contains revert link (7 days).
4. Until confirmed: old email = Verified, new email = Pending. Login works on old.
5. On confirm: new email becomes verified, old retired, endorsements run on all policies.

### B2: New email already verified at another partner
Same client-facing flow as B1. On confirm: this agency's verified client moves under the existing login; old login retired if empty. Endorsements run on all policies from both accounts.

### B3: New email already verified at same agency (merge)
Prompt:
> "[email] is already set up as an account for [Name] at your agency."
> - Merge [current client]'s policies into [Name]'s account
> - Keep them separate
> - View [Name]'s profile

If merged: full consolidation. All partner clients, all policies, all AKAs consolidated under surviving user. Email NPBEs on everything. The retired user disappears.

Merge confirmation includes: "Policy documents will still show [original name] as the named insured. To change that, contact service."

### B4: Client-initiated email change
Same as B1-B3 but requires dual email confirmation (old + new) since no agent is vouching.

---

## Halo Internal View: Clients Tab

### Top level: Parent User Logins
One row per verified email. Shows: email, display name, AKA names, count of verified partner clients, count of policies, created date, last sign-in.

### Nested: Verified Partner Clients
One row per agency. Shows: agency name, client name at that agency (AKA chip if differs from display name), policy count, verified date.

### Separate section/filter: Unverified Clients
Not nested. Shows: client name, agency, quote count, created date, "has pending link" indicator (only internal users see this).

### Internal actions
- Search across all levels by name or email (pending link emails are searchable)
- Manually verify (for legacy cleanup)
- Manually merge parent accounts (audit-logged, requires reason)
- Edit client details (CSRs can see everything including cross-agency relationships)

---

## D2C Flow

### Entry
Client enters email upfront (required in D2C). 
- If recognized → client logs in → proceeds as verified (no re-verification needed for additional policies while logged in)
- If not recognized → proceeds as unverified despite supplying email

### End of flow
Instead of going directly to checkout/signature/payment, unverified client sees a variation of the review screen:
- Explains the email entered will be used for their online account
- "Check your email to complete the checkout process"
- Sends magic link email (variation of the agent-flow email)

### Per-partner verification in D2C
- If client is already logged in (has an active session from a previous verification), they should NOT be asked to re-verify — even if the current flow is through a different non-agency partner
- Per-partner verification only applies when the client is not logged in and comes through a new partner's flow

---

## Migration Analysis (saved progress)

### Current state
- 696K users, 659K clients, 626K partner_clients
- Every client has a user (email required at creation today)
- Email is unique per user

### Problem: mislinked accounts
Different agents at different agencies created partner_clients under the same email for completely different people.

### Source of mislinks (% of affected partner_clients)
- **Independent Agent/Broker: 77.7%** (15,684 PCs across 7,029 parent accounts) — agents entering placeholder/convenience emails during client creation
- **D2C (Obie direct): 13.5%** (2,723 PCs) — clients entering fake emails or reusing someone else's email
- **Property Manager: 4.5%** (903 PCs) — Baselane is the biggest contributor (795)
- **Lender: 3.2%** (656 PCs) — Kiavi leads (351)
- **Other (SAAS/Aggregators): ~1%**

### Key finding
Every name mismatch is cross-agency. Zero same-agency collisions exist in the data. The mechanism is always: different agents at different agencies independently creating partner_clients under the same email.

### Detection signals
1. Last name divergence across partner_clients (strongest signal)
2. Email quality (placeholder, suspiciously generic, normal)
3. Agency count (more agencies = more suspicious)
4. Policy-level email vs parent email (corrective signal — policy_terms.clientEmail often has the real email)
5. Agent email cross-reference (none of the top mislinks are agent emails)

### Cohorts
- **Tier 1 (5+ last names)**: 198 clients, 2,994 PCs — definite mislinks, auto-decouple
- **Tier 2 (3-4 last names)**: 451 clients, 1,582 PCs — very likely mislinks, auto-decouple with validation
- **Tier 3 (2 last names)**: 6,948 clients, 15,609 PCs — ambiguous, needs triage
  - ~6,071 whitespace-only → auto-verify
  - ~877 same last name → likely same person, auto-verify
  - ~4,000-5,000 genuinely different → sub-filter by policy email match
- **Tier 4 (1 last name)**: 555,316 clients, 605,534 PCs — clean, auto-verify

### Migration script approach
1. Decouple Tiers 1+2: use policy_terms.clientEmail to reassign partner_clients to correct users
2. For Tier 3: auto-verify whitespace/variant matches; flag genuine mismatches for CSR review
3. Auto-verify Tier 4
4. End state: verified, auto-verified, or unverified — no special quarantine state
