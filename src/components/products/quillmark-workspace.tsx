"use client";

import { useMemo, useState } from "react";
import {
  emptyDecision,
  exportPacket,
  SAMPLE_DECISIONS,
  STATUS_ORDER,
  type DecisionRecord,
  type DecisionStatus,
  toMarkdown,
} from "@/lib/products/quillmark/templates";
import { downloadText } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Metric } from "@/components/studio/metric";

export function QuillmarkWorkspace() {
  const [decisions, setDecisions] = useState<DecisionRecord[]>(SAMPLE_DECISIONS);
  const [selectedId, setSelectedId] = useState(SAMPLE_DECISIONS[0]?.id ?? "");

  const selected =
    decisions.find((d) => d.id === selectedId) ?? decisions[0] ?? null;

  const stats = useMemo(() => {
    return {
      total: decisions.length,
      accepted: decisions.filter((d) => d.status === "accepted").length,
      proposed: decisions.filter((d) => d.status === "proposed").length,
    };
  }, [decisions]);

  function update(patch: Partial<DecisionRecord>) {
    if (!selected) return;
    setDecisions((prev) =>
      prev.map((d) => (d.id === selected.id ? { ...d, ...patch } : d)),
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-slate-700">Records</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              const next = emptyDecision(decisions.length + 1);
              setDecisions((d) => [...d, next]);
              setSelectedId(next.id);
            }}
          >
            New
          </Button>
        </div>
        <ul className="space-y-1">
          {decisions.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => setSelectedId(d.id)}
                className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                  d.id === selected?.id
                    ? "border-teal-300 bg-teal-50/80"
                    : "border-transparent bg-white/60 hover:border-slate-200"
                }`}
              >
                <div className="font-mono text-[11px] text-slate-500">{d.id}</div>
                <div className="line-clamp-2 text-sm text-slate-800">
                  {d.title || "Untitled decision"}
                </div>
                <Badge variant="outline" className="mt-1 text-[10px] capitalize">
                  {d.status}
                </Badge>
              </button>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Metric label="Total" value={stats.total} />
          <Metric label="Accepted" value={stats.accepted} />
          <Metric label="Proposed" value={stats.proposed} />
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={() =>
            downloadText(
              `quillmark-packet-${new Date().toISOString().slice(0, 10)}.md`,
              exportPacket(decisions),
            )
          }
        >
          Export diligence packet
        </Button>
      </aside>

      {selected ? (
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white/80 p-4 md:p-6">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={selected.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Decision title"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={selected.status}
                onValueChange={(v) => update({ status: v as DecisionStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selected.date}
                onChange={(e) => update({ date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authors">Authors</Label>
              <Input
                id="authors"
                value={selected.authors}
                onChange={(e) => update({ authors: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={selected.tags.join(", ")}
                onChange={(e) =>
                  update({
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
          </div>

          {(
            [
              ["context", "Context"],
              ["decision", "Decision"],
              ["consequences", "Consequences"],
              ["alternatives", "Alternatives considered"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Textarea
                id={key}
                value={selected[key]}
                onChange={(e) => update({ [key]: e.target.value })}
                className="min-h-[90px]"
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              downloadText(`${selected.id.toLowerCase()}.md`, toMarkdown(selected))
            }
          >
            Export this ADR
          </Button>
        </section>
      ) : null}
    </div>
  );
}
