import type { Catalog } from "../lib/catalog";

export function AboutPage({ catalog }: { catalog: Catalog }) {
  return (
    <section className="section rise">
      <h2>About {catalog.product.name}</h2>
      <p className="lede">{catalog.product.description}</p>
      <div className="panel" style={{ maxWidth: 720 }}>
        <h3>What you get</h3>
        <ul>
          <li>{catalog.count} browser tools that each solve a concrete job</li>
          <li>
            Organized into {catalog.batchCount} batches of {catalog.batchSize}
          </li>
          <li>Sample inputs, run button, and Markdown export on every tool</li>
          <li>Static hosting — no backend, no API keys</li>
        </ul>
      </div>
    </section>
  );
}
