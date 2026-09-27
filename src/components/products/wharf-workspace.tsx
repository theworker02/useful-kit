"use client";

import { useMemo, useState } from "react";
import { analyzeInventory, reportToMarkdown } from "@/lib/products/wharf/analyze";
import { WHARF_SAMPLE } from "@/lib/products/wharf/samples";
import { downloadText } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const badgeTone: Record<string, string> = {
  compatible: "bg-teal-50 text-teal-900 border-teal-200",
  review: "bg-amber-50 text-amber-950 border-amber-200",
  incompatible: "bg-rose-50 text-rose-900 border-rose-200",
  unknown: "bg-slate-100 text-slate-800 border-slate-300",
};

export function WharfWorkspace() {
  const [inventory, setInventory] = useState(WHARF_SAMPLE);
  const [productLicense, setProductLicense] = useState("MIT");

  const { report, error } = useMemo(() => {
    try {
      return { report: analyzeInventory(inventory, productLicense), error: null as string | null };
    } catch (e) {
      return {
        report: null,
        error: e instanceof Error ? e.message : "Failed to parse inventory",
      };
    }
  }, [inventory, productLicense]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="license">Outbound product license</Label>
          <Select value={productLicense} onValueChange={setProductLicense}>
            <SelectTrigger id="license" className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["MIT", "Apache-2.0", "GPL-3.0-only", "AGPL-3.0-only", "Proprietary"].map(
                (l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="inventory">Dependency inventory</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setInventory(WHARF_SAMPLE)}
            >
              Load sample
            </Button>
          </div>
          <Textarea
            id="inventory"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            className="min-h-[320px] bg-white font-mono text-xs leading-relaxed"
            placeholder="name@version LICENSE or CSV / JSON"
          />
          <p className="text-xs text-slate-500">
            Accepts npm-style lines, CSV, pipe-delimited SBOM-lite, or a JSON array.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={!report}
            onClick={() =>
              report &&
              downloadText(
                `wharf-diligence-${new Date().toISOString().slice(0, 10)}.md`,
                reportToMarkdown(report),
              )
            }
          >
            Export diligence report
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!report}
            onClick={() =>
              report &&
              downloadText(
                `wharf-report-${new Date().toISOString().slice(0, 10)}.json`,
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
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Parse error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {report ? (
          <>
            <Alert className="border-teal-200/80 bg-white/80">
              <AlertTitle>Executive summary</AlertTitle>
              <AlertDescription>{report.executiveSummary}</AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Metric label="Risk score" value={`${report.riskScore}/100`} />
              <Metric label="Packages" value={report.totals.packages} />
              <Metric label="Review" value={report.totals.review} />
              <Metric
                label="Blockers"
                value={report.totals.incompatible + report.totals.unknown}
              />
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white/80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Fit</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.findings.slice(0, 40).map((f) => (
                    <TableRow key={`${f.package}@${f.version}-${f.license}`}>
                      <TableCell className="font-mono text-xs">
                        {f.package}@{f.version}
                      </TableCell>
                      <TableCell className="text-xs">{f.license}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={badgeTone[f.compatibility] ?? ""}
                        >
                          {f.compatibility}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs capitalize">{f.severity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
