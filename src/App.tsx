import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import catalog from "./data/catalog.json";
import { HomePage } from "./pages/HomePage";
import { BatchPage } from "./pages/BatchPage";
import { ToolPage } from "./pages/ToolPage";
import { AboutPage } from "./pages/AboutPage";

export type Tool = (typeof catalog.tools)[number];

export function App() {
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
        <Route path="/" element={<HomePage />} />
        <Route path="/batches" element={<BatchPage />} />
        <Route path="/batch/:n" element={<BatchPage />} />
        <Route path="/tool/:id" element={<ToolRoute />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="footer">
        {catalog.product.name} · {catalog.count} tools · GitHub Pages
      </footer>
    </div>
  );
}

function ToolRoute() {
  const { id } = useParams();
  const tool = catalog.tools.find((t) => t.id === id);
  if (!tool) return <Navigate to="/batches" replace />;
  return <ToolPage tool={tool} />;
}
