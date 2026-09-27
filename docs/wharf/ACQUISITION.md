# Wharf — Acquisition Document

## Executive summary

Wharf converts dependency inventories into license risk reports scored against an outbound product license. It targets release gates and M&A tech diligence where copyleft/source-available exposure must be quantified quickly.

## Market problem

License review lags dependency growth. Issues surface during customer questionnaires or acquisition — when remediation cost peaks.

## Product capability

- Parse npm-style, CSV, SBOM-lite, and JSON inventories
- Classify SPDX licenses into families (permissive → network copyleft)
- Compatibility matrix vs outbound posture (MIT, Apache-2.0, GPL, AGPL, Proprietary)
- Risk score, executive summary, Markdown/JSON export

## Ideal customer profile

- Mid-market SaaS with 200–5,000 dependencies
- Active fundraising or acquisition conversations
- Emerging Open Source Program Office

## Architecture notes

Client-side analysis; curated SPDX table; heuristic compatibility engine designed for CycloneDX/SPDX import and CI SARIF export as natural extensions.

## Competitive positioning

Lighter than full SCA suites (FOSSA, Black Duck); faster executive narrative than raw scancode dumps.

## Diligence evidence

Run `/wharf` → load sample → export `wharf-diligence-*.md` and JSON. Attach this document.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Heuristic false positives | Human review queue; SPDX expression expansion roadmap |
| Incomplete license DB | Explicit UNKNOWN severity; extensible table |
| Not a substitute for counsel | Documented as decision-support, not legal advice |

## Suggested deal framing

Standalone license intelligence module or bolt-on for an ASPM/SCA platform seeking diligence UX.
