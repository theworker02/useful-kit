import Link from "next/link";
import { products, STUDIO } from "@/lib/products/catalog";
import { cn } from "@/lib/utils";

export function StudioNav({
  active,
  tone = "studio",
}: {
  active?: string;
  tone?: "studio" | "product";
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-md",
        tone === "studio"
          ? "border-white/10 bg-[#07151c]/80 text-[#e8f1f4]"
          : "border-slate-200/80 bg-[#f4f7fa]/90 text-slate-900",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span
            className={cn(
              "font-[family-name:var(--font-display)] text-xl tracking-tight md:text-2xl",
              tone === "studio" ? "text-[#e8f1f4]" : "text-[#0b1f2a]",
            )}
          >
            {STUDIO.name}
          </span>
          <span
            className={cn(
              "hidden text-[11px] uppercase tracking-[0.18em] sm:inline",
              tone === "studio" ? "text-[#7eb8b2]" : "text-teal-800/70",
            )}
          >
            Studio
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-sm">
          {products.map((p) => (
            <Link
              key={p.id}
              href={p.href}
              className={cn(
                "transition-colors",
                active === p.id
                  ? tone === "studio"
                    ? "text-[#f0c987]"
                    : "text-teal-900 font-medium"
                  : tone === "studio"
                    ? "text-[#e8f1f4]/70 hover:text-[#e8f1f4]"
                    : "text-slate-600 hover:text-slate-900",
              )}
            >
              {p.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
