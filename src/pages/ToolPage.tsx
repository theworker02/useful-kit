import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Tool } from "../App";
import {
  resultToMarkdown,
  runEngine,
  type EngineId,
  type EngineResult,
} from "../lib/engines";

export function ToolPage({ tool }: { tool: Tool }) {
  const initial = useMemo(() => {
    const map: Record<string, string> = {};
    for (const input of tool.inputs) map[input.id] = input.sample;
    return map;
  }, [tool]);

  const [values, setValues] = useState(initial);
  const [result, setResult] = useState<EngineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setValues(initial);
    setResult(null);
    setError(null);
  }, [initial]);

  async function run() {
    setRunning(true);
    setError(null);
    try {
      const next = await runEngine(
        tool.engine as EngineId,
        values,
        tool.options as Record<string, string | number | boolean>,
      );
      setResult(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Run failed");
      setResult(null);
    } finally {
      setRunning(false);
    }
  }

  function download() {
    if (!result) return;
    const md = resultToMarkdown(tool.name, result);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="section rise">
      <p className="eyebrow">
        <Link to={`/batch/${tool.batch}`}>Batch {tool.batch}</Link> · {tool.category}
      </p>
      <h2>{tool.name}</h2>
      <p className="lede">{tool.summary}</p>

      <div className="tool-layout">
        <div className="panel">
          <h3>Input</h3>
          {tool.inputs.map((input) => (
            <div key={input.id}>
              <label htmlFor={input.id}>{input.label}</label>
              <textarea
                id={input.id}
                value={values[input.id] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [input.id]: e.target.value }))
                }
              />
            </div>
          ))}
          <div className="actions">
            <button className="btn" type="button" onClick={run} disabled={running}>
              {running ? "Running…" : "Run tool"}
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={() => setValues(initial)}
            >
              Reset sample
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={download}
              disabled={!result}
            >
              Export Markdown
            </button>
          </div>
        </div>

        <div className="panel">
          <h3>Result</h3>
          {error ? <div className="summary fail">{error}</div> : null}
          {!result && !error ? (
            <p className="meta">Run the tool to see output.</p>
          ) : null}
          {result ? (
            <>
              <div className={`summary ${result.pass === false ? "fail" : ""}`}>
                {result.summary}
              </div>
              {result.metrics?.length ? (
                <div className="metrics">
                  {result.metrics.map((m) => (
                    <div className="metric" key={m.label}>
                      <span>{m.label}</span>
                      <strong>{m.value}</strong>
                    </div>
                  ))}
                </div>
              ) : null}
              {result.tables?.map((table, idx) => (
                <div className="table-wrap block" key={idx}>
                  <table>
                    <thead>
                      <tr>
                        {table.headers.map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.length === 0 ? (
                        <tr>
                          <td colSpan={table.headers.length}>No rows</td>
                        </tr>
                      ) : (
                        table.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx}>{cell}</td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ))}
              {result.blocks?.map((block) => (
                <div className="block" key={block.heading}>
                  <h4>{block.heading}</h4>
                  <pre>{block.content}</pre>
                </div>
              ))}
            </>
          ) : null}
        </div>

        <div className="panel docs">
          <h3>About this tool</h3>
          <ul>
            <li>{tool.docs.what}</li>
            <li>{tool.docs.when}</li>
            <li>{tool.docs.notes}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
