# Quillmark — Acquisition Document

## Executive summary

Quillmark standardizes Architecture Decision Records and exports diligence packets that survive reorgs and buyer tech reviews.

## Market problem

Critical decisions live in Slack and stale wikis. Diligence cannot reconstruct technical rationale.

## Product capability

- Structured ADR fields (context, decision, consequences, alternatives)
- Status lifecycle (proposed → accepted/rejected/superseded/deprecated)
- Per-record and portfolio Markdown export

## Ideal customer profile

Series B+ engineering orgs and companies preparing for acquisition tech diligence.

## Architecture notes

Local-first editor; natural extensions include git-backed ADR folders and Notion sync.

## Competitive positioning

Stronger packaging than adr-tools; more focused than generic doc platforms.

## Diligence evidence

Run `/quillmark` → review samples → export diligence packet.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Adoption/process risk | Templates + sample library reduce blank-page friction |
| Storage durability | Export-first design; persistence roadmap documented |

## Suggested deal framing

Engineering governance add-on for developer portal or knowledge-platform acquirers.
