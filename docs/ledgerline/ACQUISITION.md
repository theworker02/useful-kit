# Ledgerline — Acquisition Document

## Executive summary

Ledgerline reconciles invoices to payments using interpretable scoring (amount, reference, counterparty, timing) and produces AP exception queues with exportable packets.

## Market problem

Month-end close still depends on fragile spreadsheets. Partial pays and memo noise hide leakage.

## Product capability

- CSV invoice and payment ingest
- Deterministic match scoring with reason codes
- Statuses: matched / partial / exception / unmatched
- Recovery rate metric + Markdown/JSON export

## Ideal customer profile

Finance ops teams processing hundreds to tens of thousands of invoices monthly without mature ERP auto-match rules.

## Architecture notes

Pure function scoring — audit-friendly, no black-box ML in v1. Ready for bank CSV adapters and ERP webhooks.

## Competitive positioning

Portable exception engine vs locked-in ERP matchers; diligence-ready demos for finance tooling portfolios.

## Diligence evidence

Run `/ledgerline` → load samples → export AP packet.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Ambiguous vendor names | Partial credit + exception bucket |
| Multi-currency complexity | Currency hard-fail today; FX module later |
| Fraud detection out of scope | Explicitly scoped to reconciliation, not AML |

## Suggested deal framing

AP automation bolt-on or showcase asset for a finops/vertical SaaS acquirer.
