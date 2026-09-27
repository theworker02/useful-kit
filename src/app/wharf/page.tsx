import type { Metadata } from "next";
import { getProduct } from "@/lib/products/catalog";
import { ProductShell } from "@/components/studio/product-shell";
import { WharfWorkspace } from "@/components/products/wharf-workspace";

export const metadata: Metadata = {
  title: "Wharf",
  description: "License compatibility compiler for dependency inventories.",
};

export default function WharfPage() {
  return (
    <ProductShell product={getProduct("wharf")}>
      <WharfWorkspace />
    </ProductShell>
  );
}
