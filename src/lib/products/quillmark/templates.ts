export type DecisionStatus =
  | "proposed"
  | "accepted"
  | "rejected"
  | "superseded"
  | "deprecated";

export interface DecisionRecord {
  id: string;
  title: string;
  status: DecisionStatus;
  date: string;
  authors: string;
  context: string;
  decision: string;
  consequences: string;
  alternatives: string;
  tags: string[];
}

export const STATUS_ORDER: DecisionStatus[] = [
  "proposed",
  "accepted",
  "rejected",
  "superseded",
  "deprecated",
];

export const SAMPLE_DECISIONS: DecisionRecord[] = [
  {
    id: "ADR-001",
    title: "Adopt OpenAPI as the source of truth for public APIs",
    status: "accepted",
    date: "2025-11-12",
    authors: "Platform Architecture",
    context:
      "Consumer teams were integrating against stale wiki pages, causing production contract drift.",
    decision:
      "All externally reachable HTTP APIs must publish an OpenAPI 3 description in-repo, validated in CI via HarborGate.",
    consequences:
      "Slightly higher PR overhead; dramatically fewer silent breaking changes and clearer partner communication.",
    alternatives:
      "GraphQL schema-first; protobuf-only; continue wiki documentation.",
    tags: ["api", "platform", "governance"],
  },
  {
    id: "ADR-002",
    title: "Prefer Postgres for transactional workloads",
    status: "accepted",
    date: "2025-12-02",
    authors: "Data Platform",
    context:
      "Two product lines independently evaluated document stores for billing ledgers.",
    decision:
      "Transactional systems with strong consistency needs standardize on Postgres; document stores remain optional for content/search.",
    consequences:
      "Shared operational expertise, clearer hiring profile, unified backup/restore runbooks.",
    alternatives: "CockroachDB everywhere; DynamoDB for all ledgers.",
    tags: ["data", "infrastructure"],
  },
  {
    id: "ADR-003",
    title: "Defer multi-region active-active",
    status: "proposed",
    date: "2026-02-18",
    authors: "SRE",
    context:
      "Enterprise prospects asked for <30s RPO across continents; current architecture is active-passive.",
    decision:
      "Remain active-passive with improved failover automation through H2; revisit active-active after latency SLOs are funded.",
    consequences:
      "Keeps infra cost predictable; may lose deals that mandate simultaneous multi-region writes.",
    alternatives: "Immediate active-active with conflict-free ledgers; regional single-tenant stacks.",
    tags: ["reliability", "cost"],
  },
];

export function toMarkdown(d: DecisionRecord): string {
  return [
    `# ${d.id}: ${d.title}`,
    ``,
    `- Status: ${d.status}`,
    `- Date: ${d.date}`,
    `- Authors: ${d.authors}`,
    `- Tags: ${d.tags.join(", ") || "—"}`,
    ``,
    `## Context`,
    ``,
    d.context,
    ``,
    `## Decision`,
    ``,
    d.decision,
    ``,
    `## Consequences`,
    ``,
    d.consequences,
    ``,
    `## Alternatives considered`,
    ``,
    d.alternatives,
    ``,
  ].join("\n");
}

export function exportPacket(decisions: DecisionRecord[]): string {
  const accepted = decisions.filter((d) => d.status === "accepted").length;
  const proposed = decisions.filter((d) => d.status === "proposed").length;
  const header = [
    `# Quillmark Architecture Decision Packet`,
    ``,
    `- Exported: ${new Date().toISOString()}`,
    `- Records: ${decisions.length}`,
    `- Accepted: ${accepted}`,
    `- Proposed: ${proposed}`,
    ``,
    `---`,
    ``,
  ].join("\n");
  return header + decisions.map(toMarkdown).join("\n---\n\n");
}

export function emptyDecision(index: number): DecisionRecord {
  const n = String(index).padStart(3, "0");
  return {
    id: `ADR-${n}`,
    title: "",
    status: "proposed",
    date: new Date().toISOString().slice(0, 10),
    authors: "",
    context: "",
    decision: "",
    consequences: "",
    alternatives: "",
    tags: [],
  };
}
