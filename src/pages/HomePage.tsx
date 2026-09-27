import { Link } from "react-router-dom";
import catalog from "../data/catalog.json";

export function HomePage() {
  const firstBatch = catalog.tools.filter((t) => t.batch === 1);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">GitHub Pages product</p>
        <h1>{catalog.product.name}</h1>
        <p>{catalog.product.tagline}</p>
        <p style={{ marginTop: "0.85rem" }}>{catalog.product.description}</p>
        <div className="cta-row">
          <Link className="btn" to="/batch/1">
            Open batch 1
          </Link>
          <Link className="btn secondary" to="/batches">
            Browse all {catalog.batchCount} batches
          </Link>
        </div>
      </section>

      <section className="section rise">
        <h2>Batch 1</h2>
        <p className="lede">Five tools. Each one does a real job in your browser.</p>
        <div className="batch-grid">
          {firstBatch.map((tool) => (
            <Link key={tool.id} className="tool-card" to={`/tool/${tool.id}`}>
              <strong>{tool.name}</strong>
              <div className="meta">{tool.category}</div>
              <div className="meta">{tool.summary}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
