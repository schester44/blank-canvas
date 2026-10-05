# Agent Review Screen — Email Entry

> What happens when the agent enters an email on the review screen for an unverified client

```mermaid
flowchart TD
    START["🖊️ Agent types email on<br/>review screen"] --> VALIDATE{"Valid email<br/>format?"}
    
    VALIDATE -->|No| DISABLED["Send button disabled<br/><sup>[A]</sup>"]
    
    VALIDATE -->|Yes| CHECK{"Is this email already<br/>VERIFIED at this<br/>agency?"}
    
    CHECK -->|No| CLEAN["No collision<br/>Send button enabled<br/><sup>[B]</sup>"]
    
    CHECK -->|Yes| COLLISION{"Under which<br/>client?"}
    
    COLLISION -->|Same client| ALREADY["Already verified<br/>Read-only email shown<br/>Send review link for sign/pay<br/><sup>[C]</sup>"]
    
    COLLISION -->|"Different client (e.g., Ron Doe)"| PROMPT["⚠️ Collision prompt:<br/>'This email is already set up<br/>as an account for Ron Doe.<br/>X quotes will merge.'<br/><sup>[D]</sup>"]
    
    PROMPT --> USE["Use Ron Doe's account<br/><sup>[E]</sup>"]
    PROMPT --> DIFFERENT["Set up a different account<br/><sup>[F]</sup>"]
    PROMPT --> VIEW["View Ron Doe's profile<br/><sup>[G]</sup>"]
    
    CLEAN --> SEND["📤 Agent clicks<br/>'Send review link'"]
    
    SEND --> SENT["Link sent<br/>Status: Unverified<br/>Actions: Resend · Change email<br/><sup>[H]</sup>"]
    
    SENT --> PREPAY["Optional: Continue<br/>to prepayment<br/><sup>[I]</sup>"]
    
    USE --> SWAP["All quotes move to<br/>Ron Doe's verified account<br/>Unverified client retired<br/>AKA added<br/>Link sent to verified email"]
    
    DIFFERENT --> CLEAR["Email field cleared<br/>Agent enters new email<br/>↩ Returns to top"]
    
    VIEW --> TAB["Opens Ron Doe's<br/>profile in new tab<br/>Agent can edit if match is wrong"]

    style START fill:#0e2325,color:#eaff90,stroke:#0e2325
    style PROMPT fill:#fef3c7,color:#92400e,stroke:#fcd34d
    style SWAP fill:#f0fdf4,color:#166534,stroke:#bbf7d0
    style SENT fill:#f0fdf4,color:#166534,stroke:#bbf7d0
```

## Annotations

| Ref | Detail |
|-----|--------|
| **[A]** | Basic client-side validation. Also silently trims whitespace, lowercases, and strips `mailto:` prefixes from pasted text. |
| **[B]** | **No cross-partner check.** The system does NOT check whether this email is verified at a different agency. Agent can't see cross-agency data (Rule 10). If the email is verified elsewhere, the cross-partner roll-up happens silently at click-time (Path D in the click diagram). |
| **[C]** | Edge case: agent somehow arrived at the review screen with a client who's already verified. Email is pre-filled and read-only. No email entry needed. |
| **[D]** | **Same-agency collision (E2).** The prompt explicitly states the merge impact: the number of active quotes that will move. This is the agent's decision point — they can merge, try a different email, or inspect the other client's profile. |
| **[E]** | **Agent-initiated merge.** ALL quotes from the current unverified client move to the verified client — not just the one the agent is working on. The agent confirmed the merge, which is the authorization. The unverified client record is retired and the name becomes an AKA on the verified account. |
| **[F]** | Email field clears. Agent enters a different email. The flow restarts from the top — the new email goes through the same collision check. |
| **[G]** | Opens in a new tab so the agent doesn't lose their place in the quote flow. Useful when the agent believes the match is wrong — they can edit Ron Doe's profile (e.g., change Ron's email to free up this one) and then return. |
| **[H]** | **Post-send state.** Only two verification statuses are visible: Unverified and Verified. No "sent," "delivered," "bounced," etc. Resend is silently rate-limited. Change email silently invalidates the previous token. One live token per quote at any time. |
| **[I]** | **Prepayment is a separate, optional step.** Has no bearing on verification. If the agent prepays, the client won't see a payment step. If the client never verifies, prepayment refund follows billing rules (separate from this spec). |
