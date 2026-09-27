"use client";

import { useMemo, useState } from "react";
import {
  reconcile,
  reportToMarkdown,
} from "@/lib/products/ledgerline/reconcile";
import {
  SAMPLE_INVOICES,
  SAMPLE_PAYMENTS,
} from "@/lib/products/ledgerline/samples";
import { downloadText } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Metric } from "@/components/studio/metric";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const statusClass: Record<string, string> = {
  matched: "bg-teal-50 text-teal-900 border-teal-200",
  partial: "bg-amber-50 text-amber-950 border-amber-200",
  exception: "bg-orange-50 text-orange-950 border-orange-200",
  unmatched: "bg-rose-50 text-rose-900 border-rose-200",
};

export function LedgerlineWorkspace() {
  const [invoices, setInvoices] = useState(SAMPLE_INVOICES);
  const [payments, setPayments] = useState(SAMPLE_PAYMENTS);

  const report = useMemo(
    () => reconcile(invoices, payments),
    [invoices, payments],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="invoices">Invoices CSV</Label>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setInvoices(SAMPLE_INVOICES);
                setPayments(SAMPLE_PAYMENTS);
              }}
            >
              Load sample
            </Button>
          </div>
          <Textarea
            id="invoices"
            value={invoices}
            onChange={(e) => setInvoices(e.target.value)}
            className="min-h-[220px] bg-white font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payments">Payments CSV</Label>
          <Textarea
            id="payments"
            value={payments}
            onChange={(e) => setPayments(e.target.value)}
            className="min-h-[220px] bg-white font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() =>
            downloadText(
              `ledgerline-${new Date().toISOString().slice(0, 10)}.md`,
              reportToMarkdown(report),
            )
          }
        >
          Export AP packet
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            downloadText(
              `ledgerline-${new Date().toISOString().slice(0, 10)}.json`,
              JSON.stringify(report, null, 2),
              "application/json",
            )
          }
        >
          Export JSON
        </Button>
      </div>

      <Alert className="border-teal-200/80 bg-white/80">
        <AlertTitle>Executive summary</AlertTitle>
        <AlertDescription>{report.executiveSummary}</AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Metric label="Recovery" value={`${report.recoveryRate}%`} />
        <Metric label="Matched" value={report.matched} />
        <Metric label="Partial" value={report.partial} />
        <Metric label="Exceptions" value={report.exceptions} />
        <Metric label="Open invoices" value={report.unmatchedInvoices} />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Reasons</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.results.map((r, i) => (
              <TableRow key={`${r.invoiceId}-${r.paymentId}-${i}`}>
                <TableCell>
                  <Badge variant="outline" className={statusClass[r.status]}>
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {r.invoiceId ?? "—"}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {r.paymentId ?? "—"}
                </TableCell>
                <TableCell>{r.confidence}</TableCell>
                <TableCell className="max-w-md text-xs text-slate-600">
                  {r.reasons.join("; ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
