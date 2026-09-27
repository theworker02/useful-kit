# North Harbor Studio

**Operator-grade portfolio products for software diligence and delivery.**

North Harbor ships five serious tools — not empty repos — each with a working workspace, sample fixtures, exportable evidence packets, and acquisition documentation.

| Product | Route | What it does |
| --- | --- | --- |
| **Wharf** | [`/wharf`](./src/app/wharf) | License compatibility compiler for dependency inventories |
| **Ledgerline** | [`/ledgerline`](./src/app/ledgerline) | Invoice ↔ payment reconciliation with exception queues |
| **HarborGate** | [`/harborgate`](./src/app/harborgate) | OpenAPI breaking-change detection & release gates |
| **Quillmark** | [`/quillmark`](./src/app/quillmark) | ADR/RFC authoring with diligence packet export |
| **Cipherlane** | [`/cipherlane`](./src/app/cipherlane) | Config policy & secret-pattern hygiene (defensive) |

Diligence library: [`/docs`](./src/app/docs) · Markdown briefs: [`docs/`](./docs)

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321).

```bash
npm run build   # production build
npm run start   # serve production build on :4321
npm run lint
```

No API keys or databases required. All demos run locally with synthetic fixtures.

---

## Why a studio (not 2,000 empty repositories)

Portfolio value comes from **credible products buyers can evaluate**, not repository count. Inflating GitHub with vacant repos damages trust. This studio concentrates effort into five products that:

1. Solve expensive, recurring operator problems  
2. Produce artifacts suitable for diligence data rooms  
3. Include architecture, ICP, and competitive notes  
4. Demonstrate taste in product UX and documentation  

---

## Product snapshots

### Wharf
Paste an SBOM-lite inventory, choose an outbound license posture, and export a board-ready license risk report.

### Ledgerline
Match AP invoices to remittances with interpretable confidence scores and reason codes.

### HarborGate
Diff baseline vs candidate OpenAPI documents; fail the gate on breaking changes.

### Quillmark
Author ADRs with status lifecycle and export a combined architecture diligence packet.

### Cipherlane
Scan configs for credential-shaped literals and insecure defaults; export remediation guidance. **Demo is client-side — never paste production secrets.**

---

## Documentation map

| Document | Path |
| --- | --- |
| Studio overview | [`docs/STUDIO.md`](./docs/STUDIO.md) |
| Wharf acquisition brief | [`docs/wharf/ACQUISITION.md`](./docs/wharf/ACQUISITION.md) |
| Ledgerline acquisition brief | [`docs/ledgerline/ACQUISITION.md`](./docs/ledgerline/ACQUISITION.md) |
| HarborGate acquisition brief | [`docs/harborgate/ACQUISITION.md`](./docs/harborgate/ACQUISITION.md) |
| Quillmark acquisition brief | [`docs/quillmark/ACQUISITION.md`](./docs/quillmark/ACQUISITION.md) |
| Cipherlane acquisition brief | [`docs/cipherlane/ACQUISITION.md`](./docs/cipherlane/ACQUISITION.md) |
| Architecture | [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) |
| Security | [`SECURITY.md`](./SECURITY.md) |
| Contributing | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |

---

## Stack

- Next.js (App Router) + TypeScript  
- Tailwind CSS v4 + shadcn/ui  
- Local-first analysis engines (no backend required for demos)

---

## License

MIT — see [`LICENSE`](./LICENSE).
