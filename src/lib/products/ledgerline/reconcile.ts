export interface Invoice {
  id: string;
  vendor: string;
  amount: number;
  currency: string;
  issuedOn: string;
  reference: string;
}

export interface Payment {
  id: string;
  counterparty: string;
  amount: number;
  currency: string;
  paidOn: string;
  memo: string;
}

export type MatchStatus = "matched" | "partial" | "exception" | "unmatched";

export interface MatchResult {
  invoiceId: string | null;
  paymentId: string | null;
  status: MatchStatus;
  confidence: number;
  reasons: string[];
  amountDelta: number | null;
}

export interface ReconciliationReport {
  generatedAt: string;
  invoices: number;
  payments: number;
  matched: number;
  partial: number;
  exceptions: number;
  unmatchedInvoices: number;
  unmatchedPayments: number;
  recoveryRate: number;
  results: MatchResult[];
  executiveSummary: string;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function daysBetween(a: string, b: string): number {
  const ms = Math.abs(Date.parse(a) - Date.parse(b));
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function scorePair(invoice: Invoice, payment: Payment): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  if (invoice.currency !== payment.currency) {
    return { score: 0, reasons: ["Currency mismatch"] };
  }

  const amountDelta = Math.abs(invoice.amount - payment.amount);
  const amountPct = amountDelta / Math.max(invoice.amount, 0.01);
  if (amountDelta < 0.01) {
    score += 45;
    reasons.push("Exact amount");
  } else if (amountPct <= 0.02) {
    score += 30;
    reasons.push(`Near amount (Δ ${amountDelta.toFixed(2)})`);
  } else if (amountPct <= 0.05) {
    score += 15;
    reasons.push(`Amount within 5% (Δ ${amountDelta.toFixed(2)})`);
  } else {
    reasons.push(`Amount gap ${amountDelta.toFixed(2)}`);
  }

  const ref = normalize(invoice.reference);
  const memo = normalize(payment.memo);
  if (ref && memo.includes(ref)) {
    score += 35;
    reasons.push("Reference found in memo");
  } else if (ref && memo && (memo.includes(ref.slice(0, 6)) || ref.includes(memo.slice(0, 6)))) {
    score += 18;
    reasons.push("Partial reference overlap");
  }

  const vendor = normalize(invoice.vendor);
  const party = normalize(payment.counterparty);
  if (vendor && party && (vendor.includes(party) || party.includes(vendor))) {
    score += 15;
    reasons.push("Vendor/counterparty name alignment");
  }

  const dayGap = daysBetween(invoice.issuedOn, payment.paidOn);
  if (dayGap <= 45) {
    score += 10;
    reasons.push(`Paid within ${dayGap}d of invoice`);
  } else if (dayGap <= 90) {
    score += 4;
    reasons.push(`Paid ${dayGap}d after invoice`);
  } else {
    reasons.push(`Stale payment window (${dayGap}d)`);
  }

  return { score: Math.min(100, score), reasons };
}

export function parseInvoices(text: string): Invoice[] {
  return text
    .trim()
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#"))
    .map((line, i) => {
      const [id, vendor, amount, currency, issuedOn, reference] = line
        .split(",")
        .map((s) => s.trim());
      return {
        id: id || `INV-${i + 1}`,
        vendor: vendor || "Unknown",
        amount: Number(amount || 0),
        currency: (currency || "USD").toUpperCase(),
        issuedOn: issuedOn || "2026-01-01",
        reference: reference || id || "",
      };
    });
}

export function parsePayments(text: string): Payment[] {
  return text
    .trim()
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#"))
    .map((line, i) => {
      const [id, counterparty, amount, currency, paidOn, memo] = line
        .split(",")
        .map((s) => s.trim());
      return {
        id: id || `PMT-${i + 1}`,
        counterparty: counterparty || "Unknown",
        amount: Number(amount || 0),
        currency: (currency || "USD").toUpperCase(),
        paidOn: paidOn || "2026-01-01",
        memo: memo || "",
      };
    });
}

export function reconcile(invoicesText: string, paymentsText: string): ReconciliationReport {
  const invoices = parseInvoices(invoicesText);
  const payments = parsePayments(paymentsText);
  const usedPayments = new Set<string>();
  const results: MatchResult[] = [];

  for (const invoice of invoices) {
    let best: { payment: Payment; score: number; reasons: string[] } | null = null;
    for (const payment of payments) {
      if (usedPayments.has(payment.id)) continue;
      const { score, reasons } = scorePair(invoice, payment);
      if (!best || score > best.score) best = { payment, score, reasons };
    }

    if (!best || best.score < 35) {
      results.push({
        invoiceId: invoice.id,
        paymentId: null,
        status: "unmatched",
        confidence: best?.score ?? 0,
        reasons: best?.reasons ?? ["No candidate payment"],
        amountDelta: null,
      });
      continue;
    }

    usedPayments.add(best.payment.id);
    const amountDelta = Number((invoice.amount - best.payment.amount).toFixed(2));
    const status: MatchStatus =
      best.score >= 75 && Math.abs(amountDelta) < 0.01
        ? "matched"
        : best.score >= 55
          ? "partial"
          : "exception";

    results.push({
      invoiceId: invoice.id,
      paymentId: best.payment.id,
      status,
      confidence: best.score,
      reasons: best.reasons,
      amountDelta,
    });
  }

  for (const payment of payments) {
    if (!usedPayments.has(payment.id)) {
      results.push({
        invoiceId: null,
        paymentId: payment.id,
        status: "unmatched",
        confidence: 0,
        reasons: ["Unapplied payment"],
        amountDelta: null,
      });
    }
  }

  const matched = results.filter((r) => r.status === "matched").length;
  const partial = results.filter((r) => r.status === "partial").length;
  const exceptions = results.filter((r) => r.status === "exception").length;
  const unmatchedInvoices = results.filter(
    (r) => r.status === "unmatched" && r.invoiceId,
  ).length;
  const unmatchedPayments = results.filter(
    (r) => r.status === "unmatched" && r.paymentId && !r.invoiceId,
  ).length;
  const recoveryRate =
    invoices.length === 0
      ? 0
      : Math.round(((matched + partial * 0.5) / invoices.length) * 1000) / 10;

  const executiveSummary =
    invoices.length === 0
      ? "Provide invoice and payment CSVs to run reconciliation."
      : `Recovery rate ${recoveryRate}%. ${matched} clean matches, ${partial} partials, ${exceptions} exceptions, ${unmatchedInvoices} open invoices, ${unmatchedPayments} unapplied payments.`;

  return {
    generatedAt: new Date().toISOString(),
    invoices: invoices.length,
    payments: payments.length,
    matched,
    partial,
    exceptions,
    unmatchedInvoices,
    unmatchedPayments,
    recoveryRate,
    results: results.sort((a, b) => a.confidence - b.confidence),
    executiveSummary,
  };
}

export function reportToMarkdown(report: ReconciliationReport): string {
  const lines = [
    `# Ledgerline Reconciliation Report`,
    ``,
    `- Generated: ${report.generatedAt}`,
    `- Recovery rate: ${report.recoveryRate}%`,
    ``,
    `## Executive summary`,
    ``,
    report.executiveSummary,
    ``,
    `## Results`,
    ``,
  ];
  for (const r of report.results) {
    lines.push(
      `- ${r.status.toUpperCase()} | invoice=${r.invoiceId ?? "—"} payment=${r.paymentId ?? "—"} confidence=${r.confidence} Δ=${r.amountDelta ?? "—"} | ${r.reasons.join("; ")}`,
    );
  }
  return lines.join("\n");
}
