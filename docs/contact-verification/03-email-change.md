# Email Change Flow (Section B)

> What happens when anyone (agent, CSR, or client) changes the email on a verified account

```mermaid
flowchart TD
    START["✏️ Email change initiated<br/>on Parent User Login"] --> WHO{"Initiated by?"}
    
    WHO -->|Agent / CSR| EDIT_INTERNAL["Enter new email<br/>on client profile<br/><sup>[A]</sup>"]
    WHO -->|Client| EDIT_CLIENT["Enter new email<br/>on portal dashboard<br/><sup>[B]</sup>"]
    
    EDIT_INTERNAL --> CHECK{"Is the new email<br/>already in use?"}
    EDIT_CLIENT --> CHECK
    
    CHECK -->|"Not in use anywhere"| B1["B1: Clean change<br/><sup>[C]</sup>"]
    CHECK -->|"Verified at a different partner"| B2["B2: Cross-partner merge<br/><sup>[D]</sup>"]
    CHECK -->|"Verified at same agency,<br/>different client"| B3["B3: Same-agency merge<br/><sup>[E]</sup>"]
    
    B1 --> CONFIRM_NEW["📧 Confirm email sent<br/>to NEW address<br/>'Confirm your updated email.<br/>Your X policies will be updated.'"]
    
    B2 --> WARN["⚠️ Agent/CSR warned:<br/>'This email has X policies<br/>across Y partners.<br/>All will be affected.'"]
    WARN --> PROCEED{"Proceed?"}
    PROCEED -->|Yes| CONFIRM_NEW
    PROCEED -->|No| CANCEL["Cancel — no changes"]
    
    B3 --> MERGE_PROMPT["⚠️ Merge prompt:<br/>'Merge into [Name]'s account?'<br/><sup>[E]</sup>"]
    MERGE_PROMPT -->|Merge| CONFIRM_NEW
    MERGE_PROMPT -->|"Keep separate"| CANCEL
    MERGE_PROMPT -->|"View profile"| VIEW_PROFILE["Opens profile in new tab"]
    
    CONFIRM_NEW --> NOTIFY_OLD["📧 Notification to OLD address<br/>'Your email is being changed.<br/>Revert link (7 days).'<br/><sup>[F]</sup>"]
    
    NOTIFY_OLD --> PENDING["Status: old email active,<br/>new email pending<br/>Login works on old email"]
    
    PENDING --> CLIENT_CONFIRMS{"Client clicks<br/>confirm link?"}
    
    CLIENT_CONFIRMS -->|Yes| COMPLETE["✅ New email active<br/>Old email retired + immediately reusable<br/>NPBEs run on ALL policies<br/>across ALL partners<br/><sup>[G]</sup>"]
    
    CLIENT_CONFIRMS -->|"Never clicks"| STALE["Pending change<br/>remains indefinitely<br/><sup>[H]</sup>"]
    
    CLIENT_CONFIRMS -->|"Clicks revert<br/>on old email"| REVERT{"Is old email<br/>still unclaimed?"}
    
    REVERT -->|Yes| REVERTED["✅ Change reverted<br/>Old email stays active"]
    REVERT -->|"No — someone<br/>else claimed it"| REVERT_FAIL["❌ 'Contact support'<br/><sup>[I]</sup>"]

    style START fill:#0e2325,color:#eaff90,stroke:#0e2325
    style COMPLETE fill:#f0fdf4,color:#166534,stroke:#bbf7d0
    style REVERTED fill:#f0fdf4,color:#166534,stroke:#bbf7d0
    style MERGE_PROMPT fill:#fef3c7,color:#92400e,stroke:#fcd34d
    style WARN fill:#fef3c7,color:#92400e,stroke:#fcd34d
    style CANCEL fill:#f5f5f5,color:#666,stroke:#ddd
    style REVERT_FAIL fill:#fee,color:#900,stroke:#fcc
```

## Annotations

| Ref | Detail |
|-----|--------|
| **[A]** | **Agent/CSR edit.** Only the new email requires confirmation (the client clicks the confirm link). The old email gets a notification with a revert link as a safety net. CSRs can initiate this from the parent account section in Halo. Agents can initiate from their partner's client profile. |
| **[B]** | **Client-initiated edit (B4).** Same flow, but only the new email requires confirmation. The client is already authenticated via login, so verifying the old email again is redundant. The old-email notification with revert link provides the safety net. |
| **[C]** | **B1: Clean change.** Confirmation copy: "Confirm your updated email address. This will be the email used to sign into your account. Your X active policies will be updated to reflect this new contact email." No mention of partner names or named insured unless it's a merge. |
| **[D]** | **B2: Cross-partner merge.** The agent/CSR MUST be warned that this affects policies outside their agency: "This email is associated with an account that has X active policies across Y partners. Updating the email will affect all of them." On confirm, verified clients consolidate under the existing login. |
| **[E]** | **B3: Same-agency merge.** Merge prompt offers three options. If merged: full consolidation of all partner clients, policies, AKAs. Merge confirmation adds: "Policy documents will still show [original name] as the named insured. To change that, contact service." Name-change messaging only appears in merge scenarios. |
| **[F]** | **Old email notification.** Revert link valid 7 days. Does a live check at click time — if someone else has claimed the old email since it was retired, the revert fails gracefully with "contact support." No buffer period on retired emails; they're immediately reusable. |
| **[G]** | **NPBEs.** Contact email endorsements run on every active policy in the entire stack of partner clients under this Parent User Login, across all partners. Follows the same backend behavior as mailing address NPBEs. |
| **[H]** | **Stale pending change.** If the client never clicks the confirm link, the old email stays active indefinitely. If a new email change is initiated while one is pending, the pending change is replaced. |
| **[I]** | **Revert failure.** Extremely unlikely — requires someone else to claim the exact same email within 7 days of it being freed. Fails gracefully. Support can resolve manually. |
