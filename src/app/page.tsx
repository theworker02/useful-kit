import Link from "next/link";
import { products, STUDIO } from "@/lib/products/catalog";
import { StudioNav } from "@/components/studio/studio-nav";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#061018] text-[#e8f1f4]">
      <StudioNav tone="studio" />
      <section className="studio-hero">
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 md:px-6 md:pb-24">
          <p className="harbor-rise text-[11px] uppercase tracking-[0.28em] text-[#7eb8b2]">
            Product studio
          </p>
          <h1 className="harbor-rise-delay mt-3 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight md:text-7xl">
            {STUDIO.name}
          </h1>
          <p className="harbor-rise-delay-2 mt-5 max-w-xl text-lg text-[#e8f1f4]/80 md:text-xl">
            {STUDIO.tagline}
          </p>
          <div className="harbor-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Link
              href="/wharf"
              className="inline-flex items-center rounded-md bg-[#2a9d8f] px-5 py-2.5 text-sm font-medium text-[#061018] transition hover:bg-[#3cb3a4]"
            >
              Enter Wharf
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center rounded-md border border-white/20 px-5 py-2.5 text-sm text-[#e8f1f4] transition hover:border-white/40 hover:bg-white/5"
            >
              Diligence library
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b1f2a]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">
            Five operator tools. One diligence standard.
          </h2>
          <p className="mt-3 max-w-2xl text-[#e8f1f4]/70">
            Each product solves a concrete buyer problem, ships with working demos, and includes
            acquisition documentation — not placeholders.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={product.href}
                className="product-link group rounded-lg border border-white/10 bg-white/[0.03] p-5 md:p-6"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-[family-name:var(--font-display)] text-2xl text-[#f0c987]">
                        {product.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-white/20 bg-transparent text-[10px] uppercase tracking-wide text-[#e8f1f4]/70"
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-[#e8f1f4]/75">{product.tagline}</p>
                  </div>
                  <span className="text-[#7eb8b2] transition group-hover:translate-x-1">→</span>
                </div>
                <p className="mt-4 text-sm text-[#e8f1f4]/55">{product.summary}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[#7eb8b2]/90">
                  {product.category}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-[#e8f1f4]/45 md:px-6">
        {STUDIO.legalName} · Portfolio products with exportable diligence packets
      </footer>
    </div>
  );
}
