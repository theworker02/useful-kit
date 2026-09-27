#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../src/data");
mkdirSync(outDir, { recursive: true });

const PREFIX = [
  "Clear","Swift","Solid","Bright","Steady","Sharp","Quiet","Open","True","Prime",
  "Rapid","Clean","Exact","Safe","Lean","Plain","Direct","Ready","Tight","Fresh",
];
const ROOT = [
  "JSON","CSV","Diff","Hash","Codec","URL","Cron","Semver","Regex","JWT",
  "Env","Log","Stats","Markdown","Slug","Contrast","Header","Check","Template","SQL",
  "Duration","License","Secret","Invoice","OpenAPI","ADR","YAML","Idempotency","SLA","Robots",
  "Changelog","Bytes","Unicode","Policy","Trace","Flag","RateLimit","Cost","Query","Path",
  "Bundle","Import","Coverage","Owner","Branch","PR","Release","Backup","Cache","Queue",
  "Retry","Timeout","Health","Metric","Alert","Schema","Pivot","Join","Filter","Sort",
  "Validate","Normalize","Dedupe","Sample","Partition","Archive","Ticket","SLAQ","Macro","Handoff",
  "Forecast","Territory","Offer","Onboard","Clause","Redline","NDA","Vendor","RFP","Spend",
  "Image","Font","Critical","Prefetch","Redirect","Sitemap","Fixture","Load","Chaos","Mutation",
  "Token","Session","Boundary","Baseline","Patch","CVE","Runbook","Incident","Span","Profile",
];

const CATEGORIES = [
  "Data formats",
  "Text & docs",
  "Web & HTTP",
  "Security hygiene",
  "APIs & contracts",
  "Finance ops",
  "Release & versions",
  "Observability",
  "Cloud cost",
  "QA & testing",
  "Governance",
  "Productivity",
];

const ENGINES = [
  {
    engine: "json-format",
    verb: "format and validate JSON",
    inputs: [{ id: "a", label: "JSON", sample: '{"ok":true,"service":"billing","rps":120}' }],
    options: { indent: 2 },
  },
  {
    engine: "csv-json",
    verb: "convert CSV to JSON",
    inputs: [{ id: "a", label: "CSV", sample: "name,role,team\nAda,Engineer,Platform\nLin,PM,Growth\n" }],
  },
  {
    engine: "csv-validate",
    verb: "validate CSV column shape",
    inputs: [{ id: "a", label: "CSV", sample: "id,name,email\n1,Ada,ada@example.com\n2,Lin\n3,Tom,tom@example.com,extra\n" }],
  },
  {
    engine: "line-diff",
    verb: "diff two texts line-by-line",
    inputs: [
      { id: "a", label: "Before", sample: "alpha\nbeta\ngamma\n" },
      { id: "b", label: "After", sample: "alpha\nbeta-2\ngamma\ndelta\n" },
    ],
  },
  {
    engine: "hash-digest",
    verb: "compute cryptographic digests",
    inputs: [{ id: "a", label: "Input", sample: "release:2026.03.1" }],
    options: { algo: "SHA-256" },
  },
  {
    engine: "codec",
    verb: "encode or decode common formats",
    inputs: [{ id: "a", label: "Input", sample: "https://example.com/path?q=1" }],
    options: { mode: "base64-encode" },
  },
  {
    engine: "url-inspect",
    verb: "break down URLs and query params",
    inputs: [{ id: "a", label: "URL", sample: "https://api.example.com/v1/items?limit=50&cursor=abc#top" }],
  },
  {
    engine: "cron-explain",
    verb: "explain cron schedules",
    inputs: [{ id: "a", label: "Cron expression", sample: "15 3 * * 1-5" }],
  },
  {
    engine: "semver-tools",
    verb: "validate and sort semver lists",
    inputs: [{ id: "a", label: "Versions", sample: "1.2.0\nv2.0.0-rc.1\n1.10.3\nnot-a-version\n0.9.9\n" }],
  },
  {
    engine: "regex-lab",
    verb: "test regex extractions",
    inputs: [
      { id: "a", label: "Text", sample: "order_id=A-1002 status=paid\norder_id=B-44 status=open\n" },
      { id: "pattern", label: "Pattern", sample: "order_id=([A-Z]-\\d+)" },
    ],
    options: { flags: "g" },
  },
  {
    engine: "jwt-inspect",
    verb: "inspect JWT headers and payloads (no verify)",
    inputs: [{ id: "a", label: "JWT", sample: "eyJhbGciOiJub25lIn0.eyJzdWIiOiJ1c2VyXzEyMyIsInJvbGUiOiJyZWFkZXIiLCJleHAiOjE4OTM0NTYwMDB9." }],
  },
  {
    engine: "env-audit",
    verb: "audit .env key hygiene",
    inputs: [{ id: "a", label: ".env", sample: "DATABASE_URL=postgres://local/app\napiKey=demo\nSTRIPE_SECRET=sk_test_example\nFEATURE_X=true\n" }],
  },
  {
    engine: "log-parse",
    verb: "triage log levels and timestamps",
    inputs: [{ id: "a", label: "Logs", sample: "2026-03-01T12:00:01 INFO boot complete\n2026-03-01T12:00:02 WARN cache miss\n2026-03-01T12:00:03 ERROR upstream timeout\n" }],
  },
  {
    engine: "number-stats",
    verb: "compute distribution stats",
    inputs: [{ id: "a", label: "Numbers", sample: "120, 140, 135, 400, 128, 132, 131, 129, 500, 125" }],
  },
  {
    engine: "markdown-toc",
    verb: "generate Markdown tables of contents",
    inputs: [{ id: "a", label: "Markdown", sample: "# Title\n\n## Overview\n\n### Goals\n\n## Architecture\n\n## Risks\n" }],
  },
  {
    engine: "slug-case",
    verb: "normalize identifiers and slugs",
    inputs: [{ id: "a", label: "Strings", sample: "Invoice Match v2\nOpenAPI Diff Gate\nUseful Kit\n" }],
    options: { mode: "kebab" },
  },
  {
    engine: "color-contrast",
    verb: "check WCAG color contrast",
    inputs: [
      { id: "a", label: "Foreground", sample: "#102a43" },
      { id: "b", label: "Background", sample: "#f0f4f8" },
    ],
  },
  {
    engine: "http-headers",
    verb: "review HTTP security headers",
    inputs: [{ id: "a", label: "Headers", sample: "strict-transport-security: max-age=63072000\ncontent-security-policy: default-src 'self'\naccess-control-allow-origin: *\nserver: nginx/1.25\n" }],
  },
  {
    engine: "checklist-score",
    verb: "score readiness checklists",
    inputs: [{ id: "a", label: "Checklist", sample: "[x] Backups verified\n[ ] On-call published\n[x] Sev1 runbook reviewed\n[ ] Comms template ready\n" }],
  },
  {
    engine: "template-merge",
    verb: "merge {{placeholders}} safely",
    inputs: [
      { id: "a", label: "Template", sample: "Hello {{name}}, your {{product}} trial ends on {{date}}." },
      { id: "b", label: "Values", sample: "name=Alex\nproduct=Useful Kit\ndate=2026-04-01\n" },
    ],
  },
  {
    engine: "sql-tidy",
    verb: "tidy SQL for review",
    inputs: [{ id: "a", label: "SQL", sample: "select id, name, created_at from users u join orgs o on o.id=u.org_id where u.active=true order by created_at desc limit 50" }],
  },
  {
    engine: "duration-calc",
    verb: "calculate time intervals",
    inputs: [
      { id: "a", label: "Starts", sample: "2026-03-01T09:00:00Z\n2026-03-01T13:15:00Z\n" },
      { id: "b", label: "Ends", sample: "2026-03-01T11:30:00Z\n2026-03-01T14:00:00Z\n" },
    ],
  },
  {
    engine: "dependency-scan",
    verb: "scan dependency licenses",
    inputs: [{ id: "a", label: "Inventory", sample: "express@4.21.0 MIT\nlodash@4.17.21 MIT\nlegacy-pdf@2.1.0 GPL-3.0-only\nobscure@0.1 UNKNOWN\n" }],
    options: { license: "MIT" },
  },
  {
    engine: "secret-patterns",
    verb: "find risky config patterns",
    inputs: [{ id: "a", label: "Config", sample: "debug: true\npassword: admin\norigin: \"*\"\nrejectUnauthorized: false\n" }],
  },
  {
    engine: "invoice-match",
    verb: "match invoices to payments",
    inputs: [
      { id: "a", label: "Invoices CSV", sample: "INV-1,Acme,100.00,USD,2026-01-01,AC-1\nINV-2,Beta,50.00,USD,2026-01-02,BE-2\n" },
      { id: "b", label: "Payments CSV", sample: "P-1,Acme Inc,100.00,USD,2026-01-10,AC-1\nP-2,Beta,49.00,USD,2026-01-12,BE-2\n" },
    ],
  },
  {
    engine: "openapi-diff",
    verb: "diff OpenAPI contracts",
    inputs: [
      { id: "a", label: "Baseline", sample: "{\"openapi\":\"3.0.3\",\"paths\":{\"/v1/items\":{\"get\":{\"responses\":{\"200\":{}}}}}}" },
      { id: "b", label: "Candidate", sample: "{\"openapi\":\"3.0.3\",\"paths\":{\"/v1/items\":{\"get\":{\"parameters\":[{\"name\":\"cursor\",\"in\":\"query\",\"required\":true}],\"responses\":{\"200\":{}}}}}}" },
    ],
  },
  {
    engine: "adr-packet",
    verb: "package architecture decisions",
    inputs: [{ id: "a", label: "title|status|decision", sample: "Use Postgres for ledgers|accepted|Standardize transactional storage on Postgres\nDefer multi-region|proposed|Stay active-passive through H2\n" }],
  },
  {
    engine: "yaml-keys",
    verb: "inventory YAML keys",
    inputs: [{ id: "a", label: "YAML", sample: "service:\n  name: billing\n  ports:\n    http: 8080\nfeatures:\n  newCheckout: true\n" }],
  },
  {
    engine: "idempotency-key",
    verb: "mint idempotency keys",
    inputs: [
      { id: "a", label: "Seed", sample: "POST:/v1/charges:cus_123:1000" },
      { id: "b", label: "Namespace", sample: "billing" },
    ],
    options: { prefix: "idem" },
  },
  {
    engine: "percentile-sla",
    verb: "compute latency percentiles vs SLA",
    inputs: [{ id: "a", label: "Latencies (ms)", sample: "110\n120\n115\n130\n400\n118\n122\n125\n119\n121\n" }],
    options: { target: 300 },
  },
  {
    engine: "robots-audit",
    verb: "audit robots.txt",
    inputs: [{ id: "a", label: "robots.txt", sample: "User-agent: *\nDisallow: /admin\nAllow: /\nSitemap: https://example.com/sitemap.xml\n" }],
  },
  {
    engine: "changelog-parse",
    verb: "parse changelog sections",
    inputs: [{ id: "a", label: "Changelog", sample: "## 1.2.0\n- Add export\n- Fix timezone\n\n## 1.1.0\n- Initial gate\n" }],
  },
  {
    engine: "byte-size",
    verb: "measure UTF-8 byte sizes",
    inputs: [{ id: "a", label: "Lines", sample: "index.js bundle chunk\nstyles.css critical\nlogo.svg\n" }],
  },
  {
    engine: "unicode-normalize",
    verb: "normalize Unicode text",
    inputs: [{ id: "a", label: "Text", sample: "cafe\u0301 résumé" }],
    options: { form: "NFC" },
  },
  {
    engine: "policy-lint",
    verb: "lint docs for required markers",
    inputs: [{ id: "a", label: "Policy text", sample: "Service owner: platform@example.com\nSLA: 99.9%\nTier: tier-1\n" }],
    options: { required: "owner,sla,tier" },
  },
  {
    engine: "trace-id",
    verb: "generate W3C trace/span IDs",
    inputs: [{ id: "a", label: "Seed", sample: "checkout-session-42" }],
  },
  {
    engine: "feature-flag-eval",
    verb: "evaluate deterministic feature flags",
    inputs: [
      { id: "a", label: "name,pct,attr", sample: "new_checkout,25,user_42\nbeta_billing,100,user_42\n" },
      { id: "b", label: "Subject", sample: "user_42" },
    ],
  },
  {
    engine: "rate-limit-plan",
    verb: "plan token-bucket rate limits",
    inputs: [{ id: "a", label: "rps / burst", sample: "50\n150\n" }],
    options: { window: 60 },
  },
  {
    engine: "cost-estimate",
    verb: "roll up unit costs",
    inputs: [{ id: "a", label: "CSV", sample: "service,units,unitCost\ncompute,720,0.05\nstorage,2000,0.02\negress,500,0.09\n" }],
  },
  {
    engine: "text-metrics",
    verb: "measure reading metrics",
    inputs: [{ id: "a", label: "Text", sample: "Useful Kit is a static collection of practical browser tools.\n\nEach tool runs locally and can export its result." }],
  },
];

const names = [];
for (const p of PREFIX) {
  for (const r of ROOT) {
    names.push(`${p} ${r}`);
    if (names.length >= 300) break;
  }
  if (names.length >= 300) break;
}

function slug(name, i) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${String(i + 1).padStart(3, "0")}`;
}

function specialize(recipe, i) {
  const r = structuredClone(recipe);
  const v = i % 7;
  if (r.engine === "hash-digest") r.options = { algo: ["SHA-256", "SHA-1", "SHA-512", "SHA-256", "SHA-512", "SHA-256", "SHA-1"][v] };
  if (r.engine === "codec") {
    r.options = { mode: ["base64-encode", "url-encode", "html-escape", "base64-decode", "url-decode", "base64-encode", "url-encode"][v] };
    if (r.options.mode === "base64-decode") r.inputs[0].sample = Buffer.from("useful-kit-demo").toString("base64");
  }
  if (r.engine === "slug-case") r.options = { mode: ["kebab", "snake", "camel", "pascal", "kebab", "snake", "camel"][v] };
  if (r.engine === "percentile-sla") r.options = { target: [200, 250, 300, 400, 500, 150, 350][v] };
  if (r.engine === "dependency-scan") r.options = { license: ["MIT", "Apache-2.0", "MIT", "Proprietary", "GPL-3.0-only", "MIT", "Apache-2.0"][v] };
  if (r.engine === "policy-lint") r.options = { required: ["owner,sla,tier", "owner,severity,review", "sla,rto,rpo", "owner,sla,tier,pager", "control,owner,evidence", "owner,sla", "tier,owner,budget"][v] };
  return r;
}

const tools = [];
for (let i = 0; i < 300; i++) {
  const recipe = specialize(ENGINES[i % ENGINES.length], i);
  const name = names[i];
  const category = CATEGORIES[i % CATEGORIES.length];
  tools.push({
    id: slug(name, i),
    name,
    batch: Math.floor(i / 5) + 1,
    category,
    summary: `${name} helps you ${recipe.verb}. Runs entirely in your browser.`,
    engine: recipe.engine,
    inputs: recipe.inputs,
    options: recipe.options ?? {},
    docs: {
      what: `${name} is a focused utility for ${recipe.verb}.`,
      when: `Use it when you need a fast, repeatable answer without installing CLI tooling.`,
      notes: `All processing is local. Exports stay on your machine unless you choose to share them.`,
    },
  });
}

writeFileSync(
  join(outDir, "catalog.json"),
  JSON.stringify(
    {
      product: {
        name: "Useful Kit",
        tagline: "300 practical browser tools, in batches of five.",
        description:
          "A GitHub Pages product: focused utilities for everyday engineering and ops work. Every tool runs locally, ships with sample input, and can export results.",
      },
      count: tools.length,
      batchSize: 5,
      batchCount: 60,
      tools,
    },
    null,
    2,
  ),
);

console.log(`Wrote ${tools.length} tools → ${outDir}/catalog.json`);
