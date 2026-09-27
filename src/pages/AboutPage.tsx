import catalog from "../data/catalog.json";

export function AboutPage() {
  return (
    <section className="section rise">
      <h2>About {catalog.product.name}</h2>
      <p className="lede">{catalog.product.description}</p>
      <div className="panel" style={{ maxWidth: 720 }}>
        <h3>What you get</h3>
        <ul>
          <li>{catalog.count} browser tools that each solve a concrete job</li>
          <li>Organized into {catalog.batchCount} batches of {catalog.batchSize}</li>
          <li>Sample inputs, run button, and Markdown export on every tool</li>
          <li>Static site — works on GitHub Pages with no backend</li>
        </ul>
        <h3 style={{ marginTop: "1.25rem" }}>Deploy</h3>
        <ul>
          <li>Enable GitHub Pages with the “GitHub Actions” source</li>
          <li>Push to <code>main</code> — the workflow builds and publishes <code>dist/</code></li>
          <li>Or run <code>npm run build</code> and publish the <code>dist</code> folder yourself</li>
        </ul>
      </div>
    </section>
  );
}
