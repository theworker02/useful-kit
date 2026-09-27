# HarborGate — Acquisition Document

## Executive summary

HarborGate diffs OpenAPI specifications to detect breaking changes before release, emitting pass/fail gates and executive-readable scores.

## Market problem

API changes remove operations or introduce required parameters without consumer warning — causing partner outages and support escalations.

## Product capability

- OpenAPI 3 JSON parse
- Detect removed operations, new required params, removed response codes, additive ops
- Compatibility score and gate status
- Markdown/JSON export

## Ideal customer profile

Platform teams with public or multi-team internal HTTP APIs and CI release trains.

## Architecture notes

Operation-keyed diff engine; extendable to schema-level JSON Schema compare and spectral rule packs.

## Competitive positioning

Complements oasdiff/Optic/Pact with diligence-grade reporting UX.

## Diligence evidence

Run `/harborgate` → sample baseline vs candidate → observe FAIL → export gate report.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| YAML-only specs | JSON primary; YAML path extraction is best-effort |
| Deep schema breaks missed | Roadmap: property-level schema diff |
| False FAIL on intentional breaks | Versioning guidance in report narrative |

## Suggested deal framing

API governance module for platform/engineering-intelligence acquirers.
