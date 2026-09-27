import type { ProductId } from "@/lib/products/catalog";

export interface DocSection {
  heading: string;
  body: string[];
  table?: { headers: string[]; rows: string[][] };
}

export interface ProductDoc {
  id: ProductId;
  title: string;
  subtitle: string;
  sections: DocSection[];
}

export const studioDoc = {
  title: "North Harbor Studio — Diligence Library",
  subtitle:
    "Corporate overview, product index, and shared acquisition standards for the portfolio.",
  sections: [
    {
      heading: "Purpose",
      body: [
        "North Harbor Studio packages five focused operator products that address recurring diligence and delivery risks: open-source license exposure, accounts-payable reconciliation, API contract breakage, architecture decision continuity, and configuration policy hygiene.",
        "This repository is intentionally a multi-product studio rather than a pile of empty repositories. Each product includes a working interactive workspace, sample fixtures, exportable reports, and acquisition-oriented documentation.",
      ],
    },
    {
      heading: "Portfolio index",
      body: [
        "Wharf — license compatibility and SBOM-lite risk scoring.",
        "Ledgerline — invoice/payment matching with exception queues.",
        "HarborGate — OpenAPI breaking-change detection and release gates.",
        "Quillmark — ADR/RFC authoring with diligence packet export.",
        "Cipherlane — defensive config policy and secret-pattern scanning (client-side demos only).",
      ],
    },
    {
      heading: "Shared diligence standard",
      body: [
        "Every product maintains: product overview, architecture notes, threat/abuse considerations, competitive positioning, go-to-market notes, and an exportable evidence artifact from the live workspace.",
        "No credentials are required to evaluate the demos. Sample data is synthetic. Cipherlane explicitly warns against pasting production secrets.",
      ],
    },
    {
      heading: "Commercial posture",
      body: [
        "These products are designed as portfolio assets: narrow ICP, clear ROI narrative, and artifacts a buyer can attach to an investment or acquisition memo.",
        "Recommended packaging for external review: run each workspace, export Markdown/JSON packets, and attach the corresponding docs/* acquisition brief.",
      ],
    },
  ] satisfies DocSection[],
};

export const productDocs: Record<ProductId, ProductDoc> = {
  wharf: {
    id: "wharf",
    title: "Wharf — Acquisition Brief",
    subtitle: "Open-source license intelligence for release and M&A gates.",
    sections: [
      {
        heading: "Problem",
        body: [
          "Engineering organizations accumulate transitive dependencies faster than legal can review them. Copyleft and source-available licenses surface late — during customer security reviews, fundraising, or acquisition diligence — when remediation is expensive.",
        ],
      },
      {
        heading: "Solution",
        body: [
          "Wharf ingests dependency inventories (npm-style lines, CSV, SBOM-lite, or JSON), classifies SPDX licenses into families, and scores compatibility against an outbound product license posture.",
          "Operators export Markdown diligence reports and JSON suitable for ticketing or data rooms.",
        ],
      },
      {
        heading: "ICP & buyer",
        body: [
          "Primary: Head of Security / Open Source Program Office / General Counsel supporting software M&A.",
          "Secondary: Release engineering teams enforcing license gates in CI.",
        ],
      },
      {
        heading: "Architecture",
        body: [
          "Client-side analysis engine with a curated SPDX metadata table and heuristic compatibility matrix. No network calls are required for core scoring.",
          "Designed to extend toward CycloneDX/SPDX JSON import and CI SARIF export without changing the product narrative.",
        ],
      },
      {
        heading: "Competitive landscape",
        body: [
          "Adjacent to FOSSA, Snyk License, Black Duck, and scancode-based pipelines. Wharf differentiates as a lightweight, diligence-first compiler with immediate executive summaries rather than a full SCA platform.",
        ],
      },
      {
        heading: "Evidence package",
        body: [
          "From the live app: load sample inventory → review risk score → Export diligence report (.md) and JSON.",
          "Attach this brief plus exported artifacts for buyer review.",
        ],
      },
      {
        heading: "Key metrics (demo sample)",
        body: ["Illustrative outcomes on the bundled fixture:"],
        table: {
          headers: ["Metric", "Signal"],
          rows: [
            ["Risk score", "Elevated when AGPL/SSPL/unknown present"],
            ["Blockers", "Incompatible + unknown licenses"],
            ["Review queue", "Weak copyleft / proprietary"],
          ],
        },
      },
    ],
  },
  ledgerline: {
    id: "ledgerline",
    title: "Ledgerline — Acquisition Brief",
    subtitle: "AP reconciliation that turns remittance chaos into an exception queue.",
    sections: [
      {
        heading: "Problem",
        body: [
          "Controllers still reconcile invoices to bank remittances in spreadsheets. Partial payments, memo noise, and vendor name drift create silent leakage and month-end overtime.",
        ],
      },
      {
        heading: "Solution",
        body: [
          "Ledgerline scores invoice/payment pairs on amount proximity, reference overlap, counterparty alignment, and payment timing. Results classify into matched, partial, exception, and unmatched — with exportable AP packets.",
        ],
      },
      {
        heading: "ICP & buyer",
        body: [
          "Controllers, AP managers, and finance ops leads at mid-market companies with high invoice volume but immature ERP matching rules.",
        ],
      },
      {
        heading: "Architecture",
        body: [
          "Deterministic scoring engine over CSV inputs. No ML model required for v1 — interpretable reasons ship with every match for auditability.",
        ],
      },
      {
        heading: "Competitive landscape",
        body: [
          "Overlaps with ERP native matchers (NetSuite, QuickBooks Advanced) and Point of Sale cash apps. Ledgerline is positioned as a portable exception engine and diligence demonstrator for finance tooling portfolios.",
        ],
      },
      {
        heading: "Evidence package",
        body: [
          "Load sample invoices/payments → inspect recovery rate → Export AP packet.",
        ],
      },
    ],
  },
  harborgate: {
    id: "harborgate",
    title: "HarborGate — Acquisition Brief",
    subtitle: "API contract compatibility before consumers break.",
    sections: [
      {
        heading: "Problem",
        body: [
          "Platform teams ship OpenAPI changes that remove operations, require new parameters, or drop response codes — silently breaking partners and internal clients.",
        ],
      },
      {
        heading: "Solution",
        body: [
          "HarborGate diffs baseline vs candidate OpenAPI documents, classifies breaking vs additive changes, and emits a pass/fail release gate with a numeric score.",
        ],
      },
      {
        heading: "ICP & buyer",
        body: [
          "Platform engineering managers, API product owners, and SRE teams running contract tests in CI.",
        ],
      },
      {
        heading: "Architecture",
        body: [
          "JSON OpenAPI 3 parser with operation-level comparison (method+path keys), required parameter introduction detection, response code removal detection, and additive operation discovery.",
        ],
      },
      {
        heading: "Competitive landscape",
        body: [
          "Adjacent to oasdiff, Optic, Swagger Hub governance, and Pact. HarborGate emphasizes executive-readable gate reports for release and acquisition reviews.",
        ],
      },
      {
        heading: "Evidence package",
        body: [
          "Load sample baseline/candidate → observe FAIL on required cursor + deleted DELETE → Export gate report.",
        ],
      },
    ],
  },
  quillmark: {
    id: "quillmark",
    title: "Quillmark — Acquisition Brief",
    subtitle: "Decision records that survive reorgs and diligence.",
    sections: [
      {
        heading: "Problem",
        body: [
          "Architecture decisions live in chat threads and stale Confluence pages. During diligence, buyers cannot reconstruct why critical technical bets were made.",
        ],
      },
      {
        heading: "Solution",
        body: [
          "Quillmark structures ADRs (context, decision, consequences, alternatives), tracks status transitions, and exports a combined diligence packet.",
        ],
      },
      {
        heading: "ICP & buyer",
        body: [
          "Staff+ engineers, CTOs, and technical program managers preparing Series B+ diligence or acquisition tech reviews.",
        ],
      },
      {
        heading: "Architecture",
        body: [
          "Local-first editor state with Markdown exporters. Ready to back with git-backed storage or Notion sync in a later phase.",
        ],
      },
      {
        heading: "Competitive landscape",
        body: [
          "Overlaps with Log4brains, adr-tools, and Notion templates. Quillmark’s wedge is diligence packaging and portfolio presentation quality.",
        ],
      },
      {
        heading: "Evidence package",
        body: [
          "Review sample ADRs → edit status → Export diligence packet.",
        ],
      },
    ],
  },
  cipherlane: {
    id: "cipherlane",
    title: "Cipherlane — Acquisition Brief",
    subtitle: "Defensive configuration policy and secret-pattern hygiene.",
    sections: [
      {
        heading: "Problem",
        body: [
          "Credentials and insecure defaults still land in config files and PRs. Teams need a fast, explainable gate before merge — without standing up a full ASPM platform on day one.",
        ],
      },
      {
        heading: "Solution",
        body: [
          "Cipherlane scans configuration text for high-signal patterns (key-shaped assignments, private key blocks, TLS verification disabled, wildcard CORS, default credentials) and produces remediation-oriented findings.",
          "Demo scanning is entirely client-side. Do not paste production secrets into the workspace.",
        ],
      },
      {
        heading: "ICP & buyer",
        body: [
          "AppSec engineers and DevOps leads who need a lightweight policy gate and teaching tool for engineering orgs.",
        ],
      },
      {
        heading: "Architecture",
        body: [
          "Rule engine with severity scoring and placeholder suppression to reduce false positives on ${ENV} style templates.",
        ],
      },
      {
        heading: "Competitive landscape",
        body: [
          "Adjacent to gitleaks, trufflehog, and checkov. Cipherlane focuses on readable remediation packets and productized policy gates for portfolio demos.",
        ],
      },
      {
        heading: "Evidence package",
        body: [
          "Load sample config → review FAIL gate → Export remediation packet.",
        ],
      },
      {
        heading: "Responsible use",
        body: [
          "Cipherlane is a defensive hygiene aid. It is not an offensive credential harvesting tool. Findings should be remediated through secret rotation and secure configuration practices.",
        ],
      },
    ],
  },
};
