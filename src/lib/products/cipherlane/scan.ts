export type FindingSeverity = "critical" | "high" | "medium" | "low" | "info";

export interface PolicyFinding {
  id: string;
  rule: string;
  severity: FindingSeverity;
  line: number;
  excerpt: string;
  remediation: string;
}

export interface ScanReport {
  generatedAt: string;
  linesScanned: number;
  findings: PolicyFinding[];
  score: number;
  passGate: boolean;
  executiveSummary: string;
}

interface Rule {
  id: string;
  rule: string;
  severity: FindingSeverity;
  pattern: RegExp;
  remediation: string;
  /** When true, matches are only reported if they look like real secrets (not placeholders). */
  requireEntropy?: boolean;
}

const PLACEHOLDER =
  /(your[_-]?api[_-]?key|changeme|example|xxx+|todo|placeholder|<.*>|\$\{|process\.env)/i;

const RULES: Rule[] = [
  {
    id: "CL-001",
    rule: "AWS access key pattern",
    severity: "critical",
    pattern: /\bAKIA[0-9A-Z]{16}\b/g,
    remediation: "Revoke the key, rotate credentials, and load secrets from a vault or env injection.",
    requireEntropy: true,
  },
  {
    id: "CL-002",
    rule: "Generic API key / bearer assignment",
    severity: "high",
    pattern:
      /\b(api[_-]?key|apikey|secret|token|password|passwd|auth)\b\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    remediation: "Move secrets to environment variables or a secrets manager; never commit literals.",
    requireEntropy: true,
  },
  {
    id: "CL-003",
    rule: "Private key block",
    severity: "critical",
    pattern: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    remediation: "Remove the key material from config; store in a hardware or cloud KMS-backed secret store.",
  },
  {
    id: "CL-004",
    rule: "Insecure TLS verification disabled",
    severity: "high",
    pattern: /\b(rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*0|insecureSkipVerify\s*:\s*true)\b/g,
    remediation: "Keep TLS verification enabled; fix certificate trust chains instead of disabling checks.",
  },
  {
    id: "CL-005",
    rule: "Debug mode enabled in config",
    severity: "medium",
    pattern: /\b(debug|DEBUG)\b\s*[:=]\s*(true|1|yes|on)\b/gi,
    remediation: "Disable debug in shared and production configs; gate verbose logging behind environment checks.",
  },
  {
    id: "CL-006",
    rule: "Wildcard CORS origin",
    severity: "medium",
    pattern: /\b(Access-Control-Allow-Origin|origin)\b\s*[:=]\s*['"]\*['"]/gi,
    remediation: "Allowlist specific origins; avoid wildcard CORS on credentialed APIs.",
  },
  {
    id: "CL-007",
    rule: "Default credentials",
    severity: "high",
    pattern: /\b(admin|root)\b\s*[:=]\s*['"]?(admin|password|root|123456)['"]?/gi,
    remediation: "Replace default credentials and enforce rotation policies.",
  },
  {
    id: "CL-008",
    rule: "HTTP cleartext service URL in prod-like config",
    severity: "low",
    pattern: /\bhttps?:\/\/(?!localhost|127\.0\.0\.1)[^\s'"]+/gi,
    remediation: "Prefer HTTPS endpoints for non-local services; document intentional exceptions.",
  },
];

function looksSecret(value: string): boolean {
  if (PLACEHOLDER.test(value)) return false;
  const literal = value.match(/['"]([^'"]{8,})['"]/);
  const candidate = literal?.[1] ?? value;
  if (candidate.length < 8) return false;
  const unique = new Set(candidate).size;
  return unique >= 5;
}

export function scanConfig(text: string): ScanReport {
  const lines = text.split(/\r?\n/);
  const findings: PolicyFinding[] = [];

  lines.forEach((line, idx) => {
    for (const rule of RULES) {
      rule.pattern.lastIndex = 0;
      if (!rule.pattern.test(line)) continue;
      rule.pattern.lastIndex = 0;
      if (rule.requireEntropy && !looksSecret(line)) continue;
      // Soft-pedal CL-008 for https
      if (rule.id === "CL-008" && /https:\/\//i.test(line) && !/http:\/\//i.test(line)) {
        continue;
      }
      findings.push({
        id: rule.id,
        rule: rule.rule,
        severity: rule.severity,
        line: idx + 1,
        excerpt: line.trim().slice(0, 160),
        remediation: rule.remediation,
      });
    }
  });

  let score = 100;
  for (const f of findings) {
    if (f.severity === "critical") score -= 30;
    else if (f.severity === "high") score -= 18;
    else if (f.severity === "medium") score -= 8;
    else if (f.severity === "low") score -= 3;
  }
  score = Math.max(0, score);
  const passGate = !findings.some((f) => f.severity === "critical" || f.severity === "high");

  const executiveSummary =
    lines.length === 0 || !text.trim()
      ? "Paste configuration to scan for secret patterns and insecure defaults."
      : passGate
        ? `Policy gate passed (${score}/100). ${findings.length} low/medium finding(s); no critical credential exposures detected.`
        : `Policy gate failed (${score}/100). ${findings.filter((f) => f.severity === "critical" || f.severity === "high").length} high-severity issue(s) require remediation before merge.`;

  return {
    generatedAt: new Date().toISOString(),
    linesScanned: lines.filter((l) => l.trim()).length,
    findings,
    score,
    passGate,
    executiveSummary,
  };
}

export function reportToMarkdown(report: ScanReport): string {
  return [
    `# Cipherlane Policy Scan`,
    ``,
    `- Generated: ${report.generatedAt}`,
    `- Score: ${report.score}/100`,
    `- Gate: ${report.passGate ? "PASS" : "FAIL"}`,
    ``,
    report.executiveSummary,
    ``,
    `## Findings`,
    ...report.findings.map(
      (f) =>
        `- ${f.id} L${f.line} [${f.severity}] ${f.rule}\n  \`${f.excerpt}\`\n  Remediation: ${f.remediation}`,
    ),
  ].join("\n");
}
