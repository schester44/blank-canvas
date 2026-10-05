# Magic Link Click Resolution

> What happens when the client clicks a magic link

```mermaid
flowchart TD
    CLICK["🔗 Client clicks magic link"] --> RESOLVE["Token resolves to:<br/>• Quote<br/>• Unverified client<br/>• Partner<br/>• Pending email"]
    
    RESOLVE --> Q_VALID{"Is the quote<br/>still active?"}
    
    Q_VALID -->|No| DEAD["❌ 'This quote is no longer<br/>available'<br/><sup>[A]</sup>"]
    
    Q_VALID -->|Yes| Q_LINK{"Is this token<br/>still the live<br/>token for<br/>this quote?"}
    
    Q_LINK -->|No| INVALID["❌ 'This link is no longer<br/>active. Contact your agent.'<br/><sup>[B]</sup>"]
    
    Q_LINK -->|Yes| LOGIN_EXISTS{"Does a Parent<br/>User Login exist<br/>for this email?"}
    
    LOGIN_EXISTS -->|"No — first time anywhere"| CREATE["✅ Create Parent User Login<br/>Graduate unverified client<br/>Auto-move all quotes<br/>Retire unverified record<br/><sup>[C]</sup>"]
    
    LOGIN_EXISTS -->|Yes| SAME_PARTNER{"Is the login<br/>verified at THIS<br/>partner?"}
    
    SAME_PARTNER -->|"No — verified elsewhere only"| GRADUATE["✅ Graduate unverified client<br/>at this partner<br/>Roll up under existing login<br/>Auto-move all quotes<br/><sup>[D]</sup>"]
    
    SAME_PARTNER -->|Yes| SAME_CLIENT{"Is it under the<br/>SAME client<br/>record?"}
    
    SAME_CLIENT -->|Yes| OPEN["✅ Already verified<br/>Open review/sign page<br/><sup>[E]</sup>"]
    
    SAME_CLIENT -->|"No — different client"| MERGE["✅ Auto-merge at click-time<br/>Quotes move to verified client<br/>Name becomes AKA<br/>Unverified record retired<br/><sup>[F]</sup>"]
    
    CREATE --> REVIEW["📄 Client lands on<br/>Review → Sign → Pay → Done"]
    GRADUATE --> REVIEW
    OPEN --> REVIEW
    MERGE --> REVIEW

    style CLICK fill:#0e2325,color:#eaff90,stroke:#0e2325
    style REVIEW fill:#0e2325,color:#eaff90,stroke:#0e2325
    style DEAD fill:#fee,color:#900,stroke:#fcc
    style INVALID fill:#fee,color:#900,stroke:#fcc
    style CREATE fill:#f0fdf4,color:#166534,stroke:#bbf7d0
    style GRADUATE fill:#f0fdf4,color:#166534,stroke:#bbf7d0
    style OPEN fill:#f0fdf4,color:#166534,stroke:#bbf7d0
    style MERGE fill:#f0fdf4,color:#166534,stroke:#bbf7d0
```

## Annotations

| Ref | Detail |
|-----|--------|
| **[A]** | Quote expired, cancelled, or replaced. The link had no arbitrary expiry — validity is tied to the quote. Nothing to clean up since no state was created. |
| **[B]** | Agent changed the email after sending, which invalidated this token. A newer token exists for this quote. The client should contact their agent for a new link. |
| **[C]** | **First verification anywhere.** Login created on click, not on send. All quotes auto-move from the unverified client — including quotes without their own tokens. This is the simple auto-move approach; see "Known Risks: lazy agent" for the edge case where multiple people's quotes sit under one client. |
| **[D]** | **Cross-partner roll-up.** The email was verified at a different partner (e.g., verified at Agency A, now clicking from Agency B). A new verified partner client is created at this partner and linked to the existing Parent User Login. Per-partner re-verification is satisfied. No merge of client records. |
| **[E]** | **Returning verified client.** The client already verified at this partner with this email. The click just authenticates them (the link is the auth) and opens the review page. No verification step needed. Applies to: subsequent links for same client, or links sent after the client is already verified. |
| **[F]** | **Click-time auto-merge.** The email is verified at this partner, but under a *different* client record. This happens when the agent created multiple unverified clients (e.g., "John Doe" and "J. Doe") and sent links for both to the same email. The first verification created the login under "John Doe"; now J. Doe's quotes merge into John Doe's verified record. The name "J. Doe" becomes an AKA. No client-facing prompt — the merge is invisible to the client. |
