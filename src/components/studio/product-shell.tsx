import Link from "next/link";
import type { Product } from "@/lib/products/catalog";
import { StudioNav } from "./studio-nav";
import { Badge } from "@/components/ui/badge";

export function ProductShell({
  product,
  children,
}: {
  product: Product;
  children: React.ReactNode;
}) {
  return (
    <div className="product-surface min-h-screen">
      <StudioNav active={product.id} tone="product" />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-8 flex flex-col gap-3 border-b border-slate-200/80 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-md font-normal">
                {product.category}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-md font-normal uppercase tracking-wide"
              >
                {product.status}
              </Badge>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[#0b1f2a] md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-2 max-w-2xl text-base text-slate-600 md:text-lg">
              {product.tagline}
            </p>
          </div>
          <Link
            href={product.diligencePath}
            className="text-sm text-teal-900 underline-offset-4 hover:underline"
          >
            Acquisition docs →
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
