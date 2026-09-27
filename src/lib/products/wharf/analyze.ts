import {
  compatibilityFor,
  normalizeLicense,
  resolveLicense,
  type Compatibility,
  type LicenseFamily,
  type LicenseMeta,
} from "./licenses";

export interface DependencyRow {
  name: string;
  version: string;
  license: string;
}

export interface Finding {
  package: string;
  version: string;
  license: string;
  family: LicenseFamily;
  compatibility: Compatibility;
  severity: "info" | "low" | "medium" | "high" | "critical";
  rationale: string;
}

export interface WharfReport {
  generatedAt: string;
  productLicense: string;
  totals: {
    packages: number;
    compatible: number;
    review: number;
    incompatible: number;
    unknown: number;
  };
  familyBreakdown: Record<string, number>;
  findings: Finding[];
  riskScore: number;
  executiveSummary: string;
}

const SEVERITY: Record<Compatibility, Finding["severity"]> = {
  compatible: "info",
  review: "medium",
  incompatible: "high",
  unknown: "critical",
};

export function parseInventory(text: string): DependencyRow[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  // JSON array: [{name, version, license}]
  if (trimmed.startsWith("[")) {
    const data = JSON.parse(trimmed) as DependencyRow[];
    return data.map((d) => ({
      name: String(d.name ?? "unknown"),
      version: String(d.version ?? "*"),
      license: normalizeLicense(String(d.license ?? "UNKNOWN")),
    }));
  }

  // package-lock-ish / npm ls style: name@version license
  // or CSV: name,version,license
  // or SBOM-lite lines: name | version | license
  const rows: DependencyRow[] = [];
  for (const line of trimmed.split(/\r?\n/)) {
    const l = line.trim();
    if (!l || l.startsWith("#") || l.startsWith("//")) continue;

    if (l.includes(",")) {
      const [name, version, license] = l.split(",").map((s) => s.trim());
      if (name && license) {
        rows.push({
          name,
          version: version || "*",
          license: normalizeLicense(license),
        });
        continue;
      }
    }

    if (l.includes("|")) {
      const [name, version, license] = l.split("|").map((s) => s.trim());
      if (name && license) {
        rows.push({
          name,
          version: version || "*",
          license: normalizeLicense(license),
        });
        continue;
      }
    }

    const m = l.match(/^(@?[\w./-]+)@([^\s]+)\s+(.+)$/);
    if (m) {
      rows.push({
        name: m[1],
        version: m[2],
        license: normalizeLicense(m[3]),
      });
      continue;
    }

    const parts = l.split(/\s+/);
    if (parts.length >= 2) {
      rows.push({
        name: parts[0],
        version: parts.length >= 3 ? parts[1] : "*",
        license: normalizeLicense(parts[parts.length - 1]),
      });
    }
  }
  return rows;
}

function score(findings: Finding[]): number {
  let s = 0;
  for (const f of findings) {
    if (f.severity === "critical") s += 25;
    else if (f.severity === "high") s += 15;
    else if (f.severity === "medium") s += 6;
    else if (f.severity === "low") s += 2;
  }
  return Math.min(100, s);
}

export function analyzeInventory(
  text: string,
  productLicense: string,
): WharfReport {
  const deps = parseInventory(text);
  const findings: Finding[] = deps.map((d) => {
    const meta: LicenseMeta = resolveLicense(d.license);
    const compatibility = compatibilityFor(meta, productLicense);
    return {
      package: d.name,
      version: d.version,
      license: meta.spdx,
      family: meta.family,
      compatibility,
      severity: SEVERITY[compatibility],
      rationale: meta.notes,
    };
  });

  const totals = {
    packages: findings.length,
    compatible: findings.filter((f) => f.compatibility === "compatible").length,
    review: findings.filter((f) => f.compatibility === "review").length,
    incompatible: findings.filter((f) => f.compatibility === "incompatible")
      .length,
    unknown: findings.filter((f) => f.compatibility === "unknown").length,
  };

  const familyBreakdown: Record<string, number> = {};
  for (const f of findings) {
    familyBreakdown[f.family] = (familyBreakdown[f.family] ?? 0) + 1;
  }

  const riskScore = score(findings);
  const executiveSummary =
    findings.length === 0
      ? "No packages parsed. Provide a dependency inventory to generate a license risk report."
      : riskScore >= 40
        ? `Elevated license risk (${riskScore}/100). ${totals.incompatible} incompatible and ${totals.unknown} unknown licenses require remediation before release or acquisition close.`
        : riskScore >= 15
          ? `Moderate exposure (${riskScore}/100). ${totals.review} packages need legal/engineering review; ${totals.compatible} are compatible with ${productLicense}.`
          : `Low exposure (${riskScore}/100). Inventory is largely compatible with an outbound ${productLicense} posture.`;

  return {
    generatedAt: new Date().toISOString(),
    productLicense,
    totals,
    familyBreakdown,
    findings: findings.sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      return order[a.severity] - order[b.severity];
    }),
    riskScore,
    executiveSummary,
  };
}

export function reportToMarkdown(report: WharfReport): string {
  const lines = [
    `# Wharf License Diligence Report`,
    ``,
    `- Generated: ${report.generatedAt}`,
    `- Product license posture: ${report.productLicense}`,
    `- Risk score: ${report.riskScore}/100`,
    ``,
    `## Executive summary`,
    ``,
    report.executiveSummary,
    ``,
    `## Totals`,
    ``,
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| Packages | ${report.totals.packages} |`,
    `| Compatible | ${report.totals.compatible} |`,
    `| Review | ${report.totals.review} |`,
    `| Incompatible | ${report.totals.incompatible} |`,
    `| Unknown | ${report.totals.unknown} |`,
    ``,
    `## Findings`,
    ``,
  ];

  for (const f of report.findings) {
    lines.push(
      `### ${f.package}@${f.version}`,
      ``,
      `- License: \`${f.license}\` (${f.family})`,
      `- Compatibility: **${f.compatibility}**`,
      `- Severity: ${f.severity}`,
      `- Notes: ${f.rationale}`,
      ``,
    );
  }

  return lines.join("\n");
}
