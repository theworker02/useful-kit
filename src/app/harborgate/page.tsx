import type { Metadata } from "next";
import { getProduct } from "@/lib/products/catalog";
import { ProductShell } from "@/components/studio/product-shell";
import { HarborGateWorkspace } from "@/components/products/harborgate-workspace";

export const metadata: Metadata = {
  title: "HarborGate",
  description: "OpenAPI contract compatibility gates for release readiness.",
};

export default function HarborGatePage() {
  return (
    <ProductShell product={getProduct("harborgate")}>
      <HarborGateWorkspace />
    </ProductShell>
  );
}
