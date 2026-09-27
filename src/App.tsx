import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { loadCatalog, type Catalog, type Tool } from "./lib/catalog";
import { HomePage } from "./pages/HomePage";
import { BatchPage } from "./pages/BatchPage";
import { ToolPage } from "./pages/ToolPage";
import { AboutPage } from "./pages/AboutPage";

export type { Tool };

export function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCatalog()
      .then(setCatalog)
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed"));
  }, []);

  if (error) {
    return (
      <div className="shell">
        <p className="summary fail">{error}</p>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="shell">
        <p className="meta" style={{ padding: "2rem 0" }}>
          Loading Useful Kit…
        </p>
      </div>
    );
  }

  return (
    <div className="shell">
      <header className="topnav">
        <Link to="/" className="brand">
          {catalog.product.name}
        </Link>
        <nav className="nav-links">
          <Link to="/batches">Batches</Link>
          <Link to="/about">About</Link>
          <a
            href="https://github.com/theworker02"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage catalog={catalog} />} />
        <Route path="/batches" element={<BatchPage catalog={catalog} />} />
        <Route path="/batch/:n" element={<BatchPage catalog={catalog} />} />
        <Route path="/tool/:id" element={<ToolRoute catalog={catalog} />} />
        <Route path="/about" element={<AboutPage catalog={catalog} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="footer">
        {catalog.product.name} · {catalog.count} tools · live site
      </footer>
    </div>
  );
}

function ToolRoute({ catalog }: { catalog: Catalog }) {
  const { id } = useParams();
  const tool = catalog.tools.find((t) => t.id === id);
  if (!tool) return <Navigate to="/batches" replace />;
  return <ToolPage tool={tool} />;
}
