"use client";

import { useMemo, useState } from "react";
import { reportToMarkdown, scanConfig } from "@/lib/products/cipherlane/scan";
import { CIPHERLANE_SAMPLE } from "@/lib/products/cipherlane/samples";
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

export function CipherlaneWorkspace() {
  const [config, setConfig] = useState(CIPHERLANE_SAMPLE);
  const report = useMemo(() => scanConfig(config), [config]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="config">Configuration source</Label>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setConfig(CIPHERLANE_SAMPLE)}
          >
            Load sample
          </Button>
        </div>
        <Textarea
          id="config"
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          className="min-h-[360px] bg-white font-mono text-xs leading-relaxed"
        />
        <p className="text-xs text-slate-500">
          Client-side pattern scan only. Use synthetic fixtures — do not paste production secrets.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() =>
              downloadText(
                `cipherlane-${new Date().toISOString().slice(0, 10)}.md`,
                reportToMarkdown(report),
              )
            }
          >
            Export remediation packet
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              downloadText(
                `cipherlane-${new Date().toISOString().slice(0, 10)}.json`,
                JSON.stringify(report, null, 2),
                "application/json",
              )
            }
          >
            Export JSON
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <Alert
          className={
            report.passGate
              ? "border-teal-200 bg-teal-50/60"
              : "border-rose-200 bg-rose-50/60"
          }
        >
          <AlertTitle>Policy gate: {report.passGate ? "PASS" : "FAIL"}</AlertTitle>
          <AlertDescription>{report.executiveSummary}</AlertDescription>
        </Alert>

        <div className="grid grid-cols-3 gap-3">
          <Metric label="Score" value={`${report.score}/100`} />
          <Metric label="Findings" value={report.findings.length} />
          <Metric label="Lines" value={report.linesScanned} />
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule</TableHead>
                <TableHead>Sev</TableHead>
                <TableHead>Line</TableHead>
                <TableHead>Remediation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.findings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-sm text-slate-500">
                    No policy findings for the current source.
                  </TableCell>
                </TableRow>
              ) : (
                report.findings.map((f, i) => (
                  <TableRow key={`${f.id}-${f.line}-${i}`}>
                    <TableCell>
                      <div className="font-mono text-[11px] text-slate-500">
                        {f.id}
                      </div>
                      <div className="text-xs">{f.rule}</div>
                      <div className="mt-1 max-w-xs truncate font-mono text-[10px] text-slate-500">
                        {f.excerpt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {f.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{f.line}</TableCell>
                    <TableCell className="max-w-sm text-xs text-slate-600">
                      {f.remediation}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
