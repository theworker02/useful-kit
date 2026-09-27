import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/lib/products/catalog";
import { studioDoc } from "@/lib/docs/content";
import { StudioNav } from "@/components/studio/studio-nav";

export const metadata: Metadata = {
  title: "Diligence Library",
  description: "Acquisition documentation for North Harbor Studio products.",
};

export default function DocsIndexPage() {
  return (
    <div className="product-surface min-h-screen">
      <StudioNav tone="product" />
      <article className="doc-prose mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <Link href="/" className="text-sm text-teal-900 underline-offset-4 hover:underline">
          ← Studio home
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[#0b1f2a] md:text-5xl">
          {studioDoc.title}
        </h1>
        <p className="mt-3 text-lg text-slate-600">{studioDoc.subtitle}</p>
        {studioDoc.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((p) => (
              <p key={p.slice(0, 64)}>{p}</p>
            ))}
          </section>
        ))}
        <section>
          <h2>Product briefs</h2>
          <ul>
            {products.map((p) => (
              <li key={p.id}>
                <Link href={p.diligencePath} className="text-teal-900 hover:underline">
                  {p.name} — Acquisition Brief
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
