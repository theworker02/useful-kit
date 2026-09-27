export type EngineId =
  | "text-metrics"
  | "line-diff"
  | "json-format"
  | "csv-json"
  | "csv-validate"
  | "hash-digest"
  | "codec"
  | "url-inspect"
  | "cron-explain"
  | "semver-tools"
  | "regex-lab"
  | "jwt-inspect"
  | "env-audit"
  | "log-parse"
  | "number-stats"
  | "markdown-toc"
  | "slug-case"
  | "color-contrast"
  | "http-headers"
  | "checklist-score"
  | "template-merge"
  | "sql-tidy"
  | "duration-calc"
  | "dependency-scan"
  | "secret-patterns"
  | "invoice-match"
  | "openapi-diff"
  | "adr-packet"
  | "yaml-keys"
  | "idempotency-key"
  | "percentile-sla"
  | "robots-audit"
  | "changelog-parse"
  | "byte-size"
  | "unicode-normalize"
  | "policy-lint"
  | "trace-id"
  | "feature-flag-eval"
  | "rate-limit-plan"
  | "cost-estimate";

export interface EngineResult {
  title: string;
  summary: string;
  score?: number;
  pass?: boolean;
  metrics?: { label: string; value: string | number }[];
  tables?: { headers: string[]; rows: string[][] }[];
  blocks?: { heading: string; content: string }[];
}

const lines = (t: string) => t.replace(/\r\n/g, "\n").split("\n");
const nonEmpty = (t: string) => lines(t).map((l) => l.trim()).filter(Boolean);

async function digestHex(algo: AlgorithmIdentifier, text: string) {
  const digest = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function parseCsv(text: string): string[][] {
  return nonEmpty(text)
    .filter((l) => !l.startsWith("#"))
    .map((line) => {
      const cells: string[] = [];
      let cur = "";
      let q = false;
      for (const ch of line) {
        if (ch === '"') {
          q = !q;
          continue;
        }
        if (ch === "," && !q) {
          cells.push(cur.trim());
          cur = "";
          continue;
        }
        cur += ch;
      }
      cells.push(cur.trim());
      return cells;
    });
}

function diffLines(left: string, right: string) {
  const a = lines(left);
  const b = lines(right);
  const m = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      m[i][j] = a[i] === b[j] ? m[i + 1][j + 1] + 1 : Math.max(m[i + 1][j], m[i][j + 1]);
    }
  }
  const out: { op: string; text: string }[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      out.push({ op: " ", text: a[i++] });
      j++;
    } else if (m[i + 1][j] >= m[i][j + 1]) out.push({ op: "-", text: a[i++] });
    else out.push({ op: "+", text: b[j++] });
  }
  while (i < a.length) out.push({ op: "-", text: a[i++] });
  while (j < b.length) out.push({ op: "+", text: b[j++] });
  return out;
}

function contrastRatio(hex1: string, hex2: string) {
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
    const rgb = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
    const lin = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  };
  const L1 = lum(hex1);
  const L2 = lum(hex2);
  const bright = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (bright + 0.05) / (dark + 0.05);
}

function tidySql(sql: string) {
  const keywords =
    /\b(select|from|where|and|or|join|left|right|inner|outer|on|group by|order by|having|limit|offset|insert|into|values|update|set|delete|create|table|index|with|as|union|all|distinct|case|when|then|else|end)\b/gi;
  let s = sql.replace(/\s+/g, " ").trim().replace(keywords, (m) => m.toUpperCase());
  for (const k of ["FROM", "WHERE", "JOIN", "LEFT JOIN", "GROUP BY", "ORDER BY", "LIMIT"]) {
    s = s.replace(new RegExp(`\\b${k}\\b`, "g"), `\n${k}`);
  }
  return s.replace(/\s*,\s*/g, ",\n  ");
}

const LICENSE_RISK: Record<string, number> = {
  MIT: 0,
  ISC: 0,
  "Apache-2.0": 0,
  "BSD-3-Clause": 0,
  "BSD-2-Clause": 0,
  "MPL-2.0": 6,
  "LGPL-3.0-only": 8,
  "GPL-3.0-only": 15,
  "GPL-2.0-only": 15,
  "AGPL-3.0-only": 25,
  "SSPL-1.0": 25,
  Proprietary: 12,
  UNKNOWN: 20,
};

export async function runEngine(
  engine: EngineId,
  values: Record<string, string>,
  options: Record<string, string | number | boolean> = {},
): Promise<EngineResult> {
  const a = values.a ?? values.input ?? "";
  const b = values.b ?? values.right ?? "";

  switch (engine) {
    case "text-metrics": {
      const words = a.trim() ? a.trim().split(/\s+/).length : 0;
      return {
        title: "Text metrics",
        summary: `${words} words · ~${Math.max(1, Math.ceil(words / 200))} min read`,
        metrics: [
          { label: "Words", value: words },
          { label: "Characters", value: a.length },
          { label: "Lines", value: lines(a).length },
          { label: "Paragraphs", value: a.split(/\n\s*\n/).filter((p) => p.trim()).length },
        ],
      };
    }
    case "line-diff": {
      const diff = diffLines(a, b);
      return {
        title: "Line diff",
        summary: `${diff.filter((d) => d.op === "+").length} added · ${diff.filter((d) => d.op === "-").length} removed`,
        blocks: [{ heading: "Diff", content: diff.map((d) => `${d.op}${d.text}`).join("\n") }],
      };
    }
    case "json-format": {
      try {
        const formatted = JSON.stringify(JSON.parse(a), null, Number(options.indent ?? 2));
        return { title: "JSON", summary: "Valid", pass: true, score: 100, blocks: [{ heading: "Formatted", content: formatted }] };
      } catch (e) {
        return { title: "JSON", summary: e instanceof Error ? e.message : "Invalid", pass: false, score: 0 };
      }
    }
    case "csv-json": {
      const rows = parseCsv(a);
      if (!rows.length) return { title: "CSV → JSON", summary: "No rows", pass: false };
      const [header, ...body] = rows;
      const objects = body.map((row) => Object.fromEntries(header.map((h, i) => [h, row[i] ?? ""])));
      return {
        title: "CSV → JSON",
        summary: `${objects.length} records`,
        blocks: [{ heading: "JSON", content: JSON.stringify(objects, null, 2) }],
      };
    }
    case "csv-validate": {
      const rows = parseCsv(a);
      if (!rows.length) return { title: "CSV validate", summary: "Empty", pass: false, score: 0 };
      const width = rows[0].length;
      const bad = rows.map((r, i) => ({ i: i + 1, len: r.length })).filter((r) => r.len !== width);
      return {
        title: "CSV validate",
        summary: bad.length ? `${bad.length} jagged rows` : "Consistent shape",
        pass: bad.length === 0,
        score: Math.max(0, 100 - bad.length * 10),
        tables: [{ headers: ["Row", "Columns", "Expected"], rows: bad.map((r) => [String(r.i), String(r.len), String(width)]) }],
      };
    }
    case "hash-digest": {
      const algo = String(options.algo ?? "SHA-256");
      const hex = await digestHex(algo === "SHA-1" ? "SHA-1" : algo === "SHA-512" ? "SHA-512" : "SHA-256", a);
      return { title: algo, summary: hex.slice(0, 18) + "…", blocks: [{ heading: "Hex", content: hex }] };
    }
    case "codec": {
      const mode = String(options.mode ?? "base64-encode");
      try {
        let out = a;
        if (mode === "base64-encode") out = btoa(unescape(encodeURIComponent(a)));
        else if (mode === "base64-decode") out = decodeURIComponent(escape(atob(a.trim())));
        else if (mode === "url-encode") out = encodeURIComponent(a);
        else if (mode === "url-decode") out = decodeURIComponent(a);
        else if (mode === "html-escape")
          out = a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        return { title: "Codec", summary: mode, pass: true, blocks: [{ heading: "Output", content: out }] };
      } catch (e) {
        return { title: "Codec", summary: e instanceof Error ? e.message : "Failed", pass: false, score: 0 };
      }
    }
    case "url-inspect": {
      try {
        const u = new URL(a.trim());
        const params = [...u.searchParams.entries()];
        return {
          title: "URL",
          summary: u.origin + u.pathname,
          tables: [
            { headers: ["Field", "Value"], rows: [["Protocol", u.protocol], ["Host", u.host], ["Path", u.pathname], ["Hash", u.hash || "—"]] },
            { headers: ["Param", "Value"], rows: params.map(([k, v]) => [k, v]) },
          ],
        };
      } catch {
        return { title: "URL", summary: "Invalid URL", pass: false, score: 0 };
      }
    }
    case "cron-explain": {
      const parts = a.trim().split(/\s+/);
      if (parts.length < 5) return { title: "Cron", summary: "Need 5 fields", pass: false };
      const [min, hour, dom, mon, dow] = parts;
      return {
        title: "Cron",
        summary: a.trim(),
        blocks: [{
          heading: "Fields",
          content: `Minute: ${min}\nHour: ${hour}\nDay of month: ${dom}\nMonth: ${mon}\nDay of week: ${dow}`,
        }],
      };
    }
    case "semver-tools": {
      const versions = nonEmpty(a);
      const parsed = versions.map((v) => {
        const m = v.replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/);
        return m ? { raw: v, major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] ?? "" } : null;
      });
      const valid = parsed.filter(Boolean) as { raw: string; major: number; minor: number; patch: number; pre: string }[];
      valid.sort((x, y) => x.major - y.major || x.minor - y.minor || x.patch - y.patch || x.pre.localeCompare(y.pre));
      const invalid = versions.filter((_, i) => !parsed[i]);
      return {
        title: "Semver",
        summary: `${valid.length} valid · ${invalid.length} invalid`,
        pass: invalid.length === 0,
        blocks: [
          { heading: "Sorted", content: valid.map((v) => v.raw).join("\n") },
          { heading: "Invalid", content: invalid.join("\n") || "(none)" },
        ],
      };
    }
    case "regex-lab": {
      try {
        const re = new RegExp((values.pattern ?? b).trim(), String(options.flags ?? "g"));
        const matches = [...a.matchAll(re)].slice(0, 100);
        return {
          title: "Regex",
          summary: `${matches.length} match(es)`,
          pass: true,
          tables: [{ headers: ["#", "Match", "Groups"], rows: matches.map((m, i) => [String(i + 1), m[0], m.slice(1).join(" | ") || "—"]) }],
        };
      } catch (e) {
        return { title: "Regex", summary: e instanceof Error ? e.message : "Invalid", pass: false, score: 0 };
      }
    }
    case "jwt-inspect": {
      const parts = a.trim().split(".");
      if (parts.length < 2) return { title: "JWT", summary: "Not JWT-shaped", pass: false, score: 0 };
      const decode = (p: string) => {
        const pad = p + "=".repeat((4 - (p.length % 4)) % 4);
        return JSON.stringify(JSON.parse(atob(pad.replace(/-/g, "+").replace(/_/g, "/"))), null, 2);
      };
      try {
        return {
          title: "JWT",
          summary: "Decoded only — signature not verified",
          pass: true,
          blocks: [
            { heading: "Header", content: decode(parts[0]) },
            { heading: "Payload", content: decode(parts[1]) },
            { heading: "Note", content: "Do not use this to forge tokens. Claims are untrusted until verified elsewhere." },
          ],
        };
      } catch (e) {
        return { title: "JWT", summary: e instanceof Error ? e.message : "Decode failed", pass: false, score: 0 };
      }
    }
    case "env-audit": {
      const keys = nonEmpty(a).map((l) => {
        const i = l.indexOf("=");
        if (i === -1) return [l, "Missing ="];
        const key = l.slice(0, i).trim();
        const value = l.slice(i + 1);
        const issues: string[] = [];
        if (!/^[A-Z][A-Z0-9_]*$/.test(key)) issues.push("Non-canonical key");
        if (/secret|password|token|key/i.test(key) && value && !value.startsWith("$")) issues.push("Secret-like plain value");
        return [key, issues.join("; ") || "OK"];
      });
      const problems = keys.filter((k) => k[1] !== "OK").length;
      return {
        title: "Env audit",
        summary: `${problems} finding(s)`,
        pass: problems === 0,
        score: Math.max(0, 100 - problems * 12),
        tables: [{ headers: ["Key", "Status"], rows: keys }],
      };
    }
    case "log-parse": {
      const rows = nonEmpty(a).map((line, idx) => {
        const level = line.match(/\b(ERROR|WARN|INFO|DEBUG|TRACE|FATAL)\b/i)?.[1]?.toUpperCase() ?? "UNKNOWN";
        const ts = line.match(/\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/)?.[0] ?? "—";
        return [String(idx + 1), level, ts, line.slice(0, 100)];
      });
      return {
        title: "Log parse",
        summary: `${rows.length} lines`,
        tables: [{ headers: ["#", "Level", "Timestamp", "Line"], rows }],
      };
    }
    case "number-stats": {
      const nums = nonEmpty(a).join(" ").split(/[\s,;]+/).map(Number).filter((n) => Number.isFinite(n));
      if (!nums.length) return { title: "Stats", summary: "No numbers", pass: false };
      const sorted = [...nums].sort((x, y) => x - y);
      const sum = nums.reduce((s, n) => s + n, 0);
      const pct = (p: number) => sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)];
      return {
        title: "Stats",
        summary: `n=${nums.length}`,
        metrics: [
          { label: "Min", value: sorted[0] },
          { label: "Max", value: sorted.at(-1)! },
          { label: "Mean", value: Number((sum / nums.length).toFixed(4)) },
          { label: "p50", value: pct(0.5) },
          { label: "p95", value: pct(0.95) },
          { label: "Sum", value: Number(sum.toFixed(4)) },
        ],
      };
    }
    case "markdown-toc": {
      const headings = lines(a).map((l) => l.match(/^(#{1,6})\s+(.+)$/)).filter(Boolean) as RegExpMatchArray[];
      const toc = headings
        .map((m) => {
          const depth = m[1].length;
          const title = m[2].replace(/#+$/, "").trim();
          const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
          return `${"  ".repeat(depth - 1)}- [${title}](#${slug})`;
        })
        .join("\n");
      return { title: "TOC", summary: `${headings.length} headings`, blocks: [{ heading: "Markdown", content: toc || "(none)" }] };
    }
    case "slug-case": {
      const mode = String(options.mode ?? "kebab");
      const transform = (s: string) => {
        const base = s.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().toLowerCase();
        if (mode === "snake") return base.replace(/[\s-]+/g, "_");
        if (mode === "camel")
          return base.split(/[\s_-]+/).map((w, i) => (i ? w[0]?.toUpperCase() + w.slice(1) : w)).join("");
        if (mode === "pascal")
          return base.split(/[\s_-]+/).map((w) => w[0]?.toUpperCase() + w.slice(1)).join("");
        return base.replace(/[\s_]+/g, "-");
      };
      return { title: "Slug", summary: mode, blocks: [{ heading: "Output", content: nonEmpty(a).map(transform).join("\n") }] };
    }
    case "color-contrast": {
      try {
        const ratio = contrastRatio((values.fg ?? a).trim().split(/\s+/)[0], (values.bg ?? b).trim().split(/\s+/)[0]);
        return {
          title: "Contrast",
          summary: `${ratio.toFixed(2)}:1`,
          pass: ratio >= 4.5,
          score: Math.min(100, Math.round((ratio / 7) * 100)),
          metrics: [
            { label: "Ratio", value: Number(ratio.toFixed(2)) },
            { label: "AA", value: ratio >= 4.5 ? "PASS" : "FAIL" },
            { label: "AAA", value: ratio >= 7 ? "PASS" : "FAIL" },
          ],
        };
      } catch {
        return { title: "Contrast", summary: "Need two hex colors", pass: false, score: 0 };
      }
    }
    case "http-headers": {
      const rows = nonEmpty(a).map((l) => {
        const i = l.indexOf(":");
        if (i === -1) return [l, "", "Malformed"];
        const name = l.slice(0, i).trim();
        const value = l.slice(i + 1).trim();
        const notes: string[] = [];
        if (name.toLowerCase() === "access-control-allow-origin" && value === "*") notes.push("Wildcard CORS");
        if (name.toLowerCase() === "strict-transport-security") notes.push("HSTS");
        if (name.toLowerCase() === "content-security-policy") notes.push("CSP");
        if (name.toLowerCase() === "server") notes.push("Banner disclosure");
        return [name, value.slice(0, 80), notes.join("; ") || "—"];
      });
      return { title: "Headers", summary: `${rows.length} headers`, tables: [{ headers: ["Header", "Value", "Notes"], rows }] };
    }
    case "checklist-score": {
      const items = nonEmpty(a).map((l) => {
        const done = /^\s*\[(x|X|✓)\]/.test(l);
        return [done ? "DONE" : "TODO", l.replace(/^\s*\[(?: |x|X|✓)\]\s*/, "")];
      });
      const done = items.filter((i) => i[0] === "DONE").length;
      const score = items.length ? Math.round((done / items.length) * 100) : 0;
      return {
        title: "Checklist",
        summary: `${done}/${items.length} (${score}%)`,
        score,
        pass: score === 100,
        tables: [{ headers: ["Status", "Item"], rows: items }],
      };
    }
    case "template-merge": {
      let out = a;
      for (const row of nonEmpty(b)) {
        const [k, ...rest] = row.split("=");
        if (k) out = out.replaceAll(`{{${k.trim()}}}`, rest.join("=").trim());
      }
      const missing = [...out.matchAll(/\{\{([^}]+)\}\}/g)].map((m) => m[1]);
      return {
        title: "Template",
        summary: missing.length ? `${missing.length} missing` : "Complete",
        pass: missing.length === 0,
        blocks: [
          { heading: "Output", content: out },
          { heading: "Missing", content: missing.join("\n") || "(none)" },
        ],
      };
    }
    case "sql-tidy":
      return { title: "SQL", summary: "Formatted", blocks: [{ heading: "SQL", content: tidySql(a) }] };
    case "duration-calc": {
      const starts = nonEmpty(a);
      const ends = nonEmpty(b);
      const rows = starts.map((s, i) => {
        const e = ends[i] ?? ends[0] ?? "";
        const ms = Date.parse(e) - Date.parse(s);
        return [s, e || "—", Number.isFinite(ms) ? `${(ms / 60000).toFixed(1)} min` : "Invalid"];
      });
      return { title: "Duration", summary: `${rows.length} interval(s)`, tables: [{ headers: ["Start", "End", "Duration"], rows }] };
    }
    case "dependency-scan": {
      const rows = nonEmpty(a).filter((l) => !l.startsWith("#")).map((l) => {
        const m = l.match(/^(@?[\w./-]+)(?:@([^\s]+))?\s+(.+)$/);
        const name = m?.[1] ?? l;
        const version = m?.[2] ?? "*";
        const license = (m?.[3] ?? "UNKNOWN").trim();
        const risk = LICENSE_RISK[license] ?? LICENSE_RISK.UNKNOWN;
        return { name, version, license, risk };
      });
      const score = Math.min(100, rows.reduce((s, r) => s + r.risk, 0));
      return {
        title: "License scan",
        summary: `${rows.length} packages · risk ${score}/100`,
        score: Math.max(0, 100 - score),
        pass: score < 40,
        tables: [{ headers: ["Package", "Version", "License", "Risk"], rows: rows.map((r) => [r.name, r.version, r.license, String(r.risk)]) }],
      };
    }
    case "secret-patterns": {
      const rules: { rule: string; re: RegExp; sev: string }[] = [
        { rule: "AWS key pattern", re: /\bAKIA[0-9A-Z]{16}\b/, sev: "critical" },
        { rule: "Secret assignment", re: /\b(api[_-]?key|secret|token|password)\b\s*[:=]\s*['"][^'"]{6,}['"]/i, sev: "high" },
        { rule: "TLS verify disabled", re: /rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*0/i, sev: "high" },
        { rule: "Debug enabled", re: /\bdebug\b\s*[:=]\s*(true|1|yes)/i, sev: "medium" },
        { rule: "Wildcard CORS", re: /origin\s*[:=]\s*['"]\*['"]/i, sev: "medium" },
        { rule: "Default credentials", re: /\b(admin|root)\b\s*[:=]\s*['"]?(admin|password|root)['"]?/i, sev: "high" },
      ];
      const findings: string[][] = [];
      lines(a).forEach((line, idx) => {
        for (const rule of rules) {
          if (rule.re.test(line) && !/\$\{|changeme|example|placeholder/i.test(line)) {
            findings.push([rule.rule, rule.sev, String(idx + 1), line.trim().slice(0, 100)]);
          }
        }
      });
      const score = Math.max(0, 100 - findings.length * 15);
      return {
        title: "Config patterns",
        summary: `${findings.length} finding(s)`,
        score,
        pass: !findings.some((f) => f[1] === "critical" || f[1] === "high"),
        tables: [{ headers: ["Rule", "Severity", "Line", "Excerpt"], rows: findings }],
      };
    }
    case "invoice-match": {
      const invoices = parseCsv(a);
      const payments = parseCsv(b);
      const used = new Set<number>();
      const results: string[][] = [];
      for (const inv of invoices) {
        let best = -1;
        let bestScore = 0;
        let reasons = "";
        payments.forEach((p, pi) => {
          if (used.has(pi)) return;
          let s = 0;
          const why: string[] = [];
          if (inv[2] && p[2] && Math.abs(Number(inv[2]) - Number(p[2])) < 0.01) {
            s += 45;
            why.push("amount");
          } else if (inv[2] && p[2] && Math.abs(Number(inv[2]) - Number(p[2])) / Number(inv[2]) < 0.05) {
            s += 20;
            why.push("near amount");
          }
          const ref = (inv[5] ?? inv[0] ?? "").toLowerCase();
          if (ref && (p[5] ?? "").toLowerCase().includes(ref)) {
            s += 35;
            why.push("reference");
          }
          if ((inv[1] ?? "").toLowerCase() && (p[1] ?? "").toLowerCase().includes((inv[1] ?? "").toLowerCase().slice(0, 4))) {
            s += 15;
            why.push("vendor");
          }
          if (s > bestScore) {
            bestScore = s;
            best = pi;
            reasons = why.join(", ");
          }
        });
        if (best >= 0 && bestScore >= 35) {
          used.add(best);
          results.push([bestScore >= 75 ? "matched" : "partial", inv[0] ?? "", payments[best][0] ?? "", String(bestScore), reasons]);
        } else results.push(["unmatched", inv[0] ?? "", "—", String(bestScore), reasons || "no candidate"]);
      }
      const matched = results.filter((r) => r[0] === "matched").length;
      const rate = invoices.length ? Math.round((matched / invoices.length) * 100) : 0;
      return {
        title: "Invoice match",
        summary: `${rate}% clean match rate`,
        score: rate,
        pass: rate >= 70,
        tables: [{ headers: ["Status", "Invoice", "Payment", "Score", "Reasons"], rows: results }],
      };
    }
    case "openapi-diff": {
      const parsePaths = (text: string) => {
        try {
          const doc = JSON.parse(text) as { paths?: Record<string, Record<string, { parameters?: { name: string; required?: boolean; in?: string }[]; responses?: Record<string, unknown> }>> };
          const ops: { key: string; required: string[]; codes: string[] }[] = [];
          for (const [path, methods] of Object.entries(doc.paths ?? {})) {
            for (const [method, op] of Object.entries(methods)) {
              if (!["get", "post", "put", "patch", "delete"].includes(method)) continue;
              ops.push({
                key: `${method.toUpperCase()} ${path}`,
                required: (op.parameters ?? []).filter((p) => p.required || p.in === "path").map((p) => p.name),
                codes: Object.keys(op.responses ?? { "200": {} }),
              });
            }
          }
          return ops;
        } catch {
          return [];
        }
      };
      const base = parsePaths(a);
      const next = parsePaths(b);
      const nextMap = new Map(next.map((o) => [o.key, o]));
      const changes: string[][] = [];
      for (const op of base) {
        const n = nextMap.get(op.key);
        if (!n) changes.push(["breaking", "critical", op.key, "Operation removed"]);
        else {
          for (const p of n.required) if (!op.required.includes(p)) changes.push(["breaking", "high", op.key, `New required param ${p}`]);
          for (const c of op.codes) if (!n.codes.includes(c)) changes.push(["breaking", "high", op.key, `Response ${c} removed`]);
        }
      }
      for (const op of next) if (!base.some((b0) => b0.key === op.key)) changes.push(["additive", "info", op.key, "New operation"]);
      const breaking = changes.filter((c) => c[0] === "breaking").length;
      const score = Math.max(0, 100 - breaking * 20);
      return {
        title: "OpenAPI diff",
        summary: breaking ? `${breaking} breaking` : "No breaking changes",
        score,
        pass: breaking === 0,
        tables: [{ headers: ["Kind", "Severity", "Operation", "Detail"], rows: changes }],
      };
    }
    case "adr-packet": {
      const records = nonEmpty(a).map((line, i) => {
        const [title, status, decision] = line.split("|").map((s) => s.trim());
        return `# ADR-${String(i + 1).padStart(3, "0")}: ${title || "Untitled"}\n\n- Status: ${status || "proposed"}\n\n## Decision\n\n${decision || title || ""}\n`;
      });
      return {
        title: "ADR packet",
        summary: `${records.length} records`,
        blocks: [{ heading: "Markdown", content: records.join("\n---\n\n") }],
      };
    }
    case "yaml-keys": {
      const keys = nonEmpty(a)
        .filter((l) => !l.trim().startsWith("#"))
        .map((l) => {
          const m = l.match(/^(\s*)([^:#]+):/);
          if (!m) return null;
          const depth = Math.floor(m[1].replace(/\t/g, "  ").length / 2);
          return [String(depth), `${"  ".repeat(depth)}${m[2].trim()}`];
        })
        .filter(Boolean) as string[][];
      return { title: "YAML keys", summary: `${keys.length} keys`, tables: [{ headers: ["Depth", "Key"], rows: keys }] };
    }
    case "idempotency-key": {
      const hex = await digestHex("SHA-256", `${a.trim() || crypto.randomUUID()}:${b || "v1"}`);
      const key = `${String(options.prefix ?? "idem")}_${hex.slice(0, 32)}`;
      return { title: "Idempotency key", summary: key, blocks: [{ heading: "Key", content: key }] };
    }
    case "percentile-sla": {
      const nums = nonEmpty(a).join(" ").split(/[\s,;]+/).map(Number).filter((n) => Number.isFinite(n)).sort((x, y) => x - y);
      const target = Number(options.target ?? 300);
      if (!nums.length) return { title: "SLA", summary: "No samples", pass: false };
      const pct = (p: number) => nums[Math.min(nums.length - 1, Math.ceil(nums.length * p) - 1)];
      const p99 = pct(0.99);
      return {
        title: "SLA percentiles",
        summary: `p99=${p99} vs ${target}`,
        pass: p99 <= target,
        metrics: [
          { label: "n", value: nums.length },
          { label: "p50", value: pct(0.5) },
          { label: "p95", value: pct(0.95) },
          { label: "p99", value: p99 },
          { label: "Target", value: target },
        ],
      };
    }
    case "robots-audit": {
      const rules = nonEmpty(a);
      const blocksAll = rules.some((d) => /disallow:\s*\/\s*$/i.test(d));
      return {
        title: "robots.txt",
        summary: blocksAll ? "Root disallow detected" : "Parsed",
        pass: !blocksAll,
        metrics: [
          { label: "Agents", value: rules.filter((l) => /^user-agent:/i.test(l)).length },
          { label: "Disallows", value: rules.filter((l) => /^disallow:/i.test(l)).length },
          { label: "Sitemaps", value: rules.filter((l) => /^sitemap:/i.test(l)).length },
        ],
        blocks: [{ heading: "Normalized", content: rules.join("\n") }],
      };
    }
    case "changelog-parse": {
      const sections = a.split(/^##\s+/m).filter(Boolean);
      const rows = sections.map((s) => {
        const [title, ...body] = s.split("\n");
        return [title.trim(), String(body.filter((l) => /^\s*[-*]/.test(l)).length), body.join(" ").trim().slice(0, 80)];
      });
      return { title: "Changelog", summary: `${rows.length} sections`, tables: [{ headers: ["Version", "Items", "Preview"], rows }] };
    }
    case "byte-size": {
      const rows = nonEmpty(a).map((line) => {
        const bytes = new TextEncoder().encode(line).length;
        return [line.slice(0, 48), String(bytes), (bytes / 1024).toFixed(2)];
      });
      const total = rows.reduce((s, r) => s + Number(r[1]), 0);
      return {
        title: "Byte size",
        summary: `${total} bytes`,
        metrics: [{ label: "Total", value: total }],
        tables: [{ headers: ["Line", "Bytes", "KiB"], rows }],
      };
    }
    case "unicode-normalize": {
      const form = String(options.form ?? "NFC") as "NFC" | "NFD" | "NFKC" | "NFKD";
      const out = a.normalize(form);
      return {
        title: "Unicode",
        summary: form,
        blocks: [{ heading: "Normalized", content: out }],
        metrics: [
          { label: "In", value: [...a].length },
          { label: "Out", value: [...out].length },
        ],
      };
    }
    case "policy-lint": {
      const required = String(options.required ?? "owner,sla,tier").split(",").map((s) => s.trim()).filter(Boolean);
      const text = a.toLowerCase();
      const missing = required.filter((r) => !text.includes(r.toLowerCase()));
      return {
        title: "Policy lint",
        summary: missing.length ? `Missing: ${missing.join(", ")}` : "Complete",
        pass: missing.length === 0,
        score: Math.round(((required.length - missing.length) / Math.max(required.length, 1)) * 100),
        tables: [{ headers: ["Marker", "Present"], rows: required.map((r) => [r, missing.includes(r) ? "NO" : "YES"]) }],
      };
    }
    case "trace-id": {
      const hex = await digestHex("SHA-256", a || crypto.randomUUID());
      const traceId = hex.slice(0, 32);
      const spanId = hex.slice(32, 48);
      return {
        title: "Trace IDs",
        summary: traceId,
        blocks: [
          { heading: "trace_id", content: traceId },
          { heading: "span_id", content: spanId },
          { heading: "traceparent", content: `00-${traceId}-${spanId}-01` },
        ],
      };
    }
    case "feature-flag-eval": {
      const rows = nonEmpty(a).map((l) => {
        const [name, pctRaw, attr] = l.split(",").map((s) => s.trim());
        const pct = Number(pctRaw ?? 0);
        const seed = `${name}:${attr || b || "anon"}`;
        let h = 0;
        for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
        const bucket = h % 100;
        return [name || "flag", String(pct), String(bucket), bucket < pct ? "ON" : "OFF"];
      });
      return { title: "Feature flags", summary: `${rows.filter((r) => r[3] === "ON").length} on`, tables: [{ headers: ["Flag", "%", "Bucket", "State"], rows }] };
    }
    case "rate-limit-plan": {
      const rps = Number(nonEmpty(a)[0] ?? options.rps ?? 10);
      const burst = Number(nonEmpty(a)[1] ?? options.burst ?? rps * 2);
      const window = Number(options.window ?? 60);
      return {
        title: "Rate limit",
        summary: `${rps} rps · burst ${burst}`,
        metrics: [
          { label: "rps", value: rps },
          { label: "burst", value: burst },
          { label: "window", value: window },
          { label: "max/window", value: rps * window },
        ],
        blocks: [{
          heading: "Config",
          content: JSON.stringify({ algorithm: "token_bucket", refill_per_sec: rps, bucket_size: burst }, null, 2),
        }],
      };
    }
    case "cost-estimate": {
      const rows = parseCsv(a);
      const body = rows[0]?.[0]?.toLowerCase() === "service" ? rows.slice(1) : rows;
      let total = 0;
      const out = body.map((r) => {
        const cost = Number(r[1]) * Number(r[2]);
        total += Number.isFinite(cost) ? cost : 0;
        return [r[0] ?? "item", r[1] ?? "0", r[2] ?? "0", (Number.isFinite(cost) ? cost : 0).toFixed(2)];
      });
      return {
        title: "Cost",
        summary: `$${total.toFixed(2)}`,
        metrics: [{ label: "Total USD", value: Number(total.toFixed(2)) }],
        tables: [{ headers: ["Service", "Units", "Unit $", "Cost"], rows: out }],
      };
    }
    default:
      return { title: "Unknown", summary: `No engine: ${engine}`, pass: false };
  }
}

export function resultToMarkdown(name: string, result: EngineResult): string {
  const parts = [
    `# ${name}`,
    "",
    result.summary,
    "",
  ];
  if (result.metrics?.length) {
    parts.push("## Metrics", "", ...result.metrics.map((m) => `- ${m.label}: ${m.value}`), "");
  }
  if (result.tables) {
    for (const t of result.tables) {
      parts.push(`| ${t.headers.join(" | ")} |`, `| ${t.headers.map(() => "---").join(" | ")} |`);
      for (const row of t.rows) parts.push(`| ${row.join(" | ")} |`);
      parts.push("");
    }
  }
  if (result.blocks) {
    for (const b of result.blocks) {
      parts.push(`## ${b.heading}`, "", "```", b.content, "```", "");
    }
  }
  return parts.join("\n");
}
