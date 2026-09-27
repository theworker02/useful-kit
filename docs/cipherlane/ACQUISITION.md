# Cipherlane — Acquisition Document

## Executive summary

Cipherlane provides defensive configuration policy scanning and secret-pattern hygiene with remediation-oriented exports. Demo mode is client-side and synthetic-data only.

## Market problem

High-severity misconfigurations and credential-shaped literals still reach shared branches. Teams need a fast, explainable gate.

## Product capability

- Pattern rules for key-shaped assignments, private key blocks, TLS verify disabled, wildcard CORS, default credentials, debug flags
- Placeholder suppression for `${ENV}` style templates
- Policy score, pass/fail gate, remediation packet export

## Ideal customer profile

AppSec and DevOps teams introducing merge gates without a full ASPM rollout.

## Architecture notes

Deterministic regex rule engine; designed to evolve toward SARIF output and CI action packaging.

## Competitive positioning

Narrower than gitleaks/trufflehog/checkov suites; optimized for teaching + diligence presentation.

## Responsible use

Defensive hygiene only. Do not paste production secrets into the demo workspace. Rotate any real credentials discovered in real pipelines through proper secret management.

## Diligence evidence

Run `/cipherlane` → load sample → export remediation packet.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| False positives | Entropy/placeholder guards; severity tiers |
| Bypass via encoding | Documented limitation; binary/encoded scan roadmap |
| Misuse concerns | Explicit defensive scope in product + docs |

## Suggested deal framing

Policy-gate module for ASPM, secrets, or DevSecOps platforms.
