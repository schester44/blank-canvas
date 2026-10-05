# Contact Verification Spec — Reference Materials

## Files

| File | Contents |
|------|----------|
| `contact_verification_spec.xlsx` | Excel workbook with 9 sheets covering all scenarios, decisions, and edge states as structured decision tables |
| `01-magic-link-click.md` | Mermaid flowchart: what happens when the client clicks a magic link (5 paths) |
| `02-agent-email-entry.md` | Mermaid flowchart: agent review screen email entry + collision prompt |
| `03-email-change.md` | Mermaid flowchart: email change flow (B1–B4) with revert logic |
| `04-d2c-flow.md` | Mermaid flowchart: D2C entry through checkout, logged-in vs. unverified |

## Excel Sheets

1. **Magic Link Click** — Decision table for all click-time resolution paths
2. **Agent Email Entry** — Review screen email entry through post-send state
3. **Email Change (B)** — All B-flow scenarios (B1–B4, revert, pending replacement)
4. **D2C Flow** — Entry through bind, authenticated vs. unverified paths
5. **Quote Movement** — When/how quotes transfer between client records
6. **Halo Internal** — Field ownership, edit model, who can change what
7. **Decisions Log** — All 15 major decisions with chosen option, pros, risks
8. **Error/Edge States** — Every error, empty, and edge state by screen
9. **Future Milestones** — Deferred features with triggers to build

## Mermaid Diagrams

Each `.md` file contains a Mermaid flowchart (renders in GitHub, Confluence, Notion) plus an annotations table with qualitative detail for each decision point. The flowchart is the "easily digestible" view; the annotations are the "optional extra detail."
