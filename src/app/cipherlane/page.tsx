import type { Metadata } from "next";
import { getProduct } from "@/lib/products/catalog";
import { ProductShell } from "@/components/studio/product-shell";
import { CipherlaneWorkspace } from "@/components/products/cipherlane-workspace";

export const metadata: Metadata = {
  title: "Cipherlane",
  description: "Configuration policy and secret-pattern hygiene scanner.",
};

export default function CipherlanePage() {
  return (
    <ProductShell product={getProduct("cipherlane")}>
      <CipherlaneWorkspace />
    </ProductShell>
  );
}
