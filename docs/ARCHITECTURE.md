# Architecture

## System shape

```
Browser (Next.js App Router)
├── Studio landing (/)
├── Product workspaces (/wharf, /ledgerline, /harborgate, /quillmark, /cipherlane)
├── Diligence library (/docs, /docs/[product])
└── Pure TS engines under src/lib/products/*
```

Each product engine is a pure TypeScript module. UI components are client islands that call engines and offer Markdown/JSON downloads via `Blob` URLs.

## Design principles

1. **No demo credentials** — evaluation must work offline after `npm install`
2. **Interpretable outputs** — every score ships with reason codes
3. **Export-first** — diligence packets are first-class artifacts
4. **Narrow ICP** — each product solves one expensive workflow
5. **Extensible engines** — CI/SARIF/SPDX adapters can wrap the same cores

## Module map

| Path | Responsibility |
| --- | --- |
| `src/lib/products/catalog.ts` | Portfolio metadata |
| `src/lib/products/wharf/*` | License DB + inventory analysis |
| `src/lib/products/ledgerline/*` | Reconciliation scoring |
| `src/lib/products/harborgate/*` | OpenAPI diff / gate |
| `src/lib/products/quillmark/*` | ADR models + exporters |
| `src/lib/products/cipherlane/*` | Config policy rules |
| `src/lib/docs/content.ts` | In-app diligence copy |
| `docs/**` | Repo-level acquisition briefs |

## Future extension points

- Persist Quillmark ADRs to git
- CycloneDX import for Wharf
- Schema-level OpenAPI compare for HarborGate
- CI GitHub Action wrappers emitting SARIF
- Optional server routes for org-wide report history (explicitly out of scope for v1)
