import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, type ProductId } from "@/lib/products/catalog";
import { productDocs } from "@/lib/docs/content";
import { DocView } from "@/components/studio/doc-view";

const ids = new Set(products.map((p) => p.id));

export function generateStaticParams() {
  return products.map((p) => ({ product: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>;
}): Promise<Metadata> {
  const { product } = await params;
  const doc = productDocs[product as ProductId];
  if (!doc) return { title: "Not found" };
  return { title: doc.title, description: doc.subtitle };
}

export default async function ProductDocPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product } = await params;
  if (!ids.has(product as ProductId)) notFound();
  const doc = productDocs[product as ProductId];
  return (
    <DocView
      title={doc.title}
      subtitle={doc.subtitle}
      sections={doc.sections}
      active={doc.id}
    />
  );
}
