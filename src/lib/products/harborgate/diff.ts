export type ChangeKind =
  | "breaking"
  | "non-breaking"
  | "additive"
  | "documentation"
  | "unknown";

export interface ApiChange {
  path: string;
  kind: ChangeKind;
  detail: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
}

export interface ContractReport {
  generatedAt: string;
  baselinePaths: number;
  candidatePaths: number;
  changes: ApiChange[];
  breakingCount: number;
  score: number;
  passGate: boolean;
  executiveSummary: string;
}

interface SimpleOperation {
  method: string;
  path: string;
  requiredParams: string[];
  responseCodes: string[];
  hasRequestBody: boolean;
}

function extractOps(specText: string): SimpleOperation[] {
  const ops: SimpleOperation[] = [];
  let json: unknown;
  try {
    json = JSON.parse(specText);
  } catch {
    // Minimal YAML-ish path extraction for demos
    const pathBlocks = specText.split(/\n(?=\s{0,2}\/)/);
    for (const block of pathBlocks) {
      const pathMatch = block.match(/^\s*(\/[\w/{}/.-]*)\s*:/);
      if (!pathMatch) continue;
      const methods = [...block.matchAll(/^\s{2,}(get|post|put|patch|delete)\s*:/gim)];
      for (const m of methods) {
        const requiredParams = [
          ...block.matchAll(/name:\s*([^\n]+)\n\s*in:\s*path/g),
        ].map((x) => x[1].trim());
        const responseCodes = [...block.matchAll(/^\s{6,}['"]?(\d{3})['"]?\s*:/gm)].map(
          (x) => x[1],
        );
        ops.push({
          method: m[1].toUpperCase(),
          path: pathMatch[1],
          requiredParams,
          responseCodes: responseCodes.length ? responseCodes : ["200"],
          hasRequestBody: /requestBody:/i.test(block),
        });
      }
    }
    return ops;
  }

  const doc = json as {
    paths?: Record<
      string,
      Record<
        string,
        {
          parameters?: { name: string; in: string; required?: boolean }[];
          requestBody?: unknown;
          responses?: Record<string, unknown>;
        }
      >
    >;
  };

  for (const [path, methods] of Object.entries(doc.paths ?? {})) {
    for (const [method, op] of Object.entries(methods)) {
      if (!["get", "post", "put", "patch", "delete"].includes(method)) continue;
      const requiredParams = (op.parameters ?? [])
        .filter((p) => p.in === "path" || p.required)
        .map((p) => p.name);
      ops.push({
        method: method.toUpperCase(),
        path,
        requiredParams,
        responseCodes: Object.keys(op.responses ?? { "200": {} }),
        hasRequestBody: Boolean(op.requestBody),
      });
    }
  }
  return ops;
}

function key(op: SimpleOperation): string {
  return `${op.method} ${op.path}`;
}

export function diffContracts(baselineText: string, candidateText: string): ContractReport {
  const baseline = extractOps(baselineText);
  const candidate = extractOps(candidateText);
  const baseMap = new Map(baseline.map((o) => [key(o), o]));
  const candMap = new Map(candidate.map((o) => [key(o), o]));
  const changes: ApiChange[] = [];

  for (const [k, op] of baseMap) {
    const next = candMap.get(k);
    if (!next) {
      changes.push({
        path: k,
        kind: "breaking",
        detail: "Operation removed",
        severity: "critical",
      });
      continue;
    }

    for (const p of next.requiredParams) {
      if (!op.requiredParams.includes(p)) {
        changes.push({
          path: k,
          kind: "breaking",
          detail: `New required parameter '${p}'`,
          severity: "high",
        });
      }
    }

    for (const code of op.responseCodes) {
      if (!next.responseCodes.includes(code)) {
        changes.push({
          path: k,
          kind: "breaking",
          detail: `Response code ${code} removed`,
          severity: "high",
        });
      }
    }

    if (!op.hasRequestBody && next.hasRequestBody) {
      changes.push({
        path: k,
        kind: "breaking",
        detail: "Request body introduced on previously body-less operation",
        severity: "medium",
      });
    }
  }

  for (const [k] of candMap) {
    if (!baseMap.has(k)) {
      changes.push({
        path: k,
        kind: "additive",
        detail: "New operation",
        severity: "info",
      });
    }
  }

  if (changes.length === 0 && baseline.length === 0 && candidate.length === 0) {
    changes.push({
      path: "*",
      kind: "unknown",
      detail: "Could not parse operations from either specification",
      severity: "medium",
    });
  }

  const breakingCount = changes.filter((c) => c.kind === "breaking").length;
  let score = 100;
  for (const c of changes) {
    if (c.severity === "critical") score -= 25;
    else if (c.severity === "high") score -= 15;
    else if (c.severity === "medium") score -= 8;
    else if (c.severity === "low") score -= 3;
  }
  score = Math.max(0, score);
  const passGate = breakingCount === 0 && score >= 70;

  const executiveSummary = passGate
    ? `Compatibility gate passed (${score}/100). ${changes.filter((c) => c.kind === "additive").length} additive changes; no breaking removals detected.`
    : `Compatibility gate failed (${score}/100). ${breakingCount} breaking change(s) must be versioned or mitigated before release.`;

  return {
    generatedAt: new Date().toISOString(),
    baselinePaths: baseline.length,
    candidatePaths: candidate.length,
    changes,
    breakingCount,
    score,
    passGate,
    executiveSummary,
  };
}

export function reportToMarkdown(report: ContractReport): string {
  return [
    `# HarborGate Contract Diff`,
    ``,
    `- Generated: ${report.generatedAt}`,
    `- Score: ${report.score}/100`,
    `- Gate: ${report.passGate ? "PASS" : "FAIL"}`,
    ``,
    report.executiveSummary,
    ``,
    `## Changes`,
    ...report.changes.map(
      (c) => `- [${c.kind}/${c.severity}] ${c.path} — ${c.detail}`,
    ),
  ].join("\n");
}
