import { Link, useParams } from "react-router-dom";
import catalog from "../data/catalog.json";

export function BatchPage() {
  const { n } = useParams();
  const batchNum = n ? Number(n) : null;
  const valid = batchNum && batchNum >= 1 && batchNum <= catalog.batchCount;

  if (!valid) {
    return (
      <section className="section rise">
        <h2>All batches</h2>
        <p className="lede">
          {catalog.count} tools · {catalog.batchCount} batches · {catalog.batchSize}{" "}
          tools each
        </p>
        <div className="batch-grid">
          {Array.from({ length: catalog.batchCount }, (_, i) => {
            const batch = i + 1;
            const tools = catalog.tools.filter((t) => t.batch === batch);
            return (
              <Link key={batch} className="batch-card" to={`/batch/${batch}`}>
                <strong>Batch {batch}</strong>
                <div className="meta">{tools.map((t) => t.name).join(" · ")}</div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  const tools = catalog.tools.filter((t) => t.batch === batchNum);
  const prev = batchNum > 1 ? batchNum - 1 : null;
  const next = batchNum < catalog.batchCount ? batchNum + 1 : null;

  return (
    <section className="section rise">
      <div className="pager">
        <div>
          <p className="eyebrow">Batch {batchNum} of {catalog.batchCount}</p>
          <h2 style={{ margin: 0 }}>Five useful tools</h2>
        </div>
        <div className="cta-row">
          {prev ? (
            <Link className="btn secondary" to={`/batch/${prev}`}>
              ← Batch {prev}
            </Link>
          ) : null}
          {next ? (
            <Link className="btn secondary" to={`/batch/${next}`}>
              Batch {next} →
            </Link>
          ) : null}
        </div>
      </div>
      <div className="batch-grid">
        {tools.map((tool) => (
          <Link key={tool.id} className="tool-card" to={`/tool/${tool.id}`}>
            <strong>{tool.name}</strong>
            <div className="meta">{tool.category}</div>
            <div className="meta">{tool.summary}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
