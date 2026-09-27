"use client";

import { useMemo, useState } from "react";
import { diffContracts, reportToMarkdown } from "@/lib/products/harborgate/diff";
import {
  BASELINE_OPENAPI,
  CANDIDATE_OPENAPI,
} from "@/lib/products/harborgate/samples";
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

export function HarborGateWorkspace() {
  const [baseline, setBaseline] = useState(BASELINE_OPENAPI);
  const [candidate, setCandidate] = useState(CANDIDATE_OPENAPI);

  const report = useMemo(
    () => diffContracts(baseline, candidate),
    [baseline, candidate],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="baseline">Baseline OpenAPI</Label>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setBaseline(BASELINE_OPENAPI);
                setCandidate(CANDIDATE_OPENAPI);
              }}
            >
              Load sample
            </Button>
          </div>
          <Textarea
            id="baseline"
            value={baseline}
            onChange={(e) => setBaseline(e.target.value)}
            className="min-h-[260px] bg-white font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="candidate">Candidate OpenAPI</Label>
          <Textarea
            id="candidate"
            value={candidate}
            onChange={(e) => setCandidate(e.target.value)}
            className="min-h-[260px] bg-white font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() =>
            downloadText(
              `harborgate-${new Date().toISOString().slice(0, 10)}.md`,
              reportToMarkdown(report),
            )
          }
        >
          Export gate report
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            downloadText(
              `harborgate-${new Date().toISOString().slice(0, 10)}.json`,
              JSON.stringify(report, null, 2),
              "application/json",
            )
          }
        >
          Export JSON
        </Button>
      </div>

      <Alert
        className={
          report.passGate
            ? "border-teal-200 bg-teal-50/60"
            : "border-rose-200 bg-rose-50/60"
        }
      >
        <AlertTitle>
          Compatibility gate: {report.passGate ? "PASS" : "FAIL"}
        </AlertTitle>
        <AlertDescription>{report.executiveSummary}</AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Score" value={`${report.score}/100`} />
        <Metric label="Breaking" value={report.breakingCount} />
        <Metric label="Baseline ops" value={report.baselinePaths} />
        <Metric label="Candidate ops" value={report.candidatePaths} />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kind</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Operation</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.changes.map((c, i) => (
              <TableRow key={`${c.path}-${i}`}>
                <TableCell>
                  <Badge variant="outline">{c.kind}</Badge>
                </TableCell>
                <TableCell className="capitalize">{c.severity}</TableCell>
                <TableCell className="font-mono text-xs">{c.path}</TableCell>
                <TableCell className="text-xs text-slate-600">{c.detail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
