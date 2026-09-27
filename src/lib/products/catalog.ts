export type ProductId =
  | "wharf"
  | "ledgerline"
  | "harborgate"
  | "quillmark"
  | "cipherlane";

export type ProductStatus = "ga" | "beta";

export interface Product {
  id: ProductId;
  name: string;
  tagline: string;
  summary: string;
  href: string;
  category: string;
  status: ProductStatus;
  buyer: string;
  valueProp: string;
  diligencePath: string;
}

export const STUDIO = {
  name: "North Harbor",
  legalName: "North Harbor Studio",
  tagline: "Operator-grade tools for software diligence and delivery.",
  description:
    "A portfolio of focused products for license risk, financial reconciliation, API contracts, architecture decisions, and configuration policy — each shipped with acquisition-ready documentation.",
} as const;

export const products: Product[] = [
  {
    id: "wharf",
    name: "Wharf",
    tagline: "License compatibility for modern dependency graphs.",
    summary:
      "Parse package inventories, classify SPDX licenses, and produce board-ready copyleft exposure reports.",
    href: "/wharf",
    category: "Open Source Compliance",
    status: "ga",
    buyer: "Security, Legal, and Engineering leaders",
    valueProp:
      "Turns dependency lists into actionable license risk before M&A or release gates.",
    diligencePath: "/docs/wharf",
  },
  {
    id: "ledgerline",
    name: "Ledgerline",
    tagline: "Invoice-to-payment reconciliation without the spreadsheet fog.",
    summary:
      "Match invoices to remittances with fuzzy amount, date, and reference scoring — export exceptions for AP review.",
    href: "/ledgerline",
    category: "Finance Operations",
    status: "ga",
    buyer: "Controllers and AP operations",
    valueProp:
      "Cuts manual matching cycles and surfaces exception queues with audit trails.",
    diligencePath: "/docs/ledgerline",
  },
  {
    id: "harborgate",
    name: "HarborGate",
    tagline: "API contract compatibility before the break reaches production.",
    summary:
      "Diff OpenAPI descriptions, classify breaking vs. additive changes, and emit release-gate findings.",
    href: "/harborgate",
    category: "Platform Engineering",
    status: "ga",
    buyer: "Platform and API owners",
    valueProp:
      "Prevents silent consumer breakage with deterministic contract scoring.",
    diligencePath: "/docs/harborgate",
  },
  {
    id: "quillmark",
    name: "Quillmark",
    tagline: "RFCs and ADRs that survive the next reorg.",
    summary:
      "Author structured architecture decisions, track status transitions, and export diligence-ready packets.",
    href: "/quillmark",
    category: "Engineering Governance",
    status: "ga",
    buyer: "Staff+ engineers and CTOs",
    valueProp:
      "Standardizes decision records so diligence and onboarding stay current.",
    diligencePath: "/docs/quillmark",
  },
  {
    id: "cipherlane",
    name: "Cipherlane",
    tagline: "Configuration policy and secret-pattern hygiene.",
    summary:
      "Scan configs for high-risk patterns, enforce baseline policies, and produce remediation checklists.",
    href: "/cipherlane",
    category: "Security Engineering",
    status: "beta",
    buyer: "AppSec and DevOps",
    valueProp:
      "Catches credential-shaped leaks and insecure defaults before merge.",
    diligencePath: "/docs/cipherlane",
  },
];

export function getProduct(id: ProductId): Product {
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error(`Unknown product: ${id}`);
  return product;
}
